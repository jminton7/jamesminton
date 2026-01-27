"use client";

import ConsoleEasterEggs from "@/components/atoms/ConsoleEasterEggs";
import KonamiCode from "@/components/atoms/KonamiCode";
import CursorTrail from "@/components/atoms/CursorTrail";
import DevJokes from "@/components/atoms/DevJokes";
import ClickAchievements from "@/components/atoms/ClickAchievements";

/**
 * EasterEggs - Container for all easter egg components.
 * Includes console messages, Konami code, cursor trail, dev jokes, and click achievements.
 */
export default function EasterEggs() {
  return (
    <>
      <ConsoleEasterEggs />
      <KonamiCode />
      <CursorTrail />
      <DevJokes />
      <ClickAchievements />
    </>
  );
}
