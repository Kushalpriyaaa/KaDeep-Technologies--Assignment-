import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * Database Schema for Sah One Food Delivery App
 */
export default defineSchema({
  // Users table - for regular customers
  users: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(), // "user", "admin", "delivery"
    address: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_firebase_uid", ["firebaseUid"])
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  // Admins table - for admin users
  admins: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    role: v.string(), // "admin"
    permissions: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_firebase_uid", ["firebaseUid"])
    .index("by_email", ["email"]),

  // Delivery personnel table
  delivery: defineTable({
    firebaseUid: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.string(),
    role: v.string(), // "delivery"
    vehicleNumber: v.optional(v.string()),
    isAvailable: v.boolean(),
    currentOrders: v.optional(v.array(v.string())),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_firebase_uid", ["firebaseUid"])
    .index("by_email", ["email"])
    .index("by_availability", ["isAvailable"]),

  // Categories
  categories: defineTable({
    name: v.string(),
    isActive: v.boolean(),
    order: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_name", ["name"])
    .index("by_active", ["isActive"]),

  // Menu items
  menuItems: defineTable({
    name: v.string(),
    description: v.string(),
    category: v.string(),
    image: v.optional(v.string()),
    hasHalfPortion: v.boolean(),
    halfPrice: v.optional(v.number()),
    fullPrice: v.number(),
    isAvailable: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_availability", ["isAvailable"]),

  // Orders
  orders: defineTable({
    userId: v.string(), // Reference to users._id
    items: v.array(v.object({
      itemId: v.string(),
      name: v.string(),
      quantity: v.number(),
      price: v.number(),
      portion: v.optional(v.string()),
      image: v.optional(v.string()),
    })),
    totalAmount: v.number(),
    status: v.string(), // "pending", "confirmed", "preparing", "out-for-delivery", "delivered", "cancelled"
    deliveryAddress: v.string(),
    customerName: v.optional(v.string()),
    customerPhone: v.optional(v.string()),
    customerEmail: v.optional(v.string()),
    paymentMethod: v.optional(v.string()),
    deliveryCharge: v.optional(v.number()),
    subtotal: v.optional(v.number()),
    deliveryPersonId: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_delivery_person", ["deliveryPersonId"]),

  // Offers
  offers: defineTable({
    title: v.string(),
    description: v.string(),
    code: v.string(),
    discountType: v.string(), // "percentage", "fixed"
    discountValue: v.number(),
    minOrderAmount: v.optional(v.number()),
    maxDiscount: v.optional(v.number()),
    validFrom: v.number(),
    validTo: v.number(),
    isActive: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"]),

  // Serving Hours Configuration (Global v3)
  servingHoursConfig: defineTable({
    isClosed: v.boolean(),
    reason: v.optional(v.string()),

    // Breakfast Slot
    breakfast: v.optional(v.object({
      isActive: v.boolean(),
      startTime: v.string(),
      endTime: v.string(),
      items: v.array(v.object({
        id: v.string(),
        name: v.string(),
        price: v.number(),
        description: v.optional(v.string()),
        image: v.optional(v.string()),
        isActive: v.boolean() // New toggle for individual item
      }))
    })),

    // Lunch Slot
    lunch: v.optional(v.object({
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
    })),

    // Dinner Slot
    dinner: v.optional(v.object({
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
    })),

    createdAt: v.number(),
    updatedAt: v.number(),
  }),

  // Restaurant Settings
  restaurantSettings: defineTable({
    settingKey: v.string(),
    settingValue: v.string(),
    description: v.optional(v.string()),
    updatedAt: v.number(),
  })
    .index("by_key", ["settingKey"]),

  // Reports/Analytics
  reports: defineTable({
    reportType: v.string(), // "daily", "weekly", "monthly"
    date: v.string(),
    totalOrders: v.number(),
    totalRevenue: v.number(),
    totalDeliveries: v.number(),
    topSellingItems: v.optional(v.array(v.object({
      itemId: v.string(),
      itemName: v.string(),
      quantity: v.number(),
    }))),
    createdAt: v.number(),
  })
    .index("by_type", ["reportType"])
    .index("by_date", ["date"]),
});
