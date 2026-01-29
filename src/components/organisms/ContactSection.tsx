"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";

/**
 * ContactSection - Call-to-action section with mailto link.
 * Opens email client with prefilled subject and body.
 */

interface ContactSectionProps {
  email: string;
}

export default function ContactSection({ email }: ContactSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  // Create mailto link with prefilled subject and body
  const subject = encodeURIComponent("Hello from your portfolio!");
  const body = encodeURIComponent(
    "Hi James,\n\nI came across your portfolio and would love to connect.\n\nBest regards,",
  );
  const mailtoLink = `mailto:${email}?subject=${subject}&body=${body}`;

  return (
    <section className="py-20 px-6">
      <motion.div
        ref={ref}
        className="max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Let&apos;s Work Together
        </h2>
        <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
          I&apos;m currently exploring new opportunities and creative
          collaborations. Whether you have a proposal, a question, or simply
          want to say hi, I&apos;d love to hear from you.
        </p>

        <motion.a
          href={mailtoLink}
          className="inline-flex items-center gap-3 px-8 py-4 bg-linear-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-full hover:from-purple-500 hover:to-blue-500 transition-all shadow-lg shadow-purple-500/25"
          whileHover={{ scale: 1.05, y: -2 }}
          whileTap={{ scale: 0.98 }}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
            />
          </svg>
          Contact Me
        </motion.a>

        <p className="text-gray-500 text-sm mt-6">{email}</p>
      </motion.div>
    </section>
  );
}
