// ===============================================
// src/routes/RouterPage.jsx
// ===============================================

import React from "react";

import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

// =========================================
// AUTH PAGES
// =========================================
import Login from "../pages/Login";
import VerifyOTP from "../pages/authenticated/VerifyOTP";

// =========================================
// LAYOUT
// =========================================
import MainLayout from "../mainlayout/MainLayout";

// =========================================
// ROUTES CONSTANT
// =========================================
import { AdminRouters } from "../constants/routes";

// =========================================
// DASHBOARD
// =========================================
import Dashboard from "../pages/admin/dashboard/Dashboard";

// =========================================
// USERS
// =========================================
import AllUsers from "../pages/admin/users/AllUsers";
import AdminRoles from "../pages/admin/users/AdminRoles";
import AddUser from "../pages/admin/users/AddUser";

// =========================================
// PRODUCTS
// =========================================
import Products from "../pages/admin/products/Products";
import AddProduct from "../pages/admin/products/AddProduct";

// =========================================
// CATEGORIES
// =========================================
import Categories from "../pages/admin/categories/Categories";
import SubCategories from "../pages/admin/categories/SubCategories";
import Brands from "../pages/admin/categories/Brands";
import ParentCategories from "../pages/admin/categories/ParentCategories";

// =========================================
// STORES
// =========================================
import Stores from "../pages/admin/stores/Stores";
import Inventory from "../pages/admin/stores/Inventory";
import StoreDetails from "../pages/admin/stores/StoreDetails";
import StoreCategories from "../pages/admin/stores/StoreCategories";
import Transactions from "../pages/admin/payments/Transactions";
import Drivers from "../pages/admin/drivers/Drivers";
import StoreDrivers from "../pages/admin/drivers/StoreDrivers";
import AddDriver from "../pages/admin/drivers/AddDriver";
import Support from "../pages/admin/Support";



// =========================================
// OUT FOR DELIVERY
// =========================================
import OutForDeliveryOrders from "../pages/admin/orders/OutForDeliveryOrders";
import PendingOrders from "../pages/admin/orders/PendingOrders";
// import ShippingOrders from "../pages/admin/orders/ShippingOrders";
// import AllOrdersPage from "../pages/admin/orders/AllOrders";
// import OrderStatus from "../pages/admin/orders/OrderStatus";


// RATINGS

import Ratings from "../pages/admin/ratings/Ratings";
import Rewards from "../pages/admin/rewards/Rewards";
import AllRatings from "../pages/admin/ratings/AllRatings";
import AverageRating from "../pages/admin/ratings/AverageRating";

//orders
import AllOrders from "../pages/admin/orders/AllOrders";
import Orders from "../pages/admin/orders/Oreders";
import PackedOrders from "../pages/admin/orders/PackedOrders";
import StoreProduct from "../pages/admin/stores/StoreProduct";
import Variants from "../pages/admin/products/Variants";
import ManageWallet from "../pages/admin/Wallet/ManageWallet";
import TimeSlot from "../pages/admin/timeslot/TimeSlot";
import Notifications from "../pages/admin/notifications/Notifications";
 


// COMMON PAGE

const CommonPage = ({ title, desc }) => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] p-6">
      <div className="rounded-[32px] border border-[var(--border-soft)] bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
          Admin Panel
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          {title}
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          {desc ||
            "This page is ready. Connect your API and build UI here."}
        </p>
      </div>
    </div>
  );
};

// =========================================
// PAGE NOT FOUND
// =========================================
const PageNotFound = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-5">
      <div className="w-full max-w-xl rounded-[32px] border border-[var(--border-soft)] bg-white p-10 text-center shadow-xl">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
          404 ERROR
        </p>

        <h1 className="mt-4 text-4xl font-bold text-slate-900">
          Page Not Found
        </h1>

        <p className="mt-4 text-slate-500">
          The page you are trying to access does not exist.
        </p>

        <a
          href={AdminRouters.DASHBOARD}
          className="mt-8 inline-flex items-center justify-center rounded-2xl bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
        >
          Go To Dashboard
        </a>
      </div>
    </div>
  );
};

