import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export function CustomCursor() {
  const [isPointer, setIsPointer] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for high-end feel
  const springConfig = { damping: 25, stiffness: 250 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  const dotX = useSpring(mouseX, { damping: 40, stiffness: 800 });
  const dotY = useSpring(mouseY, { damping: 40, stiffness: 800 });

  const scaleMotionValue = useMotionValue(1);
  const scaleSpring = useSpring(scaleMotionValue, {
    damping: 25,
    stiffness: 250,
  });

  useEffect(() => {
    scaleMotionValue.set(isPointer ? 1.5 : 1);
  }, [isPointer, scaleMotionValue]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      if (!isVisible) setIsVisible(true);

      const target = e.target as HTMLElement;
      const isClickable =
        window.getComputedStyle(target).cursor === "pointer" ||
        target.tagName === "BUTTON" ||
        target.tagName === "A" ||
        target.closest("button") ||
        target.closest("a");

      setIsPointer(!!isClickable);
    };

    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [mouseX, mouseY, isVisible]);

  return (
    <div className="fixed inset-0 pointer-events-none z-9999 mix-blend-difference hidden md:block">
      {/* Main Outer Ring */}
      <motion.div
        className="absolute w-8 h-8 border border-white rounded-full flex items-center justify-center"
        style={{
          x: cursorX,
          y: cursorY,
          left: -16,
          top: -16,
          opacity: isVisible ? 0.8 : 0,
          scale: scaleSpring,
        }}
      />

      {/* Center Core Dot */}
      <motion.div
        className="absolute w-1.5 h-1.5 bg-primary-500 rounded-full"
        style={{
          x: dotX,
          y: dotY,
          left: -3,
          top: -3,
          opacity: isVisible ? 1 : 0,
          scale: isPointer ? 0.5 : 1,
        }}
        transition={{ scale: { type: "spring", stiffness: 300, damping: 20 } }}
      />

      {/* Trailing Glow / Light Effect */}
      <motion.div
        className="absolute w-24 h-24 bg-primary-500/50 blur-3xl rounded-full"
        style={{
          x: cursorX,
          y: cursorY,
          left: -48,
          top: -48,
          opacity: isVisible && !isPointer ? 0.4 : 0,
        }}
      />
    </div>
  );
}
