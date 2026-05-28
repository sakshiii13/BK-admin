// src/components/ui/TopBar.jsx

import React, { useEffect, useState, useRef } from "react";
import {
  FaExpandArrowsAlt, FaCompressArrowsAlt, FaSearch,
  FaBell, FaUser, FaCog, FaSignOutAlt,
} from "react-icons/fa";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { showConfirm, showSuccess } from "../../utils/alertService";

const formatSegment = (text) => {
  if (!text) return "Dashboard";
  return text.replace(/-/g, " ").replace(/_/g, " ").replace(/\b\w/g, (char) => char.toUpperCase());
};

const BreadCrumb = ({ pathname }) => {
  const segments = pathname.split("/").filter(Boolean).map(formatSegment);
  if (segments.length === 0) return <span>Dashboard</span>;
  return (
    <div className="flex items-center gap-1 text-sm sm:text-base">
      {segments.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className={index === segments.length - 1 ? "font-bold text-slate-800" : "text-slate-500"}>
            {item}
          </span>
          {index !== segments.length - 1 && <MdKeyboardArrowRight className="text-slate-400" />}
        </div>
      ))}
    </div>
  );
};

const TopBar = ({ onMenuClick }) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const profileRef = useRef(null);
  const notifRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Fullscreen & ClickOutside Logic (Same as before)
  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(Boolean(document.fullscreenElement));
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setShowProfile(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifications(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen();
    else document.exitFullscreen();
  };

  const handleLogout = async () => {
    const result = await showConfirm({ title: "Sign Out?", text: "Are you sure you want to sign out?", confirmButtonText: "Yes, Sign Out" });
    if (!result.isConfirmed) return;
    dispatch(showLoader());
    localStorage.removeItem("isAdminLogin");
    setTimeout(() => { dispatch(hideLoader()); navigate("/login"); showSuccess("Signed out successfully"); }, 800);
  };

  return (
    <div className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between shadow-sm">
      
      {/* LEFT: Menu & Breadcrumb */}
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-orange-500 hover:text-white transition-all">
          <GiHamburgerMenu size={18} />
        </button>
        <div className="hidden sm:block text-slate-800 font-semibold">
          <BreadCrumb pathname={location.pathname} />
        </div>
      </div>

      {/* CENTER: Search */}
      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <input type="text" placeholder="Search..." className="w-full h-11 bg-slate-50 border border-slate-200 text-slate-800 rounded-xl pl-11 pr-4 text-sm outline-none focus:border-orange-500 transition-all" />
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>
      </div>

      {/* RIGHT: Actions */}
      <div className="flex items-center gap-3">
        <button onClick={toggleFullscreen} className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-50 text-slate-500 border border-slate-200 hover:border-orange-500 hover:text-orange-600 transition-all">
          {isFullscreen ? <FaCompressArrowsAlt size={14} /> : <FaExpandArrowsAlt size={14} />}
        </button>

        {/* Profile Button */}
        <div className="relative" ref={profileRef}>
          <div onClick={() => setShowProfile(!showProfile)} className="flex items-center gap-3 cursor-pointer p-1 pr-4 rounded-xl border border-slate-200 hover:border-orange-300 transition-all">
            <img src="https://i.pravatar.cc/150?img=11" alt="User" className="w-8 h-8 rounded-lg object-cover" />
            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-slate-800">Admin User</p>
              <p className="text-[9px] text-slate-400 uppercase font-semibold">Manager</p>
            </div>
          </div>

          {/* Profile Dropdown */}
          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-white shadow-xl border border-slate-100 overflow-hidden">
              <div className="px-4 py-4 border-b border-slate-50 text-center">
                <img src="https://i.pravatar.cc/150?img=11" className="w-16 h-16 rounded-xl mx-auto mb-2 border-2 border-orange-100" />
                <p className="text-sm font-bold text-slate-800">Admin User</p>
                <p className="text-[11px] text-slate-400">admin@bkgrocery.com</p>
              </div>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50"><FaUser /> My Profile</button>
              <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-600 hover:bg-slate-50"><FaCog /> Settings</button>
              <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs text-red-600 bg-red-50 hover:bg-red-100 font-semibold"><FaSignOutAlt /> Sign Out</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;