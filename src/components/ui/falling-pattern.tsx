"use client";

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface FallingPatternProps {
  /** Color for the radial gradient shapes. Defaults to "var(--primary)" */
  color?: string;
  /** Background canvas color. Defaults to "var(--background)" */
  backgroundColor?: string;
  /** Duration of one full animation cycle in seconds. Defaults to 150 */
  duration?: number;
  /** Density multiplier for dot-grid spacing (base 8px). Defaults to 1 */
  density?: number;
  /** Blur intensity for the overlay backdrop-filter. Defaults to "1em" */
  blurIntensity?: string;
  /** Additional CSS classes merged via cn() */
  className?: string;
}

export function FallingPattern({
  color = "var(--primary)",
  backgroundColor = "var(--background)",
  duration = 150,
  density = 1,
  blurIntensity = "1em",
  className,
}: FallingPatternProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className={cn(className)}
      style={{
        pointerEvents: "none",
        position: "absolute",
        inset: 0,
      }}
    >
      {/* Gradient animation layer */}
      <motion.div
        animate={{
          backgroundPosition: shouldReduceMotion ? "0% 0%" : "0% 100%",
        }}
        initial={{ backgroundPosition: "0% 0%" }}
        transition={{ duration, repeat: Infinity, ease: "linear" }}
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1px)`,
          backgroundSize: `${density * 8}px ${density * 8}px`,
          backgroundColor,
          maskImage:
            "radial-gradient(ellipse at center, black 60%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 60%, transparent 80%)",
        }}
      />
      {/* Blur overlay layer */}
      <motion.div
        style={{
          position: "absolute",
          inset: 0,
          backdropFilter: `blur(${blurIntensity})`,
          WebkitBackdropFilter: `blur(${blurIntensity})`,
          transform: "translateZ(0)",
        }}
      />
    </div>
  );
}
