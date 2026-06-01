import React, { useEffect, useMemo, useState } from "react";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import Axios from "../../../api/Axios";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  // ================= API =================
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await Axios.get("/admin/get-all-users");

      if (res?.data?.success) {
        setUsers(res?.data?.data || []);
      }
    } catch (err) {
      console.log(err);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ================= FILTER =================
  const filtered = useMemo(() => {
    if (!search) return users;
    return users.filter((u) =>
      `${u.firstName} ${u.lastName} ${u.email} ${u.number} ${u.role}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, users]);

  return (
    <div className="p-4 md:p-6 space-y-6">

      {/* ================= HEADER ================= */}
      <div className="card-3d p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">

        {/* TITLE */}
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-slate-800 tracking-tight">
            All Users
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage your platform users in one place
          </p>
        </div>

        {/* SEARCH + REFRESH */}
        <div className="flex gap-3 w-full lg:w-auto">

          <div className="relative w-full lg:w-80">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xs" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search users..."
              className="input-3d h-11 w-full pl-11 text-sm"
            />
          </div>

          <button
  onClick={fetchUsers}
  disabled={loading}
  className="group relative h-11 px-5 flex items-center gap-2 rounded-xl 
             bg-white border border-slate-200 
             shadow-[0_6px_18px_rgba(0,0,0,0.06)] 
             hover:shadow-[0_10px_25px_rgba(247,148,29,0.25)] 
             transition-all duration-300 active:scale-95"
>

  {/* ICON WRAPPER */}
  <span className="relative flex items-center justify-center">
    <FaSyncAlt
      className={`text-sm text-slate-600 group-hover:text-orange-500 transition-all duration-300
        ${loading ? "animate-spin" : ""}`}
    />
  </span>

  {/* TEXT */}
  <span className="text-xs font-bold text-slate-700 group-hover:text-orange-500 transition-all">
    {loading ? "Refreshing..." : "Refresh"}
  </span>

  {/* TOP GLOW LINE */}
  <span className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-orange-400 via-orange-500 to-orange-300 opacity-0 group-hover:opacity-100 transition-all rounded-t-xl" />

</button>

        </div>
      </div>

      {/* ================= STATS BAR ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

        <div className="card-3d p-5">
          <p className="text-xs text-slate-500">Total Users</p>
          <h2 className="text-2xl font-extrabold text-slate-800 mt-1">
            {users.length}
          </h2>
        </div>

        <div className="card-3d p-5">
          <p className="text-xs text-slate-500">Active Users</p>
          <h2 className="text-2xl font-extrabold text-green-600 mt-1">
            {users.filter(u => !u.disable).length}
          </h2>
        </div>

        <div className="card-3d p-5">
          <p className="text-xs text-slate-500">Drivers</p>
          <h2 className="text-2xl font-extrabold text-orange-500 mt-1">
            {users.filter(u => u.role === "DRIVER").length}
          </h2>
        </div>

      </div>

      {/* ================= TABLE ================= */}
      <div className="card-3d overflow-hidden">

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">

            {/* HEADER */}
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">User</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Contact</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Role</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="p-5 text-xs font-bold text-slate-500 uppercase">Joined</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100">

              {loading ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-10 text-center text-slate-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <tr
                    key={u._id}
                    className="hover:bg-white transition-all duration-200 hover:shadow-sm"
                  >

                    {/* USER */}
                    <td className="p-5">
                      <div className="flex items-center gap-3">

                        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold shadow-md">
                          {u.firstName?.charAt(0)}
                        </div>

                        <div>
                          <p className="font-bold text-slate-800 text-sm">
                            {u.firstName} {u.lastName}
                          </p>
                          <p className="text-xs text-slate-400">
                            ID: {u._id?.slice(-6)}
                          </p>
                        </div>

                      </div>
                    </td>

                    {/* CONTACT */}
                    <td className="p-5">
                      <p className="text-sm text-slate-700">{u.email}</p>
                      <p className="text-xs text-slate-400">{u.number || "-"}</p>
                    </td>

                    {/* ROLE */}
                    <td className="p-5">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-semibold">
                        {u.role}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="p-5">
                      <span
                        className={`px-3 py-1 text-xs rounded-full font-semibold ${
                          u.disable
                            ? "bg-red-50 text-red-500"
                            : "bg-green-50 text-green-600"
                        }`}
                      >
                        {u.disable ? "Disabled" : "Active"}
                      </span>
                    </td>

                    {/* JOINED */}
                    <td className="p-5 text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>

                  </tr>
                ))
              )}

            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};

export default AllUsers;