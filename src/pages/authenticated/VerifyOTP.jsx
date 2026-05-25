import React, { useState } from "react";
import { FaShieldAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { verifyAdminOtpApi, saveAdminAuth } from "../../api/admin.api";

const VerifyOTP = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    const email = localStorage.getItem("adminEmail");

    if (!email) {
      alert("Email not found. Please login again.");
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        email,
        otp,
      };

      const response = await verifyAdminOtpApi(payload);
      console.log("VERIFY OTP RESPONSE 👉", response);

      if (response?.success) {
        const token = saveAdminAuth(response);

        if (!token) {
          alert("OTP verified but token not received from backend.");
          return;
        }

        localStorage.setItem("isAdminLogin", "true");
        localStorage.removeItem("adminOtp");

        alert(response?.message || "OTP verified successfully");
        navigate("/dashboard");
      } else {
        alert(response?.message || "Invalid OTP");
      }
    } catch (error) {
      console.log("VERIFY OTP ERROR 👉", error);
      alert("Something went wrong while verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#030604] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary-green)]/10 rounded-full blur-[120px] animate-ambient-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary-orange)]/10 rounded-full blur-[120px] animate-ambient-slow" style={{ animationDelay: '-4s' }} />

      <div className="relative w-full max-w-md bg-white/[0.02] backdrop-blur-xl rounded-[32px] shadow-2xl border border-white/[0.04] p-8 sm:p-10">
        <div className="text-center mb-8">
          <div className="h-16 flex items-center justify-center mb-6">
            <img src="/logo.png" alt="logo" className="h-14 object-contain animate-premium-float" />
          </div>

          <div className="mx-auto h-14 w-14 rounded-2xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)] flex items-center justify-center text-white shadow-lg shadow-orange-500/20">
            <FaShieldAlt size={22} />
          </div>

          <h2 className="mt-5 text-2xl font-bold text-white tracking-wide">
            Verify Security OTP
          </h2>

          <p className="text-slate-500 mt-2 text-xs">
            Enter 6-digit code sent to{" "}
            <span className="font-semibold text-slate-300 block mt-0.5">
              {localStorage.getItem("adminEmail")}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-6">
          <div>
            <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider text-center">
              Verification Code
            </label>

            <input
              type="text"
              placeholder="000 000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full h-12 rounded-xl bg-white/[0.02] border border-white/5 px-4 text-center text-lg tracking-[8px] font-bold text-white outline-none focus:border-[var(--primary-orange)]/50 focus:bg-white/[0.04] transition-all"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-xl btn-gradient-orange text-white text-sm font-bold tracking-wide cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.01]"
          >
            {loading ? "Verifying Credentials..." : "Access Dashboard"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-xs font-semibold text-slate-500 hover:text-[var(--primary-orange)] transition-colors cursor-pointer"
          >
            Back to Login
          </button>

          {localStorage.getItem("adminOtp") && (
            <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-xl text-center">
              <p className="text-xs text-slate-400">
                Testing OTP:{" "}
                <span className="font-extrabold text-[var(--primary-orange-light)] tracking-widest text-sm">
                  {localStorage.getItem("adminOtp")}
                </span>
              </p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;