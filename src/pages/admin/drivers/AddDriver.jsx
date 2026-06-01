import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDriversByStoreApi, assignDriverApi } from "../../../api/admin.api.js";
import { showSuccess, showError } from "../../../utils/alertService.js";
import { ArrowLeft, Mail, Phone, CheckCircle, XCircle, Truck, User } from "lucide-react";

const AddDriver = () => {
  const { storeId, orderId } = useParams(); // URL params: storeId, orderId
  const navigate = useNavigate();
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  const fetchDrivers = async () => {
    setLoading(true);
    try {
      const res = await getDriversByStoreApi(storeId);
      if (res?.success) {
        setDrivers(res.data || []);
      } else {
        console.error(res.message);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchDrivers();
  }, [storeId]);

  const handleAssignDriver = async (driverId) => {
    if (!orderId) return;
    setAssigningId(driverId);
    try {
      const res = await assignDriverApi(storeId, orderId, driverId);
      if (res?.success) {
        showSuccess(res.message || "Driver assigned successfully!");
        navigate(`/dashboard/orders/${storeId}`);
      } else {
        showError(res?.message || "Failed to assign driver.");
      }
    } catch (err) {
      showError(err?.message || "Failed to assign driver.");
    } finally {
      setAssigningId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[var(--app-bg)] text-[var(--text-primary)]">
      {/* Header Card */}
      <div className="card-3d p-6 mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="btn-3d btn-white p-2.5 h-10 w-10 flex items-center justify-center rounded-xl cursor-pointer"
            title="Go Back"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-extrabold text-slate-800">
              {orderId ? "Assign Driver to Order" : "Store Drivers"}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {orderId ? `Select a driver to deliver order #${orderId}` : `View active drivers for store ID: ${storeId}`}
            </p>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="card-3d p-10 text-center bg-white">
          <p className="text-slate-500 font-medium">Loading drivers...</p>
        </div>
      ) : drivers.length === 0 ? (
        <div className="card-3d p-10 text-center bg-white text-slate-500">
          No drivers registered for this store.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drivers.map((driver) => (
            <div key={driver._id} className="card-3d p-5 bg-white flex flex-col justify-between hover:scale-[1.02] transition-all">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  {driver.profileImage ? (
                    <img
                      src={driver.profileImage}
                      alt={driver.firstName}
                      className="w-16 h-16 rounded-full object-cover border-2 border-slate-100 img-3d"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 border-2 border-slate-100 img-3d">
                      <User size={28} />
                    </div>
                  )}
                  <div>
                    <h2 className="font-bold text-lg text-slate-800">
                      {driver.firstName} {driver.lastName}
                    </h2>
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1 ${
                      driver.isVerified
                        ? "bg-green-50 text-green-700 border border-green-200"
                        : "bg-red-50 text-red-700 border border-red-200"
                    }`}>
                      {driver.isVerified ? (
                        <>
                          <CheckCircle size={12} className="text-green-600" />
                          Verified
                        </>
                      ) : (
                        <>
                          <XCircle size={12} className="text-red-600" />
                          Unverified
                        </>
                      )}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 text-sm text-slate-600 border-t border-slate-100 pt-3">
                  <div className="flex items-center gap-2">
                    <Mail size={16} className="text-slate-400" />
                    <span className="truncate">{driver.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-slate-400" />
                    <span>{driver.number}</span>
                  </div>
                </div>
              </div>

              {orderId && (
                <div className="mt-5 pt-4 border-t border-slate-100">
                  <button
                    onClick={() => handleAssignDriver(driver._id)}
                    disabled={assigningId === driver._id}
                    className="w-full btn-3d btn-gradient-orange py-2.5 text-white font-bold transition-all flex items-center justify-center gap-2"
                  >
                    <Truck size={16} />
                    {assigningId === driver._id ? "Assigning..." : "Assign to Order"}
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AddDriver;