import React from "react";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--card-bg)] p-6 shadow-xl">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
          Admin Panel
        </p>

        <h1 className="mt-3 text-3xl font-bold text-white">
          Welcome to BK Grocery Dashboard
        </h1>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
          Manage products, categories, brands, stores, inventory and users from
          one clean admin workspace.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;