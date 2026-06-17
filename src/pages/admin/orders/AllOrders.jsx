import React, { useEffect, useState } from "react";
import { FaTimes, FaStore, FaRupeeSign, FaBoxOpen } from "react-icons/fa";
import Axios from "../../../api/axiosInstance";
import TableComponent from "../../../components/global/TableComponent";

// ── STATUS CONFIG ──
const ORDER_STATUS = {
  PENDING:    { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200",   dot: "bg-amber-400"   },
  CONFIRMED:  { bg: "bg-blue-50",    text: "text-blue-600",    border: "border-blue-200",    dot: "bg-blue-400"    },
  PROCESSING: { bg: "bg-indigo-50",  text: "text-indigo-600",  border: "border-indigo-200",  dot: "bg-indigo-400"  },
  SHIPPED:    { bg: "bg-purple-50",  text: "text-purple-600",  border: "border-purple-200",  dot: "bg-purple-400"  },
  DELIVERED:  { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200", dot: "bg-emerald-500" },
  CANCELLED:  { bg: "bg-rose-50",    text: "text-rose-600",    border: "border-rose-200",    dot: "bg-rose-400"    },
};

const PAYMENT_STATUS = {
  PAID:    { bg: "bg-emerald-50", text: "text-emerald-600", border: "border-emerald-200" },
  UNPAID:  { bg: "bg-rose-50",    text: "text-rose-500",    border: "border-rose-200"    },
  PENDING: { bg: "bg-amber-50",   text: "text-amber-600",   border: "border-amber-200"   },
};

const StatusBadge = ({ value, map }) => {
  const key = value?.toUpperCase();
  const s   = map[key] || { bg: "bg-slate-50", text: "text-slate-500", border: "border-slate-200", dot: "bg-slate-400" };
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border ${s.bg} ${s.text} ${s.border}`}>
      {s.dot && <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />}
      {value || "—"}
    </span>
  );
};

const getInitials = (first = "", last = "") =>
  `${first.charAt(0)}${last.charAt(0)}`.toUpperCase() || "U";

// ── COLUMNS ──
const buildColumns = (onView) => [
  {
    key: "orderNumber",
    label: "Order #",
    render: (val) => (
      <span className="font-black text-[var(--text-primary)] text-xs font-mono">{val || "—"}</span>
    ),
  },
  {
    key: "user",
    label: "Customer",
    render: (val) => (
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs text-white shrink-0"
          style={{ background: "linear-gradient(135deg, var(--primary-orange), var(--primary-orange-light))", boxShadow: "0 3px 8px rgba(242,122,26,0.3)" }}
        >
          {getInitials(val?.firstName, val?.lastName)}
        </div>
        <div>
          <p className="font-bold text-[var(--text-primary)] text-sm leading-tight">
            {val?.firstName} {val?.lastName}
          </p>
          <p className="text-[10px] text-slate-400 font-semibold">{val?.email || "—"}</p>
        </div>
      </div>
    ),
  },
  {
    key: "store",
    label: "Store",
    render: (val) => (
      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-600">
        <FaStore className="text-orange-400 shrink-0" />
        {val?.name || "—"}
      </div>
    ),
  },
  {
    key: "orderStatus",
    label: "Order Status",
    render: (val) => <StatusBadge value={val} map={ORDER_STATUS} />,
  },
  {
    key: "paymentStatus",
    label: "Payment",
    render: (val) => <StatusBadge value={val} map={PAYMENT_STATUS} />,
  },
  {
    key: "paymentMethod",
    label: "Method",
    render: (val) => (
      <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-black uppercase">
        {val || "COD"}
      </span>
    ),
  },
  {
    key: "grandTotal",
    label: "Amount",
    render: (val) => (
      <span className="flex items-center gap-0.5 font-black text-emerald-600 text-sm">
        <FaRupeeSign size={10} />{val || 0}
      </span>
    ),
  },
  {
    key: "createdAt",
    label: "Date",
    render: (val) => (
      <span className="text-xs font-bold text-slate-500">
        {val ? new Date(val).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : "—"}
      </span>
    ),
  },
  {
    key: "_id",
    label: "Details",
    render: (_, row) => (
      <button
        onClick={() => onView(row)}
        className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider text-white transition-all hover:opacity-90 active:scale-95"
        style={{ background: "linear-gradient(135deg, var(--primary-orange), var(--primary-orange-light))" }}
      >
        View
      </button>
    ),
  },
];

// ── ORDER DETAIL MODAL ──
const OrderModal = ({ order, onClose }) => {
  if (!order) return null;

  const os = ORDER_STATUS[order.orderStatus?.toUpperCase()] || {};
  const ps = PAYMENT_STATUS[order.paymentStatus?.toUpperCase()] || {};

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 flex items-start justify-between border-b border-slate-100"
          style={{ background: "linear-gradient(135deg, #fff7ed, #fff)" }}>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-400 mb-1">Order Details</p>
            <h2 className="text-lg font-black text-[var(--text-primary)] font-mono">{order.orderNumber || "—"}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <StatusBadge value={order.orderStatus} map={ORDER_STATUS} />
              <StatusBadge value={order.paymentStatus} map={PAYMENT_STATUS} />
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-all">
            <FaTimes size={16} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-5">

          {/* Customer */}
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center font-black text-white shrink-0"
              style={{ background: "linear-gradient(135deg, var(--primary-orange), var(--primary-orange-light))", boxShadow: "0 4px 10px rgba(242,122,26,0.3)" }}
            >
              {getInitials(order.user?.firstName, order.user?.lastName)}
            </div>
            <div>
              <p className="font-black text-[var(--text-primary)]">
                {order.user?.firstName} {order.user?.lastName}
              </p>
              <p className="text-xs text-slate-400 font-semibold">{order.user?.email}</p>
              <p className="text-xs text-slate-400 font-semibold">{order.user?.number || "—"}</p>
            </div>
          </div>

          {/* Store + Payment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Store</p>
              <div className="flex items-center gap-1.5 text-sm font-bold text-slate-700">
                <FaStore className="text-orange-400" size={11} />
                {order.store?.name || "—"}
              </div>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
              <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">Payment Method</p>
              <p className="text-sm font-black text-slate-700 uppercase">{order.paymentMethod || "COD"}</p>
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FaBoxOpen className="text-orange-400" size={13} />
              <p className="text-xs font-black uppercase tracking-wider text-slate-500">
                Items Ordered ({order.items?.length || 0})
              </p>
            </div>
            <div className="rounded-2xl border border-slate-100 overflow-hidden">
              {order.items?.length > 0 ? (
                order.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between px-4 py-3 text-sm border-b border-slate-100 last:border-none hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-orange-50 border border-orange-100 flex items-center justify-center text-[10px] font-black text-orange-500">
                        {idx + 1}
                      </div>
                      <span className="font-semibold text-[var(--text-primary)]">
                        {item?.productName || item?.product?.name || "Product"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black text-slate-500">×{item?.quantity || 1}</span>
                      {item?.price && (
                        <span className="text-xs font-black text-emerald-600 flex items-center gap-0.5">
                          <FaRupeeSign size={8} />{item.price * (item.quantity || 1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="px-4 py-5 text-sm text-slate-400 font-semibold text-center">No items found</p>
              )}
            </div>
          </div>

          {/* Grand Total */}
          <div className="flex items-center justify-between px-5 py-4 rounded-2xl border border-emerald-100 bg-emerald-50">
            <p className="text-sm font-black text-emerald-700 uppercase tracking-wider">Grand Total</p>
            <p className="text-xl font-black text-emerald-700 flex items-center gap-1">
              <FaRupeeSign size={13} />{order.grandTotal || 0}
            </p>
          </div>

          {/* Date */}
          <p className="text-xs text-slate-400 font-semibold text-center">
            Placed on{" "}
            {order.createdAt
              ? new Date(order.createdAt).toLocaleString("en-IN", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })
              : "—"}
          </p>
        </div>
      </div>
    </div>
  );
};

// ── MAIN COMPONENT ──
const AllOrders = () => {
  const [orders, setOrders]       = useState([]);
  const [loading, setLoading]     = useState(false);
  const [apiError, setApiError]   = useState("");
  const [selected, setSelected]   = useState(null);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setApiError("");
      const res  = await Axios.get("/admin/all-orders");
      const data = res?.data;
      const arr  = data?.data || data || [];
      setOrders(Array.isArray(arr) ? arr : []);
    } catch (error) {
      setApiError(error?.response?.data?.message || error?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const COLUMNS = buildColumns(setSelected);

  // Stats
  const delivered  = orders.filter(o => o.orderStatus?.toUpperCase() === "DELIVERED").length;
  const pending    = orders.filter(o => o.orderStatus?.toUpperCase() === "PENDING").length;
  const totalRev   = orders.reduce((s, o) => s + (o.grandTotal || 0), 0);

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* STATS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard label="Total Orders"  value={orders.length} accent="var(--primary-orange)" text="text-orange-500" />
        <StatCard label="Delivered"     value={delivered}     accent="#16a34a"               text="text-emerald-600" />
        <StatCard label="Pending"       value={pending}       accent="#f59e0b"               text="text-amber-500" />
        <StatCard label="Revenue"       value={`₹${totalRev.toLocaleString("en-IN")}`} accent="#6366f1" text="text-indigo-600" />
      </div>

      {apiError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm text-rose-600 font-semibold">
          ⚠️ {apiError}
        </div>
      )}

      {/* TABLE */}
      <TableComponent
        title="All Orders"
        subtitle="Track and manage every customer order"
        columns={COLUMNS}
        data={orders}
        loading={loading}
        showSearch={true}
        showIndex={true}
        searchPlaceholder="Search order #, customer, store..."
        onRefresh={fetchOrders}
      />

      {/* MODAL */}
      <OrderModal order={selected} onClose={() => setSelected(null)} />

    </div>
  );
};

const StatCard = ({ label, value, accent, text }) => (
  <div className="p-4 bg-white rounded-2xl border border-slate-200" style={{ borderLeft: `4px solid ${accent}` }}>
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{label}</p>
    <p className={`text-2xl font-black mt-1 ${text}`}>{value}</p>
  </div>
);

export default AllOrders;