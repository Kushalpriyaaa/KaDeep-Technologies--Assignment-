/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as lib_auth from "../lib/auth.js";
import type * as lib_role from "../lib/role.js";
import type * as modules_auth_admins from "../modules/auth/admins.js";
import type * as modules_auth_auth from "../modules/auth/auth.js";
import type * as modules_delivery_delivery from "../modules/delivery/delivery.js";
import type * as modules_menu_menu from "../modules/menu/menu.js";
import type * as modules_offers_offers from "../modules/offers/offers.js";
import type * as modules_orders_orders from "../modules/orders/orders.js";
import type * as modules_reports_reports from "../modules/reports/reports.js";
import type * as modules_servingHours_servingHours from "../modules/servingHours/servingHours.js";
import type * as modules_settings_settings from "../modules/settings/settings.js";
import type * as modules_users_users from "../modules/users/users.js";
import type * as seedCategories from "../seedCategories.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "lib/auth": typeof lib_auth;
  "lib/role": typeof lib_role;
  "modules/auth/admins": typeof modules_auth_admins;
  "modules/auth/auth": typeof modules_auth_auth;
  "modules/delivery/delivery": typeof modules_delivery_delivery;
  "modules/menu/menu": typeof modules_menu_menu;
  "modules/offers/offers": typeof modules_offers_offers;
  "modules/orders/orders": typeof modules_orders_orders;
  "modules/reports/reports": typeof modules_reports_reports;
  "modules/servingHours/servingHours": typeof modules_servingHours_servingHours;
  "modules/settings/settings": typeof modules_settings_settings;
  "modules/users/users": typeof modules_users_users;
  seedCategories: typeof seedCategories;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
