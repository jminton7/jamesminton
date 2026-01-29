"use client";

import { motion } from "framer-motion";
import Badge from "../atoms/Badge";
import Button from "../atoms/Button";

interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  index?: number;
}

export default function ProjectCard({
  title,
  description,
  image,
  technologies,
  liveUrl,
  githubUrl,
  index = 0,
}: ProjectCardProps) {
  return (
    <motion.div
      className="group relative bg-gray-900/50 rounded-2xl overflow-hidden border border-gray-800 hover:border-purple-500/50 transition-all duration-300"
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      {/* Project image/preview */}
      <div className="relative h-48 bg-linear-to-br from-purple-900/30 to-blue-900/30 overflow-hidden">
        {image ? (
          <img src={image} alt={title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-6xl font-bold text-white/10">{title[0]}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent" />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
          {title}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {technologies.slice(0, 4).map((tech) => (
            <Badge key={tech} variant="tech">
              {tech}
            </Badge>
          ))}
          {technologies.length > 4 && (
            <Badge variant="default">+{technologies.length - 4}</Badge>
          )}
        </div>

        <div className="flex gap-3">
          {liveUrl && (
            <Button
              href={liveUrl}
              variant="primary"
              className="text-sm px-4 py-2"
            >
              Live Demo
            </Button>
          )}
          {githubUrl && (
            <Button href={githubUrl} variant="ghost" className="text-sm">
              GitHub →
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
