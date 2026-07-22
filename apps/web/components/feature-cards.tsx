"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  staggerContainer,
  staggerItem,
} from "@ai-template/ui";
import { motion } from "framer-motion";
import { Blocks, Command, ShieldCheck, Sparkles, TerminalSquare, Zap } from "lucide-react";

const FEATURES = [
  {
    icon: Blocks,
    title: "Multi-provider by design",
    description:
      "Claude Code, Cursor, Copilot, Windsurf, Codex, Aider, Cline, Roo Code, Continue.dev, and custom agents — every template declares its own compatibility.",
  },
  {
    icon: ShieldCheck,
    title: "Schema-validated content",
    description:
      "Every template is checked against a Zod schema in CI. A malformed template fails the build — no agent checklist required.",
  },
  {
    icon: Command,
    title: "Keyboard-first",
    description:
      "A global command palette (⌘K) puts search, navigation, and theme switching one keystroke away.",
  },
  {
    icon: Zap,
    title: "Zero-SaaS core",
    description:
      "Browse, search, and read every template with pnpm install && pnpm dev — no third-party accounts required to run the product.",
  },
  {
    icon: TerminalSquare,
    title: "Real automated tests",
    description:
      "Unit, component, e2e, and accessibility tests run in CI on every pull request — not a placeholder test script.",
  },
  {
    icon: Sparkles,
    title: "A premium design system",
    description:
      "One owned set of shadcn/ui-based primitives, restyled to a single brand, instead of UI assembled ad hoc per page.",
  },
];

export function FeatureCards() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-20">
      <div className="mx-auto mb-12 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Everything a prompt library should be
        </h2>
        <p className="mt-3 text-[var(--color-muted)]">
          Built to fix what&apos;s missing from every other template collection.
        </p>
      </div>
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <motion.div key={title} variants={staggerItem}>
            <Card className="h-full">
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-50)] text-[var(--color-brand-600)]">
                  <Icon className="size-5" />
                </div>
                <CardTitle>{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>{description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}
