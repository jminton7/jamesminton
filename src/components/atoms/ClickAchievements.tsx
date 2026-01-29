"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ClickAchievements - Tracks clicks and unlocks silly achievements.
 * A gamification easter egg that rewards curious users.
 */

interface Achievement {
  id: string;
  title: string;
  description: string;
  clicks: number;
  icon: string;
}

const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-click",
    title: "Hello World!",
    description: "You clicked something!",
    clicks: 1,
    icon: "👋",
  },
  {
    id: "curious",
    title: "Curious Clicker",
    description: "10 clicks - You're exploring!",
    clicks: 10,
    icon: "🔍",
  },
  {
    id: "dedicated",
    title: "Dedicated User",
    description: "50 clicks - That's dedication!",
    clicks: 50,
    icon: "⭐",
  },
  {
    id: "power-user",
    title: "Power User",
    description: "100 clicks - You really like clicking!",
    clicks: 100,
    icon: "💪",
  },
  {
    id: "clicker-pro",
    title: "Clicker Pro",
    description: "250 clicks - Impressive commitment!",
    clicks: 250,
    icon: "🏆",
  },
  {
    id: "finger-athlete",
    title: "Finger Athlete",
    description: "500 clicks - Your finger is a champion!",
    clicks: 500,
    icon: "🥇",
  },
  {
    id: "click-master",
    title: "Click Master",
    description: "1000 clicks - You've achieved enlightenment!",
    clicks: 1000,
    icon: "🧘",
  },
  {
    id: "legend",
    title: "Legendary Clicker",
    description: "2000 clicks - You ARE the click!",
    clicks: 2000,
    icon: "👑",
  },
];

interface Toast {
  id: string;
  achievement: Achievement;
}

export default function ClickAchievements() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const clickCountRef = useRef(0);
  const unlockedIdsRef = useRef<Set<string>>(new Set());
  const initializedRef = useRef(false);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined" || initializedRef.current) return;
    initializedRef.current = true;

    const savedClicks = localStorage.getItem("jm-click-count");
    const savedUnlocked = localStorage.getItem("jm-achievements");

    if (savedClicks) {
      clickCountRef.current = parseInt(savedClicks, 10);
    }
    if (savedUnlocked) {
      unlockedIdsRef.current = new Set(JSON.parse(savedUnlocked));
    }
  }, []);

  // Listen for clicks
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleClick = () => {
      clickCountRef.current += 1;
      const newCount = clickCountRef.current;

      // Save to localStorage
      localStorage.setItem("jm-click-count", newCount.toString());

      // Check for new achievements
      ACHIEVEMENTS.forEach((achievement) => {
        if (
          newCount >= achievement.clicks &&
          !unlockedIdsRef.current.has(achievement.id)
        ) {
          // Mark as unlocked IMMEDIATELY to prevent duplicates
          unlockedIdsRef.current.add(achievement.id);

          // Save unlocked achievements
          localStorage.setItem(
            "jm-achievements",
            JSON.stringify([...unlockedIdsRef.current]),
          );

          // Show toast
          const toastId = `${achievement.id}-${Date.now()}`;
          setToasts((prev) => [...prev, { id: toastId, achievement }]);

          // Log to console
          console.log(
            `%c🏆 Achievement Unlocked: ${achievement.title}!%c\n${achievement.description}`,
            "font-size: 14px; font-weight: bold; color: #fbbf24;",
            "font-size: 12px; color: #9ca3af;",
          );

          // Remove toast after delay
          setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== toastId));
          }, 4000);
        }
      });
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            className="bg-gray-900/95 backdrop-blur-sm border border-yellow-500/50 rounded-lg p-4 shadow-lg shadow-yellow-500/20 min-w-[280px]"
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{toast.achievement.icon}</span>
              <div>
                <p className="text-yellow-400 font-bold text-sm">
                  🏆 Achievement Unlocked!
                </p>
                <p className="text-white font-semibold">
                  {toast.achievement.title}
                </p>
                <p className="text-gray-400 text-xs">
                  {toast.achievement.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
