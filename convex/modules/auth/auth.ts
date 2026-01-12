import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Register or login user (handles all user types)
 */
export const registerOrLoginUser = mutation({
  args: {
    firebaseUid: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(), // "user", "admin", "delivery"
    address: v.optional(v.string()),
    vehicleNumber: v.optional(v.string()),
    permissions: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, email, role, name, phone, address, vehicleNumber, permissions } = args;
    const timestamp = Date.now();

    // Route to appropriate table based on role
    if (role === "admin") {
      // Check if admin exists
      const existingAdmin = await ctx.db
        .query("admins")
        .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
        .first();

      if (existingAdmin) {
        return { id: existingAdmin._id, role: "admin", isNew: false };
      }

      const adminId = await ctx.db.insert("admins", {
        firebaseUid,
        email,
        name: name || "",
        phone,
        role: "admin",
        permissions: permissions || [
          "manage_menu",
          "manage_orders",
          "manage_users",
          "manage_delivery",
          "manage_offers",
          "view_reports",
          "manage_settings",
        ],
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return { id: adminId, role: "admin", isNew: true };
    } else if (role === "delivery") {
      // Check if delivery personnel exists
      const existingDelivery = await ctx.db
        .query("delivery")
        .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
        .first();

      if (existingDelivery) {
        return { id: existingDelivery._id, role: "delivery", isNew: false };
      }

      const deliveryId = await ctx.db.insert("delivery", {
        firebaseUid,
        email,
        name: name || "",
        phone: phone || "",
        role: "delivery",
        vehicleNumber,
        isAvailable: true,
        currentOrders: [],
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return { id: deliveryId, role: "delivery", isNew: true };
    } else {
      // Regular user
      const existingUser = await ctx.db
        .query("users")
        .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
        .first();

      if (existingUser) {
        return { id: existingUser._id, role: "user", isNew: false };
      }

      const userId = await ctx.db.insert("users", {
        firebaseUid,
        email,
        name,
        phone,
        role: "user",
        address,
        createdAt: timestamp,
        updatedAt: timestamp,
      });

      return { id: userId, role: "user", isNew: true };
    }
  },
});

/**
 * Get current user info by Firebase UID
 */
export const getCurrentUser = query({
  args: { firebaseUid: v.string() },
  handler: async (ctx, args) => {
    // Check users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (user) return { ...user, userType: "user" };

    // Check admins table
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (admin) return { ...admin, userType: "admin" };

    // Check delivery table
    const delivery = await ctx.db
      .query("delivery")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (delivery) return { ...delivery, userType: "delivery" };

    return null;
  },
});

/**
 * Verify user role
 */
export const verifyUserRole = query({
  args: {
    firebaseUid: v.string(),
    requiredRole: v.string(),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, requiredRole } = args;

    if (requiredRole === "admin") {
      const admin = await ctx.db
        .query("admins")
        .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
        .first();
      return !!admin;
    } else if (requiredRole === "delivery") {
      const delivery = await ctx.db
        .query("delivery")
        .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
        .first();
      return !!delivery;
    } else {
      const user = await ctx.db
        .query("users")
        .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
        .first();
      return !!user;
    }
  },
});

/**
 * Check if user has specific permission (for admins)
 */
export const checkPermission = query({
  args: {
    firebaseUid: v.string(),
    permission: v.string(),
  },
  handler: async (ctx, args) => {
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
      .first();

    if (!admin) return false;

    const permissions = admin.permissions || [];
    return permissions.includes(args.permission);
  },
});

/**
 * Update user profile
 */
export const updateUserProfile = mutation({
  args: {
    firebaseUid: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    address: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { firebaseUid, ...updates } = args;

    // Find user in users table
    const user = await ctx.db
      .query("users")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    if (user) {
      await ctx.db.patch(user._id, {
        ...updates,
        updatedAt: Date.now(),
      });
      return { success: true, userType: "user" };
    }

    // Find in delivery table
    const delivery = await ctx.db
      .query("delivery")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    if (delivery) {
      await ctx.db.patch(delivery._id, {
        name: updates.name,
        phone: updates.phone,
        updatedAt: Date.now(),
      });
      return { success: true, userType: "delivery" };
    }

    // Find in admins table
    const admin = await ctx.db
      .query("admins")
      .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
      .first();

    if (admin) {
      await ctx.db.patch(admin._id, {
        name: updates.name,
        phone: updates.phone,
        updatedAt: Date.now(),
      });
      return { success: true, userType: "admin" };
    }

    throw new Error("User not found");
  },
});