// =========================================
// ADMIN ROUTES ARRAY
// =========================================
const adminRoutes = [
  // =========================================
  // DASHBOARD
  // =========================================
  {
    path: AdminRouters.DASHBOARD,
    element: <Dashboard />,
  },

  {
    path: AdminRouters.TIME_SLOTS,
    element: <TimeSlot />
  },

  {
    path: AdminRouters.NOTIFICATIONS,
    element: <Notifications />
  },
  // =========================================
  // USERS
  // =========================================
  {
    path: AdminRouters.USERS,
    element: <AllUsers />,
  },
  {
    path: AdminRouters.ALL_USERS,
    element: <AllUsers />,
  },
  {
    path: AdminRouters.ADD_USER,
    element: <AddUser />,
  },
  {
    path: AdminRouters.ADMIN_ROLES,
    element: <AdminRoles />,
  },

  // =========================================
  // PRODUCTS
  // =========================================
  {
    path: AdminRouters.VARIANTS,
    element: <Variants />,
  },
  {
    path: AdminRouters.ALL_PRODUCTS,
    element: <Products />,
  },
  {
    path: AdminRouters.ADD_PRODUCT,
    element: <AddProduct />,
  },
  {
    path: AdminRouters.EDIT_PRODUCT,
    element: <AddProduct />,
  },

  // =========================================
  // CATEGORIES
  // =========================================
  {
    path: AdminRouters.PARENT_CATEGORIES,
    element: <ParentCategories />,
  },
  {
    path: AdminRouters.CATEGORIES,
    element: <Categories />,
  },
  {
    path: AdminRouters.SUB_CATEGORIES,
    element: <SubCategories />,
  },
  {
    path: AdminRouters.BRANDS,
    element: <Brands />,
  },

  // =========================================
  // STORES
  // =========================================
  {
    path: AdminRouters.STORES,
    element: <Stores />,
  },

  {
    path: AdminRouters.STORE_PRODUCTS,
    element: <StoreProduct />,
  },
  {
    path: AdminRouters.STORE_DETAILS,
    element: <StoreDetails />,
  },
  {
    path: AdminRouters.INVENTORY,
    element: <Inventory />,
  },
  {
    path: AdminRouters.STORE_CATEGORIES,
    element: <StoreCategories />,
  },
  {
    path: AdminRouters.STORE_SUB_CATEGORIES,
    element: <SubCategories />,
  },

  // =========================================
  // STORE ORDERS
  // IMPORTANT:
  // route me :storeId hona zaruri hai
  // warna useParams() undefined dega
  // =========================================
  {
    path: AdminRouters.STORE_ORDERS,
    element: <Orders />,
  },
  {
    path: AdminRouters.STORE_ORDERS + "/:storeId",
    element: <Orders />
  },

  {
    path: AdminRouters.ALL_ORDERS,
    element: <AllOrders />
  },

  {
    path: AdminRouters.OUT_FOR_DELIVERY_ORDERS,
    element: <OutForDeliveryOrders />
  },
  {
    path: AdminRouters.PENDING_ORDERS,
    element: <PendingOrders />
  },
  

  // =========================================
  // OUT FOR DELIVERY
  // =========================================
  {
    path: "/store/out-for-delivery/:storeId",
    element: <OutForDeliveryOrders />,
  },

  // =========================================
  // STORE PRODUCTS
  // =========================================
  {
    path: AdminRouters.STORE_PRODUCTS,
    element: (
      <CommonPage title="Store Products" />
    ),
  },

  {
    path: AdminRouters.PRODUCT_DETAILS,
    element: (
      <CommonPage title="Product Details" />
    ),
  },

  // =========================================
  // ORDERS
  // =========================================
  {
    path: AdminRouters.ALL_ORDERS,
    element: (
      <CommonPage title="All Orders" />
    ),
  },

  {
    path: AdminRouters.PENDING_ORDERS,
    element: (
      <CommonPage title="Pending Orders" />
    ),
  },

  {
    path: AdminRouters.SHIPPING,
    element: (
      <CommonPage title="Shipping Orders" />
    ),
  },

  {
    path: AdminRouters.PACKED_ORDERS,
    element: (
      <PackedOrders />
    ),
  },

  {
    path: AdminRouters.ASSIGN_DRIVER,
    element: (
      <CommonPage title="Assign Driver" />
    ),
  },

  {
    path: AdminRouters.ORDER_STATUS,
    element: (
      <CommonPage title="Order Status" />
    ),
  },

  // =========================================
  // PAYMENTS
  // =========================================
  {
    path: AdminRouters.TRANSACTIONS,
    element: <Transactions />,
  },

  {
    path: AdminRouters.WALLETS,
    element: (
      <CommonPage title="Wallets" />
    ),
  },

  {
    path: AdminRouters.USER_TRANSACTIONS,
    element: (
      <CommonPage title="User Transactions" />
    ),
  },

  // =========================================
  // WALLET MANAGEMENT
  // =========================================
  {
    path: AdminRouters.MANAGE_WALLET,
    element: (
      <ManageWallet />
    )
  },
  {
    path: AdminRouters.REWARDS,
    element: (
      <Rewards />
    )
  },
  // =========================================
  // {
  //   path: AdminRouters.DRIVERS,
  //   element: <Drivers />,
  // },

  {
    path: AdminRouters.ALL_DRIVERS,
    element: (
      <StoreDrivers />
    ),
  },
{
    path: AdminRouters.ADD_DRIVER_TO_ORDER,  
    element: <AddDriver />
      
    
    },
  {
    path: AdminRouters.ADD_DRIVER,
    element: <Drivers />
  },

  // =========================================
  // RATINGS
  // =========================================
  {
    path: AdminRouters.RATINGS,
    element: <Ratings />,
  },

  {
    path: AdminRouters.ALL_RATINGS,
    element: <AllRatings />,
  },

  {
    path: AdminRouters.AVG_RATING,
    element: <AverageRating />,
  },

  // =========================================
  // REPORTS
  // =========================================
  {
    path: AdminRouters.SALES_REPORT,
    element: (
      <CommonPage title="Sales Report" />
    ),
  },

  {
    path: AdminRouters.USER_ANALYTICS,
    element: (
      <CommonPage title="User Analytics" />
    ),
  },

  // =========================================
  // SUPPORT
  // =========================================
  {
    path: AdminRouters.SUPPORT,
    element: <Support />,
  },

  {
    path: AdminRouters.NOTIFICATIONS,
    element: (
      <CommonPage title="Notifications" />
    ),
  },

  {
    path: AdminRouters.SETTINGS,
    element: (
      <CommonPage title="Settings" />
    ),
  },
];

// =========================================
// MAIN ROUTER PAGE
// =========================================
const RouterPage = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* =========================================
            AUTH ROUTES
        ========================================= */}
        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path={AdminRouters.LOGIN}
          element={<Login />}
        />

        <Route
          path={AdminRouters.VERIFY_OTP}
          element={<VerifyOTP />}
        />

        {/* =========================================
            ADMIN ROUTES
        ========================================= */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <MainLayout
                inner={route.element}
              />
            }
          />
        ))}

        {/* =========================================
            404 PAGE
        ========================================= */}
        <Route
          path="*"
          element={<PageNotFound />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterPage;