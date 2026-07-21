import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { Trans } from "@lingui/macro";
import { useIsDark } from "../hooks/useIsDark";

/**
 * Theme switch — same mechanical flip-plate language as the language dial.
 */
export function ThemeToggle() {
  const isDark = useIsDark();

  const toggle = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {
      // private mode — theme just won't persist
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title="Switch theme"
      className="group flex items-center gap-2 border border-line-strong bg-paper px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 hover:border-ink"
      style={{ perspective: 200 }}
    >
      <motion.span
        key={isDark ? "dark" : "light"}
        initial={{ rotateX: -90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="flex h-5 w-7 items-center justify-center bg-ink text-paper"
        style={{ transformOrigin: "center top" }}
      >
        {isDark ? (
          <Moon className="h-3 w-3" strokeWidth={2} />
        ) : (
          <Sun className="h-3 w-3" strokeWidth={2} />
        )}
      </motion.span>
      <span className="hidden text-muted transition-colors duration-300 group-hover:text-accent sm:inline">
        {isDark ? <Trans>Dark</Trans> : <Trans>Light</Trans>}
      </span>
    </button>
  );
}
