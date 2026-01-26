"use client";

import { motion } from "framer-motion";

/**
 * Heading - Semantic heading component with optional entrance animation.
 * Supports h1-h4 levels with consistent styling for each hierarchy.
 */

interface HeadingProps {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4;
  className?: string;
  animate?: boolean;
}

const headingStyles = {
  1: "text-5xl md:text-7xl font-bold tracking-tight",
  2: "text-3xl md:text-4xl font-bold tracking-tight",
  3: "text-xl md:text-2xl font-semibold",
  4: "text-lg font-medium",
};

export default function Heading({
  children,
  level = 1,
  className = "",
  animate = true,
}: HeadingProps) {
  const content = (
    <span className={`${headingStyles[level]} ${className}`}>{children}</span>
  );

  if (!animate) {
    return level === 1 ? (
      <h1>{content}</h1>
    ) : level === 2 ? (
      <h2>{content}</h2>
    ) : level === 3 ? (
      <h3>{content}</h3>
    ) : (
      <h4>{content}</h4>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {level === 1 ? (
        <h1>{content}</h1>
      ) : level === 2 ? (
        <h2>{content}</h2>
      ) : level === 3 ? (
        <h3>{content}</h3>
      ) : (
        <h4>{content}</h4>
      )}
    </motion.div>
  );
}
