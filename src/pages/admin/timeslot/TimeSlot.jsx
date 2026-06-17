import React, { useEffect, useState } from "react";
import {
  createTimeSlot,
  getAllTimeSlots,
  updateSlotApi,
  deleteSlotApi,
} from "../../../api/admin.api";
import TableComponent from "../../../components/global/TableComponent";
import { showSuccess, showError, showConfirm } from "../../../utils/alertService";

const initialForm = {
  slotName: "",
  startTime: "",
  endTime: "",
  maxOrders: "",
  isActive: true,
};

const TimeSlots = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formData, setFormData] = useState(initialForm);
  const [editingSlot, setEditingSlot] = useState(null);

  const fetchSlots = async () => {
    try {
      setLoading(true);
      const res = await getAllTimeSlots();

      if (res?.success) {
        setSlots(res?.data || []);
      }
    } catch (error) {
      console.log(error);
      showError("Failed to fetch time slots");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSlots();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const resetForm = () => {
    setFormData(initialForm);
    setEditingSlot(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSubmitLoading(true);

      let res;

      if (editingSlot) {
        res = await updateSlotApi(editingSlot._id, formData);
      } else {
        res = await createTimeSlot(formData);
      }

      if (res?.success) {
        showSuccess(
          editingSlot
            ? "Time slot updated successfully!"
            : "Time slot created successfully!"
        );
        resetForm();
        fetchSlots();
      }
    } catch (error) {
      console.log(error);
      showError(error?.response?.data?.message || "Failed to save time slot");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setFormData({
      slotName: slot.slotName || "",
      startTime: slot.startTime || "",
      endTime: slot.endTime || "",
      maxOrders: slot.maxOrders || "",
      isActive: slot.isActive,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (slotId, slotName) => {
    const result = await showConfirm({
      title: "Delete Time Slot?",
      text: `Are you sure you want to delete "${slotName}"? This action cannot be undone.`,
      confirmButtonText: "Delete Slot",
    });

    if (result.isConfirmed) {
      try {
        const res = await deleteSlotApi(slotId);
        if (res?.success) {
          showSuccess("Time slot deleted successfully!");
          fetchSlots();
        }
      } catch (error) {
        console.log(error);
        showError(error?.response?.data?.message || "Failed to delete slot");
      }
    }
  };

  // =========================
  // TABLE DATA MAPPING
  // =========================
  const tableData = slots.map((slot) => ({
    id: slot._id,
    slotName: (
      <div className="flex items-center gap-3">
        {/* <div className="w-10 h-10 rounded-lg bg-[var(--primary-orange)]/10 flex items-center justify-center font-bold text-[var(--primary-orange)]">
          {slot.slotName?.charAt(0) || "S"}
        </div> */}
        <span className="font-semibold text-[var(--text-primary)]">
          {slot.slotName}
        </span>
      </div>
    ),
    startTime: (
      <span className="text-sm font-medium text-[var(--text-secondary)]">
        {slot.startTime}
      </span>
    ),
    endTime: (
      <span className="text-sm font-medium text-[var(--text-secondary)]">
        {slot.endTime}
      </span>
    ),
    maxOrders: (
      <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 font-bold text-blue-600">
        {slot.maxOrders}
      </span>
    ),
    status: slot.isActive ? "Active" : "Inactive",
    createdAt: new Date(slot.createdAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }),
    actions: (
      <div className="flex gap-2 justify-center">
        <button
          onClick={() => handleEdit(slot)}
          className="btn-3d btn-blue px-4 py-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleDelete(slot._id, slot.slotName)}
          className="btn-3d btn-red px-4 py-2"
        >
          Delete
        </button>
      </div>
    ),
  }));

  // =========================
  // TABLE COLUMNS
  // =========================
  const columns = [
    { key: "slotName", label: "Slot Name" },
    { key: "startTime", label: "Start Time" },
    { key: "endTime", label: "End Time" },
    { key: "maxOrders", label: "Max Orders" },
    {
      key: "status",
      label: "Status",
      render: (value) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold ${
            value === "Active"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {value}
        </span>
      ),
    },
    { key: "createdAt", label: "Created" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 min-h-screen bg-[var(--app-bg)]">
      {/* =========================
          FORM CARD
      ========================== */}
      <div className="card-3d p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
              Time Slot Management
            </h1>
            <p className="text-[var(--text-secondary)] text-sm mt-1">
              Create, update and manage delivery slots
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-xl bg-[var(--primary-green)]/10 text-[var(--primary-green)] font-bold text-sm border border-[var(--primary-green)]/20">
            Total Slots: {slots.length}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3"
        >
          <input
            type="text"
            name="slotName"
            value={formData.slotName}
            onChange={handleChange}
            placeholder="Slot Name"
            className="input-3d px-4 py-3"
            required
          />

          <input
            type="text"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            placeholder="10:00 AM"
            className="input-3d px-4 py-3"
            required
          />

          <input
            type="text"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            placeholder="12:00 PM"
            className="input-3d px-4 py-3"
            required
          />

          <input
            type="number"
            name="maxOrders"
            value={formData.maxOrders}
            onChange={handleChange}
            placeholder="Max Orders"
            className="input-3d px-4 py-3"
            required
          />

          <label className="input-3d flex items-center gap-3 px-4 py-3 cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="w-5 h-5 rounded"
            />
            <span className="font-semibold text-[var(--text-primary)]">
              Active
            </span>
          </label>

          <div className="lg:col-span-5 flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              disabled={submitLoading}
              className="btn-3d btn-primary px-6 py-3"
            >
              {submitLoading
                ? "Processing..."
                : editingSlot
                ? "Update Slot"
                : "Create Slot"}
            </button>

            {editingSlot && (
              <button
                type="button"
                onClick={resetForm}
                className="btn-3d btn-white px-6 py-3"
              >
                Cancel Edit
              </button>
            )}
          </div>
        </form>
      </div>

      {/* =========================
          TABLE CARD
      ========================== */}
      <div className="">
        <TableComponent
          title="All Time Slots"
          subtitle="Manage your delivery slots and schedules"
          columns={columns}
          data={tableData}
          searchPlaceholder="Search slot name, time..."
          loading={loading}
          showSearch={true}
          showIndex={true}
          onRefresh={fetchSlots}
        />
      </div>
    </div>
  );
};

export default TimeSlots;