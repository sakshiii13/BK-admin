import React, { useEffect, useState } from "react";
import TableComponent from "../../../components/global/TableComponent";
import StatusBadge from "../../../components/global/StatusBadge";
import { getAllUsersApi } from "../../../api/admin.api";

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // =========================
  // FETCH USERS
  // =========================
  const fetchUsers = async () => {
    try {
      setLoading(true);

      const res = await getAllUsersApi();

      if (res?.success) {
        const mapped = (res?.data || []).map((user) => ({
          id: user?._id,

          name: (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-[var(--primary-orange)]/10 flex items-center justify-center font-bold text-[var(--primary-orange)]">
                {user?.firstName?.charAt(0) || "U"}
              </div>

              <div>
                <p className="font-semibold text-[var(--text-primary)]">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-[var(--text-secondary)]">
                  {user?.role}
                </p>
              </div>
            </div>
          ),

          email: (
            <span className="text-[var(--text-secondary)]">
              {user?.email}
            </span>
          ),

          phone: (
            <span className="text-[var(--text-secondary)]">
              {user?.number || "N/A"}
            </span>
          ),

          role: (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600">
              {user?.role}
            </span>
          ),

          status: user?.disable
            ? "Inactive"
            : user?.isVerified
            ? "Active"
            : "Pending",

          joinedAt: (
            <span className="text-[var(--text-secondary)]">
              {new Date(user?.createdAt).toLocaleDateString(
                "en-IN",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                }
              )}
            </span>
          ),
        }));

        setUsers(mapped);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // =========================
  // COLUMNS
  // =========================
  const columns = [
    { key: "name", label: "User" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (value) => <StatusBadge status={value} />,
    },
    { key: "joinedAt", label: "Joined" },
  ];

  return (
    <div className="p-6 min-h-screen bg-[var(--app-bg)]">
      {/* HEADER */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">
          All Users
        </h1>

        <p className="text-sm text-[var(--text-secondary)] mt-1">
          Manage customers, drivers and admins
        </p>
      </div>

      {/* CARD WRAPPER */}
      <div className="card-3d p-4">
        <TableComponent
          title=""
          columns={columns}
          data={users}
          searchPlaceholder="Search users..."
          loading={loading}
        />
      </div>
    </div>
  );
};

export default AllUsers;