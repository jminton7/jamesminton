"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * VisitorCounter - Displays visitor count with a subtle animation.
 * Fetches data from the /api/visitors endpoint on mount.
 */

interface VisitorData {
  visitorNumber: number;
  isNewVisitor: boolean;
  message: string;
  stats: {
    totalCount: number;
    uniqueCount: number;
  };
}

interface VisitorCounterProps {
  className?: string;
}

export default function VisitorCounter({
  className = "",
}: VisitorCounterProps) {
  const [data, setData] = useState<VisitorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const trackVisitor = async () => {
      try {
        const response = await fetch("/api/visitors");

        if (!response.ok) {
          throw new Error("Failed to fetch visitor data");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("VisitorCounter error:", err);
        setError("Could not load visitor count");
      } finally {
        setIsLoading(false);
      }
    };

    trackVisitor();
  }, []);

  // Don't render anything while loading or on error
  if (isLoading || error || !data) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.4 }}
        className={`text-gray-500 text-xs font-mono ${className}`}
      >
        <span className="inline-flex items-center gap-1.5">
          <span className="text-purple-400">👀</span>
          <span>
            Visitor #{data.visitorNumber.toLocaleString()}
            {data.isNewVisitor && (
              <motion.span
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ml-1 text-green-400"
              >
                (new!)
              </motion.span>
            )}
          </span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-600">
            {data.stats.uniqueCount.toLocaleString()} unique
          </span>
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
