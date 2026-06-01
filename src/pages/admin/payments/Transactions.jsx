import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import PageLoader from "../../../components/global/PageLoader";
import {
  getAllTransactionsApi,
  getUserTransactionsApi,
} from "../../../api/admin.api";
import { formatDate, formatCurrency } from "../../../utils/formatters";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [hasMore, setHasMore] = useState(false);

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get("userId");

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      setError("");

      const response = userId
        ? await getUserTransactionsApi(userId, page, limit)
        : await getAllTransactionsApi(page, limit);

      setLoading(false);

      if (response?.success) {
        const pageData = response?.data || [];
        setTransactions(pageData);
        setHasMore(pageData.length === limit);
      } else {
        setTransactions([]);
        setHasMore(false);
        setError(response?.message || "Unable to load transactions");
      }
    };

    fetchTransactions();
  }, [page, limit, userId]);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return transactions;

    return transactions.filter((transaction) => {
      const values = [
        transaction?.transactionNumber,
        transaction?.order?.orderNumber,
        transaction?.user?.firstName,
        transaction?.user?.lastName,
        transaction?.user?.email,
        transaction?.store?.name,
        transaction?.store?.address,
        transaction?.paymentMethod,
        transaction?.paymentStatus,
      ];

      return values.some((value) =>
        value?.toString().toLowerCase().includes(query)
      );
    });
  }, [search, transactions]);

  const currentPageTransactions = filteredTransactions;

  const totalAmount = transactions.reduce(
    (sum, item) => sum + (item?.amount || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[var(--app-bg)] p-4 md:p-6">
      <div className="rounded-[32px] border border-[var(--border-soft)] bg-white p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
              Payments
            </p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">
              Transactions
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
              View all admin transaction records with user, store, amount and status.
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 shadow-sm">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                Total Transactions
              </p>
              <p className="mt-2 text-2xl font-semibold text-slate-900">
                {transactions.length}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Total volume: {formatCurrency(totalAmount, "INR")}
              </p>
            </div>

            <div className="w-full sm:w-[360px]">
              <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
                Search transactions
              </label>
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search txn #, order #, user, store, status"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
              />
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="text-sm text-slate-500">
            Showing {currentPageTransactions.length} records on page {page}
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2 rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm shadow-sm">
              <span className="text-slate-500">Page size</span>
              <select
                value={limit}
                onChange={(e) => {
                  setLimit(Number(e.target.value));
                  setPage(1);
                }}
                className="rounded-2xl border border-slate-200 bg-white px-3 py-2 text-slate-900 outline-none"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={page === 1 || loading}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Previous
              </button>

              <span className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600">
                Page {page}
              </span>

              <button
                type="button"
                onClick={() => setPage((prev) => prev + 1)}
                disabled={!hasMore || loading}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:bg-slate-100 disabled:text-slate-400"
              >
                Next
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="min-h-[260px] flex items-center justify-center">
            <PageLoader />
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
            {error}
          </div>
        ) : filteredTransactions.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-sm text-slate-600">
            No transactions found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-100 text-slate-700">
                <tr>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">Txn #</th>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">Order</th>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">User</th>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">Store</th>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">Amount</th>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">Status</th>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">Payment</th>
                  <th className="px-4 py-4 font-medium uppercase tracking-[0.12em]">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {currentPageTransactions.map((transaction) => (
                  <tr key={transaction?._id} className="hover:bg-slate-50">
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-900">
                      {transaction?.transactionNumber || "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {transaction?.order?.orderNumber || "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {transaction?.user?.firstName} {transaction?.user?.lastName}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {transaction?.store?.name || "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-900">
                      {formatCurrency(transaction?.amount || 0, "INR")}
                    </td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        transaction?.paymentStatus === "SUCCESS"
                          ? "bg-emerald-100 text-emerald-700"
                          : transaction?.paymentStatus === "PENDING"
                          ? "bg-amber-100 text-amber-700"
                          : transaction?.paymentStatus === "FAILED"
                          ? "bg-rose-100 text-rose-700"
                          : "bg-slate-100 text-slate-700"
                      }`}>
                        {transaction?.paymentStatus || "Unknown"}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {transaction?.paymentMethod || "-"}
                    </td>
                    <td className="px-4 py-4 text-slate-600">
                      {transaction?.createdAt ? formatDate(transaction.createdAt) : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;
