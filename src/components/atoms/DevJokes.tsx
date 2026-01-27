"use client";

import { useEffect, useState } from "react";

/**
 * DevJokes - Displays random programming jokes in the console.
 * Also exports a hook to get jokes for UI display.
 */

export const DEV_JOKES = [
  "Why do programmers prefer dark mode? Because light attracts bugs! 🐛",
  "There are only 10 types of people: those who understand binary and those who don't.",
  "A SQL query walks into a bar, walks up to two tables and asks: 'Can I join you?'",
  "Why do Java developers wear glasses? Because they can't C#!",
  "!false - It's funny because it's true.",
  "A programmer's wife tells him: 'Go to the store and buy milk. If they have eggs, get a dozen.' He returns with 12 cartons of milk.",
  "// This code works, I have no idea why",
  "// This code doesn't work, I have no idea why",
  "How many programmers does it take to change a light bulb? None, that's a hardware problem.",
  "The best thing about a Boolean is that even if you're wrong, you're only off by a bit.",
  "Debugging: Being the detective in a crime movie where you're also the murderer.",
  "It works on my machine! ¯\\_(ツ)_/¯",
  "99 little bugs in the code, 99 little bugs. Take one down, patch it around... 127 little bugs in the code.",
  "Why do programmers always mix up Halloween and Christmas? Because Oct 31 == Dec 25!",
  "I would tell you a UDP joke, but you might not get it.",
  "I'd tell you a TCP joke, but I'd have to keep repeating it until you got it.",
  "['hip', 'hip'] // hooray!",
  "A programmer puts two glasses on his bedside table before going to sleep. One full of water in case he gets thirsty, and one empty in case he doesn't.",
  "To understand recursion, you must first understand recursion.",
  "There's no place like 127.0.0.1",
  "chmod 777 ~ // YOLO",
  "git commit -m 'Fixed bug' // narrator: He did not fix the bug",
  "console.log('here') // The pinnacle of debugging",
  "The code is self-documenting. // (The documentation is wrong)",
  "Weeks of coding can save you hours of planning!",
];

/**
 * Hook to get a random dev joke
 */
export function useDevJoke() {
  const [joke, setJoke] = useState<string>("");

  const getNewJoke = () => {
    const randomIndex = Math.floor(Math.random() * DEV_JOKES.length);
    setJoke(DEV_JOKES[randomIndex]);
  };

  useEffect(() => {
    getNewJoke();
  }, []);

  return { joke, getNewJoke };
}

/**
 * Logs a random dev joke to the console periodically
 */
export default function DevJokes() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Log a joke after a delay
    const timeout = setTimeout(() => {
      const joke = DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)];
      console.log(
        `%c💡 Dev Joke: ${joke}`,
        "font-size: 12px; color: #fbbf24; background: #1f2937; padding: 8px 12px; border-radius: 4px; margin: 4px 0;",
      );
    }, 5000);

    // Log more jokes periodically
    const interval = setInterval(
      () => {
        const joke = DEV_JOKES[Math.floor(Math.random() * DEV_JOKES.length)];
        console.log(
          `%c😂 ${joke}`,
          "font-size: 11px; color: #9ca3af; font-style: italic;",
        );
      },
      60000, // Every minute
    );

    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, []);

  return null;
}
