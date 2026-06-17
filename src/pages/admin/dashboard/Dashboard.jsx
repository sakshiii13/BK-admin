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
      bg: "bg-green-50/80 border border-green-100",
      text: "text-[var(--primary-green)]",
    },

    {
      title: "Total Orders",
      value: overview?.totalOrders || 0,
      sub: `Weekly ${formatCurrency(
        overview?.weeklyRevenue
      )}`,
      icon: <MdShoppingCart />,
      bg: "bg-yellow-50/80 border border-yellow-100",
      text: "text-yellow-600",
    },

    {
      title: "Total Users",
      value: overview?.totalUsers || 0,
      sub: "Registered customers",
      icon: <MdPeople />,
      bg: "bg-blue-50/80 border border-blue-100",
      text: "text-blue-600",
    },

    {
      title: "Stores / Drivers",
      value: `${overview?.totalStores || 0} / ${
        overview?.totalDrivers || 0
      }`,
      sub: "Store network",
      icon: <MdStorefront />,
      bg: "bg-orange-50/80 border border-orange-100",
      text: "text-orange-600",
    },
  ];

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[#f3f6f5] space-y-7">

      {/* =========================================
          HERO SECTION
      ========================================= */}
      <div className="card-3d p-6 md:p-8 bg-white">

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

          {/* LEFT */}
          <div>

            <div className="flex items-center gap-3">

              <div className="h-12 w-12 rounded-2xl bg-green-50 text-[var(--primary-green)] border border-green-100 flex items-center justify-center text-2xl shadow-sm">
                <GiShoppingBag className="animate-bounce" />
              </div>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.3em] text-[var(--primary-green)]">
                  BK Grocery
                </p>
              </div>
            </div>

            <h1 className="mt-6 text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Smart Business Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-slate-500 font-bold leading-7">
              Monitor revenue, stores, orders, products and
              drivers from one clean premium dashboard.
            </p>

            <p className="mt-5 text-xs font-black text-slate-400">
              {currentDate}
            </p>
          </div>

          {/* BUTTON */}
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="btn-3d btn-primary h-12 px-6"
          >
            <MdRefresh
              className={loading ? "animate-spin mr-2" : "mr-2"}
              size={18}
            />

            <span>{loading ? "Refreshing..." : "Refresh"}</span>
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
            className="card-3d p-6 bg-white"
          >

            <div className="flex items-start justify-between">

              <div>
                <p className="text-[11px] uppercase tracking-[0.25em] font-black text-slate-400">
                  {item.title}
                </p>

                <h2 className="mt-4 text-4xl font-black text-slate-900 tracking-tight">
                  {item.value}
                </h2>

                <p className="mt-3 text-sm text-slate-500 font-bold">
                  {item.sub}
                </p>
              </div>

              <div
                className={`h-14 w-14 rounded-2xl ${item.bg} ${item.text} flex items-center justify-center text-2xl shadow-md border-b-[3px] border-b-slate-200`}
              >
                {item.icon}
              </div>
            </div>

            <div className="mt-7 flex items-center justify-between border-t border-slate-100 pt-4 font-bold">

              {/* <div className="flex items-center gap-1 text-xs text-[var(--primary-green)]">
                <MdTrendingUp size={16} />
                Analytics
              </div> */}

              {/* <div className="flex items-center gap-1 text-xs text-slate-400">
                +12%
                <MdArrowOutward /> */}
              {/* </div> */}
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
                className="mb-5 rounded-[20px] border border-slate-200 border-b-4 border-b-slate-300 bg-slate-50/50 p-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
              >
                <div className="mb-3 flex justify-between font-bold">

                  <p className="text-slate-700">
                    {item?._id}
                  </p>

                  <p className="text-sm text-slate-400">
                    {item?.total} Orders
                  </p>
                </div>

                <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-green-light)] shadow-md"
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
              className="mb-4 rounded-[20px] border border-slate-200 border-b-4 border-b-slate-300 bg-slate-50/50 p-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="font-extrabold text-slate-700">
                    {item?._id}
                  </p>

                  <p className="text-xs text-slate-400 mt-1 font-bold">
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
              className="mb-5 rounded-[20px] border border-slate-200 border-b-4 border-b-slate-300 bg-slate-50/50 p-5 shadow-[inset_0_2px_4px_rgba(0,0,0,0.02)]"
            >
              <div className="mb-3 flex justify-between font-bold">

                <p className="text-slate-700">
                  {store?.storeName}
                </p>

                <p className="font-black text-[var(--primary-green)]">
                  {formatCurrency(store?.totalRevenue)}
                </p>
              </div>

              <div className="h-3.5 w-full bg-slate-200 rounded-full overflow-hidden shadow-inner">

                <div
                  className="h-full rounded-full bg-gradient-to-r from-[var(--primary-green)] to-[var(--primary-orange)]"
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
              className="flex items-center gap-4 mb-4 rounded-[20px] border border-slate-200 border-b-4 border-b-slate-300 bg-slate-50/55 p-4 hover:-translate-y-0.5 hover:bg-white hover:border-slate-300 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
            >

              <div className="h-12 w-12 rounded-2xl bg-green-50 text-[var(--primary-green)] flex items-center justify-center font-black border border-green-100 shadow-inner">
                #{index + 1}
              </div>

              <div className="flex-1 text-left">

                <p className="font-extrabold text-slate-800 text-sm">
                  {item?.productName}
                </p>

                <p className="text-xs text-slate-400 mt-1 font-bold">
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
      className={`card-3d p-6 bg-white ${className}`}
    >

      <div className="mb-6 flex items-center justify-between">

        <div className="text-left">
          <h2 className="text-xl font-black text-slate-900">
            {title}
          </h2>

          <p className="text-sm text-slate-500 mt-1 font-bold">
            {sub}
          </p>
        </div>

        <div className="h-12 w-12 rounded-2xl bg-green-50 text-[var(--primary-green)] border border-green-100 flex items-center justify-center text-2xl shadow-sm">
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
    <div className="card-3d p-4 sm:p-5 bg-white border-l-4 border-l-[var(--primary-green)] text-left">

      <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] font-black text-slate-400">
        {title}
      </p>

      <h2 className="mt-3 text-xl sm:text-2xl lg:text-3xl font-black text-[var(--primary-green)] truncate" title={value}>
        {value}
      </h2>
    </div>
  );
};

export default Dashboard;