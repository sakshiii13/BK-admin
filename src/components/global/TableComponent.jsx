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
      Object.values(row)
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search, data]);

  return (
    <div className="card-3d p-6 bg-[var(--card-bg)]">

      {/* ================= HEADER ================= */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">

        {/* TITLE */}
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-[var(--primary-orange)]">
            Admin Panel
          </p>

          <h2 className="mt-1 text-2xl font-extrabold text-[var(--text-primary)]">
            {title}
          </h2>

          {subtitle && (
            <p className="mt-1 text-xs text-[var(--text-secondary)]">
              {subtitle}
            </p>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">

          {/* SEARCH */}
          {showSearch && (
            <div className="relative w-full sm:w-72 group">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[var(--primary-orange)] transition" />

              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="input-3d h-11 w-full pl-11 pr-4 text-sm transition-all duration-300 hover:shadow-md focus:scale-[1.02]"
              />
            </div>
          )}

          {/* REFRESH */}
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="btn-3d btn-white h-11 px-4 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-sm hover:shadow-md"
            >
              <FaSyncAlt className="animate-spin-slow" />
              Refresh
            </button>
          )}

          {/* ADD */}
          {addButtonText && (
            <button
              onClick={onAdd}
              className="btn-3d btn-gradient-orange h-11 px-5 flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg hover:shadow-orange-300/40"
            >
              <FaPlus />
              {addButtonText}
            </button>
          )}
        </div>
      </div>

      {/* ================= TABLE WRAPPER ================= */}
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_10px_30px_rgba(0,0,0,0.08)]">

        <table className="w-full min-w-[900px] border-collapse">

          {/* HEADER */}
          <thead className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <tr>
              {showIndex && (
                <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500">
                  #
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-slate-500"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* BODY */}
          <tbody className="divide-y divide-slate-100">

            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (showIndex ? 1 : 0)}
                  className="py-12 text-center text-sm text-slate-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-6 h-6 border-2 border-orange-400 border-t-transparent rounded-full animate-spin"></div>
                    Loading data...
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr
                  key={row.id || row._id || index}
                  className="transition-all duration-300 hover:bg-orange-50 hover:scale-[1.01] hover:shadow-md"
                >

                  {showIndex && (
                    <td className="px-5 py-4 text-sm font-bold text-slate-500">
                      {index + 1}
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className="px-5 py-4 text-sm text-slate-700 font-medium"
                    >
                      {col.render
                        ? col.render(row[col.key], row, index)
                        : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (showIndex ? 1 : 0)}
                  className="py-14 text-center text-sm text-slate-400"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-3xl">📭</div>
                    No data found
                  </div>
                </td>
              </tr>
            )}

          </tbody>
        </table>
      </div>

      {/* ================= FOOTER ================= */}
      <div className="mt-4 flex items-center justify-between text-xs text-[var(--text-secondary)]">
        <p>
          Showing{" "}
          <span className="font-bold text-[var(--primary-orange)]">
            {filteredData.length}
          </span>{" "}
          of{" "}
          <span className="font-bold text-[var(--text-primary)]">
            {data.length}
          </span>{" "}
          records
        </p>
      </div>
    </div>
  );
};

export default TableComponent;