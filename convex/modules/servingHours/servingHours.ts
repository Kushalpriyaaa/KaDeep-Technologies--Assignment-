import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

// Helper for slot validation with item toggle
const slotSchema = v.optional(v.object({
  isActive: v.boolean(),
  startTime: v.string(),
  endTime: v.string(),
  items: v.array(v.object({
    id: v.string(),
    name: v.string(),
    price: v.number(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    isActive: v.boolean()
  }))
}));

/**
 * Get the global serving hours configuration
 */
export const getGlobalServingHours = query({
  handler: async (ctx) => {
    return await ctx.db.query("servingHoursConfig").first();
  },
});

/**
 * Update global serving hours (Admin only)
 */
export const updateGlobalServingHours = mutation({
  args: {
    isClosed: v.boolean(),
    reason: v.optional(v.string()),
    breakfast: slotSchema,
    lunch: slotSchema,
    dinner: slotSchema,
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("servingHoursConfig").first();
    const timestamp = Date.now();

    if (existing) {
      await ctx.db.patch(existing._id, {
        isClosed: args.isClosed,
        reason: args.reason,
        breakfast: args.breakfast,
        lunch: args.lunch,
        dinner: args.dinner,
        updatedAt: timestamp,
      });
      return existing._id;
    } else {
      const configId = await ctx.db.insert("servingHoursConfig", {
        ...args,
        createdAt: timestamp,
        updatedAt: timestamp,
      });
      return configId;
    }
  },
});
