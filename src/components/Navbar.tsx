import { Link, useLocation } from "@tanstack/react-router";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { t, Trans } from "@lingui/macro";

const MenuIcon = ({
  isOpen,
  isHovered,
}: {
  isOpen: boolean;
  isHovered: boolean;
}) => {
  return (
    <svg
      width="54"
      height="54"
      viewBox="0 0 s54 54"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="relative z-210"
    >
      <motion.circle
        cx="22"
        cy="22"
        r="20"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeDasharray="125"
        initial={{ strokeDashoffset: 125 }}
        animate={{
          strokeDashoffset: isHovered || isOpen ? 0 : 125,
          opacity: isHovered || isOpen ? 1 : 0.3,
        }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Top Line */}
      <motion.path
        d="M 12 16 L 32 16"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 12 16 L 32 16", rotate: 0, y: 0 },
          open: { d: "M 14 14 L 30 30", rotate: 0, y: 0 },
          hover: { d: "M 10 16 L 34 16" },
        }}
        animate={isOpen ? "open" : isHovered ? "hover" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />

      {/* Middle Line */}
      <motion.path
        d="M 12 22 L 32 22"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          closed: { opacity: 1, x: 0 },
          open: { opacity: 0, x: 10 },
          hover: { x: -4, d: "M 12 22 L 28 22" },
        }}
        animate={isOpen ? "open" : isHovered ? "hover" : "closed"}
        transition={{ duration: 0.3 }}
      />

      {/* Bottom Line */}
      <motion.path
        d="M 12 28 L 32 28"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        variants={{
          closed: { d: "M 12 28 L 32 28", rotate: 0, y: 0 },
          open: { d: "M 14 30 L 30 14", rotate: 0, y: 0 },
          hover: { d: "M 16 28 L 32 28" },
        }}
        animate={isOpen ? "open" : isHovered ? "hover" : "closed"}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
      />
    </svg>
  );
};

const MenuItem = ({
  item,
  index,
  onClose,
  activeItem,
}: {
  item: { label: string; href: string };
  index: number;
  onClose: () => void;
  activeItem: string;
}) => {
  const isSelected = activeItem === item.label;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0, rotateX: -45 }}
      animate={{ y: 0, opacity: 1, rotateX: 0 }}
      exit={{ y: -80, opacity: 0, rotateX: 45 }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="perspective-1000"
    >
      <Link
        to={item.href as any}
        onClick={() => {
          onClose();
        }}
        className="group relative flex items-center justify-center py-4 px-8"
      >
        <span
          className={`relative z-10 uppercase text-6xl md:text-8xl font-eight tracking-tighter transition-all duration-500 group-hover:scale-110 ${
            isSelected
              ? "text-primary-500"
              : "text-white hover:text-primary-400"
          }`}
        >
          {item.label}
        </span>

        <motion.div
          initial={{ width: 0 }}
          animate={{ width: isSelected ? "100%" : 0 }}
          whileHover={{ width: "100%" }}
          className="absolute bottom-0 left-0 h-1 bg-primary-500"
          transition={{ duration: 0.4, ease: "easeOut" }}
        />

        {/* Number marker */}
        <span
          className={`absolute -left-4 top-4 text-sm font-mono transition-colors ${
            isSelected
              ? "text-primary-400"
              : "text-primary-500/50 group-hover:text-primary-400"
          }`}
        >
          0{index + 1}
        </span>
      </Link>
    </motion.div>
  );
};

export function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: t`Accueil`, href: "/" },
    { label: t`Projets`, href: "/projects" },
    { label: t`À propos`, href: "/about" },
    { label: t`Contact`, href: "/contact" },
  ];

  const menuVariants: Variants = {
    closed: {
      clipPath: "circle(0% at 94% 6%)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40,
        delay: 0.4,
      },
    },
    open: {
      clipPath: "circle(150% at 94% 6%)",
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2,
      },
    },
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-150 lg:mx-10 transition-all duration-700 ease-[cubic-bezier(0.22, 1, 0.36, 1)] pointer-events-none ${
          scrolled ? "py-4" : "py-8"
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-8 flex items-center justify-between pointer-events-auto">
          <Link to="/" className="group relative z-210">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center"
            >
              <span className="text-3xl font-eight text-white group-hover:text-primary-400 transition-colors duration-300">
                LEEEIGHT
                <span className="text-primary-500 text-4xl">.</span>
              </span>
            </motion.div>
          </Link>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="relative flex items-center justify-center transition-all duration-500 text-white"
            >
              <MenuIcon isOpen={isOpen} isHovered={isHovered} />
            </button>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed inset-0 z-140 bg-[#070b14]/95 backdrop-blur-3xl flex flex-col items-center justify-center"
          >
            {/* Background elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 90, 0],
                  x: [0, 100, 0],
                  y: [0, -100, 0],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -top-1/4 -right-1/4 w-1/2 h-1/2 bg-primary-500/30 rounded-full blur-[120px]"
              />
              <motion.div
                animate={{
                  scale: [1.2, 1, 1.2],
                  rotate: [0, -90, 0],
                  x: [0, -100, 0],
                  y: [0, 100, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute -bottom-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-500/20 rounded-full blur-[120px]"
              />
            </div>

            <div className="flex flex-col items-center gap-4 md:gap-8 relative z-10 w-full px-4">
              {navItems.map((item, i) => {
                const isSelected =
                  item.href === "/"
                    ? location.pathname === "/"
                    : location.pathname.startsWith(item.href);
                return (
                  <MenuItem
                    key={item.label}
                    item={item}
                    index={i}
                    onClose={() => setIsOpen(false)}
                    activeItem={isSelected ? item.label : ""}
                  />
                );
              })}
            </div>

            {/* Bottom Footer Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.6 }}
              className="absolute bottom-12 w-full max-w-7xl px-8 flex flex-col md:flex-row justify-between items-center gap-8 border-t border-white/5 pt-12"
            >
              <div className="hidden md:flex flex-col items-center md:items-start gap-2">
                <span className="text-primary-500/50 text-xs font-mono uppercase tracking-widest">
                  <Trans> Heure locale</Trans>
                </span>
                <span className="text-white font-eight text-lg">
                  {new Date().toLocaleTimeString("fr-FR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>

              <div className="flex flex-col items-center md:items-end gap-2">
                <span className="text-primary-500/50 text-xs font-mono uppercase tracking-widest">
                  <Trans> Contactez-moi</Trans>
                </span>
                <a
                  href="mailto:leeeight71@gmail.com"
                  className="text-white hover:text-primary-500 font-eight text-lg transition-colors"
                >
                  leeeight71@gmail.com
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
