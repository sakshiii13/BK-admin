// src/components/ui/TopBar.jsx

import React, { useEffect, useState, useRef } from "react";
import {
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
  FaSearch,
  FaUser,
  FaCog,
  FaSignOutAlt,
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
        sticky top-3 z-50 mx-4
        flex items-center justify-between
        rounded-2xl
        border border-white/60
        bg-white/70 backdrop-blur-xl
        shadow-[0_10px_30px_rgba(0,0,0,0.08)]
        px-5 py-3
      "
    >
      {/* LEFT */}
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden h-10 w-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center hover:scale-105 transition"
        >
          <GiHamburgerMenu />
        </button>

        <div className="hidden sm:block">
          <BreadCrumb pathname={location.pathname} />
        </div>
      </div>

      {/* CENTER SEARCH */}
      <div className="hidden lg:block w-[380px]">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            placeholder="Search anything..."
            className="
              w-full h-11 pl-11 pr-4
              rounded-xl
              bg-white/80
              border border-slate-200
              text-sm text-slate-700
              shadow-inner
              focus:outline-none
              focus:border-orange-400
              focus:ring-4 focus:ring-orange-100
              transition
            "
          />
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center gap-3">

        {/* fullscreen */}
        <button
          onClick={toggleFullscreen}
          className="
            h-10 w-10 rounded-xl
            bg-white border border-slate-200
            shadow-sm hover:shadow-md
            flex items-center justify-center
            hover:text-orange-500 transition
          "
        >
          {isFullscreen ? (
            <FaCompressArrowsAlt />
          ) : (
            <FaExpandArrowsAlt />
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
              shadow-sm
              cursor-pointer
              hover:shadow-md transition
            "
          >
            <img
              src="https://i.pravatar.cc/100?img=12"
              className="w-9 h-9 rounded-xl object-cover"
            />
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-800">
                Admin
              </p>
              <p className="text-[10px] text-slate-400">
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
                border border-slate-100
                shadow-[0_20px_50px_rgba(0,0,0,0.15)]
                overflow-hidden
              "
            >
              <div className="p-4 text-center border-b">
                <img
                  src="https://i.pravatar.cc/100?img=12"
                  className="w-14 h-14 mx-auto rounded-xl mb-2"
                />
                <p className="text-sm font-bold">Admin</p>
                <p className="text-xs text-slate-400">
                  admin@example.com
                </p>
              </div>

              <button className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50">
                <FaUser className="inline mr-2" /> Profile
              </button>

              <button className="w-full px-4 py-2 text-left text-xs hover:bg-slate-50">
                <FaCog className="inline mr-2" /> Settings
              </button>

              <button
                onClick={handleLogout}
                className="
                  w-full px-4 py-3
                  text-xs font-semibold text-red-600
                  bg-red-50 hover:bg-red-100
                "
              >
                <FaSignOutAlt className="inline mr-2" />
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