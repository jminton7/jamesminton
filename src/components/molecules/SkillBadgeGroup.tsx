"use client";

import { motion } from "framer-motion";
import Badge from "../atoms/Badge";

/**
 * SkillBadgeGroup - Displays a list of skills as animated badges.
 * Badges appear with a staggered fade-in effect.
 */

interface SkillBadgeGroupProps {
  skills: string[];
  variant?: "default" | "tech" | "highlight";
  className?: string;
}

export default function SkillBadgeGroup({
  skills,
  variant = "tech",
  className = "",
}: SkillBadgeGroupProps) {
  return (
    <motion.div
      className={`flex flex-wrap gap-2 ${className}`}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.05 },
        },
      }}
    >
      {skills.map((skill) => (
        <motion.div
          key={skill}
          variants={{
            hidden: { opacity: 0, scale: 0.8 },
            visible: { opacity: 1, scale: 1 },
          }}
        >
          <Badge variant={variant}>{skill}</Badge>
        </motion.div>
      ))}
    </motion.div>
  );
}
