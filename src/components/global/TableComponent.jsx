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
    <div className="rounded-3xl border border-white/[0.03] bg-gradient-to-b from-[#080f0a] to-[#040805] p-6 shadow-2xl glass-premium">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--primary-orange-light)]">
            Admin Panel
          </p>

          <h2 className="mt-1.5 text-2xl font-extrabold text-white tracking-tight">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {showSearch && (
            <div className="relative w-full sm:w-72">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />

              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-11 w-full rounded-xl border border-white/5 bg-black/40 pl-11 pr-4 text-xs text-white outline-none placeholder:text-slate-600 transition-all focus:border-[var(--primary-orange)]/45 focus:bg-black/60"
              />
            </div>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-4 text-xs font-bold text-slate-300 hover:text-white hover:border-white/20 transition-all cursor-pointer"
            >
              <FaSyncAlt className="text-[10px]" />
              Refresh
            </button>
          )}

          {addButtonText && (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[var(--primary-orange)] to-[var(--primary-orange-light)] px-5 text-xs font-extrabold text-white shadow-md shadow-orange-500/20 hover:scale-[1.01] transition-all cursor-pointer"
            >
              <FaPlus />
              {addButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/[0.03] bg-black/25">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead className="bg-white/[0.01] border-b border-white/[0.03]">
            <tr>
              {showIndex && (
                <th className="w-16 px-5 py-4 text-xs font-bold uppercase tracking-wider text-[var(--primary-orange-light)]">
                  S.No
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-4 text-xs font-bold uppercase tracking-wider text-[var(--primary-orange-light)] ${
                    col.className || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/[0.02]">
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (showIndex ? 1 : 0)}
                  className="px-5 py-12 text-center text-xs text-slate-500 font-medium"
                >
                  Loading details...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={row.id || row._id || rowIndex}
                  className="transition-colors hover:bg-white/[0.01]"
                >
                  {showIndex && (
                    <td className="px-5 py-4 text-xs font-bold text-slate-400">
                      {rowIndex + 1}
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-5 py-4 text-xs text-slate-300 font-medium ${
                        col.tdClassName || ""
                      }`}
                    >
                      {col.render
                        ? col.render(row[col.key], row, rowIndex)
                        : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (showIndex ? 1 : 0)}
                  className="px-5 py-12 text-center text-xs text-slate-500 font-medium"
                >
                  No data records found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500 font-medium">
        <p>
          Showing{" "}
          <span className="font-extrabold text-[var(--primary-orange-light)]">
            {filteredData.length}
          </span>{" "}
          of <span className="font-extrabold text-white">{data.length}</span> records
        </p>
      </div>
    </div>
  );
};

export default TableComponent;