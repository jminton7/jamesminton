"use client";

import { motion } from "framer-motion";
import SocialLinks from "../molecules/SocialLinks";
import VisitorCounter from "../atoms/VisitorCounter";
import { useDevJoke } from "../atoms/DevJokes";

/**
 * Footer - Site footer with copyright info, social links, visitor counter, and dev jokes.
 */

export default function Footer() {
  const { joke, getNewJoke } = useDevJoke();

  return (
    <motion.footer
      className="border-t border-gray-800 py-12 px-6"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <div className="max-w-7xl mx-auto">
        {/* Dev joke */}
        {joke && (
          <motion.div
            className="mb-6 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            key={joke}
          >
            <p
              className="text-gray-500 text-sm italic cursor-pointer hover:text-gray-400 transition-colors"
              onClick={getNewJoke}
              title="Click for another joke"
            >
              💡 {joke}
            </p>
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <p className="text-gray-400 text-sm">
              © {new Date().getFullYear()} James Minton. All rights reserved.
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Built with Next.js, Tailwind CSS & Framer Motion
            </p>
            <VisitorCounter className="mt-2" />
          </div>
          <SocialLinks />
        </div>
      </div>
    </motion.footer>
  );
}
