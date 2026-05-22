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

  const handleLogout = () => {
    localStorage.removeItem("isAdminLogin");
    navigate("/login");
  };

  return (
    <div
      className="
        sticky top-0 z-40 w-full
        border-b border-[var(--border-soft)]
        bg-[var(--app-bg)]/90
        px-4 sm:px-6 lg:px-8 py-3
        shadow-[var(--shadow-soft)]
        backdrop-blur-[20px]
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
            bg-gradient-to-r from-orange-500 to-orange-400
            shadow-md hover:shadow-orange-500/30
            hover:scale-105 transition-all
          "
        >
          <GiHamburgerMenu size={20} />
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
            className="w-full bg-[var(--card-bg)] border border-[var(--border-soft)] text-[var(--text-primary)] rounded-full pl-11 pr-4 py-2.5 text-sm outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all shadow-[var(--shadow-inset)] group-hover:border-orange-500/30"
          />

          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] group-hover:text-orange-400 transition-colors" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <button
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
          className="
            flex h-10 w-10 items-center justify-center
            rounded-full
            bg-[var(--card-bg)]
            text-[var(--text-secondary)]
            shadow-[var(--shadow-inset)]
            border border-[var(--border-soft)]
            transition-all duration-300
            hover:text-orange-400 hover:border-orange-500/30
            hover:-translate-y-0.5
          "
        >
          {isFullscreen ? (
            <FaCompressArrowsAlt size={15} />
          ) : (
            <FaExpandArrowsAlt size={15} />
          )}
        </button>

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`
              relative flex h-10 w-10 items-center justify-center
              rounded-full bg-[var(--card-bg)]
              text-[var(--text-secondary)]
              border border-[var(--border-soft)]
              transition-all duration-300
              hover:text-orange-400 hover:border-orange-500/30
              ${showNotifications ? "ring-2 ring-orange-500/50 text-orange-400" : ""}
            `}
          >
            <FaBell size={16} />
            <span className="absolute top-2 right-2.5 h-2 w-2 rounded-full bg-orange-500"></span>
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-3 w-80 rounded-2xl bg-[#111827] shadow-2xl overflow-hidden z-50 border border-white/10">
              <div className="px-4 py-3 border-b border-white/10 flex justify-between items-center">
                <h3 className="font-semibold text-white">Notifications</h3>
                <span className="text-xs bg-orange-500 text-white px-2 py-0.5 rounded-full">
                  2 New
                </span>
              </div>

              <div className="max-h-72 overflow-y-auto">
                <div className="px-4 py-3 hover:bg-white/5 cursor-pointer border-b border-white/5 flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-orange-500"></div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      New order #1024 received
                    </p>
                    <p className="text-xs text-gray-400 mt-1">2 mins ago</p>
                  </div>
                </div>

                <div className="px-4 py-3 hover:bg-white/5 cursor-pointer flex gap-3">
                  <div className="mt-1 h-2 w-2 rounded-full bg-orange-500"></div>
                  <div>
                    <p className="text-sm text-white font-medium">
                      Stock alert for Fresh Apples
                    </p>
                    <p className="text-xs text-gray-400 mt-1">1 hour ago</p>
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
              bg-[var(--card-bg)] p-1 pr-4 rounded-full 
              border border-[var(--border-soft)] 
              transition-all duration-300
              hover:border-orange-500/50
              ${showProfile ? "ring-2 ring-orange-500/50 border-orange-500/50" : ""}
            `}
          >
            <img
              src="https://i.pravatar.cc/150?img=11"
              alt="User"
              className="w-8 h-8 rounded-full object-cover border border-orange-500/50"
            />

            <div className="hidden sm:block text-left">
              <p className="text-sm font-bold text-[var(--text-primary)] leading-none">
                Admin User
              </p>
              <p className="text-[10px] text-[var(--text-secondary)] mt-0.5 uppercase tracking-wider">
                Store Manager
              </p>
            </div>
          </div>

          {showProfile && (
            <div className="absolute right-0 mt-3 w-56 rounded-2xl bg-[#111827] shadow-2xl overflow-hidden z-50 border border-white/10">
              <div className="px-4 py-3 border-b border-white/10 text-center">
                <img
                  src="https://i.pravatar.cc/150?img=11"
                  alt="User"
                  className="w-16 h-16 rounded-full object-cover border-2 border-orange-500 mx-auto mb-2"
                />

                <p className="text-sm font-bold text-white">Admin User</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  admin@bkgrocery.com
                </p>
              </div>

              <div className="py-1">
                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-orange-400 hover:bg-white/5">
                  <FaUser className="text-lg" /> My Profile
                </button>

                <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-orange-400 hover:bg-white/5">
                  <FaCog className="text-lg" /> Account Settings
                </button>
              </div>

              <div className="border-t border-white/10 bg-red-500/5">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 font-medium"
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