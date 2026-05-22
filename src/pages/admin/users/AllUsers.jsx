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
    <div className="p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">All Users</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all registered users in the system
          </p>
        </div>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <input
              type="text"
              placeholder="Search users..."
              className="w-full sm:w-64 bg-[var(--card-bg)] border border-[var(--border-soft)] text-white rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500/50"
            />
            <FaSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-orange-500/20 font-medium shrink-0">
            <FaPlus /> Add User
          </button>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--card-bg)]/50 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Name
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Email
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Role
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Status
                </th>
                <th className="p-4 text-sm font-semibold text-[var(--text-secondary)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-white/5 hover:bg-white/5 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold border border-orange-500/30">
                        {user.name.charAt(0)}
                      </div>
                      <span className="text-white font-medium">
                        {user.name}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{user.email}</td>
                  <td className="p-4">
                    <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full text-xs border border-white/10">
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${user.status === "Active" ? "bg-green-500/10 text-green-400 border-green-500/20" : "bg-red-500/10 text-red-400 border-red-500/20"}`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3">
                      <button className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center hover:bg-blue-500/20 transition-colors border border-blue-500/20">
                        <FaEdit />
                      </button>
                      <button className="h-8 w-8 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors border border-red-500/20">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-white/10 bg-[var(--card-bg)]/30 flex items-center justify-between">
          <p className="text-sm text-[var(--text-secondary)]">
            Showing 3 of 150 users
          </p>
          <div className="flex gap-1">
            <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-400 hover:bg-white/10 text-sm disabled:opacity-50 border border-white/10">
              Prev
            </button>
            <button className="px-3 py-1 rounded-lg bg-orange-500 text-white hover:bg-orange-600 text-sm shadow-lg shadow-orange-500/20 border border-orange-500">
              1
            </button>
            <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-sm border border-white/10">
              2
            </button>
            <button className="px-3 py-1 rounded-lg bg-white/5 text-gray-300 hover:bg-white/10 text-sm border border-white/10">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllUsers;
