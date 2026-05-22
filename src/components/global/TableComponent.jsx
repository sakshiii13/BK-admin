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
    <div className="rounded-[28px] border border-[var(--border-soft)] bg-[var(--card-bg)] p-5 shadow-xl">
      {/* Header */}
      <div className="mb-5 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.25em] text-orange-400">
            Admin Panel
          </p>

          <h2 className="mt-1 text-2xl font-bold text-white">{title}</h2>

          {subtitle && (
            <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          {showSearch && (
            <div className="relative w-full sm:w-80">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />

              <input
                type="text"
                placeholder={searchPlaceholder}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="h-12 w-full rounded-2xl border border-[var(--border-soft)] bg-[var(--app-bg)] pl-11 pr-4 text-sm text-white outline-none placeholder:text-slate-500 transition focus:border-orange-400"
              />
            </div>
          )}

          {onRefresh && (
            <button
              type="button"
              onClick={onRefresh}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl border border-[var(--border-soft)] bg-[var(--app-bg)] px-4 text-sm font-bold text-slate-300 transition hover:border-orange-400 hover:text-orange-400"
            >
              <FaSyncAlt />
              Refresh
            </button>
          )}

          {addButtonText && (
            <button
              type="button"
              onClick={onAdd}
              className="inline-flex h-12 items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 text-sm font-bold text-white transition hover:bg-orange-400"
            >
              <FaPlus />
              {addButtonText}
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--border-soft)]">
        <table className="w-full min-w-[900px] border-collapse">
          <thead className="bg-orange-500/10">
            <tr>
              {showIndex && (
                <th className="w-20 px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-300">
                  S.No
                </th>
              )}

              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-4 py-4 text-left text-xs font-bold uppercase tracking-wider text-orange-300 ${
                    col.className || ""
                  }`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td
                  colSpan={columns.length + (showIndex ? 1 : 0)}
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  Loading data...
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((row, rowIndex) => (
                <tr
                  key={row.id || row._id || rowIndex}
                  className="border-t border-[var(--border-soft)] transition hover:bg-white/[0.03]"
                >
                  {showIndex && (
                    <td className="px-4 py-4 text-sm font-semibold text-slate-400">
                      {rowIndex + 1}
                    </td>
                  )}

                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-4 py-4 text-sm text-slate-300 ${
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
                  className="px-4 py-12 text-center text-sm text-slate-400"
                >
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
        <p>
          Showing{" "}
          <span className="font-bold text-orange-400">
            {filteredData.length}
          </span>{" "}
          of <span className="font-bold text-white">{data.length}</span> records
        </p>
      </div>
    </div>
  );
};

export default TableComponent;