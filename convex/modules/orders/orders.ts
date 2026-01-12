import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Create a new order
 */
export const createOrder = mutation({
  args: {
    userId: v.string(),
    items: v.array(
      v.object({
        itemId: v.string(),
        name: v.string(),
        quantity: v.number(),
        price: v.number(),
        portion: v.optional(v.string()),
        image: v.optional(v.string()),
      })
    ),
    totalAmount: v.number(),
    deliveryAddress: v.string(),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    deliveryCharge: v.optional(v.number()),
    subtotal: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timestamp = Date.now();

    const orderId = await ctx.db.insert("orders", {
      userId: args.userId,
      items: args.items,
      totalAmount: args.totalAmount,
      deliveryAddress: args.deliveryAddress,
      customerName: args.customerName,
      customerPhone: args.customerPhone,
      customerEmail: args.customerEmail,
      paymentMethod: args.paymentMethod || 'Cash on Delivery',
      deliveryCharge: args.deliveryCharge || 0,
      subtotal: args.subtotal || args.totalAmount,
      status: "pending",
      deliveryPersonId: undefined,
      createdAt: timestamp,
      updatedAt: timestamp,
    });

    return orderId;
  },
});

/**
 * Get all orders (Admin only)
 */
export const getAllOrders = query({
  handler: async (ctx) => {
    return await ctx.db.query("orders").collect();
  },
});

/**
 * Get orders by user ID
 */
export const getOrdersByUserId = query({
  args: { userId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();
  },
});

/**
 * Get orders by status
 */
export const getOrdersByStatus = query({
  args: { status: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_status", (q) => q.eq("status", args.status))
      .collect();
  },
});

/**
 * Get orders by delivery person
 */
export const getOrdersByDeliveryPerson = query({
  args: { deliveryPersonId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("orders")
      .withIndex("by_delivery_person", (q) => 
        q.eq("deliveryPersonId", args.deliveryPersonId)
      )
      .collect();
  },
});

/**
 * Get single order by ID
 */
export const getOrderById = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.orderId);
  },
});

/**
 * Update order status (Admin/Delivery)
 */
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Assign delivery person to order (Admin only)
 */
export const assignDeliveryPerson = mutation({
  args: {
    orderId: v.id("orders"),
    deliveryPersonId: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      deliveryPersonId: args.deliveryPersonId,
      status: "out-for-delivery",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Cancel order
 */
export const cancelOrder = mutation({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.orderId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });

    return { success: true };
  },
});

/**
 * Get recent orders (last 50)
 */
export const getRecentOrders = query({
  handler: async (ctx) => {
    const orders = await ctx.db.query("orders").collect();
    return orders
      .sort((a, b) => b.createdAt - a.createdAt)
      .slice(0, 50);
  },
});

/**
 * Get order statistics (Admin only)
 */
export const getOrderStatistics = query({
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").collect();
    
    const totalOrders = allOrders.length;
    const pendingOrders = allOrders.filter(o => o.status === "pending").length;
    const confirmedOrders = allOrders.filter(o => o.status === "confirmed").length;
    const preparingOrders = allOrders.filter(o => o.status === "preparing").length;
    const outForDelivery = allOrders.filter(o => o.status === "out-for-delivery").length;
    const deliveredOrders = allOrders.filter(o => o.status === "delivered").length;
    const cancelledOrders = allOrders.filter(o => o.status === "cancelled").length;
    
    const totalRevenue = allOrders
      .filter(o => o.status === "delivered")
      .reduce((sum, order) => sum + order.totalAmount, 0);

    return {
      totalOrders,
      pendingOrders,
      confirmedOrders,
      preparingOrders,
      outForDelivery,
      deliveredOrders,
      cancelledOrders,
      totalRevenue,
    };
  },
});
