import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../../redux/slices/loaderSlice";
import { showError } from "../../../utils/alertService";
import { getStoreByIdApi } from "../../../api/admin.api";

// ==========================================
// CUSTOM INLINE SVG ICONS (Removes react-icons dependency)
// ==========================================
const SvgArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
);
const SvgMapPin = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
);
const SvgPhone = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
);
const SvgMail = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path></svg>
);
const SvgClock = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);
const SvgStore = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="9" x2="21" y2="9"></line><line x1="5" y1="9" x2="5" y2="20"></line><line x1="19" y1="9" x2="19" y2="20"></line><path d="M7 20h10"></path><path d="M9 9V3h6v6"></path></svg>
);
const SvgImages = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="21 5 21 13 3 13 3 5"></polyline><circle cx="8" cy="8" r="2"></circle></svg>
);
const SvgCalendar = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
);

const StoreDetails = () => {
  const navigate = useNavigate();
  const { storeId } = useParams();
  const dispatch = useDispatch();

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState("");

  const fetchStoreDetails = async () => {
    try {
      setLoading(true);
      dispatch(showLoader());

      const res = await getStoreByIdApi(storeId);
      console.log("STORE DETAILS RESPONSE 👉", res);

      if (res?.success) {
        const apiStore = res?.data || null;
        setStore(apiStore);
        setActiveImage(apiStore?.images?.[0] || "/logo.png");
      } else {
        setStore(null);
        showError(res?.message || "Store details not found");
      }
    } catch (error) {
      console.log("Store details error:", error);
      setStore(null);
      showError("Something went wrong while fetching store details");
    } finally {
      setLoading(false);
      dispatch(hideLoader());
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
      <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 md:p-8 font-sans antialiased text-[#1e293b]">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center shadow-sm">
          <p className="text-slate-500 font-semibold">Loading store details...</p>
        </div>
      </div>
    );
  }

  if (!store) {
    return (
      <div className="min-h-screen bg-[#f8fafc] p-4 sm:p-6 md:p-8 font-sans antialiased text-[#1e293b]">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 rounded-2xl bg-white hover:bg-slate-50 text-slate-600 hover:text-[#ff7e00] border border-slate-200 px-5 py-3 font-bold transition-all cursor-pointer h-11"
        >
          <SvgArrowLeft /> Back
        </button>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 md:p-8 text-center shadow-sm">
          <p className="text-slate-500 font-semibold">Store not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 min-h-screen font-sans antialiased bg-[#f8fafc] text-[#1e293b]">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 p-3 bg-white hover:bg-slate-50 text-slate-600 hover:text-[#ff7e00] border border-slate-200 rounded-2xl shadow-sm transition-all cursor-pointer flex items-center justify-center h-11 w-11"
      >
        <SvgArrowLeft />
      </button>

      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-4xl font-black text-[#0f172a] tracking-tight">
          Store <span className="text-[#ff7e00]">Details</span>
        </h1>
        <p className="text-[#64748b] text-xs sm:text-sm font-semibold mt-2">{store?.name}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* LEFT: IMAGE GALLERY */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.02)] overflow-hidden">
            <div className="h-96 w-full rounded-2xl overflow-hidden bg-slate-100">
              <img
                src={activeImage || "/logo.png"}
                alt={store?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {store?.images?.length > 1 && (
              <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
                {store.images.map((img, index) => (
                  <button
                    key={`${img}-${index}`}
                    type="button"
                    onClick={() => setActiveImage(img)}
                    className={`h-20 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      activeImage === img
                        ? "border-[#ff7e00]"
                        : "border-slate-200 hover:border-slate-300"
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

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)] space-y-4">
            <h2 className="text-xl font-black text-[#0f172a] border-b border-slate-100 pb-3">About Store</h2>
            <p className="text-slate-600 leading-7">{store?.description || "No description available"}</p>
            
            <div className="pt-4">
              <p className="text-[10px] font-black uppercase text-[#64748b] tracking-wider mb-2">Address</p>
              <p className="flex gap-3 text-slate-700 font-semibold">
                <SvgMapPin /> {store?.address || "-"}
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: INFO CARDS */}
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)] space-y-6">
            <h2 className="text-xl font-black text-[#0f172a] border-b border-slate-100 pb-3">Status</h2>
            
            <div
              className={`flex items-center justify-between px-5 py-4 rounded-2xl border ${
                store?.isActive
                  ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                  : "bg-rose-50 border-rose-200 text-rose-700"
              }`}
            >
              <span className="text-xs font-extrabold uppercase tracking-wide">
                {store?.isActive ? "Active" : "Inactive"}
              </span>
              <span className={`w-3.5 h-3.5 rounded-full ${store?.isActive ? "bg-emerald-500" : "bg-rose-500"}`} />
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)] space-y-4">
            <h2 className="text-xl font-black text-[#0f172a] border-b border-slate-100 pb-3">Quick Info</h2>

            <InfoCard icon={<SvgPhone />} label="Phone" value={store?.phoneNumber} />
            <InfoCard icon={<SvgMail />} label="Email" value={store?.email} />
            <InfoCard 
              icon={<SvgClock />} 
              label="Timing" 
              value={`${store?.openingTime || "-"} - ${store?.closingTime || "-"}`} 
            />
            <InfoCard 
              icon={<SvgStore />} 
              label="Delivery Radius" 
              value={`${store?.deliveryRadius || "-"} KM`} 
            />
            <InfoCard 
              icon={<SvgImages />} 
              label="Total Images" 
              value={store?.images?.length || 0} 
            />
            <InfoCard 
              icon={<SvgCalendar />} 
              label="Last Updated" 
              value={store?.updatedAt ? new Date(store.updatedAt).toLocaleDateString() : "-"} 
            />
          </div>
        </div>
      </div>

      {/* COORDINATES SECTION */}
      <div className="mt-8 bg-white border border-slate-200 rounded-[2.5rem] p-5 md:p-8 shadow-[0_10px_30px_rgba(15,23,42,0.02)]">
        <h2 className="text-xl font-black text-[#0f172a] border-b border-slate-100 pb-3 mb-6">Location Coordinates</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard icon={<SvgMapPin />} label="Latitude" value={coordinates.lat} />
          <InfoCard icon={<SvgMapPin />} label="Longitude" value={coordinates.lng} />
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="space-y-2">
      <p className="flex items-center gap-2 text-[10px] font-black uppercase text-[#64748b] tracking-wider">
        <span className="text-[#ff7e00]">{icon}</span>
        {label}
      </p>
      <p className="text-slate-700 font-bold break-words">{value || "-"}</p>
    </div>
  );
};

export default StoreDetails;