"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

type BreathingStrokeProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Organic breathing animation for painted strokes.
 * Creates a subtle, artisanal vibration by duplicating the stroke,
 * slightly offsetting it, and animating opacity/scale/translate.
 * 
 * Values controlling the subtlety:
 * - scale: 1 to 1.01 (very minimal expansion)
 * - opacity: 0.88 to 1 (subtle flickering of the top layer)
 * - translate: ±1px to ±2px (micro-movements)
 * - duration: 4s to 6s (slow, irregular breathing)
 */
export function BreathingStroke({ children, className = "" }: BreathingStrokeProps) {
  return (
    <div className={`relative ${className}`}>
      {/* Base layer: static, keeps the original shape intact */}
      <div className="relative z-0">{children}</div>

      {/* Top layer: subtle organic movement */}
      <motion.div
        className="absolute inset-0 z-10 pointer-events-none"
        animate={{
          x: [1, 2.5, 0.5, 2, 1],
          y: [1, 0, 2, 0.5, 1],
          scale: [1, 1.005, 0.998, 1.003, 1],
          opacity: [0.6, 0.85, 0.5, 0.75, 0.6],
        }}
        transition={{
          duration: 5.5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "mirror",
          times: [0, 0.25, 0.5, 0.75, 1],
        }}
        aria-hidden="true"
      >
        {children}
      </motion.div>
    </div>
  );
}
