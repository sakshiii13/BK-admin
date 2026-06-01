import Swal from "sweetalert2";

// Global helper: Clean, robust, and safe cleanup
export const forceClearAlerts = () => {
  if (typeof window === "undefined") return;

  // 1. Properly close active instance
  Swal.close();

  // 2. Remove any stubborn DOM elements
  document.querySelectorAll(".swal2-container").forEach((el) => el.remove());

  // 3. Reset body and html styles that get stuck
  const resetStyles = () => {
    document.body.classList.remove("swal2-shown", "swal2-height-auto", "swal2-no-backdrop");
    document.body.style.removeProperty("overflow");
    document.body.style.removeProperty("padding-right");
    document.documentElement.classList.remove("swal2-shown", "swal2-height-auto");
    document.documentElement.style.removeProperty("overflow");
  };
  
  resetStyles();
};

// Auto-cleanup on navigation
if (typeof window !== "undefined") {
  window.addEventListener("popstate", forceClearAlerts);
}

const commonLightConfig = {
  background: "#ffffff",
  backdrop: "rgba(15, 23, 42, 0.4)",
  buttonsStyling: false,
  allowOutsideClick: false,
  allowEscapeKey: true,
  customClass: {
    popup: "rounded-[2rem] border border-slate-100 shadow-2xl premium-popup-anim",
    title: "text-[#0f172a] font-bold text-2xl pt-4",
    htmlContainer: "text-slate-500 font-medium",
    confirmButton: "rounded-2xl bg-[#ff7e00] px-10 py-4 text-white font-bold cursor-pointer hover:bg-[#e06f00] transition-all active:scale-95 m-2 shadow-md",
    cancelButton: "rounded-2xl bg-slate-100 px-10 py-4 text-slate-500 font-bold cursor-pointer hover:bg-slate-200 transition-all active:scale-95 m-2",
  },
  // USE THIS: willClose alert band hone se pehle call hota hai
  willClose: () => {
    forceClearAlerts();
  }
};

// --- ALERT FUNCTIONS ---

export const showOtpSentAlert = () => {
  return Swal.fire({
    ...commonLightConfig,
    icon: 'success',
    title: 'OTP Sent Successfully',
    text: 'Please check your Email inbox.',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
};

export const showLoginSuccessAlert = () => {
  return Swal.fire({
    ...commonLightConfig,
    icon: 'success',
    iconColor: '#10b981',
    title: 'Welcome Back!',
    text: 'Successfully logged into dashboard.',
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
  });
};

export const showSuccess = (message) => {
  return Swal.fire({
    ...commonLightConfig,
    icon: 'success',
    title: 'Success!',
    text: message,
    confirmButtonText: "Great, Got It ✨",
  });
};

export const showError = (message) => {
  return Swal.fire({
    ...commonLightConfig,
    icon: 'error',
    iconColor: '#ef4444',
    title: 'System Alert',
    text: message,
    confirmButtonText: "Dismiss Alert",
    customClass: {
      ...commonLightConfig.customClass,
      confirmButton: "rounded-2xl bg-slate-800 px-10 py-4 text-white font-bold cursor-pointer hover:bg-slate-700 transition-all active:scale-95 m-2"
    }
  });
};

export const showConfirm = ({ title = "Are you sure?", text = "This action cannot be undone.", confirmButtonText = "Yes, Proceed" }) => {
  return Swal.fire({
    ...commonLightConfig,
    icon: 'warning',
    title: title,
    text: text,
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
  });
};

export const showToast = (message, type = "success") => {
  const isError = type === "error";
  Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    didClose: () => forceClearAlerts() // Toast ke liye didClose theek hai
  }).fire({ 
    icon: type, 
    title: message,
    customClass: {
      popup: `!rounded-2xl !p-4 !shadow-xl border-l-4 ${isError ? "border-l-red-500" : "border-l-[#ff7e00]"} bg-white border border-slate-100`
    }
  });
};