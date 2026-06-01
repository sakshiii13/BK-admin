import React, { useEffect, useState } from "react";
import {
  createSupportTicketApi,
  getAllSupportTicketsApi,
  updateSupportTicketStatusApi,
} from "../../api/admin.api";
import { FaPlus, FaPaperPlane, FaSearch, FaImage } from "react-icons/fa";

const Support = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [creating, setCreating] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showCreate, setShowCreate] = useState(true);
  const [query, setQuery] = useState("");

  const fetchTickets = async () => {
    setError("");
    setLoading(true);

    try {
      const res = await getAllSupportTicketsApi();

      if (res?.success) {
        // backend may return data in res.data or res
        const data = Array.isArray(res.data) ? res.data : res.data?.data || res.data || [];
        setTickets(data);
      } else {
        setTickets([]);
        const errorText = res?.message || "Failed to fetch support tickets.";
        setError(errorText);
        console.error("Failed to fetch support tickets", errorText, res);
      }
    } catch (err) {
      setTickets([]);
      setError("Support ticket fetch failed. Check backend availability.");
      console.error("Support ticket fetch error", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    setImages(Array.from(event.target.files || []));
  };

  const handleCreateTicket = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!subject.trim() || !description.trim()) {
        setMessage("Subject and description are required.");
        return;
      }

      const formData = new FormData();
      formData.append("subject", subject);
      formData.append("description", description);
      images.forEach((file) => formData.append("images", file));

    setCreating(true);
    const res = await createSupportTicketApi(formData);

    if (res?.success) {
      setSubject("");
      setDescription("");
      setImages([]);
      setMessage("Support ticket created successfully.");
      fetchTickets();
    } else {
      const errorText = res?.message || "Failed to create support ticket.";
      setError(errorText);
      console.error("Create support ticket error", res);
    }

    setCreating(false);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  // 3D tilt handlers (pure UI)
  const handleTilt = (e, intensity = 12) => {
    const el = e.currentTarget.querySelector(".tilt-inner") || e.currentTarget;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within element
    const y = e.clientY - rect.top; // y position within element
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const dx = (x - cx) / cx;
    const dy = (y - cy) / cy;

    const rotateY = dx * intensity;
    const rotateX = -dy * intensity;

    el.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02,1.02,1.02)`;
    el.style.transition = "transform 0.05s linear";
  };

  const resetTilt = (e) => {
    const el = e.currentTarget.querySelector(".tilt-inner") || e.currentTarget;
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
    el.style.transition = "transform 200ms ease-out";
  };

  const handleChangeStatus = async (ticketId, newStatus) => {
    try {
      setUpdatingId(ticketId);
      const res = await updateSupportTicketStatusApi(ticketId, newStatus);

      if (res?.success) {
        setTickets((prev) =>
          prev.map((t) => (t._id === ticketId ? { ...t, status: newStatus } : t))
        );
      } else {
        console.error("Failed to update ticket status", res?.message || res);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] p-6">
      <div className="rounded-[20px] border border-[var(--border-soft)] bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Support Tickets</h2>
            <p className="mt-2 text-sm text-slate-500">
              This panel loads all support tickets from the admin API. If no tickets are found, you'll see the status message below.
            </p>
          </div>

          <button
            className="rounded-lg bg-orange-500 px-4 py-2 text-white"
            onClick={fetchTickets}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <form onSubmit={handleCreateTicket} className="mt-6 rounded-2xl border border-[var(--border-soft)] bg-slate-50 p-5">
          <div className="mb-4 text-sm font-semibold text-slate-700">Create support ticket</div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Subject
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-orange-400 focus:outline-none"
                placeholder="Payment Issue"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
                Attach Images
              </span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800"
                accept="image/*"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 shadow-sm focus:border-orange-400 focus:outline-none"
              rows={4}
              placeholder="My payment is not reflecting"
            />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              {images.length > 0 ? `${images.length} file(s) selected` : "Attach images if needed"}
            </div>
            <button
              type="submit"
              disabled={creating}
              className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {creating ? "Creating..." : "Create Ticket"}
            </button>
          </div>

          {message && (
            <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6">
          {tickets.length === 0 && (
            <div className="px-3 py-6 text-center text-slate-500">
              {loading ? "Loading tickets..." : "No support tickets found"}
            </div>
          )}

          <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="rounded-lg border border-[var(--border-soft)] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-lg font-bold text-slate-900">{ticket.subject}</div>
                    <div className="text-xs text-slate-400 mt-1">ID: {ticket._id}</div>
                  </div>
                  <div>
                    <span className="inline-block rounded-full px-3 py-1 text-xs font-medium" style={{ background: ticket.status === 'RESOLVED' ? '#ecfdf5' : '#fff7ed', color: ticket.status === 'RESOLVED' ? '#0f766e' : '#92400e' }}>
                      {ticket.status || 'PENDING'}
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-sm text-slate-600">{ticket.description}</div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {Array.isArray(ticket.images) && ticket.images.length > 0 ? (
                    ticket.images.map((src, idx) => (
                      <img key={idx} src={src} alt={`img-${idx}`} className="h-20 w-20 rounded object-cover border" />
                    ))
                  ) : (
                    <div className="text-xs text-slate-400">No images</div>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-2">
                  {ticket.status !== 'RESOLVED' && (
                    <button
                      className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-3 py-1 text-sm text-white shadow"
                      onClick={() => handleChangeStatus(ticket._id, 'RESOLVED')}
                      disabled={updatingId === ticket._id}
                    >
                      <FaPaperPlane />
                      {updatingId === ticket._id ? 'Updating...' : 'Resolve'}
                    </button>
                  )}

                  {ticket.status !== 'PENDING' && (
                    <button
                      className="rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-700"
                      onClick={() => handleChangeStatus(ticket._id, 'PENDING')}
                      disabled={updatingId === ticket._id}
                    >
                      Set Pending
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;