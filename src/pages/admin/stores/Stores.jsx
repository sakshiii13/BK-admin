import React, { useEffect, useMemo, useState } from "react";
import {
  FaPlus,
  FaEdit,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaTimes,
} from "react-icons/fa";

import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

import {
  createStoreApi,
  getAllStoresApi,
  updateStoreApi,
} from "../../../api/admin.api";

const emptyForm = {
  name: "",
  address: "",
  description: "",
  phoneNumber: "",
  email: "",
  openingTime: "",
  closingTime: "",
  lat: "",
  lng: "",
  deliveryRadius: "",
  isActive: true,
};

const Stores = () => {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await getAllStoresApi();

      if (res?.success) {
        setStores(res?.data || []);
      } else {
        alert(res?.message || "Stores not found");
      }
    } catch (error) {
      console.log("Fetch stores error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const openAddPopup = () => {
    setIsEdit(false);
    setSelectedStoreId(null);
    setFormData(emptyForm);
    setShowPopup(true);
  };

  const openEditPopup = (store) => {
    setIsEdit(true);
    setSelectedStoreId(store?._id);

    setFormData({
      name: store?.name || "",
      address: store?.address || "",
      description: store?.description || "",
      phoneNumber: store?.phoneNumber || "",
      email: store?.email || "",
      openingTime: store?.openingTime || "",
      closingTime: store?.closingTime || "",
      lat: store?.lat || store?.location?.coordinates?.[1] || "",
      lng: store?.lng || store?.location?.coordinates?.[0] || "",
      deliveryRadius: store?.deliveryRadius || "",
      isActive: store?.isActive ?? true,
    });

    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setIsEdit(false);
    setSelectedStoreId(null);
    setFormData(emptyForm);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lat || !formData.lng) {
      alert("Please select store location from map");
      return;
    }

    const payload = {
      ...formData,
      lat: Number(formData.lat),
      lng: Number(formData.lng),
      deliveryRadius: Number(formData.deliveryRadius),
    };

    try {
      setLoading(true);

      const res = isEdit
        ? await updateStoreApi(selectedStoreId, payload)
        : await createStoreApi(payload);

      if (res?.success) {
        alert(isEdit ? "Store updated successfully" : "Store created successfully");
        closePopup();
        fetchStores();
      } else {
        alert(res?.message || "Something went wrong");
      }
    } catch (error) {
      console.log("Submit store error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
            Store Management
          </p>
          <h1 className="mt-2 text-3xl font-bold">Stores</h1>
          <p className="mt-2 text-sm text-slate-400">
            Manage store branches, timings, delivery radius and map location.
          </p>
        </div>

        <button
          onClick={openAddPopup}
          className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-slate-950 transition hover:bg-orange-400"
        >
          <FaPlus /> Add Store
        </button>
      </div>

      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {loading ? (
          <div className="col-span-full rounded-3xl border border-[var(--border-soft)] bg-[var(--card-bg)] p-8 text-center text-slate-300">
            Loading stores...
          </div>
        ) : stores.length === 0 ? (
          <div className="col-span-full rounded-3xl border border-[var(--border-soft)] bg-[var(--card-bg)] p-8 text-center text-slate-300">
            No stores found.
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={store?._id}
              className="overflow-hidden rounded-[28px] border border-[var(--border-soft)] bg-[var(--card-bg)] shadow-xl"
            >
              <div className="h-44 w-full overflow-hidden bg-black/20">
                <img
                  src={store?.images?.[0] || "/logo.png"}
                  alt={store?.name}
                  className="h-full w-full object-cover transition duration-300 hover:scale-105"
                />
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-bold">{store?.name}</h2>
                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-400">
                      <FaMapMarkerAlt className="text-orange-400" />
                      {store?.address}
                    </p>
                  </div>

                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      store?.isActive
                        ? "bg-green-500/15 text-green-400"
                        : "bg-red-500/15 text-red-400"
                    }`}
                  >
                    {store?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-300">
                  {store?.description}
                </p>

                <div className="mt-5 space-y-3 text-sm text-slate-300">
                  <p className="flex items-center gap-2">
                    <FaPhoneAlt className="text-orange-400" />
                    {store?.phoneNumber}
                  </p>

                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-orange-400" />
                    {store?.email}
                  </p>

                  <p className="flex items-center gap-2">
                    <FaClock className="text-orange-400" />
                    {store?.openingTime} - {store?.closingTime}
                  </p>
                </div>

                <div className="mt-5 grid grid-cols-3 gap-3 text-center">
                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Radius</p>
                    <p className="mt-1 font-bold">{store?.deliveryRadius} KM</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Lat</p>
                    <p className="mt-1 font-bold">
                      {store?.lat || store?.location?.coordinates?.[1] || "-"}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-3">
                    <p className="text-xs text-slate-400">Lng</p>
                    <p className="mt-1 font-bold">
                      {store?.lng || store?.location?.coordinates?.[0] || "-"}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => openEditPopup(store)}
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-2xl border border-orange-500/30 bg-orange-500/10 px-4 py-3 font-bold text-orange-400 transition hover:bg-orange-500 hover:text-slate-950"
                >
                  <FaEdit /> Update Store
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-[32px] border border-orange-500/20 bg-[#111827] p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                  {isEdit ? "Update Store" : "Create Store"}
                </p>
                <h2 className="mt-2 text-2xl font-bold">
                  {isEdit ? "Edit Store Details" : "Add New Store"}
                </h2>
              </div>

              <button
                onClick={closePopup}
                type="button"
                className="rounded-full bg-white/10 p-3 text-slate-300 transition hover:bg-red-500 hover:text-white"
              >
                <FaTimes />
              </button>
            </div>

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 md:grid-cols-2"
            >
              <Input
                label="Store Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="DMart Palasia area"
                required
              />

              <Input
                label="Phone Number"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="9999999999"
                required
              />

              <Input
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="store@gmail.com"
                required
              />

              <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Address will auto fill from map"
                required
              />

              <Input
                label="Opening Time"
                name="openingTime"
                value={formData.openingTime}
                onChange={handleChange}
                placeholder="9 AM"
                required
              />

              <Input
                label="Closing Time"
                name="closingTime"
                value={formData.closingTime}
                onChange={handleChange}
                placeholder="11 PM"
                required
              />

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Pick Store Location From Map
                </label>

                <MapPicker formData={formData} setFormData={setFormData} />

                <p className="mt-2 text-xs text-slate-400">
                  Map par click karte hi latitude, longitude aur address
                  automatically fill ho jayega.
                </p>
              </div>

              <Input
                label="Latitude"
                name="lat"
                type="number"
                value={formData.lat}
                readOnly
                placeholder="Auto from map"
              />

              <Input
                label="Longitude"
                name="lng"
                type="number"
                value={formData.lng}
                readOnly
                placeholder="Auto from map"
              />

              <Input
                label="Delivery Radius KM"
                name="deliveryRadius"
                type="number"
                value={formData.deliveryRadius}
                onChange={handleChange}
                placeholder="10"
                required
              />

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-5 w-5 accent-orange-500"
                />
                <span className="font-semibold text-slate-300">
                  Store Active
                </span>
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Description
                </label>
                <textarea
                  name="description"
                  rows="4"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Grocery and daily needs store"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-orange-500"
                  required
                />
              </div>

              <div className="md:col-span-2 flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={closePopup}
                  className="rounded-2xl bg-white/10 px-6 py-3 font-bold text-slate-300 transition hover:bg-white/20"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-orange-500 px-6 py-3 font-bold text-slate-950 transition hover:bg-orange-400 disabled:opacity-60"
                >
                  {loading
                    ? "Please wait..."
                    : isEdit
                    ? "Update Store"
                    : "Create Store"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const MapPicker = ({ formData, setFormData }) => {
  const defaultCenter = useMemo(
    () => ({
      lat: Number(formData?.lat) || 22.7196,
      lng: Number(formData?.lng) || 75.8577,
    }),
    [formData?.lat, formData?.lng]
  );

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAP_KEY,
  });

  const handleMapClick = async (event) => {
    const lat = Number(event.latLng.lat().toFixed(6));
    const lng = Number(event.latLng.lng().toFixed(6));

    setFormData((prev) => ({
      ...prev,
      lat,
      lng,
    }));

    try {
      const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${
          import.meta.env.VITE_GOOGLE_MAP_KEY
        }`
      );

      const data = await res.json();

      setFormData((prev) => ({
        ...prev,
        lat,
        lng,
        address: data?.results?.[0]?.formatted_address || prev.address,
      }));
    } catch (error) {
      console.log("Address fetch error:", error);
    }
  };

  if (!import.meta.env.VITE_GOOGLE_MAP_KEY) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[24px] border border-red-500/30 bg-red-500/10 px-4 text-center text-red-300">
        Google Map API key missing. Add VITE_GOOGLE_MAP_KEY in .env file.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[320px] items-center justify-center rounded-[24px] bg-white/5 text-slate-300">
        Loading map...
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={{
        width: "100%",
        height: "320px",
        borderRadius: "24px",
      }}
      center={defaultCenter}
      zoom={14}
      onClick={handleMapClick}
    >
      <Marker position={defaultCenter} />
    </GoogleMap>
  );
};

const Input = ({ label, ...props }) => {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-300">
        {label}
      </label>
      <input
        {...props}
        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none transition placeholder:text-slate-500 focus:border-orange-500 read-only:cursor-not-allowed read-only:opacity-80"
      />
    </div>
  );
};

export default Stores;