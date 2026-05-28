export const AdminRouters = {
  LOGIN: "/login",
  VERIFY_OTP: "/verify-otp",

  DASHBOARD: "/dashboard",

  USERS: "/users",
  ALL_USERS: "/users/all",
  ADD_USER: "/users/add",
  ADMIN_ROLES: "/users/roles",

  PRODUCTS: "/products",
  ALL_PRODUCTS: "/products/all",
  ADD_PRODUCT: "/products/add",

  CATEGORIES: "/categories",
  SUB_CATEGORIES: "/sub-categories",
  BRANDS: "/brands",

  STORES: "/stores",
  STORE_DETAILS: "/stores/:storeId",
  INVENTORY: "/inventory",

  STORE_CATEGORIES: "/store-categories",
  STORE_SUB_CATEGORIES: "/store-sub-categories",
  STORE_PRODUCTS: "/store-products",
  PRODUCT_DETAILS: "/product-details",

  ORDERS: "/orders",
  STORE_ORDERS: "/orders",
  ALL_ORDERS: "/orders/all",
  PENDING_ORDERS: "/orders/pending",
  SHIPPING: "/orders/shipping",
  PACKED_ORDERS: "/orders/packed",
  ASSIGN_DRIVER: "/orders/assign-driver",
  ORDER_STATUS: "/orders/status",

  TRANSACTIONS: "/payments/transactions",
  WALLETS: "/payments/wallets",
  USER_TRANSACTIONS: "/payments/user-transactions",

  DRIVERS: "/drivers",
  ALL_DRIVERS: "/drivers/all",
  ADD_DRIVER: "/drivers/add",

  RATINGS: "/ratings",
  ALL_RATINGS: "/ratings/all",
  AVG_RATING: "/ratings/average",

  SALES_REPORT: "/reports/sales",
  USER_ANALYTICS: "/reports/users",

  SUPPORT: "/support",
  NOTIFICATIONS: "/notifications",
  SETTINGS: "/settings",

  LOGOUT: "/logout",
};

export const Routers = AdminRouters;