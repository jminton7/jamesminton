"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * AboutSection - Displays bio and career highlights on the home page.
 * Uses useInView for scroll-triggered animations.
 */

interface AboutSectionProps {
  bio: string[];
  highlights: { label: string; value: string }[];
}

export default function AboutSection({ bio, highlights }: AboutSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About Me
          </h2>
          <p className="text-gray-400">Get to know me better</p>
        </motion.div>

        {/* Bio */}
        <div className="space-y-6 mb-16">
          {bio.map((paragraph, index) => (
            <motion.p
              key={index}
              className="text-gray-300 text-lg leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.5 }}
            >
              {paragraph}
            </motion.p>
          ))}
        </div>

        {/* Highlights */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {highlights.map((highlight, index) => (
            <motion.div
              key={highlight.label}
              className="bg-gray-900/50 rounded-xl p-4 md:p-6 border border-gray-800 text-center hover:border-purple-500/30 transition-colors"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={
                isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }
              }
              transition={{ delay: 0.3 + index * 0.1, duration: 0.4 }}
              whileHover={{ y: -5 }}
            >
              <p className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">
                {highlight.value}
              </p>
              <p className="text-gray-400 text-xs md:text-sm mt-2">
                {highlight.label}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Download CV Button */}
        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <motion.a
            href="/cv.pdf"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900/50 text-gray-300 font-medium rounded-lg border border-gray-700 hover:border-purple-500/50 hover:text-white transition-all"
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Download CV
          </motion.a>
        </motion.div>
      </div>
    </section>
  );
}
