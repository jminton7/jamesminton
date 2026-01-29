"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Badge from "../atoms/Badge";

/**
 * ExperienceCard - Timeline-style card displaying work experience.
 * Features a timeline dot, company info, description, and tech stack badges.
 * Uses useInView hook for scroll-triggered animations.
 */

interface ExperienceCardProps {
  company: string;
  role: string;
  period: string;
  description: string;
  technologies: string[];
  index?: number;
}

export default function ExperienceCard({
  company,
  role,
  period,
  description,
  technologies,
  index = 0,
}: ExperienceCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      className="relative pl-8 pb-12 border-l-2 border-gray-800 last:pb-0"
      initial={{ opacity: 0, x: -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      {/* Timeline dot */}
      <motion.div
        className="absolute -left-2.25 top-0 w-4 h-4 rounded-full bg-linear-to-r from-purple-500 to-blue-500"
        initial={{ scale: 0 }}
        animate={isInView ? { scale: 1 } : { scale: 0 }}
        transition={{ delay: index * 0.1 + 0.1, type: "spring" }}
      />

      <div className="bg-gray-900/50 rounded-xl p-6 border border-gray-800 hover:border-purple-500/50 transition-colors">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-white">{role}</h3>
            <p className="text-purple-400 font-medium">{company}</p>
          </div>
          <span className="text-gray-400 text-sm mt-2 md:mt-0">{period}</span>
        </div>

        <p className="text-gray-300 mb-4">{description}</p>

        <div className="flex flex-wrap gap-2">
          {technologies.map((tech) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
