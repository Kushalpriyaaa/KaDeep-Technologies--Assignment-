import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Get all delivery personnel (Admin only)
 */
export const getAllDeliveryPersonnel = query({
  handler: async (ctx) => {
    return await ctx.db.query("delivery").collect();
  },
});

/**
 * Get available delivery personnel
 */
export const getAvailableDeliveryPersonnel = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("delivery")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();
  },
});

/**
 * Get delivery person by Firebase UID
 */
export const getDeliveryPersonByFirebaseUid = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("delivery")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();
  },
});

/**
 * Create or update delivery person
 */
export const createOrUpdateDeliveryPerson = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    vehicleNumber: v.optional(v.string()),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, email, name, phone, vehicleNumber, isAvailable } = args;

    const existingPerson = await ctx.db
      .query("delivery")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    const timestamp = Date.now();

    if (existingPerson) {
      await ctx.db.patch(existingPerson._id, {
        name,
        phone,
        vehicleNumber,
        isAvailable: isAvailable ?? existingPerson.isAvailable,
        updatedAt: timestamp,
      });
      return existingPerson._id;
    } else {
      const deliveryId = await ctx.db.insert("delivery", {
        firebaseUid,
        email,
        name,
        phone,
        role: "delivery",
        vehicleNumber,
        isAvailable: isAvailable ?? true,
        currentOrders: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      return deliveryId;
    }
  },
});

/**
 * Update delivery person availability
 */
export const updateAvailability = mutation({
  args: {
    deliveryPersonId: v.id("delivery"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.deliveryPersonId, {
      isAvailable: args.isAvailable,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Assign order to delivery person
 */
export const assignOrder = mutation({
  args: {
    deliveryPersonId: v.id("delivery"),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    const deliveryPerson = await ctx.db.get(args.deliveryPersonId);
    
    if (!deliveryPerson) {
      throw new Error("Delivery person not found");
    }

    const currentOrders = deliveryPerson.currentOrders || [];
    
    await ctx.db.patch(args.deliveryPersonId, {
      currentOrders: [...currentOrders, args.orderId],
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Complete order delivery
 */
export const completeOrderDelivery = mutation({
  args: {
    deliveryPersonId: v.id("delivery"),
    orderId: v.string(),
  },
  handler: async (ctx, args) => {
    const deliveryPerson = await ctx.db.get(args.deliveryPersonId);
    
    if (!deliveryPerson) {
      throw new Error("Delivery person not found");
    }

    const currentOrders = deliveryPerson.currentOrders || [];
    const updatedOrders = currentOrders.filter(id => id !== args.orderId);
    
    await ctx.db.patch(args.deliveryPersonId, {
      currentOrders: updatedOrders,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Delete delivery person (Admin only)
 */
export const deleteDeliveryPerson = mutation({
  args: { deliveryPersonId: v.id("delivery") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.deliveryPersonId);
    return { success: true };
  },
});
