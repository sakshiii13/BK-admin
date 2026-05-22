import React from "react";
import { FaBoxes, FaExclamationTriangle } from "react-icons/fa";

const Inventory = () => {
  const inventory = [
    {
      id: 1,
      product: "Fresh Organic Apples",
      store: "Main Store",
      stock: 150,
      threshold: 50,
      status: "Healthy",
    },
    {
      id: 2,
      product: "Whole Wheat Bread",
      store: "Westside",
      stock: 12,
      threshold: 20,
      status: "Low Stock",
    },
    {
      id: 3,
      product: "Almond Milk 1L",
      store: "Main Store",
      stock: 0,
      threshold: 10,
      status: "Out of Stock",
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Inventory Tracking</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Monitor stock levels across all stores
          </p>
        </div>
        <div className="flex gap-3">
          <button className="bg-[var(--card-bg)] border border-[var(--border-soft)] text-gray-300 px-4 py-2 rounded-xl transition-all hover:text-white hover:border-orange-500/50">
            Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="glass rounded-2xl p-5 border border-orange-500/30 flex items-center gap-4 bg-orange-500/5">
          <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center text-xl">
            <FaBoxes />
          </div>
          <div>
            <p className="text-sm text-gray-400">Total Items</p>
            <p className="text-2xl font-bold text-white">4,250</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-yellow-500/30 flex items-center gap-4 bg-yellow-500/5">
          <div className="w-12 h-12 rounded-full bg-yellow-500/20 text-yellow-400 flex items-center justify-center text-xl">
            <FaExclamationTriangle />
          </div>
          <div>
            <p className="text-sm text-gray-400">Low Stock Items</p>
            <p className="text-2xl font-bold text-white">24</p>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[var(--card-bg)]/50 border-b border-white/10">
              <th className="p-4 text-sm font-semibold text-gray-400">
                Product
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                Location
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                Current Stock
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                Status
              </th>
              <th className="p-4 text-sm font-semibold text-gray-400">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item) => (
              <tr
                key={item.id}
                className="border-b border-white/5 hover:bg-white/5 transition-colors"
              >
                <td className="p-4 text-white font-medium">{item.product}</td>
                <td className="p-4 text-gray-300">{item.store}</td>
                <td className="p-4 font-bold text-white">
                  {item.stock}{" "}
                  <span className="text-xs text-gray-500 font-normal">
                    / Min {item.threshold}
                  </span>
                </td>
                <td className="p-4">
                  <span
                    className={`px-2.5 py-1 rounded-md text-xs border 
                    ${
                      item.status === "Healthy"
                        ? "bg-green-500/10 text-green-400 border-green-500/20"
                        : item.status === "Low Stock"
                          ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                    }`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="p-4">
                  <button className="text-sm text-orange-400 hover:text-orange-300 font-medium">
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Inventory;
