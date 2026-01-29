"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

/**
 * VisitorCounterCard - A prominent visitor counter display for the Fun Stuff section.
 * Shows live stats and links to the source code.
 */

interface VisitorStats {
  totalCount: number;
  uniqueCount: number;
  onlineCount: number;
  onlineCountries: { code: string; count: number }[];
}

interface VisitorCounterCardProps {
  githubUrl?: string;
}

/**
 * Converts a country code to a flag emoji.
 */
function countryCodeToFlag(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return "🌍";
  const codePoints = countryCode
    .toUpperCase()
    .split("")
    .map((char) => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
}

export default function VisitorCounterCard({
  githubUrl = "https://github.com/jminton7/jamesminton/tree/main/src/app/api/visitors",
}: VisitorCounterCardProps) {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/visitors/stats");
        if (response.ok) {
          const result = await response.json();
          setStats(result);
        }
      } catch (err) {
        console.error("VisitorCounterCard error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

    // Refresh stats every 30 seconds to keep online count current
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      className="relative bg-linear-to-br from-gray-900 to-gray-800 rounded-2xl p-6 border border-gray-700 overflow-hidden group hover:border-purple-500/50 transition-colors"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
    >
      {/* Live indicator */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
        </span>
        <span className="text-xs text-green-400 font-mono">LIVE</span>
      </div>

      {/* Icon */}
      <div className="text-4xl mb-4">👀</div>

      {/* Title */}
      <h3 className="text-xl font-bold text-white mb-2">Visitor Counter</h3>
      <p className="text-gray-400 text-sm mb-6">
        Real-time visitor tracking powered by Redis. Built with Node.js using a
        clean OOP architecture (Repository → Service → Controller pattern).
      </p>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <motion.p
            className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-blue-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {isLoading ? "..." : (stats?.totalCount.toLocaleString() ?? "0")}
          </motion.p>
          <p className="text-gray-500 text-xs mt-1">Total Visits</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center">
          <motion.p
            className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-green-400 to-emerald-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring" }}
          >
            {isLoading ? "..." : (stats?.uniqueCount.toLocaleString() ?? "0")}
          </motion.p>
          <p className="text-gray-500 text-xs mt-1">Unique</p>
        </div>
        <div className="bg-gray-800/50 rounded-lg p-3 text-center relative">
          <div className="absolute top-1 right-1">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
          </div>
          <motion.p
            className="text-2xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
          >
            {isLoading ? "..." : (stats?.onlineCount.toLocaleString() ?? "0")}
          </motion.p>
          <p className="text-gray-500 text-xs mt-1">Online Now</p>
        </div>
      </div>

      {/* Online countries */}
      {stats?.onlineCountries && stats.onlineCountries.length > 0 && (
        <motion.div
          className="mb-6 p-3 bg-gray-800/30 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-gray-500 text-xs mb-2">Currently viewing from:</p>
          <div className="flex flex-wrap gap-2">
            {stats.onlineCountries.slice(0, 6).map(({ code, count }) => (
              <span
                key={code}
                className="inline-flex items-center gap-1 px-2 py-1 bg-gray-800 rounded text-sm"
                title={code}
              >
                <span className="text-lg">{countryCodeToFlag(code)}</span>
                {count > 1 && (
                  <span className="text-gray-400 text-xs">×{count}</span>
                )}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Tech stack */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["Node.js", "Redis", "Next.js API", "TypeScript"].map((tech) => (
          <span
            key={tech}
            className="px-2 py-1 text-xs font-mono bg-gray-800 text-gray-400 rounded"
          >
            {tech}
          </span>
        ))}
      </div>

      {/* View code link */}
      <a
        href={githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors group/link"
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
        </svg>
        <span>View Source Code</span>
        <svg
          className="w-3 h-3 transition-transform group-hover/link:translate-x-1"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
          />
        </svg>
      </a>
    </motion.div>
  );
}
