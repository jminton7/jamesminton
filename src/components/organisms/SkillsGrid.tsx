"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * SkillsGrid - Displays skill categories in a responsive grid.
 * Each category shows an icon, name, and list of skills as hover-interactive badges.
 * Uses useInView hook for scroll-triggered animations.
 */

interface SkillsGridProps {
  categories: {
    name: string;
    icon?: string;
    skills: string[];
  }[];
}

function SkillCategory({
  category,
  index,
}: {
  category: { name: string; icon?: string; skills: string[] };
  index: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      key={category.name}
      className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/30 transition-colors"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
    >
      <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-3">
        <span className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-lg">
          {category.icon || "💻"}
        </span>
        {category.name}
      </h3>

      <div className="flex flex-wrap gap-2">
        {category.skills.map((skill) => (
          <motion.span
            key={skill}
            className="px-3 py-2 rounded-lg bg-gray-800/80 text-gray-300 text-sm font-medium border border-gray-700/50 hover:border-purple-500/50 hover:text-purple-300 hover:bg-purple-500/10 transition-all cursor-default"
            whileHover={{ scale: 1.05 }}
          >
            {skill}
          </motion.span>
        ))}
      </div>
    </motion.div>
  );
}

export default function SkillsGrid({ categories }: SkillsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {categories.map((category, catIndex) => (
        <SkillCategory
          key={category.name}
          category={category}
          index={catIndex}
        />
      ))}
    </div>
  );
}
