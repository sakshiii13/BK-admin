import React, { useEffect, useMemo, useState } from "react";
import {
  FaArrowLeft,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaEnvelope,
  FaClock,
  FaStore,
  FaImages,
  FaCalendarAlt,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { getStoreByIdApi } from "../../../api/admin.api";

const StoreDetails = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);

      const res = await getStoreByIdApi(storeId);
      console.log("STORE DETAILS RESPONSE 👉", res);

      if (res?.success) {
        const apiStore = res?.data || null;
        setStore(apiStore);
        setActiveImage(apiStore?.images?.[0] || "/logo.png");
      } else {
        setStore(null);
        alert(res?.message || "Store details not found");
      }
    } catch (error) {
      console.log("Store details error:", error);
      setStore(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (storeId) fetchStoreDetails();
  }, [storeId]);

  const coordinates = useMemo(() => {
    return {
      lat: store?.lat || store?.location?.coordinates?.[1] || "-",
      lng: store?.lng || store?.location?.coordinates?.[0] || "-",
    };
  }, [store]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] p-6 text-white">
        <div className="rounded-[28px] border border-white/10 bg-[var(--card-bg)] p-8 text-center text-slate-300">
          Loading store details...
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[var(--app-bg)] p-6 text-white">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-bold text-slate-200 transition hover:bg-white/20"
        >
          <FaArrowLeft />
          Back
        </button>

        <div className="rounded-[28px] border border-white/10 bg-[var(--card-bg)] p-8 text-center text-slate-300">
          Store not found.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--app-bg)] px-5 py-6 text-white">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 flex items-center gap-2 rounded-2xl bg-white/10 px-5 py-3 font-bold text-slate-200 transition hover:bg-white/20"
      >
        <FaArrowLeft />
        Back
      </button>

      <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[var(--card-bg)] shadow-2xl">
        <div className="grid grid-cols-1 xl:grid-cols-[1.1fr_1fr]">
          <div className="bg-black/20 p-4">
            <div className="h-[380px] overflow-hidden rounded-[26px] bg-black/30">
              <img
                src={activeImage || "/logo.png"}
                alt={store?.name}
                className="h-full w-full object-cover"
              />
            </div>

            {store?.images?.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {store.images.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-2xl border transition ${
                      activeImage === img
                        ? "border-orange-500"
                        : "border-white/10"
                    }`}
                  >
                    <img
                      src={img}
                      alt="Store"
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-7">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-orange-400">
                  Store Details
                </p>

                <h1 className="mt-3 text-4xl font-bold">{store?.name}</h1>
              </div>

              <span
                className={`w-fit rounded-full px-4 py-2 text-xs font-bold ${
                  store?.isActive
                    ? "bg-green-500/15 text-green-400"
                    : "bg-red-500/15 text-red-400"
                }`}
              >
                {store?.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="mt-5 flex gap-3 leading-6 text-slate-300">
              <FaMapMarkerAlt className="mt-1 shrink-0 text-orange-400" />
              {store?.address || "-"}
            </p>

            <p className="mt-5 leading-7 text-slate-300">
              {store?.description || "-"}
            </p>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <InfoCard
                icon={<FaPhoneAlt />}
                label="Phone"
                value={store?.phoneNumber}
              />

              <InfoCard
                icon={<FaEnvelope />}
                label="Email"
                value={store?.email}
              />

              <InfoCard
                icon={<FaClock />}
                label="Timing"
                value={`${store?.openingTime || "-"} - ${
                  store?.closingTime || "-"
                }`}
              />

              <InfoCard
                icon={<FaStore />}
                label="Delivery Radius"
                value={`${store?.deliveryRadius || "-"} KM`}
              />

              <InfoCard
                icon={<FaMapMarkerAlt />}
                label="Latitude"
                value={coordinates.lat}
              />

              <InfoCard
                icon={<FaMapMarkerAlt />}
                label="Longitude"
                value={coordinates.lng}
              />

              <InfoCard
                icon={<FaImages />}
                label="Total Images"
                value={store?.images?.length || 0}
              />

              <InfoCard
                icon={<FaCalendarAlt />}
                label="Last Updated"
                value={
                  store?.updatedAt
                    ? new Date(store.updatedAt).toLocaleDateString()
                    : "-"
                }
              />
            </div>
          </div>
        </div>
      </div>
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

      <p className="mt-2 break-words font-bold text-white">{value || "-"}</p>
    </div>
  );
};

export default StoreDetails;