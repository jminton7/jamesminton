"use client";

import { motion } from "framer-motion";
import SocialLinks from "../molecules/SocialLinks";

/**
 * Footer - Site footer with copyright info and social links.
 */

export default function Footer() {
  return (
    <motion.footer
      className="border-t border-gray-800 py-12 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} James Minton. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Built with Next.js, Tailwind CSS & Framer Motion
          </p>
        </div>
        <SocialLinks />
      </div>
    </motion.footer>
  );
}
