import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Get all restaurant settings
 */
export const getAllSettings = query({
  handler: async (ctx) => {
    return await ctx.db.query("restaurantSettings").collect();
  },
});

/**
 * Get setting by key
 */
export const getSettingByKey = query({
  args: { settingKey: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("restaurantSettings")
      .withIndex("by_key", (q) => q.eq("settingKey", args.settingKey))
      .first();
  },
});

/**
 * Set or update restaurant setting (Admin only)
 */
export const setSetting = mutation({
  args: {
    settingKey: v.string(),
    settingValue: v.string(),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("restaurantSettings")
      .withIndex("by_key", (q) => q.eq("settingKey", args.settingKey))
      .first();

    const timestamp = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        settingValue: args.settingValue,
        description: args.description,
        updatedAt: timestamp,
      });
      return existing._id;
    } else {
      const settingId = await ctx.db.insert("restaurantSettings", {
        ...args,
        updatedAt: timestamp,
      });
      return settingId;
    }
  },
});

/**
 * Delete setting (Admin only)
 */
export const deleteSetting = mutation({
  args: { settingId: v.id("restaurantSettings") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.settingId);
    return { success: true };
  },
});

/**
 * Bulk update settings (Admin only)
 */
export const bulkUpdateSettings = mutation({
  args: {
    settings: v.array(
      v.object({
        settingKey: v.string(),
        settingValue: v.string(),
        description: v.optional(v.string()),
      })
    ),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    for (const setting of args.settings) {
      const existing = await ctx.db
        .query("restaurantSettings")
        .withIndex("by_key", (q) => q.eq("settingKey", setting.settingKey))
        .first();

      if (existing) {
        await ctx.db.patch(existing._id, {
          settingValue: setting.settingValue,
          description: setting.description,
          updatedAt: timestamp,
        });
      } else {
        await ctx.db.insert("restaurantSettings", {
          ...setting,
          updatedAt: timestamp,
        });
      }
    }

    return { success: true };
  },
});
