"use client";

import { motion } from "framer-motion";

/**
 * Badge - A small label used to display tags, skills, or status indicators.
 * Supports three visual variants: default, tech, and highlight.
 */

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "tech" | "highlight";
  className?: string;
}

const badgeStyles = {
  default: "bg-gray-800 text-gray-300 border border-gray-700",
  tech: "bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-200 border border-purple-700/50",
  highlight:
    "bg-gradient-to-r from-amber-900/50 to-orange-900/50 text-amber-200 border border-amber-700/50",
};

export default function Badge({
  children,
  variant = "default",
  className = "",
}: BadgeProps) {
  return (
    <motion.span
      className={`${badgeStyles[variant]} ${className} px-3 py-1 rounded-full text-sm font-medium inline-block`}
      whileHover={{ scale: 1.1 }}
      transition={{ type: "spring", stiffness: 400, damping: 10 }}
    >
      {children}
    </motion.span>
  );
}
