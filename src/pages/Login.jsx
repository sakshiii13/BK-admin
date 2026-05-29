import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLocalGroceryStore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { adminLoginApi } from "../api/admin.api";
import { showLoader, hideLoader } from "../redux/slices/loaderSlice";
import { showOtpSentAlert, showError } from "../utils/alertService"; 
import Swal from "sweetalert2";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [receivedOtp, setReceivedOtp] = useState(""); 

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    try {
      dispatch(showLoader());
      const response = await adminLoginApi(payload);

      if (response?.success) {
        localStorage.setItem("adminEmail", email);
        localStorage.setItem("adminOtp", response?.otp);
        setReceivedOtp(response?.otp); 

        dispatch(hideLoader());

        // 🔥 CRITICAL FIX: explicit promise resolution logic
        showOtpSentAlert().then(() => {
          Swal.close(); // Force kill modal overlay context before unmounting
          navigate("/verify-otp"); // Now change page flawlessly
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
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/30 flex items-center justify-center px-4 relative overflow-hidden font-sans">
      
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-green-500/5 rounded-full blur-[130px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[130px]" />

      <div className="relative w-full max-w-[1000px] min-h-[620px] bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.1)] overflow-hidden grid lg:grid-cols-2 border border-slate-200/80">
        
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-slate-900 via-slate-950 to-emerald-950 relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-orange-500/10 rounded-full blur-3xl" />
          <div className="absolute left-[-10%] bottom-[-10%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.04] border border-white/10 text-slate-300 rounded-full text-xs font-bold tracking-wider backdrop-blur-md shadow-sm">
              <MdLocalGroceryStore className="text-orange-400 text-sm" />
              BK GROCERY ADMIN
            </div>

            <h1 className="mt-14 text-4xl font-extrabold text-white leading-[1.25] tracking-tight">
              Manage Your <br />
              <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-emerald-400 bg-clip-text text-transparent font-black">
                Grocery Hub
              </span>
            </h1>

            <p className="mt-4 text-slate-400 text-[14px] leading-relaxed max-w-sm font-medium">
              Smart administrative ecosystem optimized for live product metrics, rapid category assignments, and intelligent order dispatch tracking.
            </p>
          </div>

          <div className="bg-white/[0.03] backdrop-blur-md rounded-2xl p-5 border border-white/10 relative group shadow-inner transition-all duration-300">
            <p className="text-white font-bold text-base tracking-wide flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              Realtime Architecture
            </p>
            <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
              Equipped with live inventory syncing, lightning fast push notifications, and adaptive logistics dashboards.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-center p-8 sm:p-14 bg-white">
          <div className="w-full max-w-sm">
            
            <div className="text-center mb-9">
              <div className="h-16 flex items-center justify-center mb-3">
                <img 
                  src="/logo.png" 
                  alt="logo" 
                  className="h-14 object-contain drop-shadow-sm transition-transform hover:scale-105 duration-300" 
                />
              </div>

              <h2 className="text-[26px] font-extrabold text-slate-800 tracking-tight">
                Welcome Back
              </h2>

              <p className="text-slate-400 mt-1 text-xs font-bold tracking-wide">
                ENTER CREDENTIALS TO SECURE WORKSPACE
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Email Address
                </label>

                <div className="h-12 rounded-xl bg-slate-50/60 border border-slate-200 flex items-center px-4 gap-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/5 transition-all shadow-sm">
                  <FaEnvelope className="text-slate-400 text-sm shrink-0" />

                  <input
                    type="email"
                    placeholder="admin@bkgrocery.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-[13px] text-slate-800 placeholder-slate-400 font-bold"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider">
                  Password
                </label>

                <div className="h-12 rounded-xl bg-slate-50/60 border border-slate-200 flex items-center px-4 gap-3 focus-within:border-orange-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-500/5 transition-all shadow-sm">
                  <FaLock className="text-slate-400 text-sm shrink-0" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-[13px] text-slate-800 placeholder-slate-400 font-bold tracking-widest"
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
                className="btn-3d btn-gradient-orange w-full h-12 rounded-xl text-white text-sm font-extrabold tracking-wide cursor-pointer transition-all flex items-center justify-center shadow-md mt-2"
              >
                Send Verification OTP
              </button>

              {receivedOtp && (
                <div className="mt-4 p-3.5 bg-orange-50 border border-orange-200/60 rounded-xl text-center shadow-inner-sm transform transition-all animate-bounce-short">
                  <p className="text-xs text-slate-500 font-bold tracking-wide">
                    🛠️ Testing OTP Mode active:{" "}
                    <span className="font-black text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-lg tracking-widest text-sm shadow-sm border border-orange-200/40 ml-1">
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