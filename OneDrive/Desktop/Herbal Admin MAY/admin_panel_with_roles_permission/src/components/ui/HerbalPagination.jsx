import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

/**
 * Accessible pagination — herbal palette. No API logic.
 */
export default function HerbalPagination({
  page = 1,
  totalPages = 1,
  onPageChange,
  totalItems,
  pageSize,
  disabled = false,
  className = "",
  /** Use on dark super-admin style shells */
  tone = "light",
}) {
  const safeTotal = Math.max(1, Number(totalPages) || 1);
  const current = Math.min(Math.max(1, Number(page) || 1), safeTotal);
  const from = totalItems != null && pageSize ? (current - 1) * pageSize + 1 : null;
  const to =
    from != null && totalItems != null
      ? Math.min(current * pageSize, totalItems)
      : null;

  const go = (p) => {
    if (disabled) return;
    const next = Math.min(Math.max(1, p), safeTotal);
    if (next !== current) onPageChange?.(next);
  };

  const windowSize = 5;
  let start = Math.max(1, current - Math.floor(windowSize / 2));
  const end = Math.min(safeTotal, start + windowSize - 1);
  if (end - start < windowSize - 1) start = Math.max(1, end - windowSize + 1);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);

  const btn =
    "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-lg text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40";
  const idle =
    tone === "dark"
      ? "bg-white/10 text-white/90 shadow-sm hover:bg-white/15 hover:text-white"
      : "bg-white text-emerald-900/85 shadow-sm hover:bg-emerald-50/90";
  const active =
    "bg-[linear-gradient(135deg,#388e3c_0%,#6d8f3a_45%,#9e7d31_100%)] text-white shadow-md";

  return (
    <div
      className={`flex flex-col items-center justify-between gap-3 sm:flex-row ${className}`}
    >
      {from != null && to != null && totalItems != null && (
        <p
          className={
            tone === "dark"
              ? "text-sm text-white/70"
              : "text-sm text-emerald-900/70"
          }
        >
          Showing{" "}
          <span
            className={
              tone === "dark"
                ? "font-semibold text-white"
                : "font-semibold text-emerald-900"
            }
          >
            {from}
          </span>
          –
          <span
            className={
              tone === "dark"
                ? "font-semibold text-white"
                : "font-semibold text-emerald-900"
            }
          >
            {to}
          </span>{" "}
          of{" "}
          <span
            className={
              tone === "dark"
                ? "font-semibold text-white"
                : "font-semibold text-emerald-900"
            }
          >
            {totalItems}
          </span>
        </p>
      )}
      <nav
        className="flex flex-wrap items-center justify-center gap-1"
        aria-label="Pagination"
      >
        <button
          type="button"
          className={`${btn} ${idle} px-2`}
          disabled={disabled || current <= 1}
          onClick={() => go(1)}
          aria-label="First page"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${idle} px-2`}
          disabled={disabled || current <= 1}
          onClick={() => go(current - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={`${btn} ${p === current ? active : idle}`}
            disabled={disabled}
            onClick={() => go(p)}
            aria-current={p === current ? "page" : undefined}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          className={`${btn} ${idle} px-2`}
          disabled={disabled || current >= safeTotal}
          onClick={() => go(current + 1)}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          type="button"
          className={`${btn} ${idle} px-2`}
          disabled={disabled || current >= safeTotal}
          onClick={() => go(safeTotal)}
          aria-label="Last page"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </nav>
    </div>
  );
}
