import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useLingui } from "@lingui/react";
import { useLoading } from "../context/LoadingContext";

export function Loader() {
  const { isLoading, setIsLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const { i18n } = useLingui();

  // Handle initial page load & language change
  useEffect(() => {
    // Only start if we are in loading state
    if (!isLoading) return;

    setProgress(0);
    const duration = i18n.locale ? 2500 : 3500; // Shorter for language change, longer for first hit
    const step = 100 / (duration / 20);

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + step;
      });
    }, 20);

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, duration);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [i18n.locale, isLoading, setIsLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 },
          }}
          className="fixed inset-0 z-1000 bg-[#070b14] flex flex-col items-center justify-center overflow-hidden"
        >
          {/* Animated Background Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, -50, 0],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
              className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-500/20 rounded-full blur-[120px]"
            />
            <motion.div
              animate={{
                scale: [1.2, 1, 1.2],
                x: [0, -50, 0],
                y: [0, 50, 0],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/10 rounded-full blur-[120px]"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Animation */}
            <div className="mb-12 overflow-hidden">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center"
              >
                <span className="text-5xl md:text-7xl font-eight text-white tracking-tighter">
                  LEEEIGHT
                  <motion.span
                    animate={{
                      opacity: [0, 1, 0],
                      scale: [1, 1.5, 1],
                    }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-primary-500"
                  >
                    .
                  </motion.span>
                </span>
              </motion.div>
            </div>

            {/* Progress Bar Container */}
            <div className="w-64 md:w-80 h-[2px] bg-white/5 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>

            {/* Percentage Display */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex flex-col items-center gap-1"
            >
              <span className="text-primary-500 font-mono text-xs tracking-[0.2em] font-bold uppercase">
                Loading Experience
              </span>
              <span className="text-white/40 font-eight text-sm tabular-nums">
                {Math.round(progress)}%
              </span>
            </motion.div>
          </div>

          {/* Abstract geometric shapes */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-white/5 rounded-full pointer-events-none"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] border border-white/5 rounded-full pointer-events-none"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
