import { Leaf } from "lucide-react";
import { resolveAppDisplayName } from "../../config/brand";
import { useTheme } from "../../context/ThemeContext";

/**
 * Decorative brand strip — copy only; name from prop or Sridevi Herbal default.
 */
export default function BrandRibbon({ appName }) {
  const { isDark } = useTheme();
  const name = resolveAppDisplayName(appName);
  const title = `Welcome to ${name} – Purely Natural Care`;

  return (
    <div
      role="region"
      aria-label="Brand announcement"
      className={`relative overflow-hidden shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] ${
        isDark
          ? "bg-neutral-900"
          : "bg-herbal-gradient bg-[length:100%_100%]"
      }`}
    >
      <div className="relative mx-auto flex max-w-[1600px] flex-col items-center justify-center gap-0.5 px-4 py-2.5 text-center sm:flex-row sm:gap-3 sm:py-3">
        <p className="font-display flex flex-wrap items-center justify-center gap-2 text-[0.95rem] font-semibold tracking-tight text-white drop-shadow-sm sm:text-lg md:text-xl">
          <Leaf
            className="h-4 w-4 shrink-0 text-emerald-200 sm:h-5 sm:w-5"
            strokeWidth={2}
            aria-hidden
          />
          {title}
          <Leaf
            className="h-4 w-4 shrink-0 text-emerald-200 sm:h-5 sm:w-5"
            strokeWidth={2}
            aria-hidden
          />
        </p>
        <p className="max-w-xl font-sans text-[11px] font-medium text-white/90 dark:text-neutral-300 sm:text-xs md:text-sm">
          Trusted by crores · Free delivery · Cash on delivery
        </p>
      </div>
    </div>
  );
}
