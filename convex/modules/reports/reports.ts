import { mutation, query } from "../../_generated/server";
import { v } from "convex/values";

/**
 * Get all reports
 */
export const getAllReports = query({
  handler: async (ctx) => {
    return await ctx.db.query("reports").collect();
  },
});

/**
 * Get reports by type
 */
export const getReportsByType = query({
  args: { reportType: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_type", (q) => q.eq("reportType", args.reportType))
      .collect();
  },
});

/**
 * Get reports by date
 */
export const getReportsByDate = query({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reports")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();
  },
});

/**
 * Get report by date and type
 */
export const getReportByDateAndType = query({
  args: {
    date: v.string(),
    reportType: v.string(),
  },
  handler: async (ctx, args) => {
    const reports = await ctx.db
      .query("reports")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .collect();

    return reports.find((r) => r.reportType === args.reportType) || null;
  },
});

/**
 * Generate daily report (Admin only)
 */
export const generateDailyReport = mutation({
  args: { date: v.string() },
  handler: async (ctx, args) => {
    // Get all orders for the date
    const allOrders = await ctx.db.query("orders").collect();
    
    // Filter orders by date
    const startOfDay = new Date(args.date).setHours(0, 0, 0, 0);
    const endOfDay = new Date(args.date).setHours(23, 59, 59, 999);
    
    const dailyOrders = allOrders.filter(
      (order) => order.createdAt >= startOfDay && order.createdAt <= endOfDay
    );

    const totalOrders = dailyOrders.length;
    const deliveredOrders = dailyOrders.filter((o) => o.status === "delivered");
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalDeliveries = deliveredOrders.length;

    // Calculate top selling items
    const itemCount: Record<string, { name: string; quantity: number }> = {};
    
    deliveredOrders.forEach((order) => {
      order.items.forEach((item) => {
        if (itemCount[item.itemId]) {
          itemCount[item.itemId].quantity += item.quantity;
        } else {
          itemCount[item.itemId] = {
            name: item.name,
            quantity: item.quantity,
          };
        }
      });
    });

    const topSellingItems = Object.entries(itemCount)
      .map(([itemId, data]) => ({
        itemId,
        itemName: data.name,
        quantity: data.quantity,
      }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 10);

    // Check if report already exists
    const existingReport = await ctx.db
      .query("reports")
      .withIndex("by_date", (q) => q.eq("date", args.date))
      .first();

    const timestamp = Date.now();

    if (existingReport) {
      await ctx.db.patch(existingReport._id, {
        totalOrders,
        totalRevenue,
        totalDeliveries,
        topSellingItems,
        createdAt: timestamp,
      });
      return existingReport._id;
    } else {
      const reportId = await ctx.db.insert("reports", {
        reportType: "daily",
        date: args.date,
        totalOrders,
        totalRevenue,
        totalDeliveries,
        topSellingItems,
        createdAt: timestamp,
      });
      return reportId;
    }
  },
});

/**
 * Generate weekly report (Admin only)
 */
export const generateWeeklyReport = mutation({
  args: {
    startDate: v.string(),
    endDate: v.string(),
  },
  handler: async (ctx, args) => {
    const allOrders = await ctx.db.query("orders").collect();
    
    const startTimestamp = new Date(args.startDate).getTime();
    const endTimestamp = new Date(args.endDate).setHours(23, 59, 59, 999);
    
    const weeklyOrders = allOrders.filter(
      (order) => order.createdAt >= startTimestamp && order.createdAt <= endTimestamp
    );

    const totalOrders = weeklyOrders.length;
    const deliveredOrders = weeklyOrders.filter((o) => o.status === "delivered");
    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalDeliveries = deliveredOrders.length;

    const reportId = await ctx.db.insert("reports", {
      reportType: "weekly",
      date: `${args.startDate}_to_${args.endDate}`,
      totalOrders,
      totalRevenue,
      totalDeliveries,
      createdAt: Date.now(),
    });

    return reportId;
  },
});

/**
 * Get revenue summary
 */
export const getRevenueSummary = query({
  handler: async (ctx) => {
    const allOrders = await ctx.db.query("orders").collect();
    const deliveredOrders = allOrders.filter((o) => o.status === "delivered");

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    const totalOrders = deliveredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get today's revenue
    const today = new Date().setHours(0, 0, 0, 0);
    const todayOrders = deliveredOrders.filter((o) => o.createdAt >= today);
    const todayRevenue = todayOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      todayRevenue,
      todayOrders: todayOrders.length,
    };
  },
});
