// src/pages/Login.jsx

import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLocalGroceryStore } from "react-icons/md";
import { GiCarrot, GiTomato, GiBreadSlice } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLoginApi } from "../api/admin.api";
import { showLoader, hideLoader } from "../redux/slices/loaderSlice";
import { showOtpSentAlert, showError } from "../utils/alertService";
import Swal from "sweetalert2";
import { MainContent } from "../constants/mainContent";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [receivedOtp, setReceivedOtp] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = { email, password };

    try {
      dispatch(showLoader());
      const response = await adminLoginApi(payload);

      if (response?.success) {
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminOtp", response?.otp);
        setReceivedOtp(response?.otp);

        dispatch(hideLoader());

        showOtpSentAlert().then(() => {
          Swal.close();
          navigate("/verify-otp");
        });
      } else {
        dispatch(hideLoader());
        showError(response?.message || "Login failed");
      }
    } catch (error) {
      dispatch(hideLoader());
      showError(error?.message || "Something went wrong during login");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fefcf6] flex items-center justify-center px-4 py-8 relative overflow-x-hidden overflow-y-auto font-sans">

      {/* AMBIENT BACKGROUND GLOW — warm citrus tones matching the logo */}
      <div className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary-orange)]/[0.10] rounded-full blur-[120px]" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary-green)]/[0.10] rounded-full blur-[120px]" />

      <div className="relative w-full max-w-[1000px] my-auto bg-[var(--card-bg)] rounded-[28px] border border-slate-200 border-b-[6px] border-b-[var(--border-3d)] shadow-[0_24px_60px_rgba(15,23,42,0.10)] overflow-hidden grid lg:grid-cols-[1.05fr_1fr]">

        {/* ===================== BRAND PANEL ===================== */}
        <div
          className="
            relative overflow-hidden
            bg-gradient-to-br from-[#fff6e0] via-[#fef0d9] to-[#f3ead0]
            border-b border-orange-100 lg:border-b-0 lg:border-r
            flex flex-col justify-between
            p-6 sm:p-8 lg:p-12
          "
        >
          {/* citrus glow accents */}
          <div className="absolute -right-16 -top-16 w-56 h-56 bg-[var(--primary-orange)]/15 rounded-full blur-[80px]" />
          <div className="absolute left-[-10%] bottom-[-15%] w-64 h-64 bg-[var(--primary-green)]/15 rounded-full blur-[90px]" />

          <div className="relative">
            {/* LOGO — hero element, large and centered to top */}
            <img
              src={MainContent.logo}
              alt="BK Grocery"
  className="h-24 sm:h-38 lg:h-44 w-auto object-contain drop-shadow-[0_4px_10px_rgba(242,122,26,0.25)] mx-auto"
            />

            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-white border border-orange-200 text-[var(--primary-orange-dark)] rounded-full text-[10px] sm:text-xs font-black tracking-wider mt-6 lg:mt-8 shadow-sm">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--primary-green)] opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 sm:h-2 sm:w-2 bg-[var(--primary-green)]" />
              </span>
              ADMIN CONSOLE
            </div>

            <h1 className="mt-4 lg:mt-6 text-2xl sm:text-3xl lg:text-[2.3rem] font-black text-slate-800 leading-[1.15] tracking-tight">
              Fresh stock, <br className="hidden sm:block" />
              <span className="bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-green)] bg-clip-text text-transparent">
                fully managed
              </span>
            </h1>

            <p className="mt-3 lg:mt-4 text-slate-500 text-[13px] sm:text-sm leading-relaxed max-w-sm font-semibold hidden sm:block">
              Approve listings, dispatch drivers, and keep every store shelf stocked — all from one console.
            </p>
          </div>

          {/* OPS STRIP */}
          <div className="relative grid grid-cols-3 gap-2 sm:gap-3 mt-6 lg:mt-10">
            <div className="bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-100">
              <p className="text-[var(--primary-orange-dark)] font-black text-base sm:text-xl leading-none">
                48
              </p>
              <p className="text-slate-500 text-[9px] sm:text-[11px] mt-1.5 font-bold leading-tight">
                Stores live
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-100">
              <p className="text-[var(--primary-orange-dark)] font-black text-base sm:text-xl leading-none">
                1.2k
              </p>
              <p className="text-slate-500 text-[9px] sm:text-[11px] mt-1.5 font-bold leading-tight">
                Orders today
              </p>
            </div>
            <div className="bg-white/70 backdrop-blur-md rounded-xl sm:rounded-2xl p-3 sm:p-4 border border-orange-100">
              <p className="text-[var(--primary-orange-dark)] font-black text-base sm:text-xl leading-none">
                6
              </p>
              <p className="text-slate-500 text-[9px] sm:text-[11px] mt-1.5 font-bold leading-tight">
                Pending approvals
              </p>
            </div>
          </div>

          {/* PRODUCE STRIP — desktop only, ties directly to the logo's basket illustration */}
          <div className="relative hidden lg:flex items-center gap-4 bg-white/70 backdrop-blur-md rounded-2xl p-5 border border-orange-100 mt-8">
            <div className="flex items-center -space-x-2 shrink-0">
              <div className="w-9 h-9 rounded-full bg-red-100 border-2 border-white flex items-center justify-center shadow-sm">
                <GiTomato className="text-red-500 text-base" />
              </div>
              <div className="w-9 h-9 rounded-full bg-orange-100 border-2 border-white flex items-center justify-center shadow-sm">
                <GiCarrot className="text-[var(--primary-orange)] text-base" />
              </div>
              <div className="w-9 h-9 rounded-full bg-amber-100 border-2 border-white flex items-center justify-center shadow-sm">
                <GiBreadSlice className="text-amber-700 text-base" />
              </div>
            </div>
            <div>
              <p className="text-slate-700 font-black text-sm tracking-wide leading-tight">
                Every aisle, tracked live
              </p>
              <p className="text-slate-500 text-xs mt-0.5 font-bold leading-relaxed">
                Inventory updates the moment stock moves.
              </p>
            </div>
          </div>
        </div>

        {/* ===================== LOGIN FORM PANEL ===================== */}
        <div className="flex items-center justify-center p-6 sm:p-10 lg:p-14 bg-[var(--card-bg)]">
          <div className="w-full max-w-sm">

            <div className="text-center mb-7 sm:mb-9">
              <div className="lg:hidden h-12 sm:h-14 flex items-center justify-center mb-5">
               {/* <div className="lg:hidden h-12 sm:h-14 flex items-center justify-center mb-5">
  {/* <img
    src={MainContent.logo}
    alt="BK Grocery logo"
    className="h-12 sm:h-14 w-auto object-contain"
  /> */}
{/* </div>  */}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-tight">
                Sign in to the console
              </h2>

              <p className="text-slate-400 mt-1.5 text-[11px] sm:text-xs font-black tracking-wide uppercase">
                Admin access only
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-wider">
                  Email address
                </label>

                <div className="h-12 w-full input-3d flex items-center px-4 gap-3 focus-within:border-[var(--primary-orange)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--primary-orange)]/15 transition-all">
                  <FaEnvelope className="text-slate-400 text-sm shrink-0" />
                  <input
                    type="email"
                    placeholder="admin@bkgrocery.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-[13px] text-slate-800 placeholder-slate-400 font-extrabold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-black text-slate-500 mb-2 block uppercase tracking-wider">
                  Password
                </label>

                <div className="h-12 w-full input-3d flex items-center px-4 gap-3 focus-within:border-[var(--primary-orange)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[var(--primary-orange)]/15 transition-all">
                  <FaLock className="text-slate-400 text-sm shrink-0" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-[13px] text-slate-800 placeholder-slate-400 font-extrabold tracking-widest"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-700 transition-colors cursor-pointer p-1"
                  >
                    {showPassword ? <FaEyeSlash size={15} /> : <FaEye size={15} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn-3d btn-orange w-full h-12 text-sm font-black tracking-wide mt-2"
              >
                Send verification OTP
              </button>

              {receivedOtp && (
                <div className="mt-4 p-3.5 bg-[var(--primary-orange)]/10 border border-[var(--primary-orange)]/40 border-b-4 border-b-[var(--primary-orange)]/60 rounded-2xl text-center">
                  <p className="text-xs text-slate-600 font-black tracking-wide flex items-center justify-center gap-1.5 flex-wrap">
                    <span>OTP mode:</span>
                    <span className="font-black text-slate-900 bg-[var(--primary-orange)]/15 px-2.5 py-0.5 rounded-lg tracking-widest text-sm border border-[var(--primary-orange)]/40">
                      {receivedOtp}
                    </span>
                  </p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;