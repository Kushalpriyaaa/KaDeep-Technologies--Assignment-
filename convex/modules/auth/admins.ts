import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Create or update admin in Convex database
 */
export const createOrUpdateAdmin = mutation({
    args: {
        firebaseUid: v.string(),
        email: v.string(),
        name: v.string(),
        phone: v.optional(v.string()), // Added phone
        role: v.string(),
        permissions: v.array(v.string()),
    },
    handler: async (ctx, args) => {
        const { firebaseUid, email, name, role, permissions, phone } = args;

        // Check if admin already exists
        const existingAdmin = await ctx.db
            .query("admins")
            .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
            .first();

        const timestamp = Date.now();

        if (existingAdmin) {
            // Update existing admin
            await ctx.db.patch(existingAdmin._id, {
                email,
                name,
                // Only update these if provided/changed, but here we just overwrite for sync
                updatedAt: timestamp,
            });
            return existingAdmin._id;
        } else {
            // Create new admin
            const adminId = await ctx.db.insert("admins", {
                firebaseUid,
                email,
                name,
                phone: phone || "",
                role,
                permissions,
                createdAt: timestamp,
                updatedAt: timestamp,
            });
            return adminId;
        }
    },
});

/**
 * Get admin by Firebase UID
 */
export const getAdmin = query({
    args: { firebaseUid: v.string() },
    handler: async (ctx, args) => {
        const admin = await ctx.db
            .query("admins")
            .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", args.firebaseUid))
            .first();
        return admin;
    },
});

/**
 * Update admin profile
 */
export const updateAdmin = mutation({
    args: {
        firebaseUid: v.string(),
        name: v.optional(v.string()),
        phone: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const { firebaseUid, ...updates } = args;

        const admin = await ctx.db
            .query("admins")
            .withIndex("by_firebase_uid", (q) => q.eq("firebaseUid", firebaseUid))
            .first();

        if (!admin) {
            throw new Error("Admin not found");
        }

        await ctx.db.patch(admin._id, {
            ...updates,
            updatedAt: Date.now(),
        });

        return admin._id;
    },
});
