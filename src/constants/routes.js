// ===============================================
// src/constants/routes.js
// ===============================================

export const AdminRouters = {
  // =========================================
  // AUTH
  // =========================================
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp",

  // =========================================
  // DASHBOARD
  // =========================================
  DASHBOARD: "/dashboard",

  // =========================================
  // USERS
  // =========================================
  USERS: "/dashboard/users",
  ALL_USERS: "/dashboard/users/all",
  ADD_USER: "/dashboard/users/add",
  ADMIN_ROLES: "/dashboard/users/roles",

  // =========================================
  // PRODUCTS
  // =========================================
  PRODUCTS: "/dashboard/products",
  ALL_PRODUCTS: "/dashboard/products/all",
  ADD_PRODUCT: "/dashboard/products/add",

  // =========================================
  // CATEGORIES
  // =========================================
  CATEGORIES: "/dashboard/categories",
  SUB_CATEGORIES: "/dashboard/sub-categories",
  BRANDS: "/dashboard/brands",

  // =========================================
  // STORES
  // =========================================
  STORES: "/dashboard/stores",

  // STORE DETAILS PAGE
  STORE_DETAILS: "/dashboard/stores/:storeId",

  INVENTORY: "/dashboard/inventory",

  STORE_CATEGORIES:
    "/dashboard/store-categories",

  STORE_SUB_CATEGORIES:
    "/dashboard/store-sub-categories",

  STORE_PRODUCTS:
    "/dashboard/store-products",

  PRODUCT_DETAILS:
    "/dashboard/product-details",

  // =========================================
  // STORE ORDERS
  // =========================================
  STORE_ORDERS:
    "/dashboard/orders",
 ALL_ORDERS: "/dashboard/orders/all",

  PENDING_ORDERS: "/dashboard/orders/pending",

  SHIPPING_ORDERS: "/dashboard/orders/shipping",

  PACKED_ORDERS: "/dashboard/orders/packed",

  ASSIGN_DRIVER: "/dashboard/orders/assign-driver",
  // =========================================
  // OUT FOR DELIVERY
  // =========================================
  OUT_FOR_DELIVERY_ORDERS:
    "/dashboard/store/out-for-delivery/:storeId",

  // =========================================
  // ORDERS
  // =========================================
  ORDERS: "/dashboard/orders",

  ALL_ORDERS:
    "/dashboard/orders/all",

  PENDING_ORDERS:
    "/dashboard/orders/pending",

  SHIPPING:
    "/dashboard/orders/shipping",

  PACKED_ORDERS:
    "/dashboard/orders/packed",

  ASSIGN_DRIVER:
    "/dashboard/orders/assign-driver",

  ORDER_STATUS:
    "/dashboard/orders/status",

  // =========================================
  // PAYMENTS
  // =========================================
  TRANSACTIONS:
    "/dashboard/payments/transactions",

  WALLETS:
    "/dashboard/payments/wallets",

  USER_TRANSACTIONS:
    "/dashboard/payments/user-transactions",

  // =========================================
  // DRIVERS
  // =========================================
  DRIVERS: "/dashboard/drivers",

  ALL_DRIVERS:
    "/dashboard/drivers/all",

  ADD_DRIVER:
    "/dashboard/drivers/add",

  // =========================================
  // RATINGS
  // =========================================
  RATINGS: "/dashboard/ratings",

  ALL_RATINGS:
    "/dashboard/ratings/all",

  AVG_RATING:
    "/dashboard/ratings/average",

  // =========================================
  // REPORTS
  // =========================================
  SALES_REPORT:
    "/dashboard/reports/sales",

  USER_ANALYTICS:
    "/dashboard/reports/users",

  // =========================================
  // SUPPORT
  // =========================================
  SUPPORT: "/dashboard/support",

  NOTIFICATIONS:
    "/dashboard/notifications",

  SETTINGS:
    "/dashboard/settings",

  // =========================================
  // LOGOUT
  // =========================================
  LOGOUT: "/logout",
};

export const Routers = AdminRouters;