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
    <div className="min-h-screen w-full bg-[#f7fbf1] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-green-300/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-130px] right-[-100px] w-[420px] h-[420px] bg-orange-300/40 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md bg-white/90 backdrop-blur-2xl rounded-[34px] shadow-[0_25px_80px_rgba(36,80,35,0.18)] border border-white p-8">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="logo" className="w-36 mx-auto mb-5" />

          <div className="mx-auto h-16 w-16 rounded-3xl bg-gradient-to-r from-[#69bd2e] to-[#ff8a00] flex items-center justify-center text-white shadow-lg">
            <FaShieldAlt size={28} />
          </div>

          <h2 className="mt-6 text-3xl font-black text-[#173b20]">
            Verify OTP
          </h2>

          <p className="text-[#6b7d68] mt-2 text-sm">
            OTP sent to{" "}
            <span className="font-bold text-[#173b20]">
              {localStorage.getItem("adminEmail")}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerifyOtp} className="space-y-5">
          <div>
            <label className="text-sm font-bold text-[#263f27] mb-2 block">
              Enter OTP
            </label>

            <input
              type="text"
              placeholder="0000"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
              className="w-full h-14 rounded-2xl bg-[#f3f8ee] border border-green-100 px-4 text-center text-xl tracking-[8px] font-bold outline-none focus:border-orange-400"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#69bd2e] via-[#f6b51e] to-[#ff8a00] text-white font-black hover:scale-[1.02] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full text-sm font-semibold text-[#6b7d68] hover:text-orange-500"
          >
            Back to Login
          </button>

          {localStorage.getItem("adminOtp") && (
            <p className="text-center text-sm text-[#6b7d68]">
              Testing OTP:{" "}
              <span className="font-bold text-orange-500">
                {localStorage.getItem("adminOtp")}
              </span>
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

export default VerifyOTP;