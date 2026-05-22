import React from "react";
import { FaShieldAlt, FaEdit, FaPlus } from "react-icons/fa";

const AdminRoles = () => {
  const roles = [
    {
      id: 1,
      name: "Super Admin",
      usersCount: 2,
      permissions: "All Access",
      color: "orange",
    },
    {
      id: 2,
      name: "Store Manager",
      usersCount: 15,
      permissions: "Products, Orders, Inventory",
      color: "lime",
    },
    {
      id: 3,
      name: "Support Staff",
      usersCount: 8,
      permissions: "Users, Support Tickets",
      color: "blue",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Admin Roles</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage permissions and access levels
          </p>
        </div>
        <button className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 hover:from-orange-600 hover:to-orange-500 text-white px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-orange-500/20 font-medium">
          <FaPlus /> Create Role
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <div
            key={role.id}
            className="glass rounded-3xl p-6 border border-white/10 shadow-xl hover:-translate-y-1 transition-transform duration-300 relative overflow-hidden group"
          >
            <div
              className={`absolute -right-10 -top-10 w-32 h-32 bg-${role.color}-500/10 rounded-full blur-2xl group-hover:bg-${role.color}-500/20 transition-all`}
            ></div>

            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-2xl bg-${role.color}-500/20 text-${role.color}-400 flex items-center justify-center text-xl border border-${role.color}-500/30`}
              >
                <FaShieldAlt />
              </div>
              <button className="text-gray-400 hover:text-white bg-[var(--card-bg)] p-2 rounded-xl border border-[var(--border-soft)]">
                <FaEdit />
              </button>
            </div>

            <h2 className="text-xl font-bold text-white mb-1">{role.name}</h2>
            <p className="text-sm text-gray-400 mb-6">
              Total {role.usersCount} users
            </p>

            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Permissions
              </p>
              <div className="flex flex-wrap gap-2">
                {role.permissions.split(", ").map((perm, idx) => (
                  <span
                    key={idx}
                    className="bg-white/5 border border-white/10 text-gray-300 px-3 py-1 rounded-full text-xs"
                  >
                    {perm}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10">
              <button
                className={`w-full py-2.5 rounded-xl text-sm font-medium text-${role.color}-400 bg-${role.color}-500/10 hover:bg-${role.color}-500/20 border border-${role.color}-500/20 transition-colors`}
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminRoles;
