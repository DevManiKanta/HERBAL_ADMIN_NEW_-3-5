import { Moon, Sun } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

/**
 * Black & white light / dark control.
 */
export default function ThemeToggle({ className = "" }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full bg-neutral-200 p-1 dark:bg-neutral-700 ${className}`}
      role="group"
      aria-label="Theme"
    >
      <button
        type="button"
        onClick={() => setTheme("light")}
        aria-pressed={theme === "light"}
        title="Light theme"
        className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
          theme === "light"
            ? "bg-black text-white shadow-md"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        }`}
      >
        <Sun className="h-4 w-4" strokeWidth={2.25} />
      </button>
      <button
        type="button"
        onClick={() => setTheme("dark")}
        aria-pressed={theme === "dark"}
        title="Dark theme"
        className={`flex h-8 w-8 items-center justify-center rounded-full transition ${
          theme === "dark"
            ? "bg-white text-black shadow-md dark:bg-white dark:text-black"
            : "text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100"
        }`}
      >
        <Moon className="h-4 w-4" strokeWidth={2.25} />
      </button>
    </div>
  );
}
