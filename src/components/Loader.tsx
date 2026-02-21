import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Trans } from "@lingui/macro";
import { useLingui } from "@lingui/react";
import { useLoading } from "../context/LoadingContext";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  appearAt: number;
  pulseDelay: number;
}

export function Loader() {
  const { isLoading, setIsLoading } = useLoading();
  const [progress, setProgress] = useState(0);
  const { i18n } = useLingui();
  const [stars, setStars] = useState<Star[]>([]);

  // Generate stars on mount to avoid hydration mismatches
  useEffect(() => {
    const generatedStars = Array.from({ length: 60 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 1,
      appearAt: Math.random() * 90, // Stars appear at varied progress percentages
      pulseDelay: Math.random() * 2,
    }));
    setStars(generatedStars);
  }, []);

  // Handle initial page load & language change
  useEffect(() => {
    if (!isLoading) return;

    setProgress(0);
    const duration = i18n.locale ? 2500 : 3500;
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
          {/* Progressive Starfield */}
          <div className="absolute inset-0 z-0 pointer-events-none">
            {stars.map((star) => {
              const hasAppeared = progress >= star.appearAt;
              return (
                <motion.div
                  key={star.id}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{
                    opacity: hasAppeared ? [0.2, 0.8, 0.4] : 0,
                    scale: hasAppeared ? 1 : 0,
                  }}
                  transition={{
                    opacity: {
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                      delay: star.pulseDelay,
                    },
                    scale: { duration: 0.8, ease: "easeOut" },
                  }}
                  className="absolute rounded-full bg-white transition-opacity duration-500"
                  style={{
                    left: `${star.x}%`,
                    top: `${star.y}%`,
                    width: `${star.size}px`,
                    height: `${star.size}px`,
                    boxShadow: "0 0 10px 1px rgba(255, 255, 255, 0.4)",
                  }}
                />
              );
            })}
          </div>

          {/* Animated Background Gradients */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30 z-0">
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

          <div className="relative z-20 flex flex-col items-center">
            {/* Logo Animation */}
            <div className="mb-12 overflow-hidden">
              <motion.div
                initial={{ y: 100 }}
                animate={{ y: 0 }}
                transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center"
              >
                <span className="text-5xl md:text-7xl font-eight text-white tracking-tighter drop-shadow-xl">
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
            <div className="w-64 md:w-80 h-[2px] bg-white/5 relative overflow-hidden rounded-full glass-card border-none">
              <motion.div
                className="absolute inset-y-0 left-0 bg-linear-to-r from-primary-600 via-primary-400 to-blue-400 shadow-[0_0_15px_rgba(99,102,241,0.8)]"
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
                <Trans>Chargement de l'expérience</Trans>
              </span>
              <span className="text-white font-eight text-sm tabular-nums text-glow">
                {Math.round(progress)}%
              </span>
            </motion.div>
          </div>

          {/* Orbital Rings - Outer */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border border-white/5 rounded-full relative"
            >
              {/* Outer Trail */}
              <div
                className="absolute inset-0 rounded-full mix-blend-plus-lighter"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 200deg, rgba(129, 140, 248, 1) 360deg)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100%))",
                  mask: "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100%))",
                }}
              />
              <div
                className="absolute inset-0 rounded-full mix-blend-plus-lighter blur-[4px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 200deg, rgba(129, 140, 248, 0.6) 360deg)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent calc(100% - 4px), black calc(100%))",
                  mask: "radial-gradient(closest-side, transparent calc(100% - 4px), black calc(100%))",
                }}
              />
              {/* Outer Planet (Tech box) */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary-400/80 rounded-sm shadow-[0_0_20px_#818cf8] rotate-45 backdrop-blur-md border border-white/40 z-10" />
            </motion.div>
          </div>

          {/* Orbital Rings - Middle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] pointer-events-none z-10">
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border border-white/10 border-dashed rounded-full relative"
            >
              {/* Middle Trails */}
              <div
                className="absolute inset-0 rounded-full mix-blend-plus-lighter"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(59, 130, 246, 1) 270deg, transparent 340deg)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100%))",
                  mask: "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100%))",
                }}
              />
              <div
                className="absolute inset-0 rounded-full mix-blend-plus-lighter blur-[4px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(59, 130, 246, 0.6) 270deg, transparent 340deg)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent calc(100% - 4px), black calc(100%))",
                  mask: "radial-gradient(closest-side, transparent calc(100% - 4px), black calc(100%))",
                }}
              />
              <div
                className="absolute inset-0 rounded-full mix-blend-plus-lighter"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 0deg, transparent 90deg, rgba(255, 255, 255, 0.8) 90deg, transparent 150deg, transparent 360deg)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent calc(100% - 1.5px), black calc(100%))",
                  mask: "radial-gradient(closest-side, transparent calc(100% - 1.5px), black calc(100%))",
                }}
              />
              {/* Middle Planet 1 */}
              <div className="absolute top-1/2 -left-1.5 -translate-y-1/2 w-4 h-4 bg-blue-500 rounded-full shadow-[0_0_20px_#3b82f6] blur-[1px] z-10" />
              {/* Middle Planet 2 (Small moon) */}
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_15px_#ffffff] z-10" />
            </motion.div>
          </div>

          {/* Orbital Rings - Inner */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] pointer-events-none z-10">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              className="w-full h-full border border-white/5 rounded-full relative"
            >
              {/* Inner Trail */}
              <div
                className="absolute inset-0 rounded-full mix-blend-plus-lighter"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 60deg, rgba(79, 70, 229, 1) 180deg, transparent 180deg, transparent 360deg)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100%))",
                  mask: "radial-gradient(closest-side, transparent calc(100% - 2px), black calc(100%))",
                }}
              />
              <div
                className="absolute inset-0 rounded-full mix-blend-plus-lighter blur-[3px]"
                style={{
                  background:
                    "conic-gradient(from 0deg, transparent 60deg, rgba(79, 70, 229, 0.6) 180deg, transparent 180deg, transparent 360deg)",
                  WebkitMask:
                    "radial-gradient(closest-side, transparent calc(100% - 3px), black calc(100%))",
                  mask: "radial-gradient(closest-side, transparent calc(100% - 3px), black calc(100%))",
                }}
              />
              {/* Inner Planet  */}
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2.5 h-2.5 bg-primary-600 rounded-full shadow-[0_0_15px_#4f46e5] z-10" />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
