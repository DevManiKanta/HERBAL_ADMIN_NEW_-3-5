import HerbalSpinner from "./HerbalSpinner";

export default function HerbalPageLoader({
  message = "Loading your workspace…",
  fullScreen = false,
}) {
  const wrap = fullScreen
    ? "fixed inset-0 z-[100] flex min-h-screen items-center justify-center bg-[linear-gradient(135deg,rgba(236,253,245,0.97)_0%,rgba(255,251,235,0.98)_100%)] dark:bg-neutral-950"
    : "flex min-h-[180px] flex-col items-center justify-center gap-4 rounded-2xl bg-white/90 px-6 py-12 shadow-inner dark:bg-neutral-900/90";

  return (
    <div className={wrap}>
      <HerbalSpinner size="lg" />
      <p className="max-w-xs text-center text-sm font-medium text-emerald-900/80 dark:text-neutral-200">
        {message}
      </p>
    </div>
  );
}
