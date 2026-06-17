import React, { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getAllOrdersByStatusApi,
  getStoreOrdersByStatusApi,
} from "../../../api/admin.api";

const PackedOrders = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [storeId, setStoreId] = useState(
    searchParams.get("storeId") || ""
  );
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const fetchPackedOrders = async (id) => {
    setLoading(true);
    setError("");

    try {
      const res = id
        ? await getStoreOrdersByStatusApi(id, "PACKED")
        : await getAllOrdersByStatusApi("PACKED");

      if (res?.success) {
        setOrders(res.data || []);
      } else {
        setError(res?.message || "Failed to fetch packed orders");
        setOrders([]);
      }
    } catch (fetchError) {
      console.error("Fetch packed orders failed", fetchError);
      setError(fetchError?.message || "Failed to fetch packed orders");
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const queryStoreId = searchParams.get("storeId") || "";
    setStoreId(queryStoreId);
    fetchPackedOrders(queryStoreId);
  }, [searchParams]);

  const filteredOrders = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return orders;

    return orders.filter((order) => {
      const orderNumber = String(order?.orderNumber || "").toLowerCase();
      const customer = `${order?.deliveryAddress?.fullName || ""}`.toLowerCase();
      const status = String(order?.orderStatus || "").toLowerCase();
      return (
        orderNumber.includes(value) ||
        customer.includes(value) ||
        status.includes(value)
      );
    });
  }, [orders, search]);

  const handleLoadOrders = async (event) => {
    event.preventDefault();
    setError("");

    if (storeId) {
      setSearchParams({ storeId });
    } else {
      setSearchParams({});
    }

    await fetchPackedOrders(storeId);
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] p-6">
      <div className="rounded-[32px] border border-[var(--border-soft)] bg-white p-8 shadow-sm max-w-6xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-orange-500">
          Packed Orders
        </p>

        <h1 className="mt-3 text-3xl font-bold text-slate-900">
          {storeId ? "Packed Orders for Store" : "Packed Orders for All Stores"}
        </h1>

        <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-500">
          {storeId
            ? "Packed orders for the selected store."
            : "Showing all packed orders across all stores when no store ID is provided."}
        </p>

        <form onSubmit={handleLoadOrders} className="mt-8 grid gap-4 sm:grid-cols-[1fr_auto] items-end">
          <div>
            <label className="text-sm font-semibold text-slate-700">Store ID</label>
            <input
              value={storeId}
              onChange={(e) => setStoreId(e.target.value)}
              placeholder="Paste store ID or use pack action from Store Orders"
              className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-orange-500 px-6 py-3 text-white font-semibold transition hover:bg-orange-600"
          >
            Load Packed Orders
          </button>
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="mt-8">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-4">
            <div>
              <p className="text-sm text-slate-500">Store ID:</p>
              <p className="font-semibold text-slate-900 break-all">{storeId || "Not set"}</p>
            </div>
            <p className="text-sm text-slate-500">
              Packed orders count: {orders.length}
            </p>
          </div>

          {loading ? (
            <div className="rounded-3xl border border-slate-300 bg-slate-100 p-8 text-center text-slate-500">
              Loading packed orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
              No packed orders found.
            </div>
          ) : (
            <div className="space-y-5">
              {filteredOrders.map((order) => (
                <div key={order._id} className="rounded-[28px] border border-slate-400 bg-white p-5 shadow-sm">
                  <div className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-4">
                    <div>
                      <h2 className="text-xl font-bold text-slate-900">#{order.orderNumber}</h2>
                      <p className="text-sm text-slate-500 mt-1">Packed at {formatDate(order.packedAt)}</p>
                    </div>
                    <div className="inline-flex items-center rounded-2xl bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700">
                      {order.orderStatus || "PACKED"}
                    </div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-3 mb-4">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Customer</p>
                      <p className="mt-2 font-semibold text-slate-900">{order.deliveryAddress?.fullName || "N/A"}</p>
                      <p className="text-sm text-slate-500 mt-1">{order.deliveryAddress?.phoneNumber || "N/A"}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Delivery Address</p>
                      <p className="mt-2 text-sm text-slate-700">
                        {order.deliveryAddress?.houseNumber}, {order.deliveryAddress?.apartment}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                      <p className="text-sm text-slate-500">{order.deliveryAddress?.postalCode}</p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Summary</p>
                      <p className="mt-2 text-sm text-slate-700">Items: {order.totalItems || 0}</p>
                      <p className="text-sm text-slate-700">Total: ₹{order.grandTotal || 0}</p>
                    </div>
                  </div>

                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm font-semibold text-slate-900 mb-3">Ordered items</p>
                    <div className="space-y-3">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-3 rounded-2xl bg-white border border-slate-200 p-3">
                          <div>
                            <p className="font-semibold text-slate-900">{item.productName}</p>
                            <p className="text-sm text-slate-500">{item.weight}{item.unit} × {item.quantity}</p>
                          </div>
                          <p className="font-bold text-slate-900">₹{item.totalPrice || 0}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PackedOrders;