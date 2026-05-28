  import React, { useEffect, useMemo, useState } from "react";
  import {
    FaPlus,
    FaEdit,
    FaEye,
    FaMapMarkerAlt,
    FaPhoneAlt,
    FaEnvelope,
    FaClock,
    FaTimes,
  } from "react-icons/fa";

  import { useNavigate } from "react-router-dom";
  import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
  import L from "leaflet";
  import { useDispatch } from "react-redux";
  import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
  import { showSuccess, showError } from "../../../utils/alertService";

  import {
    createStoreApi,
    getAllStoresApi,
    updateStoreApi,
  } from "../../../api/admin.api";

  import "leaflet/dist/leaflet.css";

  delete L.Icon.Default.prototype._getIconUrl;

  L.Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });

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
    images: [],
    existingImages: [],
  };

  const Stores = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [stores, setStores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showPopup, setShowPopup] = useState(false);
    const [isEdit, setIsEdit] = useState(false);
    const [selectedStoreId, setSelectedStoreId] = useState(null);
    const [formData, setFormData] = useState(emptyForm);

    const fetchStores = async () => {
      try {
        setLoading(true);
        dispatch(showLoader());

        const res = await getAllStoresApi();

        if (res?.success) {
          setStores(res?.data || []);
        } else {
          showError(res?.message || "Stores not found");
        }
      } catch (error) {
        console.log("Fetch stores error:", error);
        showError("Something went wrong while fetching stores");
      } finally {
        setLoading(false);
        dispatch(hideLoader());
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
        images: [],
        existingImages: Array.isArray(store?.images) ? store.images : [],
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
      const { name, value, files } = e.target;

      if (name === "images") {
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...Array.from(files || [])],
        }));
        return;
      }

      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleRemoveNewImage = (indexToRemove) => {
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, index) => index !== indexToRemove),
      }));
    };

    const handleRemoveExistingImage = (indexToRemove) => {
      setFormData((prev) => ({
        ...prev,
        existingImages: prev.existingImages.filter(
          (_, index) => index !== indexToRemove
        ),
      }));
    };

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (!formData.lat || !formData.lng) {
        showError("Please select store location from map");
        return;
      }

      const payload = new FormData();

      payload.append("name", formData.name);
      payload.append("address", formData.address);
      payload.append("description", formData.description);
      payload.append("phoneNumber", formData.phoneNumber);
      payload.append("email", formData.email);
      payload.append("openingTime", formData.openingTime);
      payload.append("closingTime", formData.closingTime);
      payload.append("lat", Number(formData.lat));
      payload.append("lng", Number(formData.lng));
      payload.append("deliveryRadius", Number(formData.deliveryRadius));

      if (isEdit) {
        payload.append(
          "existingImages",
          JSON.stringify(formData.existingImages)
        );
      }

      formData.images.forEach((image) => {
        payload.append("images", image);
      });

      try {
        setLoading(true);
        dispatch(showLoader());

        const res = isEdit
          ? await updateStoreApi(selectedStoreId, payload)
          : await createStoreApi(payload);

        if (res?.success) {
          dispatch(hideLoader());
          await showSuccess(
            isEdit
              ? "Store updated successfully"
              : "Store created successfully"
          );

          closePopup();
          fetchStores();
        } else {
          dispatch(hideLoader());
          showError(res?.message || "Something went wrong");
        }
      } catch (error) {
        console.log("Submit store error:", error);
        dispatch(hideLoader());
        showError("Something went wrong while saving store");
      } finally {
        setLoading(false);
      }
    };

    return (
      <div className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-white/[0.01] via-transparent to-transparent p-5 rounded-3xl border border-white/[0.03]">
          <div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Stores</h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Manage physical grocery stores and delivery coverages
            </p>
          </div>

          <button
            onClick={openAddPopup}
            className="flex items-center gap-2 h-11 bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)] text-white px-5 rounded-xl transition-all shadow-md shadow-orange-500/20 font-bold text-xs shrink-0 cursor-pointer hover:scale-[1.01]"
          >
            <FaPlus /> Add Store
          </button>
        </div>

        {/* CARDS GRID */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {loading ? (
            <div className="col-span-full glass-premium rounded-3xl p-10 text-center text-xs text-slate-500 font-medium border border-white/[0.03]">
              Loading stores...
            </div>
          ) : stores.length === 0 ? (
            <div className="col-span-full glass-premium rounded-3xl p-10 text-center text-xs text-slate-500 font-medium border border-white/[0.03]">
              No physical stores configured yet.
            </div>
          ) : (
            stores.map((store) => (
              <div
                key={store?._id}
                className="overflow-hidden rounded-3xl border border-white/[0.02] bg-[#080e0a] shadow-xl glass-premium glass-premium-hover flex flex-col h-full"
              >
                <div className="h-44 overflow-hidden bg-black/40 border-b border-white/[0.03]">
                  <img
                    src={store?.images?.[0] || "/logo.png"}
                    alt={store?.name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                </div>

                <div className="p-5 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h2 className="text-base font-bold text-white tracking-wide">{store?.name}</h2>

                        <p className="mt-1.5 flex gap-2 text-xs text-slate-400 font-medium leading-relaxed">
                          <FaMapMarkerAlt className="mt-0.5 text-[var(--primary-orange)] shrink-0" />
                          {store?.address}
                        </p>
                      </div>

                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0 uppercase tracking-wider ${
                          store?.isActive
                            ? "bg-[rgba(57,181,74,0.06)] border-[rgba(57,181,74,0.15)] text-[var(--primary-green-light)]"
                            : "bg-red-500/5 border-red-500/15 text-red-400"
                        }`}
                      >
                        {store?.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>

                    <p className="mt-3 text-xs text-slate-500 font-medium leading-relaxed line-clamp-2">
                      {store?.description}
                    </p>

                    <div className="mt-4 space-y-2 text-xs text-slate-400 font-medium border-t border-white/[0.02] pt-4">
                      <p className="flex items-center gap-2">
                        <FaPhoneAlt className="text-[var(--primary-orange-light)] text-xs" />
                        {store?.phoneNumber}
                      </p>

                      <p className="flex items-center gap-2">
                        <FaEnvelope className="text-[var(--primary-orange-light)] text-xs" />
                        <span className="truncate">{store?.email}</span>
                      </p>

                      <p className="flex items-center gap-2">
                        <FaClock className="text-[var(--primary-orange-light)] text-xs" />
                        {store?.openingTime} - {store?.closingTime}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                      <div className="rounded-xl bg-white/[0.01] border border-white/5 p-2">
                        <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Radius</p>
                        <p className="mt-0.5 text-xs font-black text-white">
                          {store?.deliveryRadius} KM
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.01] border border-white/5 p-2">
                        <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Lat</p>
                        <p className="mt-0.5 text-xs font-black text-white truncate">
                          {Number(store?.lat || store?.location?.coordinates?.[1] || 0).toFixed(4)}
                        </p>
                      </div>

                      <div className="rounded-xl bg-white/[0.01] border border-white/5 p-2">
                        <p className="text-[9px] font-bold uppercase text-slate-500 tracking-wider">Lng</p>
                        <p className="mt-0.5 text-xs font-black text-white truncate">
                          {Number(store?.lng || store?.location?.coordinates?.[0] || 0).toFixed(4)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 pt-2">
                      <button
                        onClick={() => navigate(`/stores/${store?._id}`)}
                        className="flex items-center justify-center gap-2 h-10 rounded-xl bg-white/[0.02] border border-white/5 text-xs font-bold text-slate-300 hover:bg-white/[0.04] transition-all cursor-pointer"
                      >
                        <FaEye />
                        Details
                      </button>

                      <button
                        onClick={() => openEditPopup(store)}
                        className="flex items-center justify-center gap-2 h-10 rounded-xl border border-[var(--primary-orange)]/20 bg-[var(--primary-orange)]/10 text-xs font-bold text-[var(--primary-orange-light)] hover:bg-[var(--primary-orange)] hover:text-white transition-all cursor-pointer"
                      >
                        <FaEdit />
                        Update
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL */}
        {showPopup && (
          <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/80 px-4 backdrop-blur-md">
            <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/5 bg-[#080e0a] p-6 shadow-2xl relative glass-premium scrollbar-thin">
              <div className="absolute top-[-30px] right-[-30px] w-32 h-32 bg-[var(--primary-orange)]/5 rounded-full blur-3xl" />
              
              <div className="mb-6 flex items-center justify-between border-b border-white/[0.03] pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-wide">
                    {isEdit ? "Update Store Properties" : "Create Grocery Outlet"}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500 font-medium">
                    {isEdit ? "Modify configuration parameters and geometry" : "Register a brand new retail store location"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closePopup}
                  className="rounded-lg bg-white/5 p-2.5 text-slate-400 hover:text-white border border-white/5 cursor-pointer"
                >
                  <FaTimes size={12} />
                </button>
              </div>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                <Input
                  label="Store Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Phone Number"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Opening Time"
                  name="openingTime"
                  value={formData.openingTime}
                  onChange={handleChange}
                  required
                />

                <Input
                  label="Closing Time"
                  name="closingTime"
                  value={formData.closingTime}
                  onChange={handleChange}
                  required
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Pick Store Location Coordinates
                  </label>

                  <MapPicker
                    formData={formData}
                    setFormData={setFormData}
                  />
                </div>

                <Input
                  label="Latitude"
                  name="lat"
                  value={formData.lat}
                  readOnly
                />

                <Input
                  label="Longitude"
                  name="lng"
                  value={formData.lng}
                  readOnly
                />

                <Input
                  label="Delivery Radius (KM)"
                  name="deliveryRadius"
                  value={formData.deliveryRadius}
                  onChange={handleChange}
                  required
                />

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Store Photo Uploads
                  </label>

                  <input
                    type="file"
                    name="images"
                    multiple
                    accept="image/*"
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-2.5 text-xs text-slate-400 outline-none focus:border-[var(--primary-orange)]/40 transition-all file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-[var(--primary-orange)]/10 file:text-[var(--primary-orange-light)] file:cursor-pointer"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Outlet Description
                  </label>

                  <textarea
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/5 bg-black/40 px-4 py-3 text-xs text-white outline-none focus:border-[var(--primary-orange)]/45 focus:bg-black/60 transition-all resize-none"
                    required
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 border-t border-white/[0.03] pt-4">
                  <button
                    type="button"
                    onClick={closePopup}
                    className="rounded-xl border border-white/5 bg-white/[0.02] px-5 h-11 text-xs font-bold text-slate-300 hover:bg-white/[0.04] transition-all cursor-pointer"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={loading}
                    className="rounded-xl btn-gradient-orange px-6 h-11 text-xs font-bold text-white disabled:opacity-50 cursor-pointer"
                  >
                    {loading
                      ? "Processing Request..."
                      : isEdit
                      ? "Update Properties"
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

  const LocationMarker = ({ setFormData }) => {
    useMapEvents({
      click(e) {
        const lat = Number(e.latlng.lat.toFixed(6));
        const lng = Number(e.latlng.lng.toFixed(6));

        setFormData((prev) => ({
          ...prev,
          lat,
          lng,
        }));
      },
    });

    return null;
  };

  const MapPicker = ({ formData, setFormData }) => {
    const position = useMemo(
      () => [
        Number(formData?.lat) || 22.7196,
        Number(formData?.lng) || 75.8577,
      ],
      [formData?.lat, formData?.lng]
    );

    return (
      <div className="overflow-hidden rounded-2xl border border-white/5 shadow-lg bg-black/40">
        <MapContainer
          center={position}
          zoom={13}
          scrollWheelZoom
          style={{
            height: "320px",
            width: "100%",
          }}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <LocationMarker setFormData={setFormData} />

          <Marker position={position} />
        </MapContainer>
      </div>
    );
  };

  const Input = ({ label, ...props }) => {
    return (
      <div>
        <label className="mb-2 block text-xs font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </label>

        <input
          {...props}
          className="w-full h-11 rounded-xl border border-white/5 bg-black/40 px-4 text-xs text-white outline-none focus:border-[var(--primary-orange)]/45 focus:bg-black/60 transition-all"
        />
      </div>
    );
  };

  export default Stores;