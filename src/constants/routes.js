// src/constants/routes.js

export const AdminRouters = {
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp",

  // =========================
  // DASHBOARD
  // =========================
  DASHBOARD: "/dashboard",

  // =========================
  // USER MANAGEMENT
  // =========================
  USERS: "/users",
  ALL_USERS: "/users/all",
  ADD_USER: "/users/add",
  ADMIN_ROLES: "/users/roles",

  // =========================
  // PRODUCT MANAGEMENT
  // =========================
  PRODUCTS: "/products",
  ALL_PRODUCTS: "/products/all",
  ADD_PRODUCT: "/products/add",

  // =========================
  // CATEGORY MANAGEMENT
  // =========================
  CATEGORIES: "/categories",
  SUB_CATEGORIES: "/sub-categories",
  BRANDS: "/brands",

  // =========================
  // STORE MANAGEMENT
  // =========================
  STORES: "/stores",
  STORE_DETAILS: "/stores/:storeId",
  INVENTORY: "/inventory",

  STORE_CATEGORIES: "/store-categories",
  STORE_SUB_CATEGORIES: "/store-sub-categories",
  STORE_PRODUCTS: "/store-products",
  PRODUCT_DETAILS: "/product-details",

  // =========================
  // ORDER MANAGEMENT
  // =========================
  ORDERS: "/orders",
  ALL_ORDERS: "/orders/all",
  PENDING_ORDERS: "/orders/pending",
  SHIPPING: "/orders/shipping",

  PACKED_ORDERS: "/orders/packed",
  ASSIGN_DRIVER: "/orders/assign-driver",
  ORDER_STATUS: "/orders/status",

  // =========================
  // TRANSACTIONS
  // =========================
  TRANSACTIONS: "/payments/transactions",
  WALLETS: "/payments/wallets",
  USER_TRANSACTIONS: "/payments/user-transactions",

  // =========================
  // DRIVER MANAGEMENT
  // =========================
  DRIVERS: "/drivers",
  ALL_DRIVERS: "/drivers/all",
  ADD_DRIVER: "/drivers/add",

  // =========================
  // RATING MANAGEMENT
  // =========================
  RATINGS: "/ratings",
  ALL_RATINGS: "/ratings/all",
  AVG_RATING: "/ratings/average",

  // =========================
  // REPORTS
  // =========================
  SALES_REPORT: "/reports/sales",
  USER_ANALYTICS: "/reports/users",

  // =========================
  // SUPPORT
  // =========================
  SUPPORT: "/support",
  NOTIFICATIONS: "/notifications",

  // =========================
  // SETTINGS
  // =========================
  SETTINGS: "/settings",

  // =========================
  // AUTH
  // =========================
  LOGOUT: "/logout",
};

export const Routers = AdminRouters;