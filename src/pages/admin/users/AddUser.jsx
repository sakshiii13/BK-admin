import React from "react";
import { FaSave, FaArrowLeft } from "react-icons/fa";

const AddUser = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button className="h-10 w-10 rounded-xl bg-[var(--card-bg)] border border-[var(--border-soft)] text-gray-400 flex items-center justify-center hover:text-white hover:border-orange-500/50 transition-all shadow-[var(--shadow-inset)]">
          <FaArrowLeft />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white">Add New User</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Create a new customer or admin account
          </p>
        </div>
      </div>

      <div className="glass rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-lime-500"></div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                First Name
              </label>
              <input
                type="text"
                placeholder="John"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                Last Name
              </label>
              <input
                type="text"
                placeholder="Doe"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="+1 234 567 890"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                Role
              </label>
              <select className="w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all appearance-none">
                <option>Customer</option>
                <option>Premium User</option>
                <option>Admin</option>
                <option>Store Manager</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-300">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full bg-[var(--card-bg)] border border-[var(--border-soft)] rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 transition-all"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <button
              type="button"
              className="px-6 py-3 rounded-xl border border-white/10 text-white hover:bg-white/5 transition-all font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-400 text-white px-8 py-3 rounded-xl transition-all shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:scale-[1.02] font-medium"
            >
              <FaSave /> Create User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;
