import React, { useEffect, useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { verifyAdminOtpApi, saveAdminAuth } from "../../api/admin.api";
import { showLoader, hideLoader } from "../../redux/slices/loaderSlice";
import { showSuccess, showError, forceClearAlerts } from "../../utils/alertService"; // 🔥 Import kiya helper

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // 🚨 ABSOLUTE CLEANUP GUARD: This will kill the lingering modal instantly on mount
  useEffect(() => {
    forceClearAlerts();
  }, []);

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("adminEmail");

    if (!email) {
      showError("Email not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);
      dispatch(showLoader());

      const payload = {
        email,
        otp,
      };

      const response = await verifyAdminOtpApi(payload);
      console.log("VERIFY OTP RESPONSE 👉", response);

      if (response?.success) {
        const token = saveAdminAuth(response);

        if (!token) {
          dispatch(hideLoader());
          showError("OTP verified but token not received from backend.");
          return;
        }

        localStorage.setItem("isAdminLogin", "true");
        localStorage.removeItem("adminOtp");

        dispatch(hideLoader());

        showSuccess(response?.message || "OTP verified successfully").then(() => {
          forceClearAlerts(); // Kill active success alert
          navigate("/dashboard");
        });

      } else {
        dispatch(hideLoader());
        showError(response?.message || "Invalid OTP");
      }
    } catch (error) {
      console.log("VERIFY OTP ERROR 👉", error);
      dispatch(hideLoader());
      showError("Something went wrong while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-100 via-slate-50 to-orange-50/30 px-4 font-sans overflow-y-auto">
  <div className="min-h-screen flex items-start lg:items-center justify-center py-6 lg:py-8">
      
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-[120px]" />

     <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-[0_25px_60px_-15px_rgba(15,23,42,0.1)] border border-slate-200/80 p-6 sm:p-8 lg:p-10">
        
        <div className="text-center mb-8">
          <div className="h-16 flex items-center justify-center mb-5">
            <img 
              src="/logo.png" 
              alt="logo" 
              className="h-37 w-40 transition-transform hover:scale-105 duration-300" 
            />
          </div>

          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-400 flex items-center justify-center text-white shadow-md shadow-orange-500/10">
            <FaShieldAlt size={22} />
          </div>

          <h2 className="mt-5 text-[24px] font-extrabold text-slate-800 tracking-tight">
            Verify Security OTP
          </h2>

          <p className="text-slate-400 mt-1.5 text-xs font-medium">
            Enter 6-digit code sent to{" "}
            <span className="font-bold text-slate-600 block mt-0.5">
              {localStorage.getItem("adminEmail") || "registered device"}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-500 mb-2 block uppercase tracking-wider text-center">
              Verification Code
            </label>

            <input
              type="text"
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full h-12 rounded-xl bg-slate-50/60 border border-slate-200 px-4 text-center text-lg tracking-[8px] font-black text-slate-800 outline-none focus:border-orange-400 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all shadow-sm"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-3d btn-gradient-orange w-full h-12 rounded-xl text-white text-sm font-extrabold tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md"
          >
            {loading ? "Verifying Credentials..." : "Access Dashboard"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-xs font-bold text-slate-400 hover:text-orange-500 transition-colors cursor-pointer text-center block mt-2"
          >
            Back to Login
          </button>

          {localStorage.getItem("adminOtp") && (
            <div className="mt-4 p-3.5 bg-orange-50 border border-orange-200/60 rounded-xl text-center shadow-inner-sm">
              <p className="text-xs text-slate-500 font-bold tracking-wide">
                🛠️ Your OTP:{" "}
                <span className="font-black text-orange-600 bg-orange-100/80 px-2.5 py-0.5 rounded-lg tracking-widest text-sm shadow-sm border border-orange-200/40 ml-1">
                  {localStorage.getItem("adminOtp")}
                </span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
    </div>
  );
};

export default VerifyOTP;