import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaSearchLocation,
  FaStore,
  FaLocationArrow,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showError } from "../../../utils/alertService";

import { findNearestStoreApi } from "../../../api/admin.api";

const defaultLocation = {
  lat: "22.7100",
  lng: "75.8700",
};

const StoreCategories = () => {
  const dispatch = useDispatch();
  const [location, setLocation] = useState(defaultLocation);
  const [nearestStore, setNearestStore] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNearestStore = async (customLocation = location) => {
    if (!customLocation.lat || !customLocation.lng) {
      showError("Please enter latitude and longitude");
      return;
    }

    try {
      setLoading(true);
      dispatch(showLoader());

      const res = await findNearestStoreApi({
        lat: customLocation.lat,
        lng: customLocation.lng,
      });

      console.log("NEAREST STORE RESPONSE 👉", res);

      if (res?.success) {
        setNearestStore(res?.data || null);
      } else {
        setNearestStore(null);
        showError(res?.message || "Nearest store not found");
      }
    } catch (error) {
      console.log("Nearest store error:", error);
      showError("Something went wrong while searching for nearest store");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
    }
  };

  useEffect(() => {
    fetchNearestStore(defaultLocation);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setLocation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchNearestStore(location);
  };

  const handleUseMyLocation = () => {
    if (!navigator.geolocation) {
      showError("Geolocation is not supported in this browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        };

        setLocation(currentLocation);
        fetchNearestStore(currentLocation);
      },
      (error) => {
        console.log("Location error:", error);
        showError("Location permission denied or unavailable");
      }
    );
  };

  const lat =
    nearestStore?.lat || nearestStore?.location?.coordinates?.[1] || "-";

  const lng =
    nearestStore?.lng || nearestStore?.location?.coordinates?.[0] || "-";

  return (
    <div className="p-6 space-y-6 bg-slate-50/50 min-h-screen">
      {/* ================= HEADER ================= */}
      <div className="card-3d p-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
            Store Management
          </p>
          <h1 className="mt-1 text-2xl font-black text-slate-800">Nearest Store Finder</h1>
          <p className="mt-1 text-sm text-slate-500">
            Locate and monitor the closest physical store assets using geographical coordinates.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseMyLocation}
          className="btn-3d btn-gradient-orange px-5 py-3 text-sm flex items-center justify-center gap-2 text-white font-bold whitespace-nowrap"
        >
          <FaLocationArrow />
          Use My Location
        </button>
      </div>

      {/* ================= INPUT SEARCH FORM ================= */}
      <form
        onSubmit={handleSearch}
        className="card-3d p-5 bg-white grid grid-cols-1 gap-5 md:grid-cols-[1fr_1fr_auto] items-end"
      >
        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Latitude Coordinate
          </label>
          <input
            type="number"
            step="any"
            name="lat"
            value={location.lat}
            onChange={handleChange}
            placeholder="e.g. 22.7100"
            className="input-3d w-full px-4 py-3 text-sm h-12 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-extrabold uppercase tracking-wider text-slate-500">
            Longitude Coordinate
          </label>
          <input
            type="number"
            step="any"
            name="lng"
            value={location.lng}
            onChange={handleChange}
            placeholder="e.g. 75.8700"
            className="input-3d w-full px-4 py-3 text-sm h-12 bg-white text-slate-800 placeholder:text-slate-400 focus:outline-none font-medium"
          />
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="btn-3d btn-white border border-slate-200 px-8 py-3 text-sm h-12 flex items-center justify-center font-bold text-slate-700 hover:bg-slate-50 w-full md:w-auto"
          >
            {loading ? "Searching..." : "Find Store Asset"}
          </button>
        </div>
      </form>

      {/* ================= RESPONSE CONTENT BLOCKS ================= */}
      {loading ? (
        <div className="card-3d p-12 bg-white text-center text-slate-400 font-medium">
          <div className="flex items-center justify-center gap-2">
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
            <div className="h-2 w-2 bg-orange-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
            <span>Calculating geometric proximities...</span>
          </div>
        </div>
      ) : !nearestStore ? (
        <div className="card-3d p-12 bg-white text-center text-slate-400 font-medium italic">
          No warehouse or store asset matched those coordinates. Try using your current location.
        </div>
      ) : (
        <div className="card-3d overflow-hidden bg-white">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr]">
            {/* Store Thumbnail Container */}
            <div className="h-[380px] overflow-hidden bg-slate-50 relative border-r border-slate-100">
              <img
                src={nearestStore?.images?.[0] || "/logo.png"}
                alt={nearestStore?.name}
                className="h-full w-full object-cover transition duration-500 hover:scale-105"
              />
            </div>

            {/* Store Specifications */}
            <div className="p-6 flex flex-col justify-between">
              <div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-2.5 py-1 rounded-md">
                      Optimized Match
                    </span>
                    <h2 className="mt-2.5 text-2xl font-black text-slate-800">
                      {nearestStore?.name}
                    </h2>
                  </div>

                  <span
                    className={`w-fit rounded-full px-4 py-1.5 text-xs font-extrabold uppercase tracking-wide ${
                      nearestStore?.isActive
                        ? "bg-green-50 text-green-600"
                        : "bg-red-50 text-red-600"
                    }`}
                  >
                    {nearestStore?.isActive ? "Operational" : "Inactive"}
                  </span>
                </div>

                <p className="mt-4 flex gap-2.5 text-sm font-medium leading-relaxed text-slate-600">
                  <FaMapMarkerAlt className="mt-0.5 text-orange-500 shrink-0 text-base" />
                  {nearestStore?.address}
                </p>

                {nearestStore?.description && (
                  <p className="mt-3 text-sm text-slate-400 bg-slate-50/50 p-3 rounded-xl border border-slate-100 italic">
                    "{nearestStore?.description}"
                  </p>
                )}

                {/* Info Metadata Cards */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoCard
                    icon={<FaPhoneAlt />}
                    label="Phone Network"
                    value={nearestStore?.phoneNumber}
                  />

                  <InfoCard
                    icon={<FaEnvelope />}
                    label="Internal Email"
                    value={nearestStore?.email}
                  />

                  <InfoCard
                    icon={<FaClock />}
                    label="Operating Hours"
                    value={`${nearestStore?.openingTime || "-"} - ${
                      nearestStore?.closingTime || "-"
                    }`}
                  />

                  <InfoCard
                    icon={<FaStore />}
                    label="Delivery Coverage"
                    value={`${nearestStore?.deliveryRadius || "-"} KM Radius`}
                  />
                </div>
              </div>

              {/* Exact Geolocation Readout */}
              <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-100 pt-4">
                <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Latitude</p>
                  <p className="mt-0.5 font-black text-slate-700 text-sm">{lat}</p>
                </div>

                <div className="rounded-xl bg-slate-50/80 p-3 border border-slate-100 text-center">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Target Longitude</p>
                  <p className="mt-0.5 font-black text-slate-700 text-sm">{lng}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sub Images Grid */}
          {nearestStore?.images?.length > 1 && (
            <div className="border-t border-slate-100 bg-slate-50/30 p-6">
              <h3 className="mb-4 text-xs font-black uppercase tracking-wider text-slate-400">
                Secondary Gallery Logs ({nearestStore.images.length} assets)
              </h3>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {nearestStore.images.map((img, index) => (
                  <img
                    key={`${img}-${index}`}
                    src={img}
                    alt="Store Asset View"
                    className="img-3d h-28 w-full object-cover bg-white"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Sub-Component Optimized for Light/3D Theme
const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/40 p-3 flex items-center gap-3">
      <div className="h-9 w-9 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center text-sm shrink-0">
        {icon}
      </div>
      <div className="overflow-hidden">
        <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">{label}</p>
        <p className="font-bold text-slate-700 text-sm truncate mt-0.5">{value || "Not Configured"}</p>
      </div>
    </div>
  );
};

export default StoreCategories;