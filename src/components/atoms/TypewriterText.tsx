"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";

/**
 * TypewriterText - Types out text character by character with a blinking cursor.
 * Creates a terminal-like effect for a developer aesthetic.
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
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCursorBlink, setShowCursorBlink] = useState(true);

  useEffect(() => {
    const startDelay = setTimeout(() => {
      setIsTyping(true);
      let currentIndex = 0;

      const typeInterval = setInterval(() => {
        if (currentIndex < text.length) {
          setDisplayedText(text.slice(0, currentIndex + 1));
          currentIndex++;
        } else {
          clearInterval(typeInterval);
          setIsTyping(false);
        }
      }, speed);

      return () => clearInterval(typeInterval);
    }, delay * 1000);

    return () => clearTimeout(startDelay);
  }, [text, delay, speed]);

  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursorBlink((prev) => !prev);
    }, 530);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <motion.span
      className={`${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay }}
    >
      <span className="font-mono">{displayedText}</span>
      {showCursor && (
        <span
          className={`inline-block w-[2px] h-[1.1em] bg-purple-400 ml-0.5 align-middle ${
            showCursorBlink || isTyping ? "opacity-100" : "opacity-0"
          }`}
          style={{ transition: "opacity 0.1s" }}
        />
      )}
    </motion.span>
  );
}
