"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Badge from "../atoms/Badge";

/**
 * FunProjectCard - Showcase card for experimental/side projects.
 * Displays project icon, description, tech stack, and status indicator.
 * Uses useInView hook for scroll-triggered animations.
 */

interface FunProjectCardProps {
  title: string;
  description: string;
  icon: string;
  technologies: string[];
  status: "coming-soon" | "in-progress" | "live";
  index?: number;
}

const statusConfig = {
  "coming-soon": {
    label: "Coming Soon",
    className: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  },
  "in-progress": {
    label: "In Progress",
    className: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  },
  live: {
    label: "Live",
    className: "bg-green-500/20 text-green-300 border-green-500/30",
  },
};

export default function FunProjectCard({
  title,
  description,
  icon,
  technologies,
  status,
  index = 0,
}: FunProjectCardProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const statusInfo = statusConfig[status];

  return (
    <motion.div
      ref={ref}
      className="group relative bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -5 }}
    >
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Status badge */}
      <div className="absolute top-4 right-4">
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${statusInfo.className}`}
        >
          {statusInfo.label}
        </span>
      </div>

      {/* Icon */}
      <motion.div
        className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center text-3xl mb-4 border border-purple-500/20"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        {icon}
      </motion.div>

      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
        {title}
      </h3>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2">
        {technologies.map((tech) => (
          <Badge key={tech} variant="tech">
            {tech}
          </Badge>
        ))}
      </div>

      {/* Animated border gradient on hover */}
      <motion.div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(168, 85, 247, 0.1), transparent)",
          backgroundSize: "200% 100%",
        }}
        animate={{
          backgroundPosition: ["200% 0", "-200% 0"],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </motion.div>
  );
}
