import { useCallback, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { dynamicActivate, i18n } from "../i18n";
import { ScrambleText } from "./ScrambleText";

/**
 * The language switch, reimagined as a mechanical flip plate.
 * Click (or press L): the plate flips and letters clack through
 * random glyphs before settling on the new locale.
 */
export function LanguageDial() {
  const locale = (i18n.locale || "en") as "en" | "fr";
  const next = locale === "en" ? "fr" : "en";
  const [busy, setBusy] = useState(false);

  const toggle = useCallback(async () => {
    if (busy) return;
    setBusy(true);
    await dynamicActivate(next);
    document.documentElement.lang = next;
    window.setTimeout(() => setBusy(false), 500);
  }, [busy, next]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
      if (e.key.toLowerCase() === "l") toggle();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch language to ${next === "en" ? "English" : "Français"}`}
      title="Switch language (L)"
      className="group flex items-center gap-2 border border-line-strong bg-paper px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors duration-300 hover:border-ink"
      style={{ perspective: 200 }}
    >
      <span className="hidden text-muted sm:inline">Lang</span>
      <motion.span
        key={locale}
        initial={{ rotateX: -90 }}
        animate={{ rotateX: 0 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative inline-flex h-5 w-7 items-center justify-center bg-ink font-bold text-paper"
        style={{ transformOrigin: "center top" }}
      >
        <ScrambleText text={locale.toUpperCase()} speed={0.5} interval={40} />
      </motion.span>
      <span className="text-muted transition-colors duration-300 group-hover:text-accent">
        {next}
      </span>
    </button>
  );
}
