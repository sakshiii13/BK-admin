import React, { useMemo, useState } from "react";
import { FaPlus, FaSearch, FaSyncAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const TableComponent = ({
  title             = "Table",
  subtitle          = "Manage your data here",
  columns           = [],
  data              = [],
  searchPlaceholder = "Search...",
  showSearch        = true,
  showIndex         = true,
  loading           = false,
  addButtonText     = "",
  onAdd,
  onRefresh,
}) => {
  const [search, setSearch] = useState("");
  const [page, setPage]     = useState(1);
  const [limit, setLimit]   = useState(10);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return data;
    return data.filter((row) =>
      Object.values(row)
        .map((v) => (typeof v === "object" ? JSON.stringify(v) : v))
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [search, data]);

  const totalPages    = Math.max(Math.ceil(filtered.length / limit), 1);
  const safePage      = Math.min(page, totalPages);
  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * limit;
    return filtered.slice(start, start + limit);
  }, [filtered, safePage, limit]);

  const handleLimitChange = (val) => { setLimit(Number(val)); setPage(1); };
  const handleSearch      = (val) => { setSearch(val); setPage(1); };

  const startRecord = filtered.length === 0 ? 0 : (safePage - 1) * limit + 1;
  const endRecord   = Math.min(safePage * limit, filtered.length);

  return (
    <div className="w-full rounded-2xl overflow-hidden bg-white" style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04)" }}>

      {/* ── HEADER ── */}
      <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-100">

        {/* Title row */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            <h2 className="text-base sm:text-lg font-black text-[var(--text-primary)] leading-tight truncate">{title}</h2>
            {subtitle && <p className="mt-0.5 text-xs text-[var(--text-secondary)] truncate">{subtitle}</p>}
          </div>

          {/* Add button — always visible top-right */}
          {addButtonText && (
            <button
              onClick={onAdd}
              className="shrink-0 h-9 sm:h-10 px-3 sm:px-4 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 hover:opacity-90 active:scale-95 transition-all"
              style={{ background: "var(--primary-green)" }}
            >
              <FaPlus className="text-[10px]" />
              <span className="hidden sm:inline">{addButtonText}</span>
              <span className="sm:hidden">Add</span>
            </button>
          )}
        </div>

        {/* Controls row */}
        <div className="flex flex-wrap items-center gap-2">

          {/* Search */}
          {showSearch && (
            <div className="relative flex-1 min-w-[140px] max-w-xs">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-[10px]" />
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="h-9 w-full pl-8 pr-3 text-xs font-semibold rounded-xl bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-[var(--primary-green)]/10 focus:border-[var(--primary-green)] transition-all placeholder:text-slate-400"
              />
            </div>
          )}

          <div className="flex items-center gap-2 ml-auto">
            {/* Rows per page */}
            <select
              value={String(limit)}
              onChange={(e) => handleLimitChange(e.target.value)}
              className="h-9 px-2 sm:px-3 text-xs font-bold rounded-xl bg-slate-50 border border-slate-200 outline-none focus:border-[var(--primary-green)] cursor-pointer text-slate-600"
            >
              <option value="10">10 / page</option>
              <option value="20">20 / page</option>
              <option value="50">50 / page</option>
            </select>

            {/* Pagination */}
            <div className="flex items-center gap-0.5 bg-slate-50 p-1 rounded-xl border border-slate-200">
              <button
                disabled={safePage === 1}
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-[var(--primary-green)] disabled:opacity-30 transition-all"
              >
                <FaChevronLeft size={10} />
              </button>
              <span className="px-2 text-xs font-black text-slate-600 whitespace-nowrap">
                {safePage} / {totalPages}
              </span>
              <button
                disabled={safePage >= totalPages}
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                className="w-7 h-7 flex items-center justify-center rounded-lg text-slate-500 hover:bg-white hover:text-[var(--primary-green)] disabled:opacity-30 transition-all"
              >
                <FaChevronRight size={10} />
              </button>
            </div>

            {/* Refresh */}
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-50 border border-slate-200 text-slate-500 hover:text-[var(--primary-green)] hover:bg-white transition-all"
              >
                <FaSyncAlt size={12} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── TABLE (desktop) ── */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr style={{ background: "#f8fafc", borderBottom: "1.5px solid #f1f5f9" }}>
              {showIndex && (
                <th className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400 w-10">#</th>
              )}
              {columns.map((col, i) => (
                <th key={`${col.key}-${i}`} className="px-4 py-3 text-left text-[10px] font-black uppercase tracking-widest text-slate-400">
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length + (showIndex ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
                      style={{ borderColor: "var(--primary-green)", borderTopColor: "transparent" }} />
                    <p className="text-sm font-bold text-slate-400">Loading data...</p>
                  </div>
                </td>
              </tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((row, index) => (
                <tr
                  key={row._id || row.id || index}
                  style={{ borderBottom: "1px solid #f8fafc" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "#f8fffe")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  className="transition-colors"
                >
                  {showIndex && (
                    <td className="px-4 py-3.5">
                      <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center">
                        {startRecord + index}
                      </span>
                    </td>
                  )}
                  {columns.map((col, ci) => (
                    <td key={`${col.key}-${ci}`} className="px-4 py-3.5 text-sm text-[var(--text-primary)] font-semibold">
                      {col.render ? col.render(row[col.key], row, index) : row[col.key] ?? "-"}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length + (showIndex ? 1 : 0)} className="py-16 text-center">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">📭</div>
                    <p className="text-sm font-bold text-slate-400">No data found</p>
                    <p className="text-xs text-slate-300">Try adjusting your search</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── CARDS (mobile) ── */}
      <div className="sm:hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: "var(--primary-green)", borderTopColor: "transparent" }} />
            <p className="text-sm font-bold text-slate-400">Loading data...</p>
          </div>
        ) : paginatedData.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {paginatedData.map((row, index) => (
              <div key={row._id || row.id || index} className="px-4 py-4 hover:bg-slate-50 transition-colors">
                {/* Card index */}
                {showIndex && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 text-[10px] font-black flex items-center justify-center shrink-0">
                      {startRecord + index}
                    </span>
                    <div className="h-px flex-1 bg-slate-100" />
                  </div>
                )}
                {/* Render each column as label-value pair */}
                <div className="space-y-2.5">
                  {columns.map((col, ci) => {
                    const val = col.render
                      ? col.render(row[col.key], row, index)
                      : (row[col.key] ?? "-");

                    // Skip "Actions" label styling — render full width
                    const isActions = col.label?.toLowerCase() === "actions";

                    return isActions ? (
                      <div key={`${col.key}-${ci}`} className="pt-1">
                        {val}
                      </div>
                    ) : (
                      <div key={`${col.key}-${ci}`} className="flex items-start justify-between gap-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 shrink-0 pt-0.5">
                          {col.label}
                        </span>
                        <span className="text-xs font-semibold text-[var(--text-primary)] text-right">
                          {val}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-xl">📭</div>
            <p className="text-sm font-bold text-slate-400">No data found</p>
            <p className="text-xs text-slate-300">Try adjusting your search</p>
          </div>
        )}
      </div>

      {/* ── FOOTER ── */}
      {/* <div className="px-4 sm:px-6 py-3.5 flex items-center justify-between border-t border-slate-100">
        <p className="text-xs text-slate-400">
          Showing{" "}
          <span className="font-black text-[var(--primary-green)]">{startRecord}–{endRecord}</span>
          {" "}of{" "}
          <span className="font-black text-[var(--text-primary)]">{filtered.length}</span>
          {" "}records
        </p>
        {data.length !== filtered.length && (
          <p className="text-xs text-slate-400">
            <span className="font-black text-slate-500">{data.length}</span> total
          </p>
        )}
      </div> */}
    </div>
  );
};

export default TableComponent;