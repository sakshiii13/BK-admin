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
    <div className="min-h-screen w-full bg-[#030604] flex items-center justify-center px-4 relative overflow-hidden font-sans">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-[var(--primary-green)]/10 rounded-full blur-[120px] animate-ambient-slow" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-[var(--primary-orange)]/10 rounded-full blur-[120px] animate-ambient-slow" style={{ animationDelay: '-4s' }} />

      <div className="relative w-full max-w-[1000px] min-h-[600px] bg-white/[0.02] backdrop-blur-xl rounded-[32px] shadow-2xl overflow-hidden grid lg:grid-cols-2 border border-white/[0.04]">
        
        {/* Left Side Branding */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-[#0b1710] via-[#091b10] to-[#121c11] relative overflow-hidden border-r border-white/[0.02]">
          {/* Visual gradient overlay line */}
          <div className="absolute top-0 right-0 w-[2px] h-full bg-gradient-to-b from-[var(--primary-orange)] via-[var(--primary-green-light)] to-transparent opacity-30" />
          
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/[0.03] border border-white/5 text-slate-300 rounded-full text-xs font-semibold tracking-wider">
              <MdLocalGroceryStore className="text-[var(--primary-orange)]" />
              BK GROCERY ADMIN
            </div>

            <h1 className="mt-12 text-4xl font-extrabold text-white leading-tight tracking-tight">
              Manage Your <br />
              <span className="gradient-text-orange-green font-black">Grocery Store</span>
            </h1>

            <p className="mt-4 text-slate-400 text-sm leading-relaxed max-w-xs">
              Smart admin dashboard for products, category parameters, and customer order management.
            </p>
          </div>

          <div className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 relative group hover:border-[var(--primary-green)]/20 transition-all duration-300">
            <div className="absolute -top-10 -right-10 w-24 h-24 bg-[var(--primary-green)]/10 rounded-full blur-xl group-hover:bg-[var(--primary-green)]/20 transition-all" />
            <p className="text-white font-bold text-base tracking-wide">
              Fresh Store Management
            </p>
            <p className="text-slate-500 text-xs mt-1.5 leading-relaxed">
              Realtime stock tracking, order notifications, and route planning.
            </p>
          </div>
        </div>

        {/* Right Side Form */}
        <div className="flex items-center justify-center p-8 sm:p-12">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8">
              <div className="h-16 flex items-center justify-center mb-4">
                <img src="/logo.png" alt="logo" className="h-14 object-contain animate-premium-float" />
              </div>

              <h2 className="text-2xl font-bold text-white tracking-wide">
                Welcome Back
              </h2>

              <p className="text-slate-500 mt-1.5 text-xs">
                Login to access administrative workspace
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">
                  Email Address
                </label>

                <div className="h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center px-4 gap-3 focus-within:border-[var(--primary-orange)]/50 focus-within:bg-white/[0.04] transition-all">
                  <FaEnvelope className="text-slate-500 text-sm shrink-0" />

                  <input
                    type="email"
                    placeholder="admin@bkgrocery.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs text-white placeholder-slate-600"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-400 mb-2 block uppercase tracking-wider">
                  Password
                </label>

                <div className="h-12 rounded-xl bg-white/[0.02] border border-white/5 flex items-center px-4 gap-3 focus-within:border-[var(--primary-orange)]/50 focus-within:bg-white/[0.04] transition-all">
                  <FaLock className="text-slate-500 text-sm shrink-0" />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-transparent outline-none text-xs text-white placeholder-slate-600"
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                  >
                    {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full h-12 rounded-xl btn-gradient-orange text-white text-sm font-bold tracking-wide cursor-pointer transition-all hover:scale-[1.01]"
              >
                Send Verification OTP
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
      </div>
    </div>
  );
};

export default Login;