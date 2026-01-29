"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * KonamiCode - Easter egg that triggers when user enters the Konami Code.
 * ↑↑↓↓←→←→BA
 */

const KONAMI_CODE = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "KeyB",
  "KeyA",
];

export default function KonamiCode() {
  const [inputSequence, setInputSequence] = useState<string[]>([]);
  const [isActivated, setIsActivated] = useState(false);
  const [showMessage, setShowMessage] = useState(false);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.code;

    setInputSequence((prev) => {
      const newSequence = [...prev, key].slice(-KONAMI_CODE.length);

      // Check if the sequence matches
      if (newSequence.join(",") === KONAMI_CODE.join(",")) {
        setIsActivated(true);
        setShowMessage(true);

        // Hide message after 5 seconds
        setTimeout(() => setShowMessage(false), 5000);

        // Log to console
        console.log(
          "%c🔫 30 LIVES! Now you're ready to take on Red Falcon! 💀",
          "font-size: 20px; color: #fbbf24; background: linear-gradient(90deg, #7c3aed, #3b82f6); padding: 10px 20px; border-radius: 8px; font-weight: bold;",
        );

        return [];
      }

      return newSequence;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      {/* Celebration overlay */}
      <AnimatePresence>
        {showMessage && (
          <motion.div
            className="fixed inset-0 z-100 pointer-events-none flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Confetti-like particles */}
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-3 h-3 rounded-full"
                style={{
                  background: [
                    "#a855f7",
                    "#3b82f6",
                    "#22c55e",
                    "#eab308",
                    "#ef4444",
                  ][i % 5],
                  left: `${Math.random() * 100}%`,
                  top: "-20px",
                }}
                animate={{
                  y: ["0vh", "100vh"],
                  x: [0, (Math.random() - 0.5) * 200],
                  rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
                }}
                transition={{
                  duration: 2 + Math.random() * 2,
                  delay: Math.random() * 0.5,
                  ease: "easeIn",
                }}
              />
            ))}

            {/* Achievement popup */}
            <motion.div
              className="bg-linear-to-r from-purple-600 to-blue-600 px-8 py-6 rounded-2xl shadow-2xl border border-white/20"
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ type: "spring", damping: 15 }}
            >
              <div className="text-center">
                <motion.div
                  className="text-5xl mb-3"
                  animate={{ rotate: [0, -10, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  🔫
                </motion.div>
                <h3 className="text-2xl font-bold text-white mb-2">
                  30 Lives Unlocked!
                </h3>
                <p className="text-purple-200">
                  Just like Contra... you&apos;re gonna need &apos;em!
                </p>
                <p className="text-sm text-purple-300 mt-2 font-mono">
                  ↑↑↓↓←→←→BA
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rainbow border effect when activated (persists) */}
      {isActivated && (
        <div
          className="fixed inset-0 pointer-events-none z-99"
          style={{
            background:
              "linear-gradient(90deg, rgba(168,85,247,0.1), rgba(59,130,246,0.1), rgba(34,197,94,0.1), rgba(234,179,8,0.1), rgba(239,68,68,0.1))",
            animation: "rainbow-shift 3s linear infinite",
          }}
        />
      )}

      <style jsx>{`
        @keyframes rainbow-shift {
          0%,
          100% {
            opacity: 0.3;
          }
          50% {
            opacity: 0.1;
          }
        }
      `}</style>
    </>
  );
}
