import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface ShimmerImageProps {
  src: string;
  alt: string;
  className?: string;
  whileHover?: any;
  transition?: any;
  "data-aos"?: string;
  "data-aos-delay"?: string;
  simulateDelay?: number;
}

export function ShimmerImage({
  src,
  alt,
  className = "",
  whileHover,
  transition,
  "data-aos": aos,
  "data-aos-delay": aosDelay,
  simulateDelay,
}: ShimmerImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [showImage, setShowImage] = useState(false);

  useEffect(() => {
    if (isLoaded) {
      const timer = setTimeout(() => {
        setShowImage(true);
      }, simulateDelay || 0);
      return () => clearTimeout(timer);
    }
  }, [isLoaded, simulateDelay]);

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      data-aos={aos}
      data-aos-delay={aosDelay}
    >
      {/* Shimmer Placeholder */}
      <AnimatePresence>
        {!showImage && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 shimmer bg-white/10"
          />
        )}
      </AnimatePresence>

      <motion.img
        src={src}
        alt={alt}
        onLoad={() => setIsLoaded(true)}
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{
          opacity: showImage ? 1 : 0,
          scale: showImage ? 1 : 1.05,
        }}
        whileHover={whileHover}
        transition={
          transition || {
            duration: 1.2,
            ease: [0.22, 1, 0.36, 1],
          }
        }
        className="w-full h-full object-cover"
      />
    </div>
  );
}
