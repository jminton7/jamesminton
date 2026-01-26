"use client";

import { motion } from "framer-motion";

/**
 * Button - A flexible call-to-action component.
 * Renders as a link (with href) or button element.
 * Variants: primary (filled), secondary (outlined), ghost (minimal).
 */

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "ghost";
  onClick?: () => void;
  href?: string;
  className?: string;
}

const buttonStyles = {
  primary:
    "bg-white text-black hover:bg-gray-200 px-6 py-3 rounded-full font-medium",
  secondary:
    "bg-transparent border border-white text-white hover:bg-white hover:text-black px-6 py-3 rounded-full font-medium",
  ghost: "bg-transparent text-white hover:text-gray-300 px-4 py-2 font-medium",
};

export default function Button({
  children,
  variant = "primary",
  onClick,
  href,
  className = "",
}: ButtonProps) {
  const Component = href ? motion.a : motion.button;

  return (
    <Component
      href={href}
      onClick={onClick}
      className={`${buttonStyles[variant]} ${className} transition-all duration-300 cursor-pointer inline-block`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {children}
    </Component>
  );
}
