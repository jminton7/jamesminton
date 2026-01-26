"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import Footer from "../organisms/Footer";

/**
 * PageLayout - Main page wrapper with animated transitions between routes.
 * Uses pathname as key to trigger animations on navigation.
 * Includes the site Footer.
 */

interface PageLayoutProps {
  children: React.ReactNode;
}

export default function PageLayout({ children }: PageLayoutProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen relative">
      <motion.main
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="pt-20 relative z-10"
      >
        {children}
      </motion.main>
      <Footer />
    </div>
  );
}
