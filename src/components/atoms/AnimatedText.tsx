"use client";

import { motion, Variants } from "framer-motion";

/**
 * AnimatedText - Animates text word-by-word with a staggered reveal effect.
 * Each word fades in and slides up sequentially for a dynamic entrance.
 */

interface AnimatedTextProps {
  text: string;
  className?: string;
  delay?: number;
  as?: "div" | "h1";
}

export default function AnimatedText({
  text,
  className = "",
  delay = 0,
  as = "div",
}: AnimatedTextProps) {
  const words = text.split(" ");
  const Component = as === "h1" ? motion.h1 : motion.div;

  const container: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: delay },
    },
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <Component
      className={`flex flex-wrap ${className}`}
      variants={container}
      initial="hidden"
      animate="visible"
    >
      {words.map((word, index) => (
        <motion.span variants={child} key={index} className="mr-2">
          {word}
          {index < words.length - 1 && " "}
        </motion.span>
      ))}
    </Component>
  );
}
