import React, { useEffect, useMemo, useState } from "react";
import {
  MdAttachMoney,
  MdShoppingCart,
  MdPeople,
  MdStorefront,
  MdRefresh,
  MdWarning,
  MdTrendingUp,
  MdPayments,
  MdBarChart,
  MdStars,
 
} from "react-icons/md";
import { GiShoppingBag } from "react-icons/gi";

import { getAdminDashboardApi } from "../../../api/admin.api";

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await getAdminDashboardApi();
      console.log("ADMIN DASHBOARD RESPONSE 👉", res);
      if (res?.success) {
        setDashboardData(res?.data || null);
      } else {
        alert(res?.message || "Dashboard data not found");
      }
    } catch (error) {
      console.log("Dashboard error:", error);
      alert("Something went wrong while fetching dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const overview = dashboardData?.overview || {};
  const orderStats = dashboardData?.orderStats || [];
  const paymentStats = dashboardData?.paymentStats || [];
  const storeWiseRevenue = dashboardData?.storeWiseRevenue || [];
  const topProducts = dashboardData?.topProducts || [];
  const inventoryAlerts = dashboardData?.inventoryAlerts || [];

  const formatCurrency = (amount) =>
    `₹${Number(amount || 0).toLocaleString("en-IN")}`;

  const currentDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const maxStoreRevenue = useMemo(() => {
    return Math.max(
      ...storeWiseRevenue.map((item) => Number(item?.totalRevenue || 0)),
      1
    );
  }, [storeWiseRevenue]);

  const stats = [
    {
      title: "Total Revenue",
      value: formatCurrency(overview?.totalRevenue),
      sub: `Monthly ${formatCurrency(overview?.monthlyRevenue)}`,
      icon: <MdAttachMoney />,
      color: "#f37023",
      glow: "rgba(243,112,35,0.18)",
      bg: "from-orange-500/15 via-orange-400/5 to-transparent",
    },
    {
      title: "Total Orders",
      value: `${overview?.totalOrders || 0}`,
      sub: `Weekly ${formatCurrency(overview?.weeklyRevenue)}`,
      icon: <MdShoppingCart />,
      color: "#39b54a",
      glow: "rgba(57,181,74,0.18)",
      bg: "from-green-500/15 via-green-400/5 to-transparent",
    },
    {
      title: "Total Users",
      value: `${overview?.totalUsers || 0}`,
      sub: "Registered customers",
      icon: <MdPeople />,
      color: "#f7941d",
      glow: "rgba(247,148,29,0.18)",
      bg: "from-amber-500/15 via-yellow-400/5 to-transparent",
    },
    {
      title: "Stores / Drivers",
      value: `${overview?.totalStores || 0} / ${overview?.totalDrivers || 0}`,
      sub: "Store network",
      icon: <MdStorefront />,
      color: "#8cc63f",
      glow: "rgba(140,198,63,0.18)",
      bg: "from-lime-500/15 via-green-400/5 to-transparent",
    },
  ];

  return (
    <div className="min-h-screen space-y-7" style={{ background: "var(--app-bg)" }}>

      {/* ── HERO BANNER ── */}
      <div className="relative overflow-hidden rounded-[34px] border border-white/[0.06] p-7 shadow-[0_25px_80px_rgba(0,0,0,0.5)]"
        style={{
          background: "linear-gradient(135deg, #0d1208 0%, #080f06 50%, #0a0e04 100%)",
        }}>

        {/* Ambient blobs */}
        <div className="pointer-events-none absolute -top-24 right-10 h-72 w-72 rounded-full blur-[110px]"
          style={{ background: "rgba(243,112,35,0.18)" }} />
        <div className="pointer-events-none absolute -bottom-24 left-10 h-72 w-72 rounded-full blur-[110px]"
          style={{ background: "rgba(57,181,74,0.14)" }} />
        <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full blur-[80px]"
          style={{ background: "rgba(247,148,29,0.08)" }} />

        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            {/* Badge */}
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl text-base"
                style={{
                  background: "rgba(243,112,35,0.12)",
                  border: "1px solid rgba(243,112,35,0.25)",
                  color: "#f7941d",
                }}>
                <GiShoppingBag />
              </span>
              <p className="text-[10px] font-black uppercase tracking-[0.35em]"
                style={{ color: "#f7941d" }}>
                BK Grocery — Admin Center
              </p>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-black tracking-tight sm:text-5xl text-white">
              Smart Business{" "}
              <span
                className="bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, #f37023 0%, #f7941d 35%, #8cc63f 65%, #39b54a 100%)",
                }}>
                Dashboard
              </span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
              Revenue, orders, payments, stores, top products and inventory
              alerts in one polished control room.
            </p>

            <p className="mt-4 text-xs font-semibold text-slate-500">{currentDate}</p>
          </div>

          {/* Refresh button */}
          <button
            onClick={fetchDashboard}
            disabled={loading}
            className="flex h-12 items-center justify-center gap-2 rounded-2xl px-5 text-sm font-bold text-white shadow-xl transition-all duration-300 hover:-translate-y-1 disabled:opacity-50"
            style={{
              background: "linear-gradient(135deg, #f37023 0%, #f7941d 50%, #8cc63f 100%)",
              boxShadow: "0 4px 20px rgba(243,112,35,0.3)",
            }}>
            <MdRefresh className={loading ? "animate-spin" : ""} />
            {loading ? "Refreshing..." : "Refresh Dashboard"}
          </button>
        </div>
      </div>

      {/* ── LOADING SKELETON ── */}
      {loading && !dashboardData ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-44 animate-pulse rounded-[30px] border border-white/[0.05]"
              style={{ background: "var(--card-bg)" }}
            />
          ))}
        </div>
      ) : (
        <>
          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {stats.map((stat) => (
              <div
                key={stat.title}
                className={`group relative overflow-hidden rounded-[30px] border border-white/[0.06] bg-gradient-to-br ${stat.bg} p-5 shadow-xl transition-all duration-300 hover:-translate-y-1`}
                style={{
                  background: `linear-gradient(135deg, ${stat.glow.replace("0.18)", "0.08)")} 0%, var(--card-bg) 100%)`,
                  borderColor: `${stat.color}22`,
                }}>
                <div
                  className="absolute -right-14 -top-14 h-40 w-40 rounded-full blur-3xl transition-all group-hover:scale-125"
                  style={{ background: stat.glow }}
                />

                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
                      {stat.title}
                    </p>
                    <h2 className="mt-3 text-3xl font-black tracking-tight text-white">
                      {stat.value}
                    </h2>
                    <p className="mt-2 text-xs font-medium text-slate-400">
                      {stat.sub}
                    </p>
                  </div>

                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-2xl border text-2xl"
                    style={{
                      color: stat.color,
                      background: `${stat.color}16`,
                      borderColor: `${stat.color}30`,
                    }}>
                    {stat.icon}
                  </div>
                </div>

                <div className="relative mt-6 flex items-center justify-between border-t pt-4"
                  style={{ borderColor: "rgba(255,255,255,0.06)" }}>
                  <span className="flex items-center gap-1 text-[11px] font-bold"
                    style={{ color: stat.color }}>
                    <MdTrendingUp /> Live API
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                    Synced
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* ── REVENUE MINI CARDS ── */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            <MiniCard title="Daily Revenue"   value={formatCurrency(overview?.dailyRevenue)}   color="#f37023" />
            <MiniCard title="Weekly Revenue"  value={formatCurrency(overview?.weeklyRevenue)}  color="#f7941d" />
            <MiniCard title="Monthly Revenue" value={formatCurrency(overview?.monthlyRevenue)} color="#8cc63f" />
            <MiniCard title="Yearly Revenue"  value={formatCurrency(overview?.yearlyRevenue)}  color="#39b54a" />
          </div>

          {/* ── ORDER STATUS + PAYMENT SPLIT ── */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <Header
                title="Order Status Flow"
                sub="Real-time distribution of all order stages"
                icon={<MdBarChart />}
                color="#f37023"
              />
              <div className="space-y-4">
                {orderStats.length === 0 ? (
                  <EmptyText text="No order stats found." />
                ) : (
                  orderStats.map((item, index) => {
                    const colors = ["#f37023", "#39b54a", "#f7941d", "#8cc63f"];
                    const color = colors[index % colors.length];
                    const percent =
                      ((item?.total || 0) / (overview?.totalOrders || 1)) * 100;

                    return (
                      <div
                        key={item?._id}
                        className="rounded-3xl border p-4"
                        style={{
                          borderColor: "rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.025)",
                        }}>
                        <div className="mb-3 flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <span
                              className="h-3 w-3 rounded-full"
                              style={{
                                background: color,
                                boxShadow: `0 0 10px ${color}99`,
                              }}
                            />
                            <p className="text-sm font-black text-white">{item?._id}</p>
                          </div>
                          <p className="text-xs font-bold text-slate-400">
                            {item?.total || 0} orders
                          </p>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-black/40">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(percent, 100)}%`,
                              background: `linear-gradient(90deg, ${color}, ${color}88)`,
                              boxShadow: `0 0 12px ${color}66`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Panel>

            <Panel>
              <Header
                title="Payment Split"
                sub="COD vs Online breakdown"
                icon={<MdPayments />}
                color="#39b54a"
              />
              <div className="space-y-4">
                {paymentStats.length === 0 ? (
                  <EmptyText text="No payment stats found." />
                ) : (
                  paymentStats.map((item, index) => {
                    const colors = ["#f37023", "#39b54a", "#f7941d"];
                    const color = colors[index % colors.length];
                    return (
                      <div
                        key={item?._id}
                        className="rounded-3xl border p-5"
                        style={{
                          borderColor: `${color}22`,
                          background: `${color}08`,
                        }}>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-black text-white">{item?._id}</p>
                            <p className="mt-1 text-xs text-slate-500">
                              {item?.totalOrders || 0} orders
                            </p>
                          </div>
                          <p className="text-xl font-black" style={{ color }}>
                            {formatCurrency(item?.totalAmount)}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Panel>
          </div>

          {/* ── STORE REVENUE + TOP PRODUCTS ── */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            <Panel className="xl:col-span-2">
              <Header
                title="Store Wise Revenue"
                sub="Performance comparison between stores"
                icon={<MdStorefront />}
                color="#8cc63f"
              />
              <div className="space-y-4">
                {storeWiseRevenue.length === 0 ? (
                  <EmptyText text="No store revenue found." />
                ) : (
                  storeWiseRevenue.map((store) => {
                    const percent =
                      (Number(store?.totalRevenue || 0) / maxStoreRevenue) * 100;
                    return (
                      <div
                        key={store?._id}
                        className="rounded-3xl border p-4"
                        style={{
                          borderColor: "rgba(255,255,255,0.06)",
                          background: "rgba(255,255,255,0.025)",
                        }}>
                        <div className="mb-3 flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-black text-white">
                              {store?.storeName || "—"}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">
                              {store?.totalOrders || 0} orders
                            </p>
                          </div>
                          <p className="font-black" style={{ color: "#f7941d" }}>
                            {formatCurrency(store?.totalRevenue)}
                          </p>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-black/40">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${Math.min(percent, 100)}%`,
                              background:
                                "linear-gradient(90deg, #f37023, #f7941d 40%, #8cc63f 75%, #39b54a)",
                              boxShadow: "0 0 12px rgba(243,112,35,0.4)",
                            }}
                          />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Panel>

            <Panel>
              <Header
                title="Top Products"
                sub="Best selling products"
                icon={<MdStars />}
                color="#f7941d"
              />
              <div className="space-y-3">
                {topProducts.length === 0 ? (
                  <EmptyText text="No top products found." />
                ) : (
                  topProducts.map((product, index) => (
                    <div
                      key={product?._id}
                      className="flex items-center gap-4 rounded-3xl border p-4 transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        borderColor: "rgba(255,255,255,0.06)",
                        background: "rgba(255,255,255,0.025)",
                      }}>
                      <div
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-sm font-black"
                        style={{
                          color: "#f7941d",
                          background: "rgba(247,148,29,0.12)",
                          borderColor: "rgba(247,148,29,0.25)",
                        }}>
                        #{index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black text-white">
                          {product?.productName || "—"}
                        </p>
                        <p className="mt-1 text-xs text-slate-500">Total sold</p>
                      </div>
                      <p
                        className="text-lg font-black"
                        style={{ color: "#39b54a" }}>
                        {product?.totalSold || 0}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </Panel>
          </div>

          {/* ── INVENTORY ALERTS ── */}
          <Panel>
            <Header
              title="Inventory Attention"
              sub="Products that need stock review"
              icon={<MdWarning />}
              color="#f37023"
            />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {inventoryAlerts.length === 0 ? (
                <EmptyText text="All inventory levels are healthy." />
              ) : (
                inventoryAlerts.map((item) => {
                  const productName = item?.variant?.product?.name || "—";
                  const sku = item?.variant?.sku || "—";
                  const storeName = item?.store?.name || "—";
                  const availableStock = item?.availableStock ?? 0;

                  return (
                    <div
                      key={item?._id}
                      className="relative overflow-hidden rounded-3xl border p-4"
                      style={{
                        borderColor: "rgba(243,112,35,0.2)",
                        background: "rgba(243,112,35,0.05)",
                      }}>
                      <div
                        className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
                        style={{ background: "rgba(243,112,35,0.15)" }}
                      />
                      <div className="relative flex items-start gap-4">
                        <div
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border text-base"
                          style={{
                            color: "#f37023",
                            background: "rgba(243,112,35,0.12)",
                            borderColor: "rgba(243,112,35,0.25)",
                          }}>
                          <MdWarning />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-black text-white">
                            {productName}
                          </p>
                          <p className="mt-1 text-xs text-slate-500">{storeName}</p>
                          <p className="mt-1 text-[10px] text-slate-600">
                            SKU: {sku}
                          </p>
                        </div>
                        <span
                          className="rounded-xl px-3 py-1 text-xs font-black"
                          style={{
                            color: "#f37023",
                            background: "rgba(243,112,35,0.12)",
                            border: "1px solid rgba(243,112,35,0.25)",
                          }}>
                          {availableStock} left
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Panel>
        </>
      )}
    </div>
  );
};

/* ── SUBCOMPONENTS ── */

const Panel = ({ children, className = "" }) => (
  <div
    className={`rounded-[34px] border p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)] ${className}`}
    style={{
      background: "var(--card-bg)",
      borderColor: "rgba(255,255,255,0.06)",
    }}>
    {children}
  </div>
);

const Header = ({ title, sub, icon, color }) => (
  <div className="mb-6 flex items-center justify-between">
    <div>
      <h2 className="text-xl font-black text-white">{title}</h2>
      <p className="mt-1 text-xs text-slate-500">{sub}</p>
    </div>
    <div
      className="flex h-11 w-11 items-center justify-center rounded-2xl border text-xl"
      style={{
        color,
        background: `${color}16`,
        borderColor: `${color}30`,
      }}>
      {icon}
    </div>
  </div>
);

const MiniCard = ({ title, value, color }) => (
  <div
    className="relative overflow-hidden rounded-[26px] border p-5 shadow-xl transition-all duration-300 hover:-translate-y-1"
    style={{
      background: "var(--card-bg)",
      borderColor: `${color}22`,
    }}>
    <div
      className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl"
      style={{ background: `${color}20` }}
    />
    <p className="relative text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">
      {title}
    </p>
    <p className="relative mt-3 text-xl font-black" style={{ color }}>
      {value}
    </p>
  </div>
);

const EmptyText = ({ text }) => (
  <div
    className="rounded-2xl border p-5 text-center text-sm text-slate-500"
    style={{
      borderColor: "rgba(255,255,255,0.06)",
      background: "rgba(255,255,255,0.02)",
    }}>
    {text}
  </div>
);

export default Dashboard;