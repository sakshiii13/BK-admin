// src/components/ui/TopBar.jsx

import React, { useEffect, useState, useRef } from "react";
import {
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
  FaBell, // ✅ ADD THIS IMPORT
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { showConfirm, showSuccess } from "../../utils/alertService";

// ================= BREADCRUMB =================
const formatSegment = (text) =>
  !text
    ? "Dashboard"
    : text
        .replace(/-/g, " ")
        .replace(/_/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());

const BreadCrumb = ({ pathname }) => {
  const segments = pathname.split("/").filter(Boolean).map(formatSegment);

  return (
    <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
      {segments.length === 0
        ? "Dashboard"
        : segments.map((item, i) => (
            <div key={i} className="flex items-center gap-2">
              <span
                className={
                  i === segments.length - 1
                    ? "text-slate-900 font-bold"
                    : "text-slate-500"
                }
              >
                {item}
              </span>
              {i !== segments.length - 1 && (
                <MdKeyboardArrowRight className="text-slate-400" />
              )}
            </div>
          ))}
    </div>
  );
};

const TopBar = ({ onMenuClick }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const profileRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // fullscreen
  useEffect(() => {
    const onChange = () =>
      setIsFullscreen(Boolean(document.fullscreenElement));

    document.addEventListener("fullscreenchange", onChange);
    return () =>
      document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement)
      document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleLogout = async () => {
    const result = await showConfirm({
      title: "Sign Out?",
      text: "Are you sure?",
      confirmButtonText: "Yes",
    });

    if (!result.isConfirmed) return;

    dispatch(showLoader());
    localStorage.clear();

    setTimeout(() => {
      dispatch(hideLoader());
      navigate("/login");
      showSuccess("Logged out");
    }, 600);
  };

  return (
    <div
      className="
        sticky top-3 z-40 mx-4
        flex items-center justify-between
        rounded-2xl
        border border-slate-200
        border-b-4 border-b-slate-300/80
        bg-white/80 backdrop-blur-xl
        shadow-[0_8px_20px_rgba(15,23,42,0.04)]
        px-5 py-3
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden btn-3d btn-white h-10 w-10 flex items-center justify-center p-0"
        >
          <GiHamburgerMenu size={18} />
        </button>

        <div className="hidden sm:block">
          <BreadCrumb pathname={location.pathname} />
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="hidden lg:block w-[380px]">
        <div className="relative group">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-green)] transition" />
          <input
            placeholder="Search anything..."
            className="input-3d w-full h-11 pl-11 pr-4 text-sm focus:scale-[1.02]"
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* ✅ NOTIFICATION BELL */}
        <button
          onClick={() => navigate("/dashboard/notifications")}
          className="relative btn-3d btn-white h-10 w-10 flex items-center justify-center p-0 hover:text-[var(--primary-green)]"
        >
          <FaBell size={15} />
          {/* unread dot — agar future me unread count API aaye to yahan dynamically dikha sakte ho */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white"></span>
        </button>

        {/* fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="btn-3d btn-white h-10 w-10 flex items-center justify-center p-0 hover:text-[var(--primary-green)]"
        >
          {isFullscreen ? (
            <FaCompressArrowsAlt size={15} />
          ) : (
            <FaExpandArrowsAlt size={15} />
          )}
        </button>

        {/* PROFILE */}
        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            className="
              flex items-center gap-3
              px-3 py-1.5
              rounded-xl
              bg-white border border-slate-200
              border-b-[4px] border-b-slate-300
              cursor-pointer select-none
              hover:-translate-y-0.5 hover:border-b-[5px]
              active:translate-y-[2px] active:border-b-[2px]
              transition-all duration-100 shadow-sm
            "
          >
            <img
              src="https://i.pravatar.cc/100?img=12"
              className="w-8 h-8 rounded-lg object-cover border border-slate-100 shadow-sm"
              alt="avatar"
            />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-slate-800 leading-tight">
                Admin
              </p>
              <p className="text-[10px] text-slate-400 font-bold leading-none mt-0.5">
                Super Admin
              </p>
            </div>
          </div>

          {/* DROPDOWN */}
          {showProfile && (
            <div
              className="
                absolute right-0 mt-3 w-56
                rounded-2xl
                bg-white
                border border-slate-200
                border-b-4 border-b-slate-300/80
                shadow-[0_15px_30px_rgba(15,23,42,0.12)]
                overflow-hidden z-50
              "
            >
              <div className="p-4 text-center border-b border-slate-100">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  className="w-14 h-14 mx-auto rounded-xl mb-2 border border-slate-200 shadow-sm"
                  alt="avatar-lg"
                />
                <p className="text-sm font-extrabold text-slate-800">Admin</p>
                <p className="text-xs text-slate-400 font-bold">
                  admin@bkgrocery.com
                </p>
              </div>

              <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-[var(--primary-green)]/10 hover:text-[var(--primary-green)] flex items-center gap-2 transition-all">
                <FaUser className="shrink-0" /> Profile
              </button>

              <button className="w-full px-4 py-2.5 text-left text-xs font-bold text-slate-600 hover:bg-[var(--primary-green)]/10 hover:text-[var(--primary-green)] flex items-center gap-2 transition-all">
                <FaCog className="shrink-0" /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="
                  w-full px-4 py-3
                  text-xs font-black text-red-600
                  bg-red-50 hover:bg-red-600 hover:text-white
                  flex items-center gap-2 transition-all duration-200
                "
              >
                <FaSignOutAlt className="shrink-0" />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;