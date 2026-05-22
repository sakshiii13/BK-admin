import React, { useState } from "react";
import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { MdLocalGroceryStore } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { adminLoginApi } from "../api/admin.api";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      email,
      password,
    };

    const response = await adminLoginApi(payload);

    if (response?.success) {
      localStorage.setItem("adminEmail", email);

      // testing ke liye, kyunki API response me OTP aa raha hai
      localStorage.setItem("adminOtp", response?.otp);

      alert(response?.message || "OTP sent successfully");

      navigate("/verify-otp");
    } else {
      alert(response?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f7fbf1] flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-[-120px] left-[-120px] w-[350px] h-[350px] bg-green-300/40 rounded-full blur-3xl" />
      <div className="absolute bottom-[-130px] right-[-100px] w-[420px] h-[420px] bg-orange-300/40 rounded-full blur-3xl" />

      <div className="relative w-full max-w-[1050px] min-h-[620px] bg-white/80 backdrop-blur-2xl rounded-[36px] shadow-[0_25px_80px_rgba(36,80,35,0.18)] overflow-hidden grid lg:grid-cols-2 border border-white">
        <div className="hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-[#0f7a38] via-[#57b72f] to-[#ffb11f] relative overflow-hidden">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 text-white rounded-full text-sm font-semibold">
              <MdLocalGroceryStore />
              Grocery Admin
            </div>

            <h1 className="mt-10 text-5xl font-black text-white leading-tight">
              Manage Your <br />
              Grocery Store
            </h1>

            <p className="mt-5 text-white/85 text-base max-w-sm">
              Smart admin dashboard for products, orders and customers.
            </p>
          </div>

          <div className="bg-white/20 rounded-[28px] p-5 border border-white/20">
            <p className="text-white font-semibold text-lg">
              Fresh Grocery Dashboard
            </p>
            <p className="text-white/70 text-sm mt-2">Easy. Fast. Modern.</p>
          </div>
        </div>

        <div className="flex items-center justify-center p-6 sm:p-10">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <img src="/logo.png" alt="logo" className="w-40 mx-auto" />

              <h2 className="mt-6 text-3xl font-black text-[#173b20]">
                Welcome Back
              </h2>

              <p className="text-[#6b7d68] mt-2 text-sm">
                Login to continue
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-sm font-bold text-[#263f27] mb-2 block">
                  Email Address
                </label>

                <div className="h-14 rounded-2xl bg-[#f3f8ee] border border-green-100 flex items-center px-4 gap-3">
                  <FaEnvelope className="text-[#67b737]" />

                  <input
                    type="email"
                    placeholder="admin@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-bold text-[#263f27] mb-2 block">
                  Password
                </label>

                <div className="h-14 rounded-2xl bg-[#f3f8ee] border border-green-100 flex items-center px-4 gap-3">
                  <FaLock className="text-[#67b737]" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#7c8f76]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-14 rounded-2xl bg-gradient-to-r from-[#69bd2e] via-[#f6b51e] to-[#ff8a00] text-white font-black hover:scale-[1.02] transition-all"
              >
                Login
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
      </div>
    </div>
  );
};

export default Login;