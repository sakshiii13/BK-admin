import React, { useEffect, useState } from "react";
import Axios from "../../../api/Axios";
import TableComponent from "../../../components/global/TableComponent";
import { showSuccess, showError } from "../../../utils/alertService";
import {
  getReferralSettingApi,
  updateReferralSettingApi,
  creditWalletApi,
} from "../../../api/admin.api";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [referralSettings, setReferralSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [rewardAmount, setRewardAmount] = useState("");
  const [isActive, setIsActive] = useState(false);
  const [editingSettings, setEditingSettings] = useState(false);

  // ── Reward Modal State ──
  const [rewardModal, setRewardModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [creditReason, setCreditReason] = useState("");
  const [crediting, setCrediting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/admin/get-all-users");
      if (res?.data?.success) setUsers(res?.data?.data || []);
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchReferralSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await getReferralSettingApi();
      if (res?.success) {
        setReferralSettings(res?.data);
        setRewardAmount(res?.data?.rewardAmount || "");
        setIsActive(res?.data?.isActive || false);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setSettingsLoading(false);
    }
  };

  const updateReferralSettings = async () => {
    try {
      setSettingsLoading(true);
      const res = await updateReferralSettingApi({
        rewardAmount: parseInt(rewardAmount),
        isActive,
      });
      if (res?.success) {
        setReferralSettings(res?.data);
        setEditingSettings(false);
        showSuccess("Referral settings updated successfully!");
      }
    } catch (err) {
      showError(err?.response?.data?.message || "Failed to update referral settings");
    } finally {
      setSettingsLoading(false);
    }
  };

  const openRewardModal = (user) => {
    setSelectedUser(user);
    setCreditAmount("");
    setCreditReason("");
    setRewardModal(true);
  };

  const closeRewardModal = () => {
    setRewardModal(false);
    setSelectedUser(null);
    setCreditAmount("");
    setCreditReason("");
  };

  const handleCreditWallet = async () => {
    if (!creditAmount || isNaN(creditAmount) || Number(creditAmount) <= 0)
      return showError("Please enter a valid amount");
    if (!creditReason.trim())
      return showError("Please enter a reason");

    try {
      setCrediting(true);
      const res = await creditWalletApi({
        userId: selectedUser._id,
        amount: Number(creditAmount),
        reason: creditReason.trim(),
      });
      if (res?.success) {
        showSuccess(`₹${creditAmount} credited to ${selectedUser.firstName}'s wallet!`);
        closeRewardModal();
      } else {
        showError(res?.message || "Failed to credit wallet");
      }
    } catch (err) {
      showError("Something went wrong");
    } finally {
      setCrediting(false);
    }
  };

  const COLUMNS = [
    {
      key: "firstName",
      label: "User",
      render: (val, row) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl btn-gradient-orange text-white flex items-center justify-center font-black text-sm shrink-0">
            {val?.charAt(0)}
          </div>
          <div>
            <p className="font-extrabold text-slate-800 text-sm">{val} {row.lastName}</p>
            <p className="text-xs font-bold text-slate-400">ID: {row._id?.slice(-8)}</p>
          </div>
        </div>
      ),
    },
    {
      key: "email",
      label: "Contact",
      render: (val, row) => (
        <div>
          <p className="text-sm font-extrabold text-slate-700">{val}</p>
          <p className="text-xs font-bold text-slate-400 mt-0.5">{row.number || "-"}</p>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (val) => (
        <span className="px-3 py-1 text-xs font-black uppercase rounded-full border border-blue-200 bg-blue-50 text-blue-600">
          {val}
        </span>
      ),
    },
    {
      key: "disable",
      label: "Status",
      render: (val) => (
        <span className={`px-3 py-1 text-xs font-black uppercase rounded-full border ${val ? "bg-red-50 text-red-500 border-red-200" : "bg-green-50 text-green-600 border-green-200"}`}>
          {val ? "Disabled" : "Active"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Joined",
      render: (val) => (
        <span className="text-xs font-bold text-slate-500">
          {new Date(val).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}
        </span>
      ),
    },
    {
      key: "_id",
      label: "Actions",
      render: (val, row) => (
        <button
          onClick={() => openRewardModal(row)}
          className="px-3 py-1.5 text-xs font-black text-white bg-purple-600 hover:bg-purple-700 rounded-lg transition-all cursor-pointer"
        >
          🎁 Reward
        </button>
      ),
    },
  ];

  useEffect(() => {
    fetchUsers();
    fetchReferralSettings();
  }, []);

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={users.length} color="var(--primary-green)" />
        <StatCard label="Active Users" value={users.filter(u => !u.disable).length} color="#16a34a" />
        <StatCard label="Drivers" value={users.filter(u => u.role === "DRIVER").length} color="#f97316" />
      </div>

      {/* REFERRAL SETTINGS */}
      <div className="p-5 bg-white rounded-2xl border-l-4 shadow-sm" style={{ borderLeftColor: "#8b5cf6" }}>
        <div className="flex justify-between items-start">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Referral Settings</p>
            {!editingSettings && referralSettings && (
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-slate-700">Reward Amount:</span>
                  <span className="text-2xl font-black text-purple-600">₹{referralSettings?.rewardAmount}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-extrabold text-slate-700">Status:</span>
                  <span className={`px-3 py-1 text-xs font-black uppercase rounded-full border ${referralSettings?.isActive ? "bg-green-50 text-green-600 border-green-200" : "bg-red-50 text-red-500 border-red-200"}`}>
                    {referralSettings?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            )}
            {editingSettings && (
              <div className="mt-3 space-y-3">
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-2">Reward Amount (₹)</label>
                  <input
                    type="number"
                    value={rewardAmount}
                    onChange={(e) => setRewardAmount(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isActive}
                      onChange={(e) => setIsActive(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-xs font-bold text-slate-700">Enable Referral Rewards</span>
                  </label>
                </div>
              </div>
            )}
          </div>
          <div className="flex gap-2">
            {!editingSettings && (
              <button onClick={() => setEditingSettings(true)} className="px-3 py-2 text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100">
                Edit
              </button>
            )}
            {editingSettings && (
              <>
                <button onClick={updateReferralSettings} disabled={settingsLoading} className="px-3 py-2 text-xs font-bold text-white bg-purple-600 rounded-lg hover:bg-purple-700">
                  {settingsLoading ? "Saving..." : "Save"}
                </button>
                <button onClick={() => setEditingSettings(false)} className="px-3 py-2 text-xs font-bold text-slate-700 bg-slate-100 border border-slate-300 rounded-lg">
                  Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <TableComponent
        title="All Users"
        subtitle="Manage platform customers and delivery staff"
        columns={COLUMNS}
        data={users}
        loading={loading}
        showSearch={true}
        showIndex={true}
        searchPlaceholder="Search name, email, role..."
        onRefresh={fetchUsers}
      />

      {/* REWARD MODAL */}
      {rewardModal && (
        <div className="fixed inset-0 z-[999] bg-slate-900/40 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-7">

            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">
                  🎁 Credit <span className="text-purple-600">Wallet</span>
                </h2>
                <p className="text-xs font-bold text-slate-400 mt-0.5">
                  {selectedUser?.firstName} {selectedUser?.lastName}
                </p>
              </div>
              <button
                onClick={closeRewardModal}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-all cursor-pointer font-black text-lg"
              >
                ✕
              </button>
            </div>

            {/* Amount */}
            <div className="mb-4">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-2">
                Amount (₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-black text-sm">₹</span>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="mb-6">
              <label className="text-xs font-black uppercase text-slate-500 tracking-wider block mb-2">
                Reason
              </label>
              <textarea
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
                placeholder="e.g. Festival bonus, Compensation, Manual reward..."
                rows={3}
                className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm font-medium text-slate-800 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100 transition-all resize-none placeholder:text-slate-400"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeRewardModal}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-2xl text-sm transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreditWallet}
                disabled={crediting}
                className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white font-black rounded-2xl text-sm transition-all cursor-pointer disabled:opacity-50 shadow-lg shadow-purple-200"
              >
                {crediting ? "Crediting..." : "Send Reward"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ label, value, color }) => (
  <div className="p-5 bg-white rounded-2xl border-l-4 shadow-sm" style={{ borderLeftColor: color }}>
    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</p>
    <h2 className="text-3xl font-black mt-1" style={{ color }}>{value}</h2>
  </div>
);

export default AllUsers;