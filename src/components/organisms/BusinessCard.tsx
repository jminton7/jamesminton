"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * BusinessCard - Interactive holographic business card with 3D tilt effect.
 *
 * Features:
 * - Collapsed mini-card that floats in the corner
 * - Expands to full-size modal on click
 * - Mouse-following 3D rotation and holographic shine
 * - Smooth spring animations throughout
 */

// ============================================================================
// Constants
// ============================================================================

const CARD_DIMENSIONS = { width: 420, height: 260 };
const TILT_INTENSITY = 20; // Max degrees of rotation
const SPRING_CONFIG = { stiffness: 400, damping: 30 };

// ============================================================================
// Types
// ============================================================================

interface BusinessCardProps {
  name: string;
  title: string;
  email: string;
  location: string;
}

export default function BusinessCard({
  name,
  title,
  email,
  location,
}: BusinessCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovering, setIsHovering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setMousePosition({ x, y });
  };

  const handleClose = () => {
    setIsExpanded(false);
  };

  // Calculate 3D rotation based on mouse position (centered at 0.5, 0.5)
  const rotateX = isHovering ? (mousePosition.y - 0.5) * -TILT_INTENSITY : 0;
  const rotateY = isHovering ? (mousePosition.x - 0.5) * TILT_INTENSITY : 0;

  // Holographic gradient shifts with mouse movement for rainbow effect
  const holographicAngle = 110 + mousePosition.x * 50 + mousePosition.y * 30;

  return (
    <>
      {/* Collapsed mini card */}
      <motion.div
        className="fixed top-24 left-6 z-40 cursor-pointer"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        onClick={() => setIsExpanded(true)}
        whileHover={{ scale: 1.05 }}
      >
        <div className="relative overflow-hidden bg-gray-900 rounded-xl p-4 border border-purple-500/30 shadow-lg shadow-purple-500/10">
          <div className="absolute inset-0 opacity-30 bg-linear-to-r from-transparent via-purple-500/30 to-transparent" />
          <div className="relative flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </div>
            <div>
              <p className="text-white font-semibold text-sm">{name}</p>
              <p className="text-purple-400 text-xs">{title}</p>
            </div>
          </div>
          <p className="text-gray-500 text-xs mt-2 relative">
            Click to expand →
          </p>
        </div>
      </motion.div>

      {/* Expanded card overlay */}
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
            />

            {/* Card Container - NO rotation on this wrapper */}
            <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
              <motion.div
                ref={cardRef}
                className="relative pointer-events-auto"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => {
                  setIsHovering(false);
                  setMousePosition({ x: 0.5, y: 0.5 });
                }}
                style={{ perspective: "1000px" }}
              >
                {/* Close button - ON the card */}
                <motion.button
                  className="absolute -top-3 -right-3 z-10 text-white bg-gray-800 hover:bg-gray-700 transition-colors p-1.5 rounded-full border border-purple-500/30"
                  onClick={handleClose}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </motion.button>

                {/* The actual 3D rotating card */}
                <motion.div
                  className="relative rounded-2xl cursor-grab active:cursor-grabbing"
                  style={{
                    width: CARD_DIMENSIONS.width,
                    height: CARD_DIMENSIONS.height,
                    transformStyle: "preserve-3d",
                  }}
                  animate={{ rotateX, rotateY }}
                  transition={{ type: "spring", ...SPRING_CONFIG }}
                >
                  {/* Card base */}
                  <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-gray-800 via-gray-900 to-gray-800" />

                  {/* Holographic rainbow effect */}
                  <div
                    className="absolute inset-0 rounded-2xl transition-opacity duration-300"
                    style={{
                      opacity: isHovering ? 0.6 : 0.2,
                      backgroundImage: `linear-gradient(${holographicAngle}deg, rgba(255, 0, 128, 0.15) 0%, rgba(255, 128, 0, 0.15) 25%, rgba(0, 255, 128, 0.15) 50%, rgba(0, 128, 255, 0.15) 75%, rgba(128, 0, 255, 0.15) 100%)`,
                    }}
                  />

                  {/* Glossy shine sweep - using backgroundImage instead of background */}
                  <div
                    className="absolute inset-0 rounded-2xl pointer-events-none transition-opacity duration-200"
                    style={{
                      backgroundImage: `radial-gradient(ellipse 80% 50% at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0.1) 30%, transparent 70%)`,
                      opacity: isHovering ? 1 : 0,
                    }}
                  />

                  {/* Border glow */}
                  <div
                    className="absolute inset-0 rounded-2xl border border-purple-500/40 transition-all duration-300"
                    style={{
                      boxShadow: isHovering
                        ? "0 0 30px rgba(168, 85, 247, 0.3), 0 0 60px rgba(59, 130, 246, 0.2)"
                        : "0 0 20px rgba(168, 85, 247, 0.2)",
                    }}
                  />

                  {/* Card content */}
                  <div className="relative z-10 h-full p-8 flex flex-col justify-between">
                    {/* Top section */}
                    <div className="flex items-start gap-5">
                      <div
                        className="w-20 h-20 rounded-xl bg-linear-to-br from-purple-500 via-purple-600 to-blue-600 flex items-center justify-center text-white text-2xl font-bold"
                        style={{
                          boxShadow: "0 10px 40px rgba(168, 85, 247, 0.4)",
                        }}
                      >
                        {name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="pt-1">
                        <h3 className="text-2xl font-bold text-white tracking-tight">
                          {name}
                        </h3>
                        <p className="text-purple-300 font-medium text-lg">
                          {title}
                        </p>
                      </div>
                    </div>

                    {/* Bottom section */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm">{email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-gray-300">
                        <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                          <svg
                            className="w-4 h-4 text-purple-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                        </div>
                        <span className="text-sm">{location}</span>
                      </div>
                    </div>
                  </div>

                  {/* Decorative corner accent */}
                  <div className="absolute bottom-4 right-4 opacity-20">
                    <svg
                      className="w-16 h-16 text-purple-400"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                  </div>
                </motion.div>

                {/* 3D Shadow */}
                <motion.div
                  className="absolute inset-0 rounded-2xl -z-10"
                  style={{
                    background:
                      "linear-gradient(to bottom, rgba(168, 85, 247, 0.3), rgba(59, 130, 246, 0.3))",
                    filter: "blur(40px)",
                    transform: "translateY(20px) scale(0.9)",
                  }}
                  animate={{
                    rotateX: rotateX * 0.5,
                    rotateY: rotateY * 0.5,
                  }}
                />
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
