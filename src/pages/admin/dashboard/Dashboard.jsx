// src/pages/dashboard/Dashboard.jsx

import React, { useEffect, useMemo, useState } from "react";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdPeople,
  MdStorefront,
  MdRefresh,
  MdTrendingUp,
  MdPayments,
  MdBarChart,
  MdStars,
  MdArrowOutward,
} from "react-icons/md";

import { GiShoppingBag } from "react-icons/gi";

import { useDispatch } from "react-redux";

import {
  showLoader,
  hideLoader,
} from "../../../redux/slices/loaderSlice";

import { showError } from "../../../utils/alertService";

import { getAdminDashboardApi } from "../../../api/admin.api";

const Dashboard = () => {
  // =========================================
  // REDUX
  // =========================================
  const dispatch = useDispatch();

  // =========================================
  // STATES
  // =========================================
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  // =========================================
  // FETCH DASHBOARD DATA
  // =========================================
  const fetchDashboard = async () => {
    try {
      setLoading(true);

      dispatch(showLoader());

      const res = await getAdminDashboardApi();

      console.log("DASHBOARD RESPONSE 👉", res);

      if (res?.success) {
        setDashboardData(res?.data || null);
      } else {
        showError(res?.message || "Dashboard data not found");
      }
    } catch (error) {
      console.log("DASHBOARD ERROR 👉", error);

      showError("Something went wrong");
    } finally {
      setLoading(false);

      dispatch(hideLoader());
    }
  };

  // =========================================
  // PAGE LOAD PE API CALL
  // =========================================
  useEffect(() => {
    fetchDashboard();
  }, []);

  // =========================================
  // SAFE DATA
  // =========================================
  const overview = dashboardData?.overview || {};
  const orderStats = dashboardData?.orderStats || [];
  const paymentStats = dashboardData?.paymentStats || [];
  const storeWiseRevenue = dashboardData?.storeWiseRevenue || [];
  const topProducts = dashboardData?.topProducts || [];

  // =========================================
  // FORMAT CURRENCY
  // =========================================
  const formatCurrency = (amount) => {
    return `₹${Number(amount || 0).toLocaleString("en-IN")}`;
  };

  // =========================================
  // CURRENT DATE
  // =========================================
  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // =========================================
  // MAX REVENUE
  // progress width ke liye
  // =========================================
  const maxStoreRevenue = useMemo(() => {
    return Math.max(
      ...storeWiseRevenue.map((item) =>
        Number(item?.totalRevenue || 0)
      ),
      1
    );
  }, [storeWiseRevenue]);

  // =========================================
  // STATS ARRAY
  // reusable cards
  // =========================================
  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(overview?.totalRevenue),
      sub: `Monthly ${formatCurrency(
        overview?.monthlyRevenue
      )}`,
      icon: <MdAttachMoney />,
      bg: "bg-orange-50",
      text: "text-orange-500",
    },

    {
      title: "Total Orders",
      value: overview?.totalOrders || 0,
      sub: `Weekly ${formatCurrency(
        overview?.weeklyRevenue
      )}`,
      icon: <MdShoppingCart />,
      bg: "bg-slate-100",
      text: "text-slate-700",
    },

    {
      title: "Total Users",
      value: overview?.totalUsers || 0,
      sub: "Registered customers",
      icon: <MdPeople />,
      bg: "bg-orange-50",
      text: "text-orange-500",
    },

    {
      title: "Stores / Drivers",
      value: `${overview?.totalStores || 0} / ${
        overview?.totalDrivers || 0
      }`,
      sub: "Store network",
      icon: <MdStorefront />,
      bg: "bg-slate-100",
      text: "text-slate-700",
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6f8] p-6 space-y-7">

      {/* =========================================
          HERO SECTION
      ========================================= */}
      <div className="bg-white rounded-[34px] border border-[#ececec] p-8 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* LEFT */}
          <div>

            <div className="flex items-center gap-3">

              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
                <GiShoppingBag />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-orange-500">
                  BK Grocery
                </p>

                {/* <p className="text-sm text-slate-500">
                  Premium Admin Dashboard
                </p> */}
              </div>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Smart Business Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-slate-500 leading-7">
              Monitor revenue, stores, orders, products and
              drivers from one clean premium dashboard.
            </p>

            <p className="mt-5 text-xs font-semibold text-slate-400">
              {currentDate}
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="h-12 px-6 rounded-2xl bg-orange-500 text-white font-semibold shadow-[0_8px_20px_rgba(249,115,22,0.20)] hover:scale-[1.02] transition-all duration-300 flex items-center gap-2"
          >
            <MdRefresh
              className={loading ? "animate-spin" : ""}
              size={18}
            />

            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* =========================================
          STAT CARDS
      ========================================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">

        {stats.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-[28px] border border-[#ececec] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:-translate-y-1 transition-all duration-300"
          >

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] font-black text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-4 text-4xl font-black text-slate-900">
                  {item.value}
                </h2>

                <p className="mt-3 text-sm text-slate-500">
                  {item.sub}
                </p>
              </div>

              <div
                className={`h-14 w-14 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center text-2xl`}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-4">

              <div className="flex items-center gap-1 text-xs font-bold text-orange-500">
                <MdTrendingUp />
                Analytics
              </div>

              <div className="flex items-center gap-1 text-xs text-slate-400 font-bold">
                +12%
                <MdArrowOutward />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* =========================================
          MINI REVENUE CARDS
      ========================================= */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">

        <MiniCard
          title="Daily Revenue"
          value={formatCurrency(overview?.dailyRevenue)}
        />

        <MiniCard
          title="Weekly Revenue"
          value={formatCurrency(overview?.weeklyRevenue)}
        />

        <MiniCard
          title="Monthly Revenue"
          value={formatCurrency(overview?.monthlyRevenue)}
        />

        <MiniCard
          title="Yearly Revenue"
          value={formatCurrency(overview?.yearlyRevenue)}
        />
      </div>

      {/* =========================================
          ORDER + PAYMENT
      ========================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* ORDER FLOW */}
        <Panel
          title="Order Status"
          sub="Real-time order flow"
          icon={<MdBarChart />}
          className="xl:col-span-2"
        >
          {orderStats.map((item, index) => {

            const percent =
              ((item?.total || 0) /
                (overview?.totalOrders || 1)) *
              100;

            return (
              <div
                key={index}
                className="mb-5 rounded-3xl border border-slate-100 bg-[#fafafa] p-5"
              >
                <div className="mb-3 flex justify-between">

                  <p className="font-bold text-slate-700">
                    {item?._id}
                  </p>

                  <p className="text-sm font-bold text-slate-400">
                    {item?.total} Orders
                  </p>
                </div>

                <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">

                  <div
                    className="h-full rounded-full bg-orange-500"
                    style={{
                      width: `${percent}%`,
                    }}
                  ></div>
                </div>
              </div>
            );
          })}
        </Panel>

        {/* PAYMENT */}
        <Panel
          title="Payments"
          sub="COD vs Online"
          icon={<MdPayments />}
        >
          {paymentStats.map((item, index) => (
            <div
              key={index}
              className="mb-4 rounded-3xl border border-slate-100 bg-[#fafafa] p-5"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="font-bold text-slate-700">
                    {item?._id}
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Payment Method
                  </p>
                </div>

                <h2 className="text-2xl font-black text-slate-900">
                  {formatCurrency(item?.totalAmount)}
                </h2>
              </div>
            </div>
          ))}
        </Panel>
      </div>

      {/* =========================================
          STORE REVENUE + PRODUCTS
      ========================================= */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* STORES */}
        <Panel
          title="Store Revenue"
          sub="Store performance"
          icon={<MdStorefront />}
          className="xl:col-span-2"
        >
          {storeWiseRevenue.map((store, index) => (
            <div
              key={index}
              className="mb-5 rounded-3xl border border-slate-100 bg-[#fafafa] p-5"
            >
              <div className="mb-3 flex justify-between">

                <p className="font-bold text-slate-700">
                  {store?.storeName}
                </p>

                <p className="font-black text-orange-500">
                  {formatCurrency(store?.totalRevenue)}
                </p>
              </div>

              <div className="h-2.5 w-full bg-slate-200 rounded-full overflow-hidden">

                <div
                  className="h-full rounded-full bg-orange-500"
                  style={{
                    width: `${
                      (store?.totalRevenue /
                        maxStoreRevenue) *
                      100
                    }%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </Panel>

        {/* TOP PRODUCTS */}
        <Panel
          title="Top Products"
          sub="Best selling products"
          icon={<MdStars />}
        >
          {topProducts.map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 mb-4 rounded-3xl border border-slate-100 bg-[#fafafa] p-4 hover:bg-white transition-all"
            >

              <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center font-black">
                #{index + 1}
              </div>

              <div className="flex-1">

                <p className="font-bold text-slate-800">
                  {item?.productName}
                </p>

                <p className="text-sm text-slate-400 mt-1">
                  {item?.totalSold} sold
                </p>
              </div>
            </div>
          ))}
        </Panel>
      </div>
    </div>
  );
};

/* =========================================
   PANEL COMPONENT
========================================= */
const Panel = ({
  children,
  title,
  sub,
  icon,
  className = "",
}) => {
  return (
    <div
      className={`bg-white rounded-[30px] border border-[#ececec] p-6 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${className}`}
    >

      <div className="mb-6 flex items-center justify-between">

        <div>
          <h2 className="text-xl font-black text-slate-900">
            {title}
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            {sub}
          </p>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center text-2xl">
          {icon}
        </div>
      </div>

      {children}
    </div>
  );
};

/* =========================================
   MINI CARD
========================================= */
const MiniCard = ({
  title,
  value,
}) => {
  return (
    <div className="bg-white rounded-[26px] border border-[#ececec] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.04)]">

      <p className="text-[11px] uppercase tracking-[0.25em] font-black text-slate-400">
        {title}
      </p>

      <h2 className="mt-4 text-3xl font-black text-slate-900">
        {value}
      </h2>
    </div>
  );
};

export default Dashboard;