import Swal from "sweetalert2";

// Global helper to instantly clear any stuck overlays anywhere in the app lifecycle
export const forceClearAlerts = () => {
  Swal.close();
  // Safe operational backup to completely scrub SweetAlert artifacts from DOM
  const backdrops = document.querySelectorAll(".swal2-container");
  backdrops.forEach((el) => el.remove());
  document.body.classList.remove("swal2-shown", "swal2-height-auto");
};

// Common configuration properties for crisp 3D light theme
const commonLightConfig = {
  background: "#ffffff",
  backdrop: "rgba(15, 23, 42, 0.22)", 
  buttonsStyling: false,
};

// Injecting Custom Liquid Animations directly into the document
if (typeof window !== "undefined") {
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes premiumScaleUp {
      0% { transform: scale(0.6) rotate(-15deg); opacity: 0; }
      70% { transform: scale(1.05) rotate(2deg); opacity: 0.9; }
      100% { transform: scale(1) rotate(0deg); opacity: 1; }
    }
    @keyframes circleDraw {
      0% { stroke-dashoffset: 260; transform: rotate(-90deg); transform-origin: center; }
      100% { stroke-dashoffset: 0; transform: rotate(0deg); transform-origin: center; }
    }
    @keyframes checkDraw {
      0% { stroke-dashoffset: 50; }
      100% { stroke-dashoffset: 0; }
    }
    @keyframes crossDraw {
      0% { stroke-dashoffset: 40; }
      100% { stroke-dashoffset: 0; }
    }
    .premium-popup-anim {
      animation: premiumScaleUp 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards !important;
    }
    .animate-circle {
      stroke-dasharray: 260;
      stroke-dashoffset: 260;
      animation: circleDraw 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }
    .animate-check {
      stroke-dasharray: 50;
      stroke-dashoffset: 50;
      animation: checkDraw 0.45s cubic-bezier(0.4, 0, 0.2, 1) 0.4s forwards;
    }
    .animate-cross {
      stroke-dasharray: 40;
      stroke-dashoffset: 40;
      animation: crossDraw 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.35s forwards;
    }
  `;
  document.head.appendChild(style);
}

// 1. OTP SENT AUTO-DISMISS POPUP (Exact 1.111s lifecycle)
export const showOtpSentAlert = () => {
  forceClearAlerts(); // Clean slate check before launching
  return Swal.fire({
    ...commonLightConfig,
    html: `
      <div style="padding: 16px 4px;">
        <div style="width: 100px; height: 100px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="otpSuccessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f37023" />
                <stop offset="100%" stop-color="#f7941d" />
              </linearGradient>
            </defs>
            <circle class="animate-circle" cx="45" cy="45" r="38" stroke="url(#otpSuccessGrad)" stroke-width="5" stroke-linecap="round" />
            <path class="animate-check" d="M30 46.5L40 56.5L61 34.5" stroke="url(#otpSuccessGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 900; margin-bottom: 8px; font-family: 'Outfit', sans-serif; letter-spacing: -0.02em;">
          OTP Sent Successfully
        </h2>
        <p style="color: #64748b; font-size: 14.5px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;">
          Please check your Email.
        </p>
      </div>
    `,
    showConfirmButton: false, 
    timer: 1111, 
    timerProgressBar: false,
    customClass: {
      popup: "rounded-[32px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.1)] bg-white p-6 premium-popup-anim",
    },
  });
};

// 2. LOGIN SUCCESS AUTO-DISMISS POPUP
export const showLoginSuccessAlert = () => {
  forceClearAlerts();
  return Swal.fire({
    ...commonLightConfig,
    html: `
      <div style="padding: 16px 4px;">
        <div style="width: 100px; height: 100px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="loginSuccessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#10b981" />
                <stop offset="100%" stop-color="#34d399" />
              </linearGradient>
            </defs>
            <circle class="animate-circle" cx="45" cy="45" r="38" stroke="url(#loginSuccessGrad)" stroke-width="5" stroke-linecap="round" />
            <path class="animate-check" d="M30 46.5L40 56.5L61 34.5" stroke="url(#loginSuccessGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h2 style="color: #1e293b; font-size: 24px; font-weight: 900; margin-bottom: 8px; font-family: 'Outfit', sans-serif; letter-spacing: -0.02em;">
          Welcome Back!
        </h2>
        <p style="color: #64748b; font-size: 14.5px; font-family: 'Plus Jakarta Sans', sans-serif; font-weight: 500;">
          Successfully logged into dashboard.
        </p>
      </div>
    `,
    showConfirmButton: false, 
    timer: 1111, 
    timerProgressBar: false,
    customClass: {
      popup: "rounded-[32px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.1)] bg-white p-6 premium-popup-anim",
    },
  });
};

// 3. CRITICAL ERROR HANDLING FUNCTION 
export const showError = (message) => {
  forceClearAlerts();
  return Swal.fire({
    ...commonLightConfig,
    html: `
      <div style="padding: 12px 4px;">
        <div style="width: 100px; height: 100px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="errorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#ef4444" />
                <stop offset="100%" stop-color="#f87171" />
              </linearGradient>
            </defs>
            <circle class="animate-circle" cx="45" cy="45" r="38" stroke="url(#errorGrad)" stroke-width="5" stroke-linecap="round" />
            <path class="animate-cross" d="M33 33L57 57" stroke="url(#errorGrad)" stroke-width="6" stroke-linecap="round" />
            <path class="animate-cross" d="M57 33L33 57" stroke="url(#errorGrad)" stroke-width="6" stroke-linecap="round" />
          </svg>
        </div>
        <h2 style="color: #1e293b; font-size: 25px; font-weight: 900; margin-bottom: 10px; font-family: 'Outfit', sans-serif;">System Halt</h2>
        <p style="color: #64748b; font-size: 14.5px; line-height: 22px; font-family: 'Plus Jakarta Sans', sans-serif; max-width: 290px; margin: 0 auto;">${message}</p>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Dismiss Alert",
    customClass: {
      popup: "rounded-[32px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.1)] bg-white p-6 premium-popup-anim",
      confirmButton: "rounded-2xl bg-slate-800 px-8 py-3.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(30,41,59,0.15)] hover:bg-slate-700 transition-all duration-300 cursor-pointer tracking-wide uppercase border-b-4 border-slate-900 active:border-b-0 active:mt-1 mt-3",
    },
  });
};

// 4. STANDARD SUCCESS OVERLAY WITH BUTTON
export const showSuccess = (message) => {
  forceClearAlerts();
  return Swal.fire({
    ...commonLightConfig,
    html: `
      <div style="padding: 12px 4px;">
        <div style="width: 100px; height: 100px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="stdSuccessGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#f37023" />
                <stop offset="100%" stop-color="#f7941d" />
              </linearGradient>
            </defs>
            <circle class="animate-circle" cx="45" cy="45" r="38" stroke="url(#stdSuccessGrad)" stroke-width="5" stroke-linecap="round" />
            <path class="animate-check" d="M30 46.5L40 56.5L61 34.5" stroke="url(#stdSuccessGrad)" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </div>
        <h2 style="color: #1e293b; font-size: 25px; font-weight: 900; margin-bottom: 10px; font-family: 'Outfit', sans-serif;">Action Successful</h2>
        <p style="color: #64748b; font-size: 14.5px; line-height: 22px; font-family: 'Plus Jakarta Sans', sans-serif; max-width: 290px; margin: 0 auto;">${message}</p>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Great, Got It ✨",
    customClass: {
      popup: "rounded-[32px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.1)] bg-white p-6 premium-popup-anim",
      confirmButton: "rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-3.5 text-xs font-black text-white shadow-[0_8px_20px_rgba(243,112,35,0.25)] hover:opacity-95 transition-all duration-300 cursor-pointer tracking-wide uppercase border-b-4 border-orange-600 active:border-b-0 active:mt-1 mt-3",
    },
  });
};

// 5. STANDARD CONFIRMATION POPUP WITH ACTIONS
export const showConfirm = ({ title = "Are you sure?", text = "This action cannot be undone.", confirmButtonText = "Yes, Proceed" }) => {
  forceClearAlerts();
  return Swal.fire({
    ...commonLightConfig,
    html: `
      <div style="padding: 12px 4px;">
        <div style="width: 100px; height: 100px; margin: 0 auto 24px; display: flex; align-items: center; justify-content: center;">
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle class="animate-circle" cx="45" cy="45" r="38" stroke="#64748b" stroke-width="5" stroke-linecap="round" />
            <path class="animate-cross" d="M45 28V50" stroke="#64748b" stroke-width="6" stroke-linecap="round" />
            <circle cx="45" cy="62" r="3.5" fill="#64748b" />
          </svg>
        </div>
        <h2 style="color: #1e293b; font-size: 23px; font-weight: 900; margin-bottom: 10px; font-family: 'Outfit', sans-serif;">${title}</h2>
        <p style="color: #64748b; font-size: 14px; line-height: 22px; font-family: 'Plus Jakarta Sans', sans-serif;">${text}</p>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-[32px] border border-slate-100 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.1)] bg-white p-6 premium-popup-anim",
      confirmButton: "rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-3.5 text-xs font-black text-white shadow-md hover:opacity-95 transition-all duration-300 cursor-pointer tracking-wide uppercase border-b-4 border-orange-600 active:border-b-0 active:mt-1 mt-3",
      cancelButton: "ml-3 rounded-2xl bg-slate-100 px-7 py-3.5 text-xs font-black text-slate-500 border border-slate-200 shadow-sm hover:bg-slate-200 transition-all duration-300 cursor-pointer tracking-wide uppercase border-b-4 border-slate-300 active:border-b-0 active:mt-1 mt-3",
    },
  });
};

// 6. MICRO SIDE TOAST FEEDBACK
export const showToast = (message, type = "success") => {
  const isError = type === "error";
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3200,
    timerProgressBar: true,
    background: "#ffffff",
    customClass: {
      popup: `!rounded-2xl !p-4 !shadow-[0_10px_30px_rgba(0,0,0,0.06)] border-l-4 ${isError ? "border-l-red-500" : "border-l-orange-500"} bg-white border border-slate-100 premium-popup-anim`,
      title: "!text-slate-700 !font-bold !text-sm !font-sans !pl-1",
    },
  });
  return Toast.fire({ icon: type, title: message });
};