// src/pages/admin/RankHistory.jsx

import React from "react";
import TableComponent from "../../components/global/TableComponent";
import StatusBadge from "../../components/global/StatusBadge";

const RankHistory = () => {
  const columns = [
    {
      key: "userName",
      label: "User Name",
    },

    {
      key: "email",
      label: "Email",
    },

    {
      key: "rank",
      label: "Rank",
    },

    {
      key: "business",
      label: "Business Achieved",
    },

    {
      key: "reward",
      label: "Reward",
    },

    {
      key: "achievedDate",
      label: "Achieved Date",
    },

    {
      key: "status",
      label: "Status",

      render: (value) => <StatusBadge status={value} />,
    },

    {
      key: "action",
      label: "Action",

      render: () => (
        <button
          className="
            rounded-full
            border border-orange-500/30
            bg-orange-500/15
            px-4 py-2
            text-xs font-bold text-orange-400
            transition hover:bg-orange-500/25
          "
        >
          View Details
        </button>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      userName: "Rahul Sharma",
      email: "rahul@gmail.com",
      rank: "Silver",
      business: "₹1,00,000",
      reward: "₹5,000",
      achievedDate: "16 May 2026",
      status: "Approved",
    },

    {
      id: 2,
      userName: "Priya Verma",
      email: "priya@gmail.com",
      rank: "Gold",
      business: "₹5,00,000",
      reward: "₹25,000",
      achievedDate: "14 May 2026",
      status: "Approved",
    },

    {
      id: 3,
      userName: "Amit Singh",
      email: "amit@gmail.com",
      rank: "Platinum",
      business: "₹10,00,000",
      reward: "₹50,000",
      achievedDate: "12 May 2026",
      status: "Pending",
    },

    {
      id: 4,
      userName: "Neha Patel",
      email: "neha@gmail.com",
      rank: "Diamond",
      business: "₹25,00,000",
      reward: "iPhone 16 Pro",
      achievedDate: "10 May 2026",
      status: "Approved",
    },

    {
      id: 5,
      userName: "Vikas Gupta",
      email: "vikas@gmail.com",
      rank: "Crown Ambassador",
      business: "₹50,00,000",
      reward: "Car Bonus",
      achievedDate: "08 May 2026",
      status: "Approved",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-3 md:px-5 py-4 md:py-6">
      <TableComponent
        title="All Rank History"
        columns={columns}
        data={data}
        searchPlaceholder="Search user, rank, reward..."
      />
    </div>
  );
};

export default RankHistory;
