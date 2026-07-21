import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";

/**
 * Editorial preloader: paper sheet, wordmark, hairline progress bar.
 * Plays once on first paint, then wipes upward like a page being pulled.
 */
export function Loader() {
  const [done, setDone] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    document.documentElement.style.overflow = "hidden";
    const duration = 1500;
    const start = performance.now();
    let raf = 0;

    const tick = (now: number) => {
      const p = Math.min(1, (now - start) / duration);
      // Ease-out so the bar decelerates into 100%
      setProgress(Math.round((1 - Math.pow(1 - p, 3)) * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        window.setTimeout(() => {
          setDone(true);
          document.documentElement.style.overflow = "";
        }, 300);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.style.overflow = "";
    };
  }, []);

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="fixed inset-0 z-[90] flex flex-col justify-between bg-paper px-4 py-5 text-ink md:px-8"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.7, ease: [0.83, 0, 0.17, 1] }}
          aria-hidden="true"
        >
          <div className="meta flex items-center justify-between text-muted">
            <span>LEEEIGHT — Folio 26</span>
            <span>Portfolio ©2026</span>
          </div>

          <div className="flex flex-col items-start gap-6 md:gap-8">
            <div className="overflow-hidden pb-1">
              <motion.p
                className="font-display text-[15vw] font-black uppercase leading-[0.85] tracking-tight md:text-[9vw]"
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              >
                LEEEIGHT
                <motion.span
                  className="text-accent"
                  animate={{ opacity: [1, 0.15, 1] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                >
                  .
                </motion.span>
              </motion.p>
            </div>
            <div className="w-full max-w-md">
              <div className="h-px w-full bg-line">
                <div
                  className="h-px bg-ink transition-[width] duration-100 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="meta mt-3 flex items-center justify-between text-muted">
                <span>
                  <Trans>Loading experience</Trans>
                </span>
                <span className="tabular-nums">{progress}%</span>
              </div>
            </div>
          </div>

          <div className="meta flex items-center justify-between text-muted">
            <span>Dakar, Senegal</span>
            <motion.span
              className="inline-block text-accent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
            >
              ✳
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
