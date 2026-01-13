/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export const api = {
  modules: {
    auth: {
      admins: {
        createOrUpdateAdmin: { _functionName: "modules/auth/admins:createOrUpdateAdmin", [Symbol.for("functionName")]: "modules/auth/admins:createOrUpdateAdmin" },
        getAdmin: { _functionName: "modules/auth/admins:getAdmin", [Symbol.for("functionName")]: "modules/auth/admins:getAdmin" },
        updateAdmin: { _functionName: "modules/auth/admins:updateAdmin", [Symbol.for("functionName")]: "modules/auth/admins:updateAdmin" },
      },
      auth: {},
    },
    delivery: {
      delivery: {
        createOrUpdateDeliveryPerson: { _functionName: "modules/delivery/delivery:createOrUpdateDeliveryPerson", [Symbol.for("functionName")]: "modules/delivery/delivery:createOrUpdateDeliveryPerson" },
        getAllDeliveryPersonnel: { _functionName: "modules/delivery/delivery:getAllDeliveryPersonnel", [Symbol.for("functionName")]: "modules/delivery/delivery:getAllDeliveryPersonnel" },
        getAvailableDeliveryPersonnel: { _functionName: "modules/delivery/delivery:getAvailableDeliveryPersonnel", [Symbol.for("functionName")]: "modules/delivery/delivery:getAvailableDeliveryPersonnel" },
        getDeliveryPersonByFirebaseUid: { _functionName: "modules/delivery/delivery:getDeliveryPersonByFirebaseUid", [Symbol.for("functionName")]: "modules/delivery/delivery:getDeliveryPersonByFirebaseUid" },
        updateAvailability: { _functionName: "modules/delivery/delivery:updateAvailability", [Symbol.for("functionName")]: "modules/delivery/delivery:updateAvailability" },
        assignOrder: { _functionName: "modules/delivery/delivery:assignOrder", [Symbol.for("functionName")]: "modules/delivery/delivery:assignOrder" },
        completeOrderDelivery: { _functionName: "modules/delivery/delivery:completeOrderDelivery", [Symbol.for("functionName")]: "modules/delivery/delivery:completeOrderDelivery" },
        deleteDeliveryPerson: { _functionName: "modules/delivery/delivery:deleteDeliveryPerson", [Symbol.for("functionName")]: "modules/delivery/delivery:deleteDeliveryPerson" },
      },
    },
    menu: {
      menu: {
        getAllCategories: { _functionName: "modules/menu/menu:getAllCategories", [Symbol.for("functionName")]: "modules/menu/menu:getAllCategories" },
        getCategoryNames: { _functionName: "modules/menu/menu:getCategoryNames", [Symbol.for("functionName")]: "modules/menu/menu:getCategoryNames" },
        createCategory: { _functionName: "modules/menu/menu:createCategory", [Symbol.for("functionName")]: "modules/menu/menu:createCategory" },
        deleteCategory: { _functionName: "modules/menu/menu:deleteCategory", [Symbol.for("functionName")]: "modules/menu/menu:deleteCategory" },
        toggleCategoryStatus: { _functionName: "modules/menu/menu:toggleCategoryStatus", [Symbol.for("functionName")]: "modules/menu/menu:toggleCategoryStatus" },
        getAllMenuItems: { _functionName: "modules/menu/menu:getAllMenuItems", [Symbol.for("functionName")]: "modules/menu/menu:getAllMenuItems" },
        getAvailableMenuItems: { _functionName: "modules/menu/menu:getAvailableMenuItems", [Symbol.for("functionName")]: "modules/menu/menu:getAvailableMenuItems" },
        getMenuItemById: { _functionName: "modules/menu/menu:getMenuItemById", [Symbol.for("functionName")]: "modules/menu/menu:getMenuItemById" },
        createMenuItem: { _functionName: "modules/menu/menu:createMenuItem", [Symbol.for("functionName")]: "modules/menu/menu:createMenuItem" },
        updateMenuItem: { _functionName: "modules/menu/menu:updateMenuItem", [Symbol.for("functionName")]: "modules/menu/menu:updateMenuItem" },
        deleteMenuItem: { _functionName: "modules/menu/menu:deleteMenuItem", [Symbol.for("functionName")]: "modules/menu/menu:deleteMenuItem" },
        toggleMenuItemAvailability: { _functionName: "modules/menu/menu:toggleMenuItemAvailability", [Symbol.for("functionName")]: "modules/menu/menu:toggleMenuItemAvailability" },
      },
    },
    offers: {
      offers: {
        getAllOffers: { _functionName: "modules/offers/offers:getAllOffers", [Symbol.for("functionName")]: "modules/offers/offers:getAllOffers" },
        getActiveOffers: { _functionName: "modules/offers/offers:getActiveOffers", [Symbol.for("functionName")]: "modules/offers/offers:getActiveOffers" },
        createOffer: { _functionName: "modules/offers/offers:createOffer", [Symbol.for("functionName")]: "modules/offers/offers:createOffer" },
        updateOffer: { _functionName: "modules/offers/offers:updateOffer", [Symbol.for("functionName")]: "modules/offers/offers:updateOffer" },
        deleteOffer: { _functionName: "modules/offers/offers:deleteOffer", [Symbol.for("functionName")]: "modules/offers/offers:deleteOffer" },
        toggleOfferStatus: { _functionName: "modules/offers/offers:toggleOfferStatus", [Symbol.for("functionName")]: "modules/offers/offers:toggleOfferStatus" },
      },
    },
    orders: {
      orders: {
        createOrder: { _functionName: "modules/orders/orders:createOrder", [Symbol.for("functionName")]: "modules/orders/orders:createOrder" },
        getAllOrders: { _functionName: "modules/orders/orders:getAllOrders", [Symbol.for("functionName")]: "modules/orders/orders:getAllOrders" },
        getOrdersByUserId: { _functionName: "modules/orders/orders:getOrdersByUserId", [Symbol.for("functionName")]: "modules/orders/orders:getOrdersByUserId" },
        getOrdersByStatus: { _functionName: "modules/orders/orders:getOrdersByStatus", [Symbol.for("functionName")]: "modules/orders/orders:getOrdersByStatus" },
        getOrdersByDeliveryPerson: { _functionName: "modules/orders/orders:getOrdersByDeliveryPerson", [Symbol.for("functionName")]: "modules/orders/orders:getOrdersByDeliveryPerson" },
        getOrderById: { _functionName: "modules/orders/orders:getOrderById", [Symbol.for("functionName")]: "modules/orders/orders:getOrderById" },
        updateOrderStatus: { _functionName: "modules/orders/orders:updateOrderStatus", [Symbol.for("functionName")]: "modules/orders/orders:updateOrderStatus" },
        assignDeliveryPerson: { _functionName: "modules/orders/orders:assignDeliveryPerson", [Symbol.for("functionName")]: "modules/orders/orders:assignDeliveryPerson" },
        cancelOrder: { _functionName: "modules/orders/orders:cancelOrder", [Symbol.for("functionName")]: "modules/orders/orders:cancelOrder" },
        getRecentOrders: { _functionName: "modules/orders/orders:getRecentOrders", [Symbol.for("functionName")]: "modules/orders/orders:getRecentOrders" },
        getOrderStatistics: { _functionName: "modules/orders/orders:getOrderStatistics", [Symbol.for("functionName")]: "modules/orders/orders:getOrderStatistics" },
      },
    },
    servingHours: {
      servingHours: {
        getGlobalServingHours: { _functionName: "modules/servingHours/servingHours:getGlobalServingHours", [Symbol.for("functionName")]: "modules/servingHours/servingHours:getGlobalServingHours" },
        updateGlobalServingHours: { _functionName: "modules/servingHours/servingHours:updateGlobalServingHours", [Symbol.for("functionName")]: "modules/servingHours/servingHours:updateGlobalServingHours" },
      },
    },
    users: {
      users: {
        createOrUpdateUser: { _functionName: "modules/users/users:createOrUpdateUser", [Symbol.for("functionName")]: "modules/users/users:createOrUpdateUser" },
        getUserByFirebaseUid: { _functionName: "modules/users/users:getUserByFirebaseUid", [Symbol.for("functionName")]: "modules/users/users:getUserByFirebaseUid" },
        updateUser: { _functionName: "modules/users/users:updateUser", [Symbol.for("functionName")]: "modules/users/users:updateUser" },
        getAllUsers: { _functionName: "modules/users/users:getAllUsers", [Symbol.for("functionName")]: "modules/users/users:getAllUsers" },
      },
    },
  },
};

export const internal = {};
