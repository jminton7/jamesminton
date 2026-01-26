"use client";

import { motion } from "framer-motion";
import Link from "next/link";

/**
 * NavLink - Navigation link with animated active state indicator.
 * Uses a simple scale animation for the underline to avoid scroll-related glitches.
 */

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

export default function NavLink({
  href,
  children,
  isActive = false,
}: NavLinkProps) {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Link
        href={href}
        className={`relative px-4 py-2 text-sm font-medium transition-colors ${
          isActive ? "text-white" : "text-gray-400 hover:text-white"
        }`}
      >
        {children}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-500 to-blue-500"
          initial={false}
          animate={{
            scaleX: isActive ? 1 : 0,
            opacity: isActive ? 1 : 0,
          }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          style={{ originX: 0.5 }}
        />
      </Link>
    </motion.div>
  );
}
