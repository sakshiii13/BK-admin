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
      <div className="card-3d p-6 bg-white">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-5">
          <div className="text-left">
            <h2 className="text-2xl font-black text-slate-900">Support Tickets</h2>
            <p className="mt-1.5 text-sm font-bold text-slate-500">
              Manage all platform support issues and log tickets directly from the admin panel.
            </p>
          </div>

          <button
            className="btn-3d btn-primary h-11 px-5"
            onClick={fetchTickets}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh Tickets"}
          </button>
        </div>

        {/* CREATE TICKET 3D SLAB */}
        <form onSubmit={handleCreateTicket} className="mt-6 rounded-[24px] border border-slate-200 border-b-4 border-b-slate-300 bg-slate-50/50 p-6 shadow-sm text-left">
          <div className="mb-4 text-sm font-black text-slate-700 uppercase tracking-wider">Create support ticket</div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                Subject
              </span>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="input-3d h-12 w-full px-4 text-sm font-bold"
                placeholder="Payment Issue"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
                Attach Images
              </span>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="input-3d h-12 w-full px-4 py-2.5 text-sm font-bold"
                accept="image/*"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="mb-2 block text-xs font-black uppercase tracking-wide text-slate-500">
              Description
            </span>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="input-3d w-full px-4 py-3 text-sm font-bold"
              rows={4}
              placeholder="My payment is not reflecting"
            />
          </label>

          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-slate-200/60 pt-4">
            <div className="text-xs text-slate-400 font-bold">
              {images.length > 0 ? `${images.length} file(s) selected` : "Attach images if needed"}
            </div>
            <button
              type="submit"
              disabled={creating}
              className="btn-3d btn-orange h-11 px-6 font-black text-sm"
            >
              {creating ? "Creating..." : "Create Ticket"}
            </button>
          </div>

          {message && (
            <div className="mt-4 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm font-bold text-emerald-700">
              {message}
            </div>
          )}
        </form>

        {error && (
          <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700 text-left">
            {error}
          </div>
        )}

        <div className="mt-8">
          {tickets.length === 0 && (
            <div className="px-3 py-10 text-center text-slate-500 font-bold border border-dashed border-slate-200 rounded-2xl bg-slate-50/30">
              {loading ? "Loading tickets..." : "No support tickets found"}
            </div>
          )}

          <div className="mt-3 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tickets.map((ticket) => (
              <div key={ticket._id} className="card-3d p-5 bg-white text-left flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="text-lg font-black text-slate-900 leading-snug">{ticket.subject}</div>
                      <div className="text-xs font-bold text-slate-400 mt-1">ID: {ticket._id?.slice(-8)}</div>
                    </div>
                    <div>
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-black uppercase border shadow-sm ${
                        ticket.status === 'RESOLVED' 
                          ? 'bg-green-50 text-green-600 border-green-200' 
                          : 'bg-yellow-50 text-yellow-600 border-yellow-200'
                      }`}>
                        {ticket.status || 'PENDING'}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 text-sm font-bold text-slate-600 leading-relaxed">{ticket.description}</div>

                  <div className="mt-4 flex flex-wrap gap-2.5">
                    {Array.isArray(ticket.images) && ticket.images.length > 0 ? (
                      ticket.images.map((src, idx) => (
                        <img key={idx} src={src} alt={`img-${idx}`} className="h-20 w-20 img-3d object-cover" />
                      ))
                    ) : (
                      <div className="text-xs text-slate-400 font-bold italic">No attachments</div>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-slate-100 pt-4">
                  {ticket.status !== 'RESOLVED' && (
                    <button
                      className="btn-3d btn-primary h-9 px-4 text-xs flex items-center gap-1.5"
                      onClick={() => handleChangeStatus(ticket._id, 'RESOLVED')}
                      disabled={updatingId === ticket._id}
                    >
                      <FaPaperPlane />
                      <span>{updatingId === ticket._id ? 'Updating...' : 'Resolve'}</span>
                    </button>
                  )}

                  {ticket.status !== 'PENDING' && (
                    <button
                      className="btn-3d btn-white h-9 px-4 text-xs"
                      onClick={() => handleChangeStatus(ticket._id, 'PENDING')}
                      disabled={updatingId === ticket._id}
                    >
                      <span>Set Pending</span>
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