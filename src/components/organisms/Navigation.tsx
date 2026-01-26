"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import NavLink from "../molecules/NavLink";

/**
 * Navigation - Fixed top navigation bar with animated entrance.
 * Highlights the current page using URL pathname matching.
 */

const navItems = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/fun-stuff", label: "Fun Stuff" },
  { href: "/skills", label: "Skills" },
  { href: "/contact", label: "Contact" },
];

export default function Navigation() {
  const pathname = usePathname();

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-black/30 border-b border-white/10"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <motion.a
          href="/"
          className="text-xl font-bold text-white"
          whileHover={{ scale: 1.05 }}
        >
          JM
        </motion.a>
        <div className="flex items-center gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              isActive={pathname === item.href}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>
    </motion.nav>
  );
}
