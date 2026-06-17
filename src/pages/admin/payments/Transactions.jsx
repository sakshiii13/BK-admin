import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import TableComponent from "../../../components/global/TableComponent";
import { getAllTransactionsApi, getUserTransactionsApi } from "../../../api/admin.api";
import { formatDate, formatCurrency } from "../../../utils/formatters";

const StatusBadge = ({ status }) => {
  const styles = {
    SUCCESS: "bg-emerald-100 text-emerald-700",
    PENDING: "bg-amber-100 text-amber-700",
    FAILED:  "bg-rose-100 text-rose-700",
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-slate-100 text-slate-700"}`}>
      {status || "Unknown"}
    </span>
  );
};

const COLUMNS = [
  { key: "transactionNumber", label: "Txn #",    render: (val) => <span className="font-bold text-slate-900">{val || "-"}</span> },
  { key: "order",             label: "Order #",   render: (val) => val?.orderNumber || "-" },
  { key: "user",              label: "User",      render: (val) => val ? `${val.firstName || ""} ${val.lastName || ""}`.trim() || "-" : "-" },
  { key: "user",              label: "Email",     render: (val) => <span className="text-slate-500 text-xs">{val?.email || "-"}</span> },
  { key: "store",             label: "Store",     render: (val) => val?.name || "-" },
  { key: "amount",            label: "Amount",    render: (val) => <span className="font-semibold">{formatCurrency(val || 0, "INR")}</span> },
  { key: "paymentStatus",     label: "Status",    render: (val) => <StatusBadge status={val} /> },
  { key: "paymentMethod",     label: "Payment",   render: (val) => val || "-" },
  { key: "createdAt",         label: "Date",      render: (val) => val ? formatDate(val) : "-" },
];

const Transactions = () => {
  const [allTransactions, setAllTransactions] = useState([]);
  const [loading, setLoading]                 = useState(false);
  const [error, setError]                     = useState("");

  const location = useLocation();
  const userId   = new URLSearchParams(location.search).get("userId");

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError("");
      try {
        const res = userId
          ? await getUserTransactionsApi(userId)
          : await getAllTransactionsApi();

        if (res?.success) {
          setAllTransactions(res?.data || []);
        } else {
          setAllTransactions([]);
          setError(res?.message || "Unable to load transactions");
        }
      } catch {
        setError("Something went wrong.");
        setAllTransactions([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [userId]);

  const totalAmount = allTransactions.reduce((s, t) => s + (t?.amount || 0), 0);

  return (
    <div className="min-h-screen bg-[var(--app-bg,#f8fafc)] p-4 md:p-6">

      {/* PAGE HEADER */}
      <div className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">Payments</p>
        <h1 className="mt-2 text-3xl font-bold text-slate-900">Transactions</h1>
        <p className="mt-1 text-sm text-slate-500">View all transaction records with user, store, amount and status.</p>
      </div>

      {/* SUMMARY CARDS */}
      <div className="mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SummaryCard label="Total Transactions" value={allTransactions.length}              sub="All records" />
        <SummaryCard label="Total Volume"        value={formatCurrency(totalAmount, "INR")} sub="All records" />
      </div>

      {error && (
        <div className="mb-4 rounded-3xl border border-red-200 bg-red-50 p-5 text-sm text-red-700">{error}</div>
      )}

      {/* TABLE — poora data do, TableComponent khud paginate/search karega */}
      <TableComponent
        title="All Transactions"
        subtitle="View and search all payment records"
        columns={COLUMNS}
        data={allTransactions}
        loading={loading}
        showSearch={true}
        showIndex={true}
        searchPlaceholder="Search txn #, order, user, store, status..."
        onRefresh={() => window.location.reload()}
      />
    </div>
  );
};

const SummaryCard = ({ label, value, sub }) => (
  <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-all">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</p>
    <p className="mt-2 text-2xl font-bold text-slate-900">{value}</p>
    {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
  </div>
);

export default Transactions;