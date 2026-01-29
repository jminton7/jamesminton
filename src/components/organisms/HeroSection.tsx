"use client";

import { motion } from "framer-motion";
import AnimatedText from "../atoms/AnimatedText";
import TypewriterText from "../atoms/TypewriterText";
import SocialLinks from "../molecules/SocialLinks";

/**
 * HeroSection - Full-screen landing section with animated name, title, and CTAs.
 * Features a typewriter effect for the tagline and scroll indicator animation.
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
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 md:px-6 pt-16 md:pt-0">
      <div className="max-w-4xl mx-auto text-center z-10">
        {/* Terminal-style greeting */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-mono text-purple-400 bg-gray-900/50 px-3 py-2 md:px-4 rounded-lg border border-gray-800">
            <span className="text-green-400">$</span>
            <TypewriterText
              text="welcome --to my portfolio"
              delay={0.3}
              speed={40}
              className="text-gray-300"
            />
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
          <h2 className="text-2xl md:text-3xl font-light text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400 mb-6">
            {title}
          </h2>
        </motion.div>

        {/* Typewriter tagline */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <p className="text-lg text-gray-400">
            <TypewriterText text={tagline} delay={1.8} speed={25} />
          </p>
        </motion.div>

        <SocialLinks className="justify-center mt-8" />
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
