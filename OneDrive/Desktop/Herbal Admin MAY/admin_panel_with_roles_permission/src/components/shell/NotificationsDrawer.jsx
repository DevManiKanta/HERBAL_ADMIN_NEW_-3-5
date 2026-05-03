import { useEffect } from "react";
import { Bell, X } from "lucide-react";

/**
 * Slide-in panel from the right. Pass `items` when you have real feeds (e.g. from API).
 * @param {{ id: string|number, title: string, body?: string, time?: string }[]} items
 */
export default function NotificationsDrawer({ open, onClose, items = [] }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open]);

  const hasItems = Array.isArray(items) && items.length > 0;

  return (
    <>
      <div
        className={`fixed inset-0 z-[60] bg-black/45 transition-opacity duration-300 dark:bg-black/60 ${
          open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!open}
        onClick={onClose}
      />

      <aside
        className={`fixed right-0 top-0 z-[70] flex h-full w-full max-w-[20rem] flex-col border-l border-slate-200/80 bg-white shadow-[-12px_0_40px_rgba(0,0,0,0.12)] transition-transform duration-300 ease-out dark:border-neutral-700 dark:bg-neutral-900 dark:shadow-[-12px_0_40px_rgba(0,0,0,0.5)] sm:max-w-sm ${
          open
            ? "translate-x-0 pointer-events-auto"
            : "translate-x-full pointer-events-none"
        }`}
        aria-hidden={!open}
        aria-label="Notifications panel"
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 dark:bg-neutral-800">
              <Bell className="h-4 w-4 text-slate-700 dark:text-neutral-200" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-white">
                Notifications
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-neutral-400">
                Alerts and updates for your workspace
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white"
            aria-label="Close notifications"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-3 py-4">
          {!hasItems ? (
            <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 dark:bg-neutral-800">
                <Bell className="h-7 w-7 text-slate-400 dark:text-neutral-500" />
              </div>
              <p className="text-sm font-semibold text-slate-800 dark:text-neutral-100">
                No feeds available
              </p>
              <p className="mt-2 max-w-[14rem] text-xs leading-relaxed text-slate-500 dark:text-neutral-400">
                When there are new orders, stock alerts, or system messages,
                they will appear here. You can connect your notification API
                later to populate this list.
              </p>
            </div>
          ) : (
            <ul className="space-y-2">
              {items.map((n) => (
                <li
                  key={n.id}
                  className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3 text-left dark:border-neutral-800 dark:bg-neutral-800/60"
                >
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {n.title}
                  </p>
                  {n.body && (
                    <p className="mt-1 text-xs leading-relaxed text-slate-600 dark:text-neutral-300">
                      {n.body}
                    </p>
                  )}
                  {n.time && (
                    <p className="mt-2 text-[10px] font-medium uppercase tracking-wide text-slate-400 dark:text-neutral-500">
                      {n.time}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
}
