import Swal from "sweetalert2";

export const showSuccess = (message) => {
  return Swal.fire({
    html: `
      <div style="padding: 12px 6px;">
        <div style="
          width: 92px; height: 92px; margin: 0 auto 18px; border-radius: 30px;
          background: linear-gradient(135deg, #f37023, #f7941d);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 18px 45px rgba(243, 112, 35, 0.4);
        ">
          <span style="font-size: 44px; color: white; font-weight: 900; font-family: sans-serif;">✓</span>
        </div>

        <h2 style="color: white; font-size: 30px; font-weight: 900; margin-bottom: 10px; font-family: 'Outfit', sans-serif;">
          Success!
        </h2>

        <p style="color: #cbd5e1; font-size: 15px; line-height: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
          ${message}
        </p>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Awesome ✨",
    background: "linear-gradient(145deg, rgba(8, 15, 10, 0.98), rgba(3, 7, 4, 0.98))",
    backdrop: "rgba(0,0,0,0.8)",
    customClass: {
      popup: "rounded-[32px] border border-white/10 shadow-2xl",
      confirmButton: "rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-8 py-3 text-sm font-bold text-white shadow-lg hover:from-orange-400 hover:to-orange-300 transition-all duration-300 cursor-pointer",
    },
    buttonsStyling: false,
  });
};

export const showError = (message) => {
  return Swal.fire({
    html: `
      <div style="padding: 12px 6px;">
        <div style="
          width: 92px; height: 92px; margin: 0 auto 18px; border-radius: 30px;
          background: linear-gradient(135deg, #ef4444, #f87171);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 18px 45px rgba(239, 68, 68, 0.45);
        ">
          <span style="font-size: 44px; color: white; font-weight: 900; font-family: sans-serif;">!</span>
        </div>

        <h2 style="color: white; font-size: 30px; font-weight: 900; margin-bottom: 10px; font-family: 'Outfit', sans-serif;">
          Oops!
        </h2>

        <p style="color: #cbd5e1; font-size: 15px; line-height: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
          ${message}
        </p>
      </div>
    `,
    showConfirmButton: true,
    confirmButtonText: "Try Again",
    background: "linear-gradient(145deg, rgba(8, 15, 10, 0.98), rgba(3, 7, 4, 0.98))",
    backdrop: "rgba(0,0,0,0.8)",
    customClass: {
      popup: "rounded-[32px] border border-white/10 shadow-2xl",
      confirmButton: "rounded-2xl bg-red-500 px-8 py-3 text-sm font-bold text-white shadow-lg hover:bg-red-400 transition-all duration-300 cursor-pointer",
    },
    buttonsStyling: false,
  });
};

export const showConfirm = ({ title = "Are you sure?", text = "This action cannot be undone.", confirmButtonText = "Yes, delete it!" }) => {
  return Swal.fire({
    html: `
      <div style="padding: 12px 6px;">
        <div style="
          width: 92px; height: 92px; margin: 0 auto 18px; border-radius: 30px;
          background: linear-gradient(135deg, #f37023, #f7941d);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 18px 45px rgba(243, 112, 35, 0.3);
        ">
          <span style="font-size: 44px; color: white; font-weight: 900; font-family: sans-serif;">?</span>
        </div>

        <h2 style="color: white; font-size: 30px; font-weight: 900; margin-bottom: 10px; font-family: 'Outfit', sans-serif;">
          ${title}
        </h2>

        <p style="color: #cbd5e1; font-size: 15px; line-height: 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
          ${text}
        </p>
      </div>
    `,
    background: "linear-gradient(145deg, rgba(8, 15, 10, 0.98), rgba(3, 7, 4, 0.98))",
    backdrop: "rgba(0,0,0,0.8)",
    showCancelButton: true,
    confirmButtonText: confirmButtonText,
    cancelButtonText: "Cancel",
    customClass: {
      popup: "rounded-[32px] border border-white/10 shadow-2xl",
      confirmButton: "rounded-2xl bg-gradient-to-r from-orange-500 to-orange-400 px-7 py-3 text-sm font-bold text-white shadow-lg hover:from-orange-400 hover:to-orange-300 transition-all duration-300 cursor-pointer",
      cancelButton: "ml-3 rounded-2xl bg-slate-700 px-7 py-3 text-sm font-bold text-white shadow-lg hover:bg-slate-600 transition-all duration-300 cursor-pointer",
    },
    buttonsStyling: false,
  });
};

export const showToast = (message, type = "success") => {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
    background: "#080f0a",
    color: "#fff",
    didOpen: (toast) => {
      toast.onmouseenter = Swal.stopTimer;
      toast.onmouseleave = Swal.resumeTimer;
    }
  });

  return Toast.fire({
    icon: type,
    title: message
  });
};
