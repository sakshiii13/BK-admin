import React from "react";
import TableComponent from "../../../components/global/TableComponent";
import StatusBadge from "../../../components/global/StatusBadge";

const AllUsers = () => {
  const columns = [
    { key: "name", label: "User Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    { key: "joinedAt", label: "Joined At" },
  ];

  const data = [
    {
      id: 1,
      name: "Rahul Sharma",
      email: "rahul@gmail.com",
      phone: "9876543210",
      role: "Customer",
      status: "Active",
      joinedAt: "16 May 2026",
    },
    {
      id: 2,
      name: "Priya Verma",
      email: "priya@gmail.com",
      phone: "9876500000",
      role: "Customer",
      status: "Inactive",
      joinedAt: "15 May 2026",
    },
  ];

  return (
    <div className="p-5">
      <TableComponent
        title="All Users"
        columns={columns}
        data={data}
        searchPlaceholder="Search users..."
      />
    </div>
  );
};

export default AllUsers;
