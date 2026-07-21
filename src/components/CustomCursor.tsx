import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

/**
 * Editorial cursor: a hairline ink square trailing the pointer,
 * a vermillion dot glued to it. The square rotates 45° and grows
 * over interactive elements. Desktop only.
 */
export function CustomCursor() {
  const reduce = useReducedMotion();
  const [visible, setVisible] = useState(false);
  const [hovering, setHovering] = useState(false);

  const mx = useMotionValue(-100);
  const my = useMotionValue(-100);

  const ringX = useSpring(mx, { stiffness: 260, damping: 24, mass: 0.6 });
  const ringY = useSpring(my, { stiffness: 260, damping: 24, mass: 0.6 });
  const dotX = useSpring(mx, { stiffness: 1200, damping: 60, mass: 0.2 });
  const dotY = useSpring(my, { stiffness: 1200, damping: 60, mass: 0.2 });

  useEffect(() => {
    if (reduce) return;

    const onMove = (e: MouseEvent) => {
      mx.set(e.clientX);
      my.set(e.clientY);
      setVisible(true);
      const target = e.target as HTMLElement;
      setHovering(!!target.closest("a, button, [role='button']"));
    };
    const onLeave = () => setVisible(false);

    window.addEventListener("mousemove", onMove, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    return () => {
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
    };
  }, [reduce, mx, my]);

  if (reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block" aria-hidden="true">
      {/* Ink square — trails with spring lag */}
      <motion.div
        className="absolute h-7 w-7 border border-ink mix-blend-difference"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{
          opacity: visible ? 0.9 : 0,
          scale: hovering ? 1.55 : 1,
          rotate: hovering ? 45 : 0,
        }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      />
      {/* Vermillion dot — glued to the pointer */}
      <motion.div
        className="absolute h-1.5 w-1.5 bg-accent"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ opacity: visible ? 1 : 0, scale: hovering ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
    </div>
  );
}
