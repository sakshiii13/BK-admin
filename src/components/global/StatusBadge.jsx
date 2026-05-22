import React from "react";

const StatusBadge = ({ status }) => {
  const value = String(status || "").toLowerCase();

  const styles = {
    active: "bg-green-500/15 text-green-400 border-green-500/30",
    approved: "bg-green-500/15 text-green-400 border-green-500/30",
    completed: "bg-green-500/15 text-green-400 border-green-500/30",
    pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
    rejected: "bg-red-500/15 text-red-400 border-red-500/30",
    inactive: "bg-red-500/15 text-red-400 border-red-500/30",
  };

  return (
    <span
      className={`inline-flex rounded-full border px-3 py-1 text-xs font-bold capitalize ${
        styles[value] || "bg-slate-500/15 text-slate-300 border-slate-500/30"
      }`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;