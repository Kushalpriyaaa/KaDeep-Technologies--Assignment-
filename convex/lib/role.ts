/**
 * Role constants and permissions
 */
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  DELIVERY: "delivery",
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

/**
 * Admin permissions
 */
export const ADMIN_PERMISSIONS = {
  MANAGE_MENU: "manage_menu",
  MANAGE_ORDERS: "manage_orders",
  MANAGE_USERS: "manage_users",
  MANAGE_DELIVERY: "manage_delivery",
  MANAGE_OFFERS: "manage_offers",
  VIEW_REPORTS: "view_reports",
  MANAGE_SETTINGS: "manage_settings",
} as const;

export type Permission = typeof ADMIN_PERMISSIONS[keyof typeof ADMIN_PERMISSIONS];

/**
 * Check if user has required permission
 */
export const hasPermission = (
  userPermissions: string[] | undefined,
  requiredPermission: Permission
): boolean => {
  if (!userPermissions) return false;
  return userPermissions.includes(requiredPermission);
};

/**
 * Check if user has admin role
 */
export const isAdmin = (role: string): boolean => {
  return role === ROLES.ADMIN;
};

/**
 * Check if user has delivery role
 */
export const isDelivery = (role: string): boolean => {
  return role === ROLES.DELIVERY;
};
