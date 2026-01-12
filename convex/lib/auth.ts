import { query } from "../_generated/server";
import { v } from "convex/values";

/**
 * Get authenticated user from context
 * This is a helper to get current user info
 */
export const getCurrentUser = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    // Check in users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (user) return { ...user, table: "users" };

    // Check in admins table
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (admin) return { ...admin, table: "admins" };

    // Check in delivery table
    const delivery = await ctx.db
      .query("delivery")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (delivery) return { ...delivery, table: "delivery" };

    return null;
  },
});

/**
 * Verify if user is admin
 */
export const verifyAdmin = async (ctx: any, firebaseUid: string) => {
  const admin = await ctx.db
    .query("admins")
    .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
    .first();

  if (!admin) {
    throw new Error("Unauthorized: Admin access required");
  }

  return admin;
};

/**
 * Verify if user is delivery personnel
 */
export const verifyDelivery = async (ctx: any, firebaseUid: string) => {
  const delivery = await ctx.db
    .query("delivery")
    .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
    .first();

  if (!delivery) {
    throw new Error("Unauthorized: Delivery personnel access required");
  }

  return delivery;
};
