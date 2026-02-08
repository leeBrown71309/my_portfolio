import { useLingui } from "@lingui/react";
import { dynamicActivate } from "../i18n";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, X } from "lucide-react";
import { useState } from "react";

const languages = [
  { code: "fr", label: "FR" },
  { code: "en", label: "EN" },
];

export function LanguageSwitcher() {
  const { i18n: lingui } = useLingui();
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleLanguage = async (locale: string) => {
    if (lingui.locale !== locale) {
      await dynamicActivate(locale);
    }
    setIsExpanded(false);
  };

  return (
    <div className="fixed left-5 top-1/2 -translate-y-1/2 z-150 ">
      <motion.div
        animate={{
          height: isExpanded ? "108px" : "36px",
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
          mass: 0.8,
        }}
        className="glass-card border-primary-500/10 shadow-2xl backdrop-blur-3xl overflow-hidden flex flex-col items-center rounded-full w-9"
      >
        {/* Toggle Button - Top Fixed Part */}
        <div className="h-9 w-9 flex items-center justify-center shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-1.5 rounded-full transition-colors duration-300 ${
              isExpanded
                ? "bg-primary-500 text-white shadow-lg shadow-primary-500/20"
                : "text-primary-400 hover:bg-primary-500/10"
            }`}
          >
            <AnimatePresence mode="wait">
              {isExpanded ? (
                <motion.div
                  key="close"
                  initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
                  animate={{ opacity: 1, rotate: 0, scale: 1 }}
                  exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  <X size={14} strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.div
                  key="globe"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.15 }}
                >
                  <Globe size={14} strokeWidth={2.5} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Vertical Options - Bottom Part with perfect spacing */}
        <div className="flex flex-col items-center gap-2 pb-2">
          {languages.map((lang, index) => (
            <motion.button
              key={lang.code}
              initial={false}
              animate={{
                opacity: isExpanded ? 1 : 0,
                scale: isExpanded ? 1 : 0.6,
                y: isExpanded ? 0 : -10,
                pointerEvents: isExpanded ? "auto" : "none",
              }}
              transition={{
                delay: isExpanded ? 0.05 + index * 0.05 : 0,
                duration: 0.2,
              }}
              onClick={() => toggleLanguage(lang.code)}
              className={`w-7 h-7 flex items-center justify-center rounded-full text-[9px] font-black transition-all duration-300 ${
                lingui.locale === lang.code
                  ? "bg-white text-primary-500 shadow-md shadow-primary-500/20"
                  : "text-slate-400 hover:text-primary-400 hover:bg-primary-500/5 group"
              }`}
            >
              {lang.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Extreme Minimalist Indicator */}
      {!isExpanded && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="w-px h-6 bg-linear-to-b from-transparent via-primary-500/20 to-transparent mx-auto mt-3"
        />
      )}
    </div>
  );
}
