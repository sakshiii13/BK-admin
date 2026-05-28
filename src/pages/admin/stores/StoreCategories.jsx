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
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <div className="mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
            Store Management
          </p>

          <h1 className="mt-2 text-3xl font-bold">Nearest Store</h1>

          <p className="mt-2 text-sm text-slate-400">
            Search nearest store using latitude and longitude.
          </p>
        </div>

        <button
          type="button"
          onClick={handleUseMyLocation}
          className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400"
        >
          <FaLocationArrow />
          Use My Location
        </button>
      </div>

      <form
        onSubmit={handleSearch}
        className="mb-6 grid grid-cols-1 gap-4 rounded-[28px] border border-white/10 bg-[var(--card-bg)] p-5 shadow-xl md:grid-cols-[1fr_1fr_auto]"
      >
        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Latitude
          </label>

          <input
            type="number"
            step="any"
            name="lat"
            value={location.lat}
            onChange={handleChange}
            placeholder="22.7100"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-500"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-slate-300">
            Longitude
          </label>

          <input
            type="number"
            step="any"
            name="lng"
            value={location.lng}
            onChange={handleChange}
            placeholder="75.8700"
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none placeholder:text-slate-500 focus:border-orange-500"
          />
        </div>

        <div className="flex items-end">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-orange-500 px-6 py-3 font-bold text-black transition hover:bg-orange-400 disabled:opacity-60"
          >
            {loading ? "Searching..." : "Find Store"}
          </button>
        </div>
      </form>

      {loading ? (
        <div className="rounded-[28px] border border-white/10 bg-[var(--card-bg)] p-8 text-center text-slate-300">
          Loading nearest store...
        </div>
      ) : !nearestStore ? (
        <div className="rounded-[28px] border border-white/10 bg-[var(--card-bg)] p-8 text-center text-slate-300">
          No nearest store found.
        </div>
      ) : (
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[var(--card-bg)] shadow-2xl">
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr]">
            <div className="h-[360px] overflow-hidden bg-black/20">
              <img
                src={nearestStore?.images?.[0] || "/logo.png"}
                alt={nearestStore?.name}
                className="h-full w-full object-cover transition duration-300 hover:scale-105"
              />
            </div>

            <div className="p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                    Nearest Store
                  </p>

                  <h2 className="mt-2 text-3xl font-bold">
                    {nearestStore?.name}
                  </h2>
                </div>

                <span
                  className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                    nearestStore?.isActive
                      ? "bg-green-500/15 text-green-400"
                      : "bg-red-500/15 text-red-400"
                  }`}
                >
                  {nearestStore?.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              <p className="mt-4 flex gap-2 text-sm leading-6 text-slate-300">
                <FaMapMarkerAlt className="mt-1 text-orange-400" />
                {nearestStore?.address}
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-300">
                {nearestStore?.description}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoCard
                  icon={<FaPhoneAlt />}
                  label="Phone"
                  value={nearestStore?.phoneNumber}
                />

                <InfoCard
                  icon={<FaEnvelope />}
                  label="Email"
                  value={nearestStore?.email}
                />

                <InfoCard
                  icon={<FaClock />}
                  label="Timing"
                  value={`${nearestStore?.openingTime || "-"} - ${
                    nearestStore?.closingTime || "-"
                  }`}
                />

                <InfoCard
                  icon={<FaStore />}
                  label="Delivery Radius"
                  value={`${nearestStore?.deliveryRadius || "-"} KM`}
                />
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-white/5 p-4 text-center">
                  <p className="text-xs text-slate-400">Latitude</p>
                  <p className="mt-1 font-bold">{lat}</p>
                </div>

                <div className="rounded-2xl bg-white/5 p-4 text-center">
                  <p className="text-xs text-slate-400">Longitude</p>
                  <p className="mt-1 font-bold">{lng}</p>
                </div>
              </div>
            </div>
          </div>

          {nearestStore?.images?.length > 1 && (
            <div className="border-t border-white/10 p-6">
              <h3 className="mb-4 text-xl font-bold">Store Images</h3>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {nearestStore.images.map((img, index) => (
                  <img
                    key={`${img}-${index}`}
                    src={img}
                    alt="Store"
                    className="h-36 w-full rounded-2xl object-cover"
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

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <p className="flex items-center gap-2 text-sm text-slate-400">
        <span className="text-orange-400">{icon}</span>
        {label}
      </p>

      <p className="mt-2 font-bold text-white">{value || "-"}</p>
    </div>
  );
};

export default StoreCategories;