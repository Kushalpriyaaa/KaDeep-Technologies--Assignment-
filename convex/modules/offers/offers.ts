import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Get all offers
 */
export const getAllOffers = query({
  handler: async (ctx) => {
    return await ctx.db.query("offers").collect();
  },
});

/**
 * Get active offers
 */
export const getActiveOffers = query({
  handler: async (ctx) => {
    const now = Date.now();
    const offers = await ctx.db
      .query("offers")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();

    return offers.filter(
      (offer) => offer.validFrom <= now && offer.validTo >= now
    );
  },
});

/**
 * Get offer by code
 */
export const getOfferByCode = query({
  args: { code: v.string() },
  handler: async (ctx, args) => {
    const offer = await ctx.db
      .query("offers")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!offer) return null;

    // Check if offer is valid
    const now = Date.now();
    if (
      offer.isActive &&
      offer.validFrom <= now &&
      offer.validTo >= now
    ) {
      return offer;
    }

    return null;
  },
});

/**
 * Get single offer by ID
 */
export const getOfferById = query({
  args: { offerId: v.id("offers") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.offerId);
  },
});

/**
 * Create new offer (Admin only)
 */
export const createOffer = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    code: v.string(),
    discountType: v.string(),
    discountValue: v.number(),
    minOrderAmount: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    validFrom: v.number(),
    validTo: v.number(),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    // Check if code already exists
    const existingOffer = await ctx.db
      .query("offers")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (existingOffer) {
      throw new Error("Offer code already exists");
    }

    const offerId = await ctx.db.insert("offers", {
      ...args,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return offerId;
  },
});

/**
 * Update offer (Admin only)
 */
export const updateOffer = mutation({
  args: {
    offerId: v.id("offers"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    discountType: v.optional(v.string()),
    discountValue: v.optional(v.number()),
    minOrderAmount: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    validFrom: v.optional(v.number()),
    validTo: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { offerId, ...updates } = args;

    await ctx.db.patch(offerId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Delete offer (Admin only)
 */
export const deleteOffer = mutation({
  args: { offerId: v.id("offers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.offerId);
    return { success: true };
  },
});

/**
 * Toggle offer active status (Admin only)
 */
export const toggleOfferStatus = mutation({
  args: {
    offerId: v.id("offers"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.offerId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Validate and apply offer code
 */
export const validateOfferCode = query({
  args: {
    code: v.string(),
    orderAmount: v.number(),
  },
  handler: async (ctx, args) => {
    const offer = await ctx.db
      .query("offers")
      .withIndex("by_code", (q) => q.eq("code", args.code))
      .first();

    if (!offer) {
      return { valid: false, message: "Invalid offer code" };
    }

    const now = Date.now();

    if (!offer.isActive) {
      return { valid: false, message: "Offer is inactive" };
    }

    if (offer.validFrom > now) {
      return { valid: false, message: "Offer not yet valid" };
    }

    if (offer.validTo < now) {
      return { valid: false, message: "Offer has expired" };
    }

    if (offer.minOrderAmount && args.orderAmount < offer.minOrderAmount) {
      return {
        valid: false,
        message: `Minimum order amount is ${offer.minOrderAmount}`,
      };
    }

    let discount = 0;
    if (offer.discountType === "percentage") {
      discount = (args.orderAmount * offer.discountValue) / 100;
      if (offer.maxDiscount && discount > offer.maxDiscount) {
        discount = offer.maxDiscount;
      }
    } else {
      discount = offer.discountValue;
    }

    return {
      valid: true,
      discount,
      offer,
    };
  },
});
