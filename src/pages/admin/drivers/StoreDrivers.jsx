import React, { useState, useEffect, useMemo } from 'react';
import { getAllStoresApi, getDriversByStoreApi } from '../../../api/admin.api';
import { getStoreOrdersApi } from '../../../api/admin.api';
import { FaStore, FaUser, FaPhone, FaBoxOpen } from 'react-icons/fa';
import { MdDeliveryDining, MdReceipt } from 'react-icons/md';

const StoreDrivers = () => {
  const [stores, setStores] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('drivers'); // 'drivers' | 'orders'

  useEffect(() => {
    const fetchStores = async () => {
      const res = await getAllStoresApi(1, 100);
      if (res?.success) setStores(res.data);
    };
    fetchStores();
  }, []);

  const handleStoreClick = async (store) => {
    setSelectedStore(store);
    setLoading(true);
    setDrivers([]);
    setOrders([]);

    const [driverRes, orderRes] = await Promise.all([
      getDriversByStoreApi(store._id),
      getStoreOrdersApi(store._id),
    ]);

    if (driverRes?.success) setDrivers(driverRes.data || []);
    if (orderRes?.success) setOrders(orderRes.data || []);

    setLoading(false);
  };

  // Orders me se assigned driver wale orders
  const ordersWithDriver = useMemo(() => {
    return orders.filter(o => o.assignedDriver?._id);
  }, [orders]);

  const getStatusColor = (status) => {
    const map = {
      PENDING: 'bg-yellow-100 text-yellow-700',
      CONFIRMED: 'bg-blue-100 text-blue-700',
      PACKED: 'bg-purple-100 text-purple-700',
      OUT_FOR_DELIVERY: 'bg-orange-100 text-orange-700',
      DELIVERED: 'bg-green-100 text-green-700',
    };
    return map[status] || 'bg-slate-100 text-slate-600';
  };

  return (
    <div className="p-6 bg-[var(--app-bg)] min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Store-wise Drivers & Orders</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* LEFT: Stores List */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 h-[calc(100vh-150px)] overflow-y-auto">
          <h2 className="font-bold mb-4 px-2">Select a Store</h2>
          {stores.map((store) => (
            <div
              key={store._id}
              onClick={() => handleStoreClick(store)}
              className={`p-4 mb-2 rounded-2xl cursor-pointer transition ${
                selectedStore?._id === store._id
                  ? 'bg-orange-50 border border-orange-200'
                  : 'hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FaStore className="text-orange-500" />
                <span className="font-semibold">{store.name}</span>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT: Drivers + Orders */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200 h-[calc(100vh-150px)] overflow-y-auto">
          {!selectedStore ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              Please select a store to view details
            </div>
          ) : loading ? (
            <div className="h-full flex items-center justify-center text-slate-400">
              Loading...
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold mb-4">{selectedStore.name}</h2>

              {/* Tabs */}
              <div className="flex gap-2 mb-6">
                <button
                  onClick={() => setActiveTab('drivers')}
                  className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${
                    activeTab === 'drivers'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MdDeliveryDining size={16} /> Drivers ({drivers.length})
                  </span>
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`px-4 py-2 rounded-2xl text-sm font-semibold transition ${
                    activeTab === 'orders'
                      ? 'bg-orange-500 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <MdReceipt size={16} /> Orders ({orders.length})
                  </span>
                </button>
              </div>

              {/* DRIVERS TAB */}
              {activeTab === 'drivers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {drivers.length > 0 ? drivers.map(d => (
                    <div key={d._id} className="p-4 border rounded-2xl flex items-center gap-4 bg-slate-50">
                      <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center">
                        <FaUser className="text-slate-500" />
                      </div>
                      <div>
                        <p className="font-bold">{d.firstName} {d.lastName}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <FaPhone size={10} /> {d.number}
                        </p>
                      </div>
                    </div>
                  )) : (
                    <p className="text-slate-400 col-span-2">No drivers registered for this store.</p>
                  )}
                </div>
              )}

              {/* ORDERS TAB */}
              {activeTab === 'orders' && (
                <div className="space-y-3">
                  {orders.length === 0 ? (
                    <p className="text-slate-400">No orders found for this store.</p>
                  ) : orders.map(order => (
                    <div key={order._id} className="border border-slate-200 rounded-2xl p-4 bg-slate-50">
                      <div className="flex items-center justify-between mb-2">
                        <p className="font-bold text-slate-800">#{order.orderNumber}</p>
                        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                          {order.orderStatus}
                        </span>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        {/* Customer */}
                        <div className="text-sm text-slate-600">
                          <p className="font-semibold">
                            {order.deliveryAddress?.fullName || order.user?.firstName}
                          </p>
                          <p className="text-xs text-slate-400">{order.deliveryAddress?.phoneNumber}</p>
                        </div>

                        {/* Assigned Driver */}
                        <div className="flex items-center gap-2">
                          {order.assignedDriver?._id ? (
                            <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 px-3 py-1.5 rounded-xl">
                              <MdDeliveryDining className="text-orange-500" size={16} />
                              <div>
                                <p className="text-xs font-bold text-slate-700">
                                  {order.assignedDriver.firstName} {order.assignedDriver.lastName}
                                </p>
                                <p className="text-xs text-slate-400">{order.assignedDriver.number}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">No driver assigned</span>
                          )}
                        </div>
                      </div>

                      {/* Items count & total */}
                      <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-200">
                        <p className="text-xs text-slate-500 flex items-center gap-1">
                          <FaBoxOpen size={12} /> {order.totalItems} items
                        </p>
                        <p className="text-xs font-bold text-orange-600">₹{order.grandTotal}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default StoreDrivers;