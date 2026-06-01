// src/pages/admin/UsersKyc.jsx

import React from "react";
import TableComponent from "../../../components/global/TableComponent";
import StatusBadge from "../../../components/global/StatusBadge";

const UsersKyc = () => {
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
      key: "documentType",
      label: "Document Type",
    },

    {
      key: "documentNumber",
      label: "Document Number",
    },

    {
      key: "status",
      label: "Status",

      render: (value) => <StatusBadge status={value} />,
    },

    {
      key: "submittedAt",
      label: "Submitted At",
    },

    {
      key: "action",
      label: "Action",

      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            className="
              rounded-full
              bg-green-500/15
              border border-green-500/30
              px-4 py-2
              text-xs font-bold text-green-400
              transition hover:bg-green-500/25
            "
          >
            Approve
          </button>

          <button
            className="
              rounded-full
              bg-red-500/15
              border border-red-500/30
              px-4 py-2
              text-xs font-bold text-red-400
              transition hover:bg-red-500/25
            "
          >
            Reject
          </button>
        </div>
      ),
    },
  ];

  const data = [
    {
      id: 1,
      userName: "Rahul Sharma",
      email: "rahul@gmail.com",
      documentType: "Aadhar Card",
      documentNumber: "XXXX-XXXX-4521",
      status: "Pending",
      submittedAt: "16 May 2026",
    },

    {
      id: 2,
      userName: "Priya Verma",
      email: "priya@gmail.com",
      documentType: "PAN Card",
      documentNumber: "ABCDE1234F",
      status: "Approved",
      submittedAt: "15 May 2026",
    },

    {
      id: 3,
      userName: "Amit Singh",
      email: "amit@gmail.com",
      documentType: "Driving License",
      documentNumber: "MP09-2025-8891",
      status: "Rejected",
      submittedAt: "14 May 2026",
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-3 md:px-5 py-4 md:py-6">
      <TableComponent
        title="Users KYC"
        columns={columns}
        data={data}
        searchPlaceholder="Search users, document type..."
      />
    </div>
  );
};

export default UsersKyc;
