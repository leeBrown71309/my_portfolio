import { AnimatePresence, motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { Trans, msg } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { ArrowUpRight } from "lucide-react";
import { useMenu } from "../context/MenuContext";
import { EMAIL, socials } from "../data/about";

const EASE = [0.83, 0, 0.17, 1] as const;

const LINKS = [
  { to: "/", num: "01", label: msg`Home`, hint: msg`The front page` },
  { to: "/projects", num: "02", label: msg`Works`, hint: msg`Six selected cases` },
  { to: "/about", num: "03", label: msg`Profile`, hint: msg`The person behind the ink` },
  { to: "/contact", num: "04", label: msg`Contact`, hint: msg`Start a conversation` },
] as const;

/**
 * Navigation as a printed table of contents: full-screen ink overlay,
 * monumental numbered entries that flood with paper on hover.
 */
export function MenuOverlay() {
  const { isOpen, close } = useMenu();
  const { i18n } = useLingui();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    if (isOpen) {
      window.addEventListener("keydown", onKey);
      document.documentElement.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", onKey);
      document.documentElement.style.overflow = "";
    };
  }, [isOpen, close]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ink-island fixed inset-0 z-[70] flex flex-col bg-ink text-paper"
          initial={{ clipPath: "inset(0 0 100% 0)" }}
          animate={{ clipPath: "inset(0 0 0% 0)" }}
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.6, ease: EASE }}
          role="dialog"
          aria-modal="true"
          aria-label="Table of contents"
        >
          {/* Top row */}
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-paper/15 px-4 md:px-8">
            <span className="meta text-paper/50">
              <Trans>Table of contents</Trans>
            </span>
            <button
              type="button"
              onClick={close}
              aria-label="Close menu"
              className="group flex items-center gap-2.5 border border-paper/40 px-3.5 py-2 text-paper transition-colors duration-300 hover:border-paper hover:bg-paper hover:text-ink"
            >
              <span className="meta">
                <Trans>Close</Trans>
              </span>
              <span className="relative block h-2.5 w-2.5">
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 rotate-45 bg-current" />
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 -rotate-45 bg-current" />
              </span>
            </button>
          </div>

          {/* Entries */}
          <nav className="flex flex-1 flex-col justify-center px-4 md:px-8">
            {LINKS.map((link, i) => (
              <motion.div
                key={link.to}
                initial={{ opacity: 0, y: 32 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16, transition: { duration: 0.2 } }}
                transition={{
                  duration: 0.55,
                  delay: 0.15 + i * 0.07,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <Link
                  to={link.to}
                  onClick={close}
                  className="group relative flex items-baseline gap-4 overflow-hidden border-b border-paper/15 py-4 md:gap-8 md:py-5"
                >
                  {/* Paper flood on hover */}
                  <span className="absolute inset-0 origin-bottom scale-y-0 bg-paper transition-transform duration-[450ms] ease-[cubic-bezier(0.83,0,0.17,1)] group-hover:scale-y-100" />
                  <span className="meta relative z-10 text-accent transition-colors duration-300 group-hover:text-accent">
                    {link.num}
                  </span>
                  <span className="relative z-10 font-display text-[13vw] font-black uppercase leading-[0.9] tracking-tight transition-colors duration-300 group-hover:text-ink md:text-[6.5vw]">
                    {i18n._(link.label)}
                  </span>
                  <span className="meta relative z-10 ml-auto hidden text-paper/40 transition-colors duration-300 group-hover:text-ink/60 md:inline">
                    {i18n._(link.hint)}
                  </span>
                  <ArrowUpRight
                    className="relative z-10 h-6 w-6 shrink-0 -translate-x-2 translate-y-2 self-center opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100 group-hover:text-ink md:h-8 md:w-8"
                    strokeWidth={1.5}
                  />
                </Link>
              </motion.div>
            ))}
          </nav>

          {/* Bottom row */}
          <motion.div
            className="flex shrink-0 flex-col gap-3 border-t border-paper/15 px-4 py-5 md:flex-row md:items-center md:justify-between md:px-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.45, duration: 0.4 }}
          >
            <a
              href={`mailto:${EMAIL}`}
              className="meta text-paper/70 transition-colors hover:text-accent"
            >
              {EMAIL}
            </a>
            <div className="flex gap-5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.url}
                  target="_blank"
                  rel="noreferrer"
                  className="meta text-paper/50 transition-colors hover:text-paper"
                >
                  {s.label}
                </a>
              ))}
            </div>
            <span className="meta text-paper/40">
              <Trans>Dakar, Senegal — GMT+0</Trans>
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
