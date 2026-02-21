import { createFileRoute } from "@tanstack/react-router";
import { Trans } from "@lingui/macro";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  Variants,
  AnimatePresence,
} from "framer-motion";
import { Plus } from "lucide-react";
import React from "react";
import { useLoading } from "../context/LoadingContext";

export const Route = createFileRoute("/")({
  component: App,
});

import { MagneticChar, MagneticLink } from "../components/Magnetic";

function App() {
  const { isLoading } = useLoading();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 50, stiffness: 300 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    mouseX.set(clientX);
    mouseY.set(clientY);
  };

  // Parallax values for background blobs
  const bgX = useTransform(smoothX, [0, 2000], [20, -20]);
  const bgY = useTransform(smoothY, [0, 1200], [20, -20]);
  const bgXSlow = useTransform(smoothX, [0, 2000], [10, -10]);
  const bgYSlow = useTransform(smoothY, [0, 1200], [10, -10]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        ease: [0.22, 1, 0.36, 1],
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.5 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 60, filter: "blur(10px)" },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] as any },
    },
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#070b14] relative selection:bg-primary-500 selection:text-white"
    >
      {/* Editorial Grid Overlay */}
      <div className="absolute inset-0 grid grid-cols-4 md:grid-cols-12 pointer-events-none opacity-[0.03]">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="border-r border-white h-full last:border-r-0"
          />
        ))}
      </div>

      {/* Atmospheric Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Layered Mouse Follow Glow */}
        <motion.div
          style={{
            left: smoothX,
            top: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          className="absolute w-[800px] h-[800px] bg-primary-500/5 blur-[120px] rounded-full z-0"
        />
        <motion.div
          style={{
            left: smoothX,
            top: smoothY,
            translateX: "-50%",
            translateY: "-50%",
          }}
          transition={{ type: "spring", damping: 30, stiffness: 200 }}
          className="absolute w-[300px] h-[300px] bg-blue-500/10 blur-[80px] rounded-full z-0"
        />

        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 5, 0],
            opacity: [0.1, 0.15, 0.1],
          }}
          style={{
            x: bgX,
            y: bgY,
          }}
          transition={{ duration: 25, repeat: Infinity }}
          className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-primary-900/40 blur-[150px] rounded-full"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [0, -5, 0],
            opacity: [0.08, 0.12, 0.08],
          }}
          style={{
            x: bgXSlow,
            y: bgYSlow,
          }}
          transition={{ duration: 20, repeat: Infinity }}
          className="absolute -bottom-[20%] -right-[10%] w-[70%] h-[70%] bg-blue-900/30 blur-[150px] rounded-full"
        />
      </div>

      <AnimatePresence mode="wait">
        {!isLoading && (
          <motion.main
            key="home-content"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative z-10 w-full max-w-[1400px] px-6 md:px-12 flex flex-col items-center text-center py-20"
          >
            {/* Top Tagline */}
            <motion.div variants={itemVariants} className="mb-8 md:mb-12">
              <span className="text-primary-500 font-mono text-[9px] md:text-[10px] uppercase tracking-[0.4em] md:tracking-[0.5em] block">
                <Trans>
                  Situé à Dakar | Développeur Full-stack | UI/UX Designer
                </Trans>
              </span>
            </motion.div>

            {/* Hero Title Section */}
            <motion.div
              variants={itemVariants}
              className="relative mb-6  w-full"
            >
              <h1 className="flex flex-col items-center w-full">
                <span className="text-white/30 font-gimbal text-xs md:text-xl uppercase tracking-[0.3em] mb-4 block">
                  <Trans>Hey, je suis</Trans>
                </span>
                <span className="text-white text-7xl  md:text-8xl lg:text-[10rem] font-eight tracking-tighter leading-[0.9] flex flex-wrap justify-center gap-x-[0.2em]">
                  <span className="flex">
                    {"LEE".split("").map((c, i) => (
                      <MagneticChar key={i} char={c} />
                    ))}
                  </span>
                  <span className="flex">
                    {"MAKOSSO".split("").map((c, i) => (
                      <MagneticChar key={i} char={c} />
                    ))}
                  </span>
                </span>
              </h1>
            </motion.div>

            <motion.div variants={itemVariants} className="mb-10 md:mb-14">
              <p className="text-white/40 font-gimbal text-[10px] md:text-xl uppercase tracking-[0.1em] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                <Trans>Mais vous pouvez m’appeler</Trans>
                <span className="text-primary-500 font-eight text-2xl md:text-6xl italic inline-block hover:scale-110 transition-transform cursor-pointer">
                  LEE
                </span>
              </p>
            </motion.div>

            {/* Description & Action Layer */}
            <motion.div
              variants={itemVariants}
              className="max-w-2xl md:max-w-3xl mb-12 md:mb-16 px-4"
            >
              <p className="text-white/40 font-dm-sans text-base md:text-2xl leading-relaxed">
                <span className="text-white/80">Designer graphique</span>,
                {" UX/UI designer "}
                <span className="text-white/80">& développeur full-stack</span>.
                <Trans>
                  {" "}
                  Je sculpte des interfaces numériques où l'esthétique rencontre
                  la performance.
                </Trans>
              </p>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center gap-4 md:gap-12"
            >
              <MagneticLink href="/projects" primary>
                <Trans>Voir mes projets</Trans>
              </MagneticLink>
              <MagneticLink href="/about" icon={Plus}>
                <Trans>En savoir plus</Trans>
              </MagneticLink>
            </motion.div>

            {/* Subtle Decorative Elements */}
            <div className="hidden lg:flex absolute left-8 bottom-8 flex-col gap-4 text-[9px] font-mono tracking-widest text-white/10 uppercase vertical-text">
              <span className="hover:text-primary-500 transition-colors cursor-pointer">
                2026 Edition
              </span>
              <span className="w-px h-12 bg-white/5 mx-auto" />
            </div>

            <div className="hidden lg:flex absolute right-8 bottom-8 flex-col items-end gap-1 text-[9px] font-mono tracking-widest text-white/10 uppercase font-bold">
              <span className="text-white/20 lowercase font-normal italic">
                Status
              </span>
              <span className="text-primary-500/80 animate-pulse flex items-center gap-2">
                <span className="w-1 h-1 rounded-full bg-current" />
                <Trans>Disponible pour les projets</Trans>
              </span>
            </div>
          </motion.main>
        )}
      </AnimatePresence>

      {/* Extreme background noise for editorial feel */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.02] pointer-events-none mix-blend-overlay" />
    </div>
  );
}
