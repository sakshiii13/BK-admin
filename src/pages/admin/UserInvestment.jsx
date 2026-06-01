// src/pages/admin/UserInvestment.jsx

import React from "react";
import TableComponent from "../../components/global/TableComponent";
import StatusBadge from "../../components/global/StatusBadge";

const UserInvestment = () => {
  const columns = [
    { key: "userName", label: "User Name" },
    { key: "email", label: "Email" },
    { key: "packageName", label: "Package" },
    { key: "amount", label: "Amount" },
    { key: "paymentMode", label: "Payment Mode" },
    { key: "transactionId", label: "Transaction ID" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    { key: "date", label: "Date" },
    {
      key: "action",
      label: "Action",
      render: (_, row) => (
        <div className="flex items-center gap-2">
          {row.status === "Pending" ? (
            <>
              <button className="rounded-full border border-green-500/30 bg-green-500/15 px-4 py-2 text-xs font-bold text-green-400 hover:bg-green-500/25">
                Approve
              </button>

              <button className="rounded-full border border-red-500/30 bg-red-500/15 px-4 py-2 text-xs font-bold text-red-400 hover:bg-red-500/25">
                Reject
              </button>
            </>
          ) : (
            <button className="rounded-full border border-orange-500/30 bg-orange-500/15 px-4 py-2 text-xs font-bold text-orange-400 hover:bg-orange-500/25">
              View
            </button>
          )}
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      userName: "Rahul Sharma",
      email: "rahul@gmail.com",
      packageName: "Starter Plan",
      amount: "₹5,000",
      paymentMode: "UPI",
      transactionId: "TXN-BKG-10021",
      status: "Pending",
      date: "16 May 2026",
    },
    {
      id: 2,
      userName: "Priya Verma",
      email: "priya@gmail.com",
      packageName: "Growth Plan",
      amount: "₹15,000",
      paymentMode: "Bank Transfer",
      transactionId: "TXN-BKG-10020",
      status: "Approved",
      date: "15 May 2026",
    },
    {
      id: 3,
      userName: "Amit Singh",
      email: "amit@gmail.com",
      packageName: "Premium Plan",
      amount: "₹25,000",
      paymentMode: "UPI",
      transactionId: "TXN-BKG-10019",
      status: "Rejected",
      date: "14 May 2026",
    },
    {
      id: 4,
      userName: "Neha Patel",
      email: "neha@gmail.com",
      packageName: "Business Plan",
      amount: "₹50,000",
      paymentMode: "Cash Deposit",
      transactionId: "TXN-BKG-10018",
      status: "Approved",
      date: "13 May 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-3 md:px-5 py-4 md:py-6">
      <TableComponent
        title="Users Investment"
        columns={columns}
        data={data}
        searchPlaceholder="Search investment, user, transaction..."
      />
    </div>
  );
};

export default UserInvestment;
