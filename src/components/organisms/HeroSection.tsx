"use client";

import { motion } from "framer-motion";
import AnimatedText from "../atoms/AnimatedText";
import Text from "../atoms/Text";
import Button from "../atoms/Button";
import SocialLinks from "../molecules/SocialLinks";

/**
 * HeroSection - Full-screen landing section with animated name, title, and CTAs.
 * Features a scroll indicator animation at the bottom.
 */

interface HeroSectionProps {
  name: string;
  title: string;
  tagline: string;
}

export default function HeroSection({
  name,
  title,
  tagline,
}: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-6">
      <div className="max-w-4xl mx-auto text-center z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="text-sm font-medium text-purple-400 tracking-widest uppercase">
            Welcome to my portfolio
          </span>
        </motion.div>

        <AnimatedText
          text={name}
          className="text-5xl md:text-7xl font-bold text-white justify-center mb-4"
          delay={0.2}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400 mb-6">
            {title}
          </h2>
        </motion.div>

        <Text variant="subtitle" delay={0.8} className="max-w-2xl mx-auto mb-8">
          {tagline}
        </Text>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          <Button href="#experience">View My Work</Button>
          <Button href="/cv.pdf" variant="secondary">
            <span className="flex items-center gap-2">
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
            </span>
          </Button>
        </motion.div>

        <SocialLinks className="justify-center mt-12" />
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-white"
            animate={{ y: [0, 16, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </motion.div>
    </section>
  );
}
