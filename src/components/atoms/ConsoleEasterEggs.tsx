"use client";

import { useEffect } from "react";

/**
 * ConsoleEasterEggs - Logs fun developer messages to the browser console.
 * A delightful surprise for devs who inspect the page!
 */

const ASCII_ART = `
     _                           __  __ _       _              
    | |                         |  \\/  (_)     | |             
    | | __ _ _ __ ___   ___  ___| \\  / |_ _ __ | |_ ___  _ __  
 _  | |/ _\` | '_ \` _ \\ / _ \\/ __| |\\/| | | '_ \\| __/ _ \\| '_ \\ 
| |_| | (_| | | | | | |  __/\\__ \\ |  | | | | | | || (_) | | | |
 \\___/ \\__,_|_| |_| |_|\\___||___/_|  |_|_|_| |_|\\__\\___/|_| |_|
`;

const CONSOLE_MESSAGES = [
  {
    type: "info",
    message: "👋 Hey there, fellow developer!",
    style: "font-size: 16px; font-weight: bold; color: #a855f7;",
  },
  {
    type: "info",
    message:
      "🔍 Curious about the code? Check it out: https://github.com/jminton7",
    style: "font-size: 14px; color: #60a5fa;",
  },
  {
    type: "info",
    message: "💼 Looking to hire? Email me: james7minton@gmail.com",
    style: "font-size: 14px; color: #34d399;",
  },
  {
    type: "info",
    message: "🎮 Try the Konami Code: ↑↑↓↓←→←→BA",
    style: "font-size: 14px; color: #fbbf24;",
  },
  {
    type: "info",
    message:
      "⚡ Built with Next.js, TypeScript, Tailwind CSS, and Framer Motion",
    style: "font-size: 12px; color: #9ca3af;",
  },
];

export default function ConsoleEasterEggs() {
  useEffect(() => {
    // Only run in browser
    if (typeof window === "undefined") return;

    // Clear previous logs and show our messages
    console.clear();

    // ASCII Art header
    console.log(
      `%c${ASCII_ART}`,
      "color: #a855f7; font-family: monospace; font-size: 10px;",
    );

    // Fun messages
    CONSOLE_MESSAGES.forEach(({ message, style }) => {
      console.log(`%c${message}`, style);
    });

    // Easter egg: hidden message
    console.log(
      "%c🥚 You found the console! Here's a virtual cookie: 🍪",
      "font-size: 12px; color: #f472b6; background: #1f2937; padding: 4px 8px; border-radius: 4px;",
    );
  }, []);

  // This component doesn't render anything
  return null;
}
