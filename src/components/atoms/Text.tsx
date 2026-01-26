"use client";

import { motion } from "framer-motion";

/**
 * Text - Paragraph component with variant-based styling.
 * Variants: body (default), caption (small/muted), subtitle (larger intro text).
 * Includes a subtle fade-in animation.
 */

interface TextProps {
  children: React.ReactNode;
  variant?: "body" | "caption" | "subtitle";
  className?: string;
  delay?: number;
}

const textStyles = {
  body: "text-base md:text-lg text-gray-300",
  caption: "text-sm text-gray-400",
  subtitle: "text-xl md:text-2xl text-gray-300 font-light",
};

export default function Text({
  children,
  variant = "body",
  className = "",
  delay = 0,
}: TextProps) {
  return (
    <motion.p
      className={`${textStyles[variant]} ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
    >
      {children}
    </motion.p>
  );
}
