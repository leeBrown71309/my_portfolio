import React from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";

interface MagneticCharProps {
  char: string;
  className?: string;
  range?: number;
  strength?: number;
}

export const MagneticChar: React.FC<MagneticCharProps> = ({
  char,
  className = "",
  range = 40,
  strength = 0.35,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150 };
  const tx = useSpring(x, springConfig);
  const ty = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    if (Math.abs(distanceX) < range && Math.abs(distanceY) < range) {
      x.set(distanceX * strength);
      y.set(distanceY * strength);
    } else {
      x.set(0);
      y.set(0);
    }
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.span
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: tx, y: ty }}
      className={`inline-block cursor-default select-none transition-colors duration-300 hover:text-primary-500 ${className}`}
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
};

interface MagneticCardProps {
  children: React.ReactNode;
  className?: string;
  strength?: number;
  glowRange?: number;
  glowOpacity?: number;
}

export const MagneticCard: React.FC<MagneticCardProps> = ({
  children,
  className = "",
  strength = 0.05,
  glowRange = 600,
  glowOpacity = 0.15,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 150 };
  const tx = useSpring(x, springConfig);
  const ty = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * strength);
    y.set((e.clientY - centerY) * strength);
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: tx, y: ty }}
      whileHover="hover"
      className={`relative group overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/3 p-8 backdrop-blur-xl transition-colors hover:border-primary-500/30 ${className}`}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: `radial-gradient(${glowRange}px circle at var(--x) var(--y), rgba(99, 102, 241, ${glowOpacity}), transparent 40%)`,
          // @ts-ignore
          "--x": `${mouseX}px`,
          "--y": `${mouseY}px`,
        }}
      />
      {children}
    </motion.div>
  );
};

interface MagneticLinkProps {
  children: React.ReactNode;
  href: string;
  icon?: any;
  primary?: boolean;
}

export const MagneticLink: React.FC<MagneticLinkProps> = ({
  children,
  href,
  icon: Icon = ArrowUpRight,
  primary = false,
}) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 150 };
  const tx = useSpring(x, springConfig);
  const ty = useSpring(y, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set((e.clientX - centerX) * 0.2);
    y.set((e.clientY - centerY) * 0.2);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: tx, y: ty }}
      className={`inline-flex items-center gap-4 transition-all duration-500 group py-2 px-4 rounded-full cursor-pointer ${
        primary ? "text-white" : "text-white/60 hover:text-white"
      }`}
    >
      <Link to={href as any} className="flex items-center gap-4">
        <span className="text-sm md:text-base font-eight uppercase tracking-tighter transition-transform duration-500 group-hover:scale-105">
          {children}
        </span>
        <div
          className={`w-10 h-10 md:w-12 md:h-12 rounded-full border border-white/20 flex items-center justify-center transition-all duration-500 overflow-hidden relative ${
            primary
              ? "group-hover:bg-primary-500 group-hover:border-primary-500"
              : "group-hover:border-white"
          }`}
        >
          <div className="relative w-5 h-5 overflow-hidden">
            <Icon className="w-5 h-5 absolute inset-0 transition-transform duration-500 group-hover:translate-x-6 group-hover:-translate-y-6" />
            <Icon className="w-5 h-5 absolute -left-6 top-6 transition-transform duration-500 group-hover:translate-x-6 group-hover:-translate-y-6" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
