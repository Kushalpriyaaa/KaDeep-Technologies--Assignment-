import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

// ==================== CATEGORY MANAGEMENT ====================

/**
 * Get all categories with item counts
 */
export const getAllCategories = query({
  handler: async (ctx) => {
    const categories = await ctx.db.query("categories").collect();
    const menuItems = await ctx.db.query("menuItems").collect();

    return categories.map((category) => ({
      ...category,
      itemCount: menuItems.filter((item) => item.category === category.name).length,
    })).sort((a, b) => (a.order || 0) - (b.order || 0));
  },
});

/**
 * Get active categories only
 */
export const getActiveCategories = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

/**
 * Get category names for dropdown
 */
export const getCategoryNames = query({
  handler: async (ctx) => {
    const categories = await ctx.db
      .query("categories")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
    
    return categories.map((cat) => cat.name).sort();
  },
});

/**
 * Create new category
 */
export const createCategory = mutation({
  args: {
    name: v.string(),
    isActive: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    // Check if category already exists
    const existing = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .first();

    if (existing) {
      throw new Error("Category already exists");
    }

    const categoryId = await ctx.db.insert("categories", {
      name: args.name,
      isActive: args.isActive ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return categoryId;
  },
});

/**
 * Update category
 */
export const updateCategory = mutation({
  args: {
    categoryId: v.id("categories"),
    name: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { categoryId, ...updates } = args;

    await ctx.db.patch(categoryId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Toggle category active status
 */
export const toggleCategoryStatus = mutation({
  args: {
    categoryId: v.id("categories"),
    isActive: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.categoryId, {
      isActive: args.isActive,
      updatedAt: Date.now(),
    });

    // Also update all menu items in this category
    const category = await ctx.db.get(args.categoryId);
    if (category) {
      const items = await ctx.db
        .query("menuItems")
        .withIndex("by_category", (q) => q.eq("category", category.name))
        .collect();

      for (const item of items) {
        await ctx.db.patch(item._id, {
          isAvailable: args.isActive,
          updatedAt: Date.now(),
        });
      }
    }

    return { success: true };
  },
});

/**
 * Delete category
 */
export const deleteCategory = mutation({
  args: { categoryId: v.id("categories") },
  handler: async (ctx, args) => {
    const category = await ctx.db.get(args.categoryId);
    
    if (category) {
      // Check if category has items
      const items = await ctx.db
        .query("menuItems")
        .withIndex("by_category", (q) => q.eq("category", category.name))
        .collect();

      if (items.length > 0) {
        throw new Error("Cannot delete category with existing items");
      }
    }

    await ctx.db.delete(args.categoryId);
    return { success: true };
  },
});

// ==================== MENU ITEMS ====================

/**
 * Get all menu items
 */
export const getAllMenuItems = query({
  handler: async (ctx) => {
    return await ctx.db.query("menuItems").collect();
  },
});

/**
 * Get available menu items
 */
export const getAvailableMenuItems = query({
  handler: async (ctx) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_availability", (q) => q.eq("isAvailable", true))
      .collect();
  },
});

/**
 * Get menu items by category
 */
export const getMenuItemsByCategory = query({
  args: { category: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("menuItems")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .collect();
  },
});

/**
 * Get single menu item by ID
 */
export const getMenuItemById = query({
  args: { itemId: v.id("menuItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.itemId);
  },
});

/**
 * Create new menu item (Admin only)
 */
export const createMenuItem = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    category: v.string(),
    image: v.optional(v.string()),
    hasHalfPortion: v.boolean(),
    halfPrice: v.optional(v.number()),
    fullPrice: v.number(),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    // Validate category exists
    const category = await ctx.db
      .query("categories")
      .withIndex("by_name", (q) => q.eq("name", args.category))
      .first();

    if (!category) {
      throw new Error("Category does not exist");
    }

    // If hasHalfPortion is true, halfPrice must be provided
    if (args.hasHalfPortion && !args.halfPrice) {
      throw new Error("Half price is required when half portion option is enabled");
    }

    const itemId = await ctx.db.insert("menuItems", {
      name: args.name,
      description: args.description,
      category: args.category,
      image: args.image,
      hasHalfPortion: args.hasHalfPortion,
      halfPrice: args.halfPrice,
      fullPrice: args.fullPrice,
      isAvailable: args.isAvailable ?? true,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return itemId;
  },
});

/**
 * Update menu item (Admin only)
 */
export const updateMenuItem = mutation({
  args: {
    itemId: v.id("menuItems"),
    name: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()),
    image: v.optional(v.string()),
    hasHalfPortion: v.optional(v.boolean()),
    halfPrice: v.optional(v.number()),
    fullPrice: v.optional(v.number()),
    isAvailable: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { itemId, ...updates } = args;

    // If category is being updated, validate it exists
    if (updates.category !== undefined) {
      const category = await ctx.db
        .query("categories")
        .withIndex("by_name", (q) => q.eq("name", updates.category!))
        .first();

      if (!category) {
        throw new Error("Category does not exist");
      }
    }

    // Validate half portion logic
    if (updates.hasHalfPortion && !updates.halfPrice) {
      const existingItem = await ctx.db.get(itemId);
      if (!existingItem?.halfPrice) {
        throw new Error("Half price is required when half portion option is enabled");
      }
    }

    await ctx.db.patch(itemId, {
      ...updates,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Delete menu item (Admin only)
 */
export const deleteMenuItem = mutation({
  args: { itemId: v.id("menuItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.itemId);
    return { success: true };
  },
});

/**
 * Toggle menu item availability (Admin only)
 */
export const toggleMenuItemAvailability = mutation({
  args: {
    itemId: v.id("menuItems"),
    isAvailable: v.boolean(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.itemId, {
      isAvailable: args.isAvailable,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Search menu items by name
 */
export const searchMenuItems = query({
  args: { searchTerm: v.string() },
  handler: async (ctx, args) => {
    const allItems = await ctx.db.query("menuItems").collect();
    
    return allItems.filter((item) =>
      item.name.toLowerCase().includes(args.searchTerm.toLowerCase())
    );
  },
});
