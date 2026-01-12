import { mutation } from "./_generated/server";

/**
 * Seed initial categories into the database
 * Run this once to populate categories
 */
export const seedCategories = mutation({
  handler: async (ctx) => {
    const timestamp = Date.now();
    
    const categories = [
      { name: "Rolls", order: 1 },
      { name: "Chowmein", order: 2 },
      { name: "Parathas", order: 3 },
      { name: "Rice Items", order: 4 },
      { name: "Breakfast", order: 5 },
      { name: "Thali", order: 6 },
    ];

    for (const category of categories) {
      // Check if category already exists
      const existing = await ctx.db
        .query("categories")
        .withIndex("by_name", (q) => q.eq("name", category.name))
        .first();

      if (!existing) {
        await ctx.db.insert("categories", {
          name: category.name,
          isActive: true,
          order: category.order,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      }
    }

    return { success: true, message: "Categories seeded successfully" };
  },
});
