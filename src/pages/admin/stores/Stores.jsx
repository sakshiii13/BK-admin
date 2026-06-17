// src/pages/admin/stores/Stores.jsx

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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

import {
  createStoreApi,
  getAllStoresApi,
  updateStoreApi,
} from "../../../api/admin.api";
import { showSuccess, showError } from "../../../utils/alertService";
import PageLoader from "../../../components/global/PageLoader"; // ✅ IMPORT

const Stores = () => {
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedStore, setSelectedStore] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [locationSearch, setLocationSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState([22.7196, 75.8577]);
  const [markerPosition, setMarkerPosition] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phoneNumber: "",
    email: "",
    openingTime: "",
    closingTime: "",
    deliveryRadius: "",
    description: "",
    locationLat: "",
    locationLng: "",
    images: [],
  });

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await getAllStoresApi();
      if (res?.success) {
        setStores(res?.data || []);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // ✅ PAGELOADER — jab tak stores fetch ho rahe hain, poora page loader dikhao
  if (loading) return <PageLoader />;

  // Yeh function add karo (existing functions ke saath):
  const handleLocationSearch = async (query) => {
    setLocationSearch(query);
    setSearchResults([]);

    if (!query || query.length < 3) return;

    try {
      setSearchLoading(true);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1&countrycodes=in&accept-language=en`,
        {
          headers: {
            "User-Agent": "BKGroceryAdminApp/1.0",
          },
        },
      );
      const data = await res.json();
      console.log("Results:", data);
      setSearchResults(data);
    } catch (err) {
      console.log("Search error:", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectLocation = (result) => {
    const lat = parseFloat(result.lat);
    const lng = parseFloat(result.lon);
    setFormData((prev) => ({
      ...prev,
      locationLat: String(lat),
      locationLng: String(lng),
    }));
    setMarkerPosition([lat, lng]);
    setMapCenter([lat, lng]);
    setLocationSearch(result.display_name);
    setSearchResults([]);
  };

  const getShortName = (displayName) => {
    return displayName.split(",").slice(0, 3).join(",");
  };
  const handleOpenModal = (store = null) => {
    setSelectedStore(store);
    setIsCreating(!store);

    let locationLat = "";
    let locationLng = "";
    let initialMarker = null;
    let initialCenter = [22.7196, 75.8577];

    if (store?.location) {
      try {
        const parsed =
          typeof store.location === "string"
            ? JSON.parse(store.location)
            : store.location;
        locationLat = parsed?.lat || "";
        locationLng = parsed?.lng || "";
        if (locationLat && locationLng) {
          initialMarker = [Number(locationLat), Number(locationLng)];
          initialCenter = initialMarker;
        }
      } catch (error) {
        locationLat = "";
        locationLng = "";
      }
    }

    setFormData({
      name: store?.name || "",
      address: store?.address || "",
      phoneNumber: store?.phoneNumber || "",
      email: store?.email || "",
      openingTime: store?.openingTime || "",
      closingTime: store?.closingTime || "",
      deliveryRadius: store?.deliveryRadius || "",
      description: store?.description || "",
      locationLat,
      locationLng,
      images: [],
    });
    setMapCenter(initialCenter);
    setMarkerPosition(initialMarker);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStore(null);
    setIsCreating(false);
    setLocationSearch("");
    setSearchResults([]);
    setFormData({
      name: "",
      address: "",
      phoneNumber: "",
      email: "",
      openingTime: "",
      closingTime: "",

      deliveryRadius: "",
      description: "",
      locationLat: "",
      locationLng: "",
      images: [],
    });
    setMapCenter([22.7196, 75.8577]);
    setMarkerPosition(null);
  };

  const handleFormChange = (e) => {
    const { name, value, files, type } = e.target;
    if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files ? Array.from(files) : [],
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "locationLat" || name === "locationLng") {
      const newLat = name === "locationLat" ? value : formData.locationLat;
      const newLng = name === "locationLng" ? value : formData.locationLng;
      if (newLat && newLng) {
        setMarkerPosition([Number(newLat), Number(newLng)]);
        setMapCenter([Number(newLat), Number(newLng)]);
      }
    }
  };

  delete L.Icon.Default.prototype._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: markerIcon2x,
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
  });

  const LocationMarker = ({ position }) => {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData((prev) => ({
          ...prev,
          locationLat: String(lat),
          locationLng: String(lng),
        }));
        setMarkerPosition([lat, lng]);
        setMapCenter([lat, lng]);
      },
    });

    useEffect(() => {
      if (map && position) {
        map.setView(position, map.getZoom());
      }
    }, [map, position]);

    return position ? <Marker position={position} /> : null;
  };

  const centerMapToMarker = () => {
    if (!mapRef) return;
    const target = markerPosition || mapCenter;
    mapRef.flyTo(target, markerPosition ? mapRef.getZoom() : 13);
  };

  const validateStoreForm = () => {
    if (!formData.name?.trim()) return "Store name is required";
    const latRaw = String(formData.locationLat || "").trim();
    const lngRaw = String(formData.locationLng || "").trim();
    if (!latRaw || !lngRaw)
      return "Store location latitude and longitude are required";
    const lat = parseFloat(latRaw);
    const lng = parseFloat(lngRaw);
    if (!Number.isFinite(lat) || !Number.isFinite(lng))
      return "Enter valid numeric latitude and longitude";
    if (lat < -90 || lat > 90) return "Latitude must be between -90 and 90";
    if (lng < -180 || lng > 180)
      return "Longitude must be between -180 and 180";
    return null;
  };

  const handleCreateStore = async (e) => {
    e.preventDefault();
    const validationError = validateStoreForm();
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setUpdating(true);
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("address", formData.address);
      formDataObj.append("phoneNumber", formData.phoneNumber);
      formDataObj.append("email", formData.email);
      formDataObj.append("openingTime", formData.openingTime);
      formDataObj.append("closingTime", formData.closingTime);
      formDataObj.append("deliveryRadius", formData.deliveryRadius);
      formDataObj.append("description", formData.description);
      formDataObj.append(
        "lat",
        Number(String(formData.locationLat || "").trim()),
      );
      formDataObj.append(
        "lng",
        Number(String(formData.locationLng || "").trim()),
      );
      if (Array.isArray(formData.images) && formData.images.length > 0) {
        formData.images.forEach((file) => formDataObj.append("images", file));
      }

      const res = await createStoreApi(formDataObj);
      if (res?.success) {
        showSuccess(res?.message || "Store created successfully!");
        handleCloseModal();
        fetchStores();
      } else {
        showError(res?.message || "Failed to create store");
      }
    } catch (error) {
      console.log("Create store error:", error);
      showError("Something went wrong while creating store");
    } finally {
      setUpdating(false);
    }
  };

  const handleUpdateStore = async (e) => {
    e.preventDefault();
    if (!selectedStore?._id) return;

    const validationError = validateStoreForm();
    if (validationError) {
      showError(validationError);
      return;
    }

    try {
      setUpdating(true);
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("address", formData.address);
      formDataObj.append("phoneNumber", formData.phoneNumber);
      formDataObj.append("email", formData.email);
      formDataObj.append("openingTime", formData.openingTime);
      formDataObj.append("closingTime", formData.closingTime);
      formDataObj.append("deliveryRadius", formData.deliveryRadius);
      formDataObj.append("description", formData.description);
      formDataObj.append(
        "lat",
        Number(String(formData.locationLat || "").trim()),
      );
      formDataObj.append(
        "lng",
        Number(String(formData.locationLng || "").trim()),
      );
      if (Array.isArray(formData.images) && formData.images.length > 0) {
        formData.images.forEach((file) => formDataObj.append("images", file));
      }

      const res = await updateStoreApi(selectedStore._id, formDataObj);
      if (res?.success) {
        showSuccess(res?.message || "Store updated successfully!");
        handleCloseModal();
        fetchStores();
      } else {
        showError(res?.message || "Failed to update store");
      }
    } catch (error) {
      console.log("Update store error:", error);
      showError("Something went wrong while updating store");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="p-4 md:p-6 min-h-screen bg-[var(--app-bg)]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
            Stores
          </h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Manage all physical stores
          </p>
        </div>
        <button
          className="btn-3d btn-gradient-orange px-5 h-11 flex items-center gap-2 w-full sm:w-auto justify-center"
          onClick={() => handleOpenModal()}
        >
          <FaPlus /> Add Store
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-stretch">
        {stores.length === 0 ? (
          <div className="card-3d p-10 text-center text-[var(--text-secondary)]">
            No stores found
          </div>
        ) : (
          stores.map((store) => (
            <div
              key={store?._id}
              className="card-3d overflow-hidden flex flex-col h-full"
            >
              {/* IMAGE */}
              <div className="h-48 shrink-0">
                <img
                  src={
                    store?.images?.[0] ||
                    "https://images.unsplash.com/photo-1542838132-92c53300491e"
                  }
                  alt={store?.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* CONTENT */}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex justify-between items-start gap-2">
                  <h2 className="text-xl font-bold text-[var(--text-primary)] line-clamp-1">
                    {store?.name}
                  </h2>
                  <span
                    className={`shrink-0 text-xs px-3 py-1 rounded-full font-semibold ${store?.isActive ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}
                  >
                    {store?.isActive ? "Active" : "Inactive"}
                  </span>
                </div>

                <p className="flex items-start gap-2 text-sm text-[var(--text-secondary)] mt-3 line-clamp-2 min-h-[2.5rem]">
                  <FaMapMarkerAlt className="text-[var(--primary-orange)] mt-0.5 shrink-0" />
                  {store?.address}
                </p>

                <div className="mt-4 space-y-2 text-sm text-[var(--text-secondary)]">
                  <p className="flex items-center gap-2">
                    <FaPhoneAlt className="text-[var(--primary-orange)] shrink-0" />
                    <span className="truncate">{store?.phoneNumber}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaEnvelope className="text-[var(--primary-orange)] shrink-0" />
                    <span className="truncate">{store?.email}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <FaClock className="text-[var(--primary-orange)] shrink-0" />
                    {store?.openingTime} - {store?.closingTime}
                  </p>
                </div>

                {/* spacer — button hamesha bottom pe rahega, chahe text 1 line ho ya 2 */}
                <div className="flex-1" />

                <div className="grid grid-cols-2 gap-3 mt-6">
                  <button
                    onClick={() => navigate(`/dashboard/stores/${store?._id}`)}
                    className="btn-3d btn-white h-10 flex items-center justify-center gap-2"
                  >
                    <FaEye /> Details
                  </button>
                  <button
                    onClick={() => navigate(`/dashboard/orders/${store?._id}`)}
                    className="btn-3d btn-white h-10 flex items-center justify-center gap-2"
                  >
                    <FaEye /> Orders
                  </button>
                  <button
                    className="btn-3d btn-gradient-orange col-span-2 h-10 flex items-center justify-center gap-2"
                    onClick={() => handleOpenModal(store)}
                  >
                    <FaEdit /> Update
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[999] overflow-y-auto bg-slate-900/40 backdrop-blur-md">
          <div className="min-h-screen flex items-start sm:items-center justify-center p-4 py-8">
            {" "}
            <div className="bg-white rounded-[2.5rem] shadow-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto border border-slate-200">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-3xl font-black text-[#0f172a] tracking-tight">
                    {isCreating ? (
                      <>
                        Add <span className="text-[#ff7e00]">Store</span>
                      </>
                    ) : (
                      <>
                        Update <span className="text-[#ff7e00]">Store</span>
                      </>
                    )}
                  </h2>
                  {!isCreating && (
                    <p className="text-[#64748b] font-semibold mt-1">
                      {selectedStore?.name}
                    </p>
                  )}
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-3 hover:bg-slate-100 text-slate-500 hover:text-slate-700 rounded-xl transition-all"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              <form
                onSubmit={isCreating ? handleCreateStore : handleUpdateStore}
                className="space-y-6"
              >
                {/* Basic Info */}
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-sm font-black uppercase text-[#64748b] tracking-wider mb-4">
                    Basic Information
                  </h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Store Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                        placeholder="Enter store name"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                        placeholder="Enter store address"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400 resize-none"
                        rows="3"
                        placeholder="Enter store description"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                          Location Latitude
                        </label>
                        <input
                          type="text"
                          name="locationLat"
                          value={formData.locationLat}
                          onChange={handleFormChange}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                          placeholder="Enter latitude"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                          Location Longitude
                        </label>
                        <input
                          type="text"
                          name="locationLng"
                          value={formData.locationLng}
                          onChange={handleFormChange}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                          placeholder="Enter longitude"
                          required
                        />
                      </div>
                    </div>

                    {/* SEARCH BAR */}
                    <div className="mb-6">
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Search Location
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={locationSearch}
                          onChange={(e) => handleLocationSearch(e.target.value)}
                          className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                          placeholder="Search city, area or address..."
                        />
                        {searchLoading && (
                          <p className="text-xs text-slate-400 mt-1 pl-1">
                            Searching...
                          </p>
                        )}
                        {searchResults.length > 0 && (
                          <div
                            className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden"
                            style={{ zIndex: 99999, top: "100%" }}
                          >
                            {searchResults.map((result) => (
                              <button
                                key={result.place_id}
                                type="button"
                                onClick={() => handleSelectLocation(result)}
                                className="w-full text-left px-5 py-3 text-sm text-[#0f172a] hover:bg-slate-50 border-b border-slate-100 last:border-0 font-medium transition-all"
                              >
                                <span className="font-semibold text-[#0f172a]">
                                  {getShortName(result.display_name)}
                                </span>
                                <br />
                                <span className="text-xs text-slate-400">
                                  {result.display_name}
                                </span>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                        <div>
                          <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                            Location Picker
                          </label>
                          <p className="text-xs text-slate-500">
                            Click the map to set latitude and longitude
                            automatically.
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={centerMapToMarker}
                          className="text-sm font-semibold text-white bg-[#ff7e00] hover:bg-[#e46b00] rounded-full px-4 py-2 transition-all"
                        >
                          Center on selected location
                        </button>
                      </div>
                      <div className="h-72 overflow-hidden rounded-3xl border border-slate-200">
                        <MapContainer
                          center={mapCenter}
                          zoom={13}
                          scrollWheelZoom={false}
                          className="h-full w-full"
                          whenCreated={setMapRef}
                        >
                          <TileLayer
                            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                          />
                          <LocationMarker position={markerPosition} />
                        </MapContainer>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Store Images
                      </label>
                      <input
                        type="file"
                        name="images"
                        onChange={handleFormChange}
                        multiple
                        accept="image/*"
                        className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#ff7e00] file:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-sm font-black uppercase text-[#64748b] tracking-wider mb-4">
                    Contact Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                        placeholder="Enter phone"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                        placeholder="Enter email"
                      />
                    </div>
                  </div>
                </div>

                {/* Operation Hours */}
                <div className="border-b border-slate-100 pb-6">
                  <h3 className="text-sm font-black uppercase text-[#64748b] tracking-wider mb-4">
                    Operation Hours
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Opening Time
                      </label>
                      <input
                        type="time"
                        name="openingTime"
                        value={formData.openingTime}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                        Closing Time
                      </label>
                      <input
                        type="time"
                        name="closingTime"
                        value={formData.closingTime}
                        onChange={handleFormChange}
                        className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery */}
                <div className="pb-6">
                  <h3 className="text-sm font-black uppercase text-[#64748b] tracking-wider mb-4">
                    Delivery Settings
                  </h3>
                  <div>
                    <label className="text-xs font-black uppercase text-[#64748b] tracking-wider pl-1 block mb-2">
                      Delivery Radius (KM)
                    </label>
                    <input
                      type="number"
                      name="deliveryRadius"
                      value={formData.deliveryRadius}
                      onChange={handleFormChange}
                      className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-3 text-[#0f172a] outline-none focus:bg-white focus:border-[#ff7e00] focus:ring-4 focus:ring-[#ff7e00]/10 transition-all font-semibold placeholder-slate-400"
                      placeholder="Enter delivery radius"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-6 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-2xl font-bold transition-all cursor-pointer active:scale-95 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={updating}
                    className="flex-1 px-6 py-3 bg-[#ff7e00] hover:bg-[#e06f00] text-white rounded-2xl font-black shadow-lg shadow-[#ff7e00]/25 hover:shadow-xl transition-all cursor-pointer active:scale-95 text-sm uppercase tracking-wider disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updating
                      ? isCreating
                        ? "Creating..."
                        : "Updating..."
                      : isCreating
                        ? "Create Store"
                        : "Update Store"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stores;
