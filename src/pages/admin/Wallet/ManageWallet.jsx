import React, { useState, useEffect } from "react";
import { getWalletByUserIdApi, creditWalletApi } from "../../../api/admin.api"; // Apna path verify karein

const ManageWallet = ({ userId }) => {
  const [wallet, setWallet] = useState(null);
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const fetchWallet = async () => {
    setLoading(true);
    const res = await getWalletByUserIdApi(userId);
    // JSON response structure ke hisaab se:
    if (res?.success) {
      setWallet(res.data);
    }
    setLoading(false);
  };

  const handleCredit = async () => {
    if (!amount) return;
    
    // API request payload
    const res = await creditWalletApi({ userId, amount: Number(amount) });
    
    if (res?.success) {
      setMessage(res.message); // "Wallet credited successfully"
      setAmount("");
      fetchWallet(); // UI update karne ke liye data refresh
    } else {
      setMessage(res.message || "Failed to credit wallet");
    }
  };

  useEffect(() => {
    if (userId) fetchWallet();
  }, [userId]);

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="card-3d p-8">
        <h2 className="text-2xl font-bold mb-6 text-slate-800">Wallet Management</h2>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg text-sm font-semibold">
            {message}
          </div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading wallet data...</div>
        ) : wallet ? (
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 shadow-inner">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">Available Balance</p>
              <h1 className="text-5xl font-black text-primary-green mt-1">₹{wallet.balance}</h1>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-black uppercase">Total Credits</p>
                <p className="text-xl font-bold text-slate-700">₹{wallet.totalCredits}</p>
              </div>
              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] text-slate-400 font-black uppercase">Total Debits</p>
                <p className="text-xl font-bold text-slate-700">₹{wallet.totalDebits}</p>
              </div>
            </div>

            <div className="pt-2">
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter credit amount"
                className="input-3d w-full p-4 mb-4 text-lg"
              />
              <button 
                onClick={handleCredit}
                className="btn-3d btn-primary w-full py-4 text-lg shadow-lg"
              >
                Confirm Credit
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center py-10 text-slate-400">No wallet data available.</p>
        )}
      </div>
    </div>
  );
};

export default ManageWallet;