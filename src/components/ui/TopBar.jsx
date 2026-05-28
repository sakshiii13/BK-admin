// src/components/ui/TopBar.jsx

import React, { useEffect, useState, useRef } from "react";
import {
  FaExpandArrowsAlt,
  FaCompressArrowsAlt,
  FaSearch,
  FaBell,
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

const formatSegment = (text) => {
  if (!text) return "Dashboard";

  return text
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const BreadCrumb = ({ pathname }) => {
  const segments = pathname.split("/").filter(Boolean).map(formatSegment);

  if (segments.length === 0) return <span>Dashboard</span>;

  return (
    <div className="flex items-center gap-1 text-sm sm:text-base">
      {segments.map((item, index) => (
        <div key={index} className="flex items-center gap-1">
          <span
            className={
              index === segments.length - 1
                ? "font-bold text-[var(--text-primary)]"
                : "text-[var(--text-secondary)]"
            }
          >
            {item}
          </span>

          {index !== segments.length - 1 && (
            <MdKeyboardArrowRight className="text-[var(--text-secondary)]" />
          )}
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

  useEffect(() => {
    const handleFullscreenChange = () => {
      const isFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement;

      setIsFullscreen(Boolean(isFs));
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      document.removeEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "mozfullscreenchange",
        handleFullscreenChange
      );
      document.removeEventListener(
        "MSFullscreenChange",
        handleFullscreenChange
      );
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfile(false);
      }

      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    const element = document.documentElement;

    if (
      !document.fullscreenElement &&
      !document.webkitFullscreenElement &&
      !document.mozFullScreenElement &&
      !document.msFullscreenElement
    ) {
      element.requestFullscreen?.();
      element.webkitRequestFullscreen?.();
      element.mozRequestFullScreen?.();
      element.msRequestFullscreen?.();
    } else {
      document.exitFullscreen?.();
      document.webkitExitFullscreen?.();
      document.mozCancelFullScreen?.();
      document.msExitFullscreen?.();
    }
  };

  const handleLogout = async () => {
    const result = await showConfirm({
      title: "Sign Out?",
      text: "Are you sure you want to sign out of BK Grocery Admin?",
      confirmButtonText: "Yes, Sign Out"
    });

    if (!result.isConfirmed) return;

    try {
      dispatch(showLoader());
      localStorage.removeItem("isAdminLogin");
      // Simulate brief loader for premium UX
      await new Promise((resolve) => setTimeout(resolve, 800));
      dispatch(hideLoader());
      navigate("/login");
      showSuccess("Signed out successfully");
    } catch (error) {
      dispatch(hideLoader());
    }
  };

  return (
    <div
      className="
        sticky top-0 z-40 w-full
        border-b border-[var(--border-soft)]
        bg-[rgba(6,10,7,0.75)]
        px-4 sm:px-6 lg:px-8 py-3.5
        shadow-xl
        backdrop-blur-xl
        flex items-center justify-between
        transition-all duration-300
      "
    >
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="
            lg:hidden
            flex h-10 w-10 items-center justify-center
            rounded-xl
            text-white
            bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)]
            shadow-md hover:shadow-[var(--primary-orange)]/30
            hover:scale-105 transition-all cursor-pointer
          "
        >
          <GiHamburgerMenu size={18} />
        </button>

        <div className="hidden sm:block text-[var(--text-primary)] font-semibold">
          <BreadCrumb pathname={location.pathname} />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 max-w-md mx-6">
        <div className="relative w-full group">
          <input
            type="text"
            placeholder="Search products, orders, users..."
            className="w-full h-11 bg-white/[0.02] border border-[var(--border-soft)] text-[var(--text-primary)] rounded-xl pl-11 pr-4 text-sm outline-none focus:border-[var(--primary-orange)]/50 focus:bg-white/[0.04] transition-all shadow-inner placeholder-slate-500 group-hover:border-white/10"
          />

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-[var(--primary-orange)] transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-xl
            bg-white/[0.02]
            text-slate-400
            border border-[var(--border-soft)]
            transition-all duration-300
            hover:text-[var(--primary-orange)] hover:border-[var(--primary-orange)]/25 hover:bg-white/[0.04]
            hover:-translate-y-0.5 cursor-pointer
          "
        >
          {isFullscreen ? (
            <FaCompressArrowsAlt size={14} />
          ) : (
            <FaExpandArrowsAlt size={14} />
          )}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              relative flex h-10 w-10 items-center justify-center
              rounded-xl bg-white/[0.02]
              text-slate-400
              border border-[var(--border-soft)]
              transition-all duration-300
              hover:text-[var(--primary-orange)] hover:border-[var(--primary-orange)]/25 hover:bg-white/[0.04] cursor-pointer
              ${showNotifications ? "ring-2 ring-[var(--primary-orange)]/30 border-[var(--primary-orange)]/40 text-[var(--primary-orange)]" : ""}
            `}
          >
            <FaBell size={15} />
            <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-[var(--primary-orange)] animate-pulse"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#090f0b] shadow-2xl overflow-hidden z-50 border border-[var(--border-soft)] glass-premium">
              <div className="px-4 py-3.5 border-b border-[var(--border-soft)] flex justify-between items-center bg-white/[0.01]">
                <h3 className="font-semibold text-white tracking-wide">Notifications</h3>
                <span className="text-[10px] bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)] text-white px-2 py-0.5 rounded-full font-bold">
                  2 NEW
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-white/[0.02]">
                <div className="px-4 py-3 hover:bg-white/[0.02] cursor-pointer flex gap-3 transition-colors">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-[var(--primary-orange)] shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium">
                      New order #1024 received
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">2 mins ago</p>
                  </div>
                </div>

                <div className="px-4 py-3 hover:bg-white/[0.02] cursor-pointer flex gap-3 transition-colors">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-[var(--primary-green)] shrink-0"></div>
                  <div>
                    <p className="text-sm text-slate-200 font-medium">
                      Stock alert for Fresh Apples
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">1 hour ago</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            className={`
              flex items-center gap-3 cursor-pointer 
              bg-white/[0.02] p-1 pr-4 rounded-xl 
              border border-[var(--border-soft)] 
              transition-all duration-300
              hover:border-[var(--primary-orange)]/45
              ${showProfile ? "ring-2 ring-[var(--primary-orange)]/30 border-[var(--primary-orange)]/40" : ""}
            `}
          >
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="User"
              className="w-8 h-8 rounded-lg object-cover border border-white/10"
            />

            <div className="hidden sm:block text-left">
              <p className="text-xs font-bold text-[var(--text-primary)] leading-none">
                Admin User
              </p>
              <p className="text-[9px] text-slate-500 mt-0.5 uppercase tracking-widest font-semibold">
                Store Manager
              </p>
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#090f0b] shadow-2xl overflow-hidden z-50 border border-[var(--border-soft)] glass-premium">
              <div className="px-4 py-4 border-b border-[var(--border-soft)] text-center bg-white/[0.01]">
                <img
                  src="https://i.pravatar.cc/150?img=11"
                  alt="User"
                  className="w-16 h-16 rounded-xl object-cover border-2 border-[var(--primary-orange)] mx-auto mb-2.5 shadow-lg"
                />

                <p className="text-sm font-bold text-white tracking-wide">Admin User</p>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  admin@bkgrocery.com
                </p>
              </div>

              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:text-[var(--primary-orange)] hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <FaUser className="text-slate-500 text-sm" /> My Profile
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-xs text-slate-300 hover:text-[var(--primary-orange)] hover:bg-white/[0.02] transition-colors cursor-pointer">
                  <FaCog className="text-slate-500 text-sm" /> Account Settings
                </button>
              </div>

              <div className="border-t border-[var(--border-soft)] bg-red-500/[0.02]">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-xs text-red-400 hover:text-red-300 hover:bg-red-500/[0.06] font-semibold transition-colors cursor-pointer"
                >
                  <FaSignOutAlt /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;