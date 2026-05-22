// src/routes/RouterPage.jsx

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
    path: AdminRouters.INVENTORY,
    element: <Inventory />,
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