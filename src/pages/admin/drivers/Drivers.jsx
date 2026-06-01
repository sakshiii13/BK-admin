import React, { useState } from "react";
import { getDriversByStoreApi, registerDriverApi } from "../../../api/admin.api";

const Drivers = () => {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    number: "",
    store: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [driversLoading, setDriversLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [drivers, setDrivers] = useState([]);
  const [driversError, setDriversError] = useState("");

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});
    setDriversError("");

    const payload = {
      firstName: form.firstName?.trim(),
      lastName: form.lastName?.trim(),
      email: form.email?.trim(),
      number: form.number?.trim(),
      store: form.store ? form.store.trim() : "",
      password: form.password,
    };

    const validation = validateForm(payload);
    if (Object.keys(validation).length > 0) {
      setFieldErrors(validation);
      setLoading(false);
      setError(Object.values(validation)[0]);
      return;
    }

    try {
      const res = await registerDriverApi(payload);
      setLoading(false);
      if (res?.success) {
        setSuccess(res.message || "Driver registered successfully");
        setForm({ firstName: "", lastName: "", email: "", number: "", store: "", password: "" });
      } else {
        setError(res?.message || "Registration failed");
      }
    } catch (err) {
      setLoading(false);
      setError(err?.message || "Registration failed");
    }
  };

  const handleFetchDrivers = async () => {
    if (!form.store?.trim()) {
      setDrivers([]);
      setDriversError("Enter a Store ID to fetch drivers");
      return;
    }

    setDriversLoading(true);
    setDriversError("");
    setError("");
    setSuccess("");

    try {
      const res = await getDriversByStoreApi(form.store.trim());
      if (res?.success) {
        setDrivers(res.data || []);
      } else {
        setDrivers([]);
        setDriversError(res?.message || "Failed to fetch drivers");
      }
    } catch (err) {
      setDrivers([]);
      setDriversError(err?.message || "Failed to fetch drivers");
    } finally {
      setDriversLoading(false);
    }
  };

  const validateForm = (values) => {
    const errs = {};
    if (!values.firstName || values.firstName.length < 2) errs.firstName = "First name must be at least 2 characters";
    if (!values.email || !/^\S+@\S+\.\S+$/.test(values.email)) errs.email = "Enter a valid email";
    if (!values.number || !/^\d{10,15}$/.test(values.number)) errs.number = "Enter a valid phone number";
    if (!values.password || values.password.length < 6) errs.password = "Password must be at least 6 characters";
    return errs;
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] p-4 md:p-6">
      <div className="rounded-[32px] border border-[var(--border-soft)] bg-white p-5 md:p-8 shadow-sm max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-3">Register Driver</h1>
        <p className="text-sm text-slate-500 mb-6">
          Use this form to create a new driver. To view drivers for a store, enter the Store ID and click "Load Store Drivers".
        </p>

        {error && <div className="mb-4 rounded p-3 bg-red-50 text-red-700">{error}</div>}
        {success && <div className="mb-4 rounded p-3 bg-emerald-50 text-emerald-700">{success}</div>}

        <form onSubmit={onSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <input name="firstName" value={form.firstName} onChange={onChange} required placeholder="First name" className="flex-1 rounded border px-3 py-2" />
            <input name="lastName" value={form.lastName} onChange={onChange} placeholder="Last name" className="flex-1 rounded border px-3 py-2" />
          </div>

          <div>
            <input name="email" value={form.email} onChange={onChange} required placeholder="Email" type="email" className="w-full rounded border px-3 py-2" />
            {fieldErrors.email && <div className="text-sm text-red-600 mt-1">{fieldErrors.email}</div>}
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input name="number" value={form.number} onChange={onChange} required placeholder="Phone number" className="w-full rounded border px-3 py-2" />
              {fieldErrors.number && <div className="text-sm text-red-600 mt-1">{fieldErrors.number}</div>}
            </div>
            <div className="flex-1">
              <input name="store" value={form.store} onChange={onChange} placeholder="Store ID" className="w-full rounded border px-3 py-2" />
              <p className="text-xs text-slate-500 mt-2">Store ID is optional for registration, but required for lookup.</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 items-center">
            <button
              type="button"
              onClick={handleFetchDrivers}
              disabled={driversLoading}
              className="rounded bg-slate-800 px-5 py-2.5 text-white font-semibold hover:bg-slate-900 transition disabled:opacity-60"
            >
              {driversLoading ? "Loading drivers..." : "Load Store Drivers"}
            </button>
            {driversError && <p className="text-sm text-red-600">{driversError}</p>}
          </div>

          <div>
            <input name="password" value={form.password} onChange={onChange} required placeholder="Password" type="password" className="w-full rounded border px-3 py-2" />
            {fieldErrors.password && <div className="text-sm text-red-600 mt-1">{fieldErrors.password}</div>}
          </div>

          <div className="mt-4">
            <button disabled={loading} type="submit" className="rounded bg-orange-500 px-6 py-2.5 text-white font-semibold hover:bg-orange-600 transition disabled:opacity-60">
              {loading ? "Registering..." : "Register Driver"}
            </button>
          </div>
        </form>

        {drivers.length > 0 ? (
          <div className="mt-8 rounded-[32px] border border-[var(--border-soft)] bg-white p-5 md:p-8 shadow-sm">
            <h2 className="text-xl font-bold mb-4">Drivers for store {form.store}</h2>
            <div className="grid gap-4">
              {drivers.map((driver) => (
                <div key={driver._id} className="rounded-2xl border border-slate-200 p-4 bg-slate-50">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="font-semibold text-slate-900">{driver.firstName} {driver.lastName}</p>
                      <p className="text-sm text-slate-600">{driver.email}</p>
                      <p className="text-sm text-slate-600">{driver.number}</p>
                    </div>
                    <div className="text-sm text-slate-500">
                      <span className="block">Verified: {driver.isVerified ? "Yes" : "No"}</span>
                      <span className="block">Disabled: {driver.disable ? "Yes" : "No"}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : form.store.trim() ? (
          <div className="mt-8 rounded-[32px] border border-[var(--border-soft)] bg-white p-5 md:p-8 shadow-sm text-slate-500">
            No drivers found for store ID <strong>{form.store}</strong>.
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Drivers;