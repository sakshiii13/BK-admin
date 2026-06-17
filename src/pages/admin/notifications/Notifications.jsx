// src/pages/admin/notifications/Notifications.jsx

import React, { useState, useEffect, useRef } from "react";
import { FaBell, FaUsers, FaUser, FaPaperPlane, FaSearch, FaChevronDown, FaTimes } from "react-icons/fa";
import {
  sendNotificationToAllApi,
  sendNotificationToUserApi,
  getAllUsersApi,
} from "../../../api/admin.api";
import { showSuccess, showError } from "../../../utils/alertService";

const NOTIFICATION_TYPES = ["GENERAL", "OFFER", "ORDER", "ALERT"];

// ===================== USER SEARCH DROPDOWN =====================
const UserSearchDropdown = ({ selectedUser, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const wrapperRef = useRef(null);

  // outside click se close
  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // dropdown open hone pe users fetch karo
  useEffect(() => {
    if (isOpen && users.length === 0) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await getAllUsersApi(1, 50); // pehle 50 users le aao
      if (res?.success) {
        setUsers(res?.data || []);
      }
    } catch (error) {
      console.log("Fetch users error:", error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const filteredUsers = users.filter((u) => {
    const fullName = `${u?.firstName || ""} ${u?.lastName || ""}`.toLowerCase();
    const email = (u?.email || "").toLowerCase();
    const number = (u?.number || "").toLowerCase();
    const query = search.toLowerCase().trim();
    return fullName.includes(query) || email.includes(query) || number.includes(query);
  });

  const handleSelect = (user) => {
    onSelect(user);
    setIsOpen(false);
    setSearch("");
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onSelect(null);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      {/* TRIGGER */}
      <div
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] cursor-pointer flex items-center justify-between gap-2 hover:bg-white hover:border-[#ff7e00] transition-all"
      >
        {selectedUser ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-8 h-8 rounded-full bg-[#ff7e00]/10 text-[#ff7e00] flex items-center justify-center font-black text-xs shrink-0">
              {(selectedUser?.firstName?.[0] || "U").toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm truncate">
                {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p className="text-xs text-slate-400 truncate">{selectedUser?.email || selectedUser?.number}</p>
            </div>
          </div>
        ) : (
          <span className="text-slate-400 font-semibold text-sm">Select a user</span>
        )}

        <div className="flex items-center gap-2 shrink-0">
          {selectedUser && (
            <button
              type="button"
              onClick={handleClear}
              className="text-slate-400 hover:text-red-500 transition-colors"
            >
              <FaTimes size={13} />
            </button>
          )}
          <FaChevronDown
            size={12}
            className={`text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </div>
      </div>

      {/* DROPDOWN PANEL */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-slate-200 rounded-2xl shadow-[0_15px_30px_rgba(15,23,42,0.12)] overflow-hidden">
          {/* SEARCH BAR */}
          <div className="p-3 border-b border-slate-100">
            <div className="relative">
              <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
              <input
                autoFocus
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name, email or phone..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none focus:border-[#ff7e00] focus:ring-2 focus:ring-[#ff7e00]/10 transition-all"
              />
            </div>
          </div>

          {/* LIST */}
          <div className="max-h-72 overflow-y-auto">
            {loadingUsers ? (
              <div className="p-6 text-center text-sm text-slate-400 font-semibold">
                Loading users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="p-6 text-center text-sm text-slate-400 font-semibold">
                No users found
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  onClick={() => handleSelect(user)}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                >
                  <div className="w-9 h-9 rounded-full bg-[#ff7e00]/10 text-[#ff7e00] flex items-center justify-center font-black text-xs shrink-0">
                    {(user?.firstName?.[0] || "U").toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-[#0f172a] truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {user?.email || "No email"} {user?.number ? `• ${user.number}` : ""}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full font-bold ${
                      user?.role === "DRIVER"
                        ? "bg-blue-100 text-blue-600"
                        : "bg-green-100 text-green-600"
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ===================== MAIN PAGE =====================
const Notifications = () => {
  const [activeTab, setActiveTab] = useState("all"); // "all" | "user"
  const [sending, setSending] = useState(false);

  // ----- ALL USERS FORM -----
  const [allForm, setAllForm] = useState({
    title: "",
    body: "",
    type: "GENERAL",
  });

  // ----- SPECIFIC USER FORM -----
  const [selectedUser, setSelectedUser] = useState(null);
  const [userForm, setUserForm] = useState({
    title: "",
    body: "",
    type: "GENERAL",
    screen: "",
  });

  const handleAllChange = (e) => {
    const { name, value } = e.target;
    setAllForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleUserChange = (e) => {
    const { name, value } = e.target;
    setUserForm((prev) => ({ ...prev, [name]: value }));
  };

  const resetAllForm = () =>
    setAllForm({ title: "", body: "", type: "GENERAL" });

  const resetUserForm = () => {
    setSelectedUser(null);
    setUserForm({ title: "", body: "", type: "GENERAL", screen: "" });
  };

  // ----- SEND TO ALL -----
  const handleSendToAll = async (e) => {
    e.preventDefault();

    if (!allForm.title?.trim() || !allForm.body?.trim()) {
      showError("Title and body are required");
      return;
    }

    try {
      setSending(true);

      const payload = {
        title: allForm.title.trim(),
        body: allForm.body.trim(),
        type: allForm.type,
      };

      const res = await sendNotificationToAllApi(payload);

      if (res?.success) {
        showSuccess(res?.message || "Notification sent to all users!");
        resetAllForm();
      } else {
        showError(res?.message || "Failed to send notification");
      }
    } catch (error) {
      console.log("Send to all error:", error);
      showError("Something went wrong while sending notification");
    } finally {
      setSending(false);
    }
  };

  // ----- SEND TO SPECIFIC USER -----
  const handleSendToUser = async (e) => {
    e.preventDefault();

    if (!selectedUser?._id) {
      showError("Please select a user");
      return;
    }
    if (!userForm.title?.trim() || !userForm.body?.trim()) {
      showError("Title and body are required");
      return;
    }

    try {
      setSending(true);

      const payload = {
        userId: selectedUser._id,
        title: userForm.title.trim(),
        body: userForm.body.trim(),
        type: userForm.type,
        data: userForm.screen?.trim()
          ? { screen: userForm.screen.trim() }
          : {},
      };

      const res = await sendNotificationToUserApi(selectedUser._id, payload);

      if (res?.success) {
        showSuccess(res?.message || "Notification sent to user!");
        resetUserForm();
      } else {
        showError(res?.message || "Failed to send notification");
      }
    } catch (error) {
      console.log("Send to user error:", error);
      showError("Something went wrong while sending notification");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[var(--app-bg)]">
      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] flex items-center gap-3">
          <FaBell className="text-[var(--primary-orange)]" />
          Notifications
        </h1>
        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Send push notifications to all users or a specific user
        </p>
      </div>

      {/* TABS */}
      <div className="flex gap-2 mb-6 bg-slate-100 p-1.5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab("all")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "all"
              ? "bg-white text-[#0f172a] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FaUsers /> Send to All
        </button>
        <button
          onClick={() => setActiveTab("user")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all ${
            activeTab === "user"
              ? "bg-white text-[#0f172a] shadow-sm"
              : "text-slate-500 hover:text-slate-700"
          }`}
        >
          <FaUser /> Send to Specific User
        </button>
      </div>

      {/* CARD */}
      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-200 max-w-2xl p-8">
        {activeTab === "all" ? (
          <form onSubmit={handleSendToAll} className="space-y-5">
            <div>
              <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={allForm.title}
                onChange={handleAllChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                placeholder="e.g. Big Sale"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                Body
              </label>
              <textarea
                name="body"
                value={allForm.body}
                onChange={handleAllChange}
                rows="3"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400 resize-none"
                placeholder="e.g. 50% OFF on all products"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                Type
              </label>
              <select
                name="type"
                value={allForm.type}
                onChange={handleAllChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold"
              >
                {NOTIFICATION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3.5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-2xl font-black shadow-lg shadow-[#ff7e00]/25 hover:shadow-xl transition-all cursor-pointer active:scale-95 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaPaperPlane size={13} />
              {sending ? "Sending..." : "Send to All Users"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleSendToUser} className="space-y-5">
            <div>
              <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                Select User
              </label>
              <UserSearchDropdown
                selectedUser={selectedUser}
                onSelect={setSelectedUser}
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={userForm.title}
                onChange={handleUserChange}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                placeholder="e.g. Hello from admin"
                required
              />
            </div>

            <div>
              <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                Body
              </label>
              <textarea
                name="body"
                value={userForm.body}
                onChange={handleUserChange}
                rows="3"
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400 resize-none"
                placeholder="e.g. This is a test notification"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={userForm.type}
                  onChange={handleUserChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold"
                >
                  {NOTIFICATION_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div>
                <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                  Screen <span className="text-slate-400 normal-case font-semibold">(optional)</span>
                </label>
                <input
                  type="text"
                  name="screen"
                  value={userForm.screen}
                  onChange={handleUserChange}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                  placeholder="e.g. home"
                />
              </div> */}
            </div>

            <button
              type="submit"
              disabled={sending}
              className="w-full px-6 py-3.5 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-2xl font-black shadow-lg shadow-[#ff7e00]/25 hover:shadow-xl transition-all cursor-pointer active:scale-95 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <FaPaperPlane size={13} />
              {sending ? "Sending..." : "Send to User"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Notifications;