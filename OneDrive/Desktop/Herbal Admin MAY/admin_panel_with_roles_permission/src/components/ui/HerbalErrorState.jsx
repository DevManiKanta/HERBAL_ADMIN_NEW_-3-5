import { AlertCircle, RefreshCw } from "lucide-react";

/**
 * Inline / panel error with optional retry — herbal styling.
 */
export default function HerbalErrorState({
  title = "Something went wrong",
  message,
  onRetry,
  compact = false,
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-red-50/90 via-amber-50/50 to-emerald-50/40 text-center shadow-lg ${compact ? "gap-2 p-4" : "gap-4 p-8"}`}
      role="alert"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-800 shadow-md">
        <AlertCircle className="h-7 w-7" aria-hidden />
      </div>
      <div className="max-w-md space-y-1">
        <h3 className="font-display text-lg font-semibold text-emerald-950">
          {title}
        </h3>
        {message && (
          <p className="text-sm leading-relaxed text-emerald-900/75">{message}</p>
        )}
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-xl bg-[linear-gradient(90deg,#388e3c_0%,#9e7d31_100%)] px-5 py-2.5 text-sm font-semibold text-white shadow-md transition hover:brightness-110 active:scale-[0.98]"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      )}
    </div>
  );
}
