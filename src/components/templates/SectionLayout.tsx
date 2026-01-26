"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Heading from "../atoms/Heading";
import Text from "../atoms/Text";

/**
 * SectionLayout - Reusable section wrapper with centered title and subtitle.
 * Provides consistent padding and max-width constraints.
 * Uses useInView hook for scroll-triggered title animations.
 */

interface SectionLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
}

export default function SectionLayout({
  children,
  title,
  subtitle,
  className = "",
}: SectionLayoutProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className={`py-20 px-6 ${className}`}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5 }}
        >
          <Heading level={2} className="text-white mb-4">
            {title}
          </Heading>
          {subtitle && (
            <Text variant="body" className="max-w-2xl mx-auto">
              {subtitle}
            </Text>
          )}
        </motion.div>
        {children}
      </div>
    </section>
  );
}
