import React, { useMemo, useState } from "react";
import { FaPlus, FaSearch, FaSyncAlt } from "react-icons/fa";

const TableComponent = ({
  title = "Table",
  subtitle = "Manage your data here",
  columns = [],
  data = [],
  searchPlaceholder = "Search...",
  showSearch = true,
  showIndex = true,
  loading = false,
  addButtonText = "",
  onAdd,
  onRefresh,
}) => {
  const [search, setSearch] = useState("");

  const filteredData = useMemo(() => {
    if (!search) return data;
    return data.filter((row) =>
      Object.values(row).join(" ").toLowerCase().includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    // Yahan humne card-3d class use ki hai jo white/light background degi
    <div className="card-3d p-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-600">Admin Panel</p>
          <h2 className="mt-1.5 text-2xl font-extrabold text-slate-800 tracking-tight">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {showSearch && (
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                // input-3d class for clean look
                className="input-3d h-11 w-full pl-11 pr-4 text-xs text-slate-800"
              />
            </div>
          )}

          {onRefresh && (
            <button type="button" onClick={onRefresh} className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-slate-100 px-4 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer">
              <FaSyncAlt className="text-[10px]" /> Refresh
            </button>
          )}

          {addButtonText && (
            <button type="button" onClick={onAdd} className="btn-3d btn-gradient-orange inline-flex h-11 items-center justify-center gap-2 px-5 text-xs font-extrabold text-white">
              <FaPlus /> {addButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Table - Black bg hata kar white/transparent kiya */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              {showIndex && <th className="w-16 px-5 py-4 text-xs font-bold uppercase text-slate-500">S.No</th>}
              {columns.map((col) => (
                <th key={col.key} className={`px-5 py-4 text-xs font-bold uppercase text-slate-500 ${col.className || ""}`}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr>
                <td colSpan={columns.length + (showIndex ? 1 : 0)} className="px-5 py-12 text-center text-xs text-slate-500">Loading details...</td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr key={row.id || row._id || rowIndex} className="hover:bg-slate-50 transition-colors">
                  {showIndex && <td className="px-5 py-4 text-xs font-bold text-slate-600">{rowIndex + 1}</td>}
                  {columns.map((col) => (
                    <td key={col.key} className={`px-5 py-4 text-xs text-slate-700 font-medium ${col.tdClassName || ""}`}>
                      {col.render ? col.render(row[col.key], row, rowIndex) : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (showIndex ? 1 : 0)} className="px-5 py-12 text-center text-xs text-slate-500">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
        <p>Showing <span className="font-extrabold text-orange-600">{filteredData.length}</span> of <span className="font-extrabold text-slate-800">{data.length}</span> records</p>
      </div>
    </div>
  );
};

export default TableComponent;