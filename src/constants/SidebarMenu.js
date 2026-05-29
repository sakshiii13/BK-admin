import {
  MdDashboard,
  MdPeople,
  MdPersonAddAlt1,
  MdAdminPanelSettings,
  MdInventory2,
  MdAddBox,
  MdCategory,
  MdShoppingCart,
  MdPendingActions,
  MdLocalShipping,
  MdPayments,
  MdAccountBalanceWallet,
  MdBarChart,
  MdAnalytics,
  MdSupportAgent,
  MdNotifications,
  MdSettings,
  MdLogout,
  MdOutlineRadioButtonUnchecked,
  MdStore,
  MdWarehouse,
  MdBrandingWatermark,
  MdStarRate,
} from "react-icons/md";

import { AdminRouters } from "./routes";

export const sidebarMenu = {
  Admin: [
    {
      title: "Dashboard",
      path: AdminRouters.DASHBOARD,
      icon: MdDashboard,
    },

    {
      title: "User Management",
      icon: MdPeople,
      children: [
        {
          title: "All Users",
          path: AdminRouters.ALL_USERS,
          icon: MdOutlineRadioButtonUnchecked,
        },
       
      ],
    },

    {
      title: "Product Management",
      icon: MdInventory2,
      children: [
        {
          title: "All Products",
          path: AdminRouters.ALL_PRODUCTS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Add Product",
          path: AdminRouters.ADD_PRODUCT,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Category Management",
      icon: MdCategory,
      children: [
        {
          title: "Categories",
          path: AdminRouters.CATEGORIES,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Sub Categories",
          path: AdminRouters.SUB_CATEGORIES,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Brands",
          path: AdminRouters.BRANDS,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Store Management",
      icon: MdStore,
      children: [
        {
          title: "Stores",
          path: AdminRouters.STORES,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Inventory",
          path: AdminRouters.INVENTORY,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Store Categories",
          path: AdminRouters.STORE_CATEGORIES,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Store Sub Categories",
          path: AdminRouters.STORE_SUB_CATEGORIES,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Store Products",
          path: AdminRouters.STORE_PRODUCTS,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Order Management",
      icon: MdShoppingCart,
      children: [
        {
          title: "All Orders",
          path: AdminRouters.ALL_ORDERS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Pending Orders",
          path: AdminRouters.PENDING_ORDERS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Packed Orders",
          path: AdminRouters.PACKED_ORDERS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Shipping",
          path: AdminRouters.SHIPPING,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Assign Driver",
          path: AdminRouters.ASSIGN_DRIVER,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Order Status",
          path: AdminRouters.ORDER_STATUS,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Transaction Management",
      icon: MdPayments,
      children: [
        {
          title: "Transactions",
          path: AdminRouters.TRANSACTIONS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Wallets",
          path: AdminRouters.WALLETS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "User Transactions",
          path: AdminRouters.USER_TRANSACTIONS,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Driver Management",
      icon: MdLocalShipping,
      children: [
        {
          title: "All Drivers",
          path: AdminRouters.ALL_DRIVERS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Add Driver",
          path: AdminRouters.ADD_DRIVER,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Rating Management",
      icon: MdStarRate,
      children: [
        {
          title: "All Ratings",
          path: AdminRouters.ALL_RATINGS,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "Average Rating",
          path: AdminRouters.AVG_RATING,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Reports",
      icon: MdBarChart,
      children: [
        {
          title: "Sales Report",
          path: AdminRouters.SALES_REPORT,
          icon: MdOutlineRadioButtonUnchecked,
        },
        {
          title: "User Analytics",
          path: AdminRouters.USER_ANALYTICS,
          icon: MdOutlineRadioButtonUnchecked,
        },
      ],
    },

    {
      title: "Support",
      path: AdminRouters.SUPPORT,
      icon: MdSupportAgent,
    },

    {
      title: "Notifications",
      path: AdminRouters.NOTIFICATIONS,
      icon: MdNotifications,
    },

    {
      title: "Settings",
      path: AdminRouters.SETTINGS,
      icon: MdSettings,
    },

    {
      title: "Logout",
      path: AdminRouters.LOGOUT,
      icon: MdLogout,
    },
  ],
};