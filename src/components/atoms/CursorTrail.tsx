"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * CursorTrail - Creates a trail of code symbols following the mouse cursor.
 * A fun visual effect that adds developer flair to the page.
 */

interface TrailParticle {
  id: number;
  x: number;
  y: number;
  symbol: string;
}

const CODE_SYMBOLS = [
  "{",
  "}",
  "<",
  ">",
  "/",
  ";",
  "(",
  ")",
  "[",
  "]",
  "=",
  "+",
  "*",
  "&",
  "|",
  "//",
  "=>",
  "&&",
  "||",
  "!=",
  "===",
  "++",
];

export default function CursorTrail() {
  const [particles, setParticles] = useState<TrailParticle[]>([]);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    // Don't run on mobile/touch devices
    if (typeof window === "undefined") return;
    if ("ontouchstart" in window) {
      setIsEnabled(false);
      return;
    }

    let particleId = 0;
    let lastSpawnTime = 0;
    const spawnInterval = 80; // ms between particles

    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawnTime < spawnInterval) return;
      lastSpawnTime = now;

      const newParticle: TrailParticle = {
        id: particleId++,
        x: e.clientX,
        y: e.clientY,
        symbol: CODE_SYMBOLS[Math.floor(Math.random() * CODE_SYMBOLS.length)],
      };

      setParticles((prev) => [...prev.slice(-12), newParticle]);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Remove particles after animation
  useEffect(() => {
    if (particles.length === 0) return;

    const timeout = setTimeout(() => {
      setParticles((prev) => prev.slice(1));
    }, 600);

    return () => clearTimeout(timeout);
  }, [particles]);

  if (!isEnabled) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.span
            key={particle.id}
            className="absolute font-mono text-sm font-bold text-purple-400/60"
            initial={{
              x: particle.x - 8,
              y: particle.y - 8,
              opacity: 0.8,
              scale: 1,
            }}
            animate={{
              y: particle.y - 30,
              opacity: 0,
              scale: 0.5,
              rotate: Math.random() > 0.5 ? 20 : -20,
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.6,
              ease: "easeOut",
            }}
          >
            {particle.symbol}
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  );
}
