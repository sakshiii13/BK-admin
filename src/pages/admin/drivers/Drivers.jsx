import React, { useState, useEffect } from "react";
import { getDriversByStoreApi, registerDriverApi, getAllStoresApi } from "../../../api/admin.api";
import { FaUserPlus, FaTruck, FaStore } from "react-icons/fa";

const Drivers = () => {
  const [stores, setStores] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ firstName: "", lastName: "", email: "", number: "", password: "" });

  // 1. Stores Fetch karna
  useEffect(() => {
    const fetchStores = async () => {
      const res = await getAllStoresApi(1, 100);
      if (res?.success) setStores(res.data);
    };
    fetchStores();
  }, []);

  // 2. Store select hote hi Drivers load karna
  useEffect(() => {
    if (selectedStoreId) fetchDrivers(selectedStoreId);
    else setDrivers([]);
  }, [selectedStoreId]);

  const fetchDrivers = async (storeId) => {
    setLoading(true);
    const res = await getDriversByStoreApi(storeId);
    if (res?.success) setDrivers(res.data || []);
    setLoading(false);
  };

  // 3. Driver Register karna
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!selectedStoreId) return alert("Please select a store first!");
    
    const payload = { ...form, store: selectedStoreId };
    const res = await registerDriverApi(payload);
    
    if (res?.success) {
      alert("Driver Registered Successfully!");
      setForm({ firstName: "", lastName: "", email: "", number: "", password: "" });
      fetchDrivers(selectedStoreId); // List refresh
    } else {
      alert(res?.message || "Error registering driver");
    }
  };

  return (
    <div className="p-6 bg-[var(--app-bg)] min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header & Store Selector */}
        <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-3xl border border-slate-200">
          <div>
            <h1 className="text-2xl font-black">Driver Management</h1>
            <p className="text-slate-400 text-sm font-semibold">Manage and register drivers for your stores</p>
          </div>
          <div className="flex items-center gap-3">
            <FaStore className="text-orange-500" />
            <select 
              className="p-3 rounded-xl border border-slate-200 font-bold"
              value={selectedStoreId}
              onChange={(e) => setSelectedStoreId(e.target.value)}
            >
              <option value="">Select a Store</option>
              {stores.map(s => <option key={s._id} value={s._id}>{s.name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Register Form */}
          <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200 h-fit">
            <h2 className="text-lg font-black mb-4 flex items-center gap-2"><FaUserPlus /> Register New</h2>
            <form onSubmit={handleRegister} className="space-y-3">
              <input placeholder="First Name" className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, firstName: e.target.value})} value={form.firstName} required />
              <input placeholder="Last Name" className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, lastName: e.target.value})} value={form.lastName} />
              <input placeholder="Email" type="email" className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, email: e.target.value})} value={form.email} required />
              <input placeholder="Phone" className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, number: e.target.value})} value={form.number} required />
              <input placeholder="Password" type="password" className="w-full p-3 border rounded-xl" onChange={(e) => setForm({...form, password: e.target.value})} value={form.password} required />
              <button className="w-full py-3 bg-gradient-to-r from-orange-600 to-orange-500 text-white rounded-xl font-black">
                Register Driver
              </button>
            </form>
          </div>

          {/* Drivers List */}
          <div className="md:col-span-2">
            {loading ? <p>Loading...</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {drivers.map(d => (
                  <div key={d._id} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500"><FaTruck /></div>
                    <div>
                      <p className="font-black text-slate-800">{d.firstName} {d.lastName}</p>
                      <p className="text-xs text-slate-400 font-bold">{d.number}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Drivers;