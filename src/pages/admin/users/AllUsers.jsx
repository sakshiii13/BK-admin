import React from "react";
import { FaEdit, FaTrash, FaPlus, FaSearch } from "react-icons/fa";

const AllUsers = () => {
  const users = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      role: "Customer",
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      role: "Premium",
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      email: "mike@example.com",
      role: "Customer",
      status: "Inactive",
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white/[0.01] via-transparent to-transparent p-5 rounded-3xl border border-white/[0.03]">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">All Users</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Manage all registered users in the system database
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full sm:w-64 h-11 bg-white/[0.02] border border-white/5 text-white rounded-xl pl-10 pr-4 text-xs outline-none focus:border-[var(--primary-orange)]/50 focus:bg-white/[0.04] transition-all"
            />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 text-xs" />
          </div>
          <button className="flex items-center gap-2 h-11 bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)] hover:from-[var(--primary-orange-dark)] text-white px-4 rounded-xl transition-all shadow-md shadow-orange-500/20 font-bold text-xs shrink-0 cursor-pointer">
            <FaPlus /> Add User
          </button>
        </div>
      </div>

      <div className="glass-premium rounded-3xl overflow-hidden border border-white/[0.03] shadow-2xl bg-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/[0.01] border-b border-white/[0.03]">
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--primary-orange-light)]">
                  Name
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--primary-orange-light)]">
                  Email
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--primary-orange-light)]">
                  Role
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--primary-orange-light)]">
                  Status
                </th>
                <th className="p-5 text-xs font-bold uppercase tracking-wider text-[var(--primary-orange-light)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.02]">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="transition-colors hover:bg-white/[0.01]"
                >
                  <td className="p-5">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--primary-orange)] to-[var(--primary-green-light)] text-white flex items-center justify-center font-black text-sm shadow-md">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-white font-bold text-xs tracking-wide">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-5 text-slate-300 font-medium text-xs">{user.email}</td>
                  <td className="p-5">
                    <span className="bg-white/[0.03] text-slate-400 px-3 py-1 rounded-full text-[10px] font-bold border border-white/5 uppercase tracking-wider">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-5">
                    <span
                      className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-bold border ${
                        user.status === "Active" 
                          ? "bg-[rgba(57,181,74,0.06)] border-[rgba(57,181,74,0.15)] text-[var(--primary-green-light)]" 
                          : "bg-red-500/5 border-red-500/15 text-red-400"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-5">
                    <div className="flex gap-2">
                      <button className="h-8 w-8 rounded-lg bg-blue-500/5 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors border border-blue-500/10 cursor-pointer">
                        <FaEdit size={12} />
                      </button>
                      <button className="h-8 w-8 rounded-lg bg-red-500/5 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors border border-red-500/10 cursor-pointer">
                        <FaTrash size={12} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-white/[0.03] bg-white/[0.01] flex items-center justify-between text-xs text-slate-500 font-medium">
          <p>
            Showing <span className="font-extrabold text-[var(--primary-orange-light)]">3</span> of <span className="font-extrabold text-white">150</span> users
          </p>
          <div className="flex gap-1.5">
            <button className="px-3 py-1.5 rounded-lg bg-white/[0.02] text-slate-500 hover:text-slate-300 hover:bg-white/[0.04] transition-all border border-white/5 cursor-pointer">
              Prev
            </button>
            <button className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)] text-white font-bold shadow-md shadow-orange-500/15 border border-orange-500/10 cursor-pointer">
              1
            </button>
            <button className="px-3.5 py-1.5 rounded-lg bg-white/[0.02] text-slate-300 hover:bg-white/[0.04] transition-all border border-white/5 cursor-pointer">
              2
            </button>
            <button className="px-3 py-1.5 rounded-lg bg-white/[0.02] text-slate-300 hover:bg-white/[0.04] transition-all border border-white/5 cursor-pointer">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
