"use client";

import { Button, staggerContainer, staggerItem } from "@ai-template/ui";
import { motion } from "framer-motion";
import Link from "next/link";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 py-28 text-center sm:py-36">
      <AnimatedBackground />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="relative mx-auto flex max-w-3xl flex-col items-center gap-6"
      >
        <motion.span
          variants={staggerItem}
          className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-1 text-sm text-[var(--color-muted)] shadow-[var(--shadow-soft-sm)]"
        >
          Open source · MIT licensed · Multi-provider
        </motion.span>
        <motion.h1
          variants={staggerItem}
          className="text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-6xl"
        >
          The world&apos;s best AI Prompt &amp; AI Agent Template Library
        </motion.h1>
        <motion.p variants={staggerItem} className="max-w-xl text-lg text-[var(--color-muted)]">
          Production-ready templates for Claude Code, Cursor, Copilot, Windsurf, and every major AI
          coding tool — searchable, versioned, and validated.
        </motion.p>
        <motion.div
          variants={staggerItem}
          className="flex flex-wrap items-center justify-center gap-3"
        >
          <Button asChild size="lg">
            <Link href="/templates">Browse templates</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link href="https://github.com/DipakMandlik/AI-TEMPLATE">Star on GitHub</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}

function AnimatedBackground() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
    >
      <motion.div
        className="bg-[var(--color-brand-300)]/30 absolute -left-24 top-0 size-96 rounded-full blur-3xl motion-reduce:animate-none"
        animate={{ x: [0, 60, 0], y: [0, 40, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-[var(--color-brand-500)]/20 absolute right-0 top-10 size-[28rem] rounded-full blur-3xl motion-reduce:animate-none"
        animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="bg-[var(--color-brand-200)]/40 absolute bottom-0 left-1/3 size-72 rounded-full blur-3xl motion-reduce:animate-none"
        animate={{ x: [0, 30, 0], y: [0, -30, 0] }}
        transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}
