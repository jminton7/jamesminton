"use client";

import { MotionConfig } from "framer-motion";

/**
 * MotionProvider - Applies site-wide Framer Motion settings.
 * reducedMotion="user" turns off transform animations for visitors who have
 * "reduce motion" enabled in their OS settings.
 */
export default function MotionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
