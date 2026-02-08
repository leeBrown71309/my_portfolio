import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-100 hidden md:block">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col items-center gap-4 p-2 rounded-full glass-card border-primary-500/10 shadow-2xl backdrop-blur-2xl"
      >
        <button
          onClick={() => !isDark && toggleTheme()}
          className={`p-2.5 rounded-full transition-all duration-500 ${
            isDark
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/40 scale-110"
              : "text-slate-400 hover:text-primary-500 hover:bg-primary-50"
          }`}
          title="Dark Mode"
        >
          <Moon size={18} strokeWidth={2.5} />
        </button>

        <div className="w-8 h-px bg-slate-200 dark:bg-primary-500/20" />

        <button
          onClick={() => isDark && toggleTheme()}
          className={`p-2.5 rounded-full transition-all duration-500 ${
            !isDark
              ? "bg-primary-500 text-white shadow-lg shadow-primary-500/40 scale-110"
              : "text-slate-400 hover:text-primary-500 hover:bg-slate-800"
          }`}
          title="Light Mode"
        >
          <Sun size={18} strokeWidth={2.5} />
        </button>
      </motion.div>

      {/* Decorative vertical line */}
      <motion.div
        initial={{ height: 0 }}
        animate={{ height: "40px" }}
        transition={{ delay: 0.5 }}
        className="w-px bg-linear-to-b from-transparent via-primary-500/30 to-transparent mx-auto mt-4"
      />
    </div>
  );
}
