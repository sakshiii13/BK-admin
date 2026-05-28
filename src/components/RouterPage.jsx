import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import MainLayout from "../mainlayout/MainLayout";
import { AdminRouters } from "../constants/routes";
import VerifyOTP from "../pages/authenticated/VerifyOTP";

import Dashboard from "../pages/admin/dashboard/Dashboard";

import AllUsers from "../pages/admin/users/AllUsers";
import AdminRoles from "../pages/admin/users/AdminRoles";
import AddUser from "../pages/admin/users/AddUser";

import Products from "../pages/admin/products/Products";
import AddProduct from "../pages/admin/products/AddProduct";

import Categories from "../pages/admin/categories/Categories";
import SubCategories from "../pages/admin/categories/SubCategories";
import Brands from "../pages/admin/categories/Brands";

import Stores from "../pages/admin/stores/Stores";
import Inventory from "../pages/admin/stores/Inventory";
import StoreDetails from "../pages/admin/stores/StoreDetails";
import StoreCategories from "../pages/admin/stores/StoreCategories";

import Ratings from "../pages/admin/ratings/Ratings";
import AllRatings from "../pages/admin/ratings/AllRatings";
import AverageRating from "../pages/admin/ratings/AverageRating";

import StoreProducts from "../pages/admin/StoreProducts";

const CommonPage = ({ title, desc }) => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--card-bg)] p-6 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
          Admin Panel
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white">{title}</h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          {desc ||
            "This page is ready. Now you can connect your API and UI here."}
        </p>
      </div>
    </div>
  );
};

const PageNotFound = () => (
  <div className="flex min-h-screen items-center justify-center bg-[var(--app-bg)] px-6 text-white">
    <div className="max-w-lg rounded-[32px] border border-[var(--border-soft)] bg-[var(--card-bg)] p-10 text-center shadow-2xl">
      <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
        404 / Page not found
      </p>

      <h1 className="mt-4 text-4xl font-bold">Oops — page not found</h1>

      <p className="mt-4 text-slate-300">
        Please use sidebar menu or go back to login page.
      </p>

      <a
        href="/"
        className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-orange-400"
      >
        Go to Login
      </a>
    </div>
  </div>
);

const adminRoutes = [
  {
    path: AdminRouters.DASHBOARD,
    element: <Dashboard />,
  },

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

  {
    path: AdminRouters.PRODUCTS,
    element: <Products />,
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

  {
    path: AdminRouters.STORES,
    element: <Stores />,
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

  {
    path: AdminRouters.STORE_ORDERS,
    element: <StoreProducts />,
  },

  {
    path: AdminRouters.STORE_PRODUCTS,
    element: <CommonPage title="Store Products" />,
  },
  {
    path: AdminRouters.PRODUCT_DETAILS,
    element: <CommonPage title="Product Details" />,
  },

  {
    path: AdminRouters.ALL_ORDERS,
    element: <CommonPage title="All Orders" />,
  },
  {
    path: AdminRouters.PENDING_ORDERS,
    element: <CommonPage title="Pending Orders" />,
  },
  {
    path: AdminRouters.SHIPPING,
    element: <CommonPage title="Shipping" />,
  },
  {
    path: AdminRouters.PACKED_ORDERS,
    element: <CommonPage title="Packed Orders" />,
  },
  {
    path: AdminRouters.ASSIGN_DRIVER,
    element: <CommonPage title="Assign Driver" />,
  },
  {
    path: AdminRouters.ORDER_STATUS,
    element: <CommonPage title="Order Status" />,
  },

  {
    path: AdminRouters.TRANSACTIONS,
    element: <CommonPage title="Transactions" />,
  },
  {
    path: AdminRouters.WALLETS,
    element: <CommonPage title="Wallets" />,
  },
  {
    path: AdminRouters.USER_TRANSACTIONS,
    element: <CommonPage title="User Transactions" />,
  },

  {
    path: AdminRouters.DRIVERS,
    element: <CommonPage title="Drivers" />,
  },
  {
    path: AdminRouters.ALL_DRIVERS,
    element: <CommonPage title="All Drivers" />,
  },
  {
    path: AdminRouters.ADD_DRIVER,
    element: <CommonPage title="Add Driver" />,
  },

  {
    path: AdminRouters.RATINGS,
    element: <Ratings />,
  },
  {
    path: AdminRouters.ALL_RATINGS,
    element: <AllRatings />,
  },
  {
    path: AdminRouters.AVERAGE_RATING,
    element: <AverageRating />,
  },
  {
    path: AdminRouters.AVG_RATING,
    element: <AverageRating />,
  },

  {
    path: AdminRouters.SALES_REPORT,
    element: <CommonPage title="Sales Report" />,
  },
  {
    path: AdminRouters.USER_ANALYTICS,
    element: <CommonPage title="User Analytics" />,
  },
  {
    path: AdminRouters.SUPPORT,
    element: <CommonPage title="Support" />,
  },
  {
    path: AdminRouters.NOTIFICATIONS,
    element: <CommonPage title="Notifications" />,
  },
  {
    path: AdminRouters.SETTINGS,
    element: <CommonPage title="Settings" />,
  },
];

const RouterPage = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path={AdminRouters.LOGIN} element={<Login />} />
        <Route path={AdminRouters.VERIFY_OTP} element={<VerifyOTP />} />

        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={<MainLayout inner={route.element} />}
          />
        ))}

        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default RouterPage;