import React, { useState, useEffect } from "react";
import { getReferralSettingApi, updateReferralSettingApi } from "../../../api/admin.api";
// Apne SweetAlert helper file ko import karein
import { showSuccess, showError, showToast } from "../../../utils/alertService"; 

const Rewards = () => {
  const [formData, setFormData] = useState({ rewardAmount: "", isActive: false });
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    const res = await getReferralSettingApi();
    if (res?.success) {
      setFormData({ 
        rewardAmount: res.data.rewardAmount, 
        isActive: res.data.isActive 
      });
    } else {
      showError(res?.message || "Failed to fetch settings");
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    const res = await updateReferralSettingApi(formData);
    
    if (res?.success) {
      showSuccess(res.message); // SweetAlert Success
      fetchData();
    } else {
      showError(res?.message || "Failed to update settings"); // SweetAlert Error
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6 max-w-lg">
      <div className="card-3d p-8">
        <h2 className="text-xl font-black text-slate-800 mb-8 uppercase tracking-tight">
          Referral Settings
        </h2>

        <div className="space-y-6">
          {/* Reward Amount */}
          <div>
            <label className="text-[10px] font-black text-slate-400 uppercase mb-2 block tracking-widest">
              Reward Amount (₹)
            </label>
            <input
              type="number"
              value={formData.rewardAmount}
              onChange={(e) => setFormData({ ...formData, rewardAmount: Number(e.target.value) })}
              className="input-3d w-full p-4 font-bold text-lg"
            />
          </div>

          {/* Status Toggle */}
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
            <span className="text-sm font-bold text-slate-700">Status</span>
            <button
              onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
              className={`w-14 h-8 rounded-full transition-all flex items-center px-1 duration-300 ${
                formData.isActive ? "bg-primary-green" : "bg-slate-300"
              }`}
            >
              <div className={`w-6 h-6 bg-white rounded-full transition-transform duration-300 ${formData.isActive ? "translate-x-6" : ""}`} />
            </button>
          </div>

          <button
            onClick={handleUpdate}
            disabled={loading}
            className="btn-3d btn-primary w-full py-4 text-sm uppercase tracking-wide"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Rewards;