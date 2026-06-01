import React from "react";
import { FaSave, FaArrowLeft } from "react-icons/fa";

const AddUser = () => {
  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">

      {/* HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <button className="h-11 w-11 rounded-xl bg-white border border-slate-200 text-slate-600 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-95 transition-all flex items-center justify-center">
          <FaArrowLeft />
        </button>

        <div>
          <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Add New User
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Create and manage user accounts
          </p>
        </div>
      </div>

      {/* CARD */}
      <div className="card-3d bg-white rounded-3xl overflow-hidden">

        {/* TOP BAR */}
        <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-orange-400 to-lime-400"></div>

        <form className="p-5 md:p-9 space-y-6">

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* FIELD */}
            {[
              { label: "First Name", placeholder: "John", type: "text" },
              { label: "Last Name", placeholder: "Doe", type: "text" },
              { label: "Email Address", placeholder: "john@example.com", type: "email" },
              { label: "Phone Number", placeholder: "+91 9876543210", type: "tel" },
              { label: "Password", placeholder: "••••••••", type: "password" },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {f.label}
                </label>

                <input
                  type={f.type}
                  placeholder={f.placeholder}
                  className="mt-2 w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800 shadow-inner
                  focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none
                  transition-all hover:shadow-md"
                />
              </div>
            ))}

            {/* ROLE */}
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Role
              </label>

              <select className="mt-2 w-full h-11 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-800
              focus:bg-white focus:border-orange-400 focus:ring-4 focus:ring-orange-100 outline-none transition-all">
                <option>Customer</option>
                <option>Premium User</option>
                <option>Admin</option>
                <option>Store Manager</option>
              </select>
            </div>
          </div>

          {/* ACTIONS */}
          <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">

            <button
              type="button"
              className="h-11 px-6 rounded-xl bg-white border border-slate-200 text-slate-600
              hover:bg-slate-50 hover:shadow-md active:scale-95 transition-all"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="h-11 px-7 rounded-xl bg-gradient-to-r from-orange-500 to-orange-400
              text-white font-semibold shadow-md shadow-orange-200
              hover:shadow-lg hover:-translate-y-0.5 active:scale-95 transition-all flex items-center gap-2"
            >
              <FaSave />
              Create User
            </button>

          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUser;