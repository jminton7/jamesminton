"use client";

import { useState, useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

/**
 * TypewriterText - Types out text character by character with a blinking cursor.
 * Creates a terminal-like effect for a developer aesthetic.
 * The full text is always present for screen readers and search engines, and
 * the animation is skipped for visitors who prefer reduced motion.
 */

interface TypewriterTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
  showCursor?: boolean;
}

export default function TypewriterText({
  text,
  className = "",
  delay = 0,
  speed = 50,
  showCursor = true,
}: TypewriterTextProps) {
  const prefersReducedMotion = useReducedMotion();
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    if (prefersReducedMotion) return;

    let typeInterval: ReturnType<typeof setInterval> | undefined;

    const startDelay = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, speed);
    }, delay * 1000);

    return () => {
      clearTimeout(startDelay);
      clearInterval(typeInterval);
    };
  }, [text, delay, speed, prefersReducedMotion]);

  // Blinking cursor effect
  useEffect(() => {
    if (prefersReducedMotion) return;

    const cursorInterval = setInterval(() => {
      setShowCursorBlink((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, [prefersReducedMotion]);

  return (
    <span className={className}>
      <span className="sr-only">{text}</span>
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: prefersReducedMotion ? 0 : delay }}
      >
        <span className="font-mono">
          {prefersReducedMotion ? text : displayedText}
        </span>
        {showCursor && (
          <span
            className={`inline-block w-0.5 h-[1.1em] bg-purple-400 ml-0.5 align-middle ${
              prefersReducedMotion || showCursorBlink || isTyping
                ? "opacity-100"
                : "opacity-0"
            }`}
            style={{ transition: "opacity 0.1s" }}
          />
        )}
      </motion.span>
    </span>
  );
}
