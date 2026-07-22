import { cn } from "@ai-template/ui";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 px-6 py-32 text-center">
      <span
        className={cn(
          "rounded-full border border-[var(--color-border)] bg-[var(--color-surface)]",
          "px-4 py-1 text-sm text-[var(--color-muted)] shadow-[var(--shadow-soft-sm)]",
        )}
      >
        Foundation phase — the design system lands in Phase 4
      </span>
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[var(--color-foreground)] sm:text-5xl">
        AI-TEMPLATE
      </h1>
      <p className="max-w-xl text-lg text-[var(--color-muted)]">
        The world&apos;s best AI Prompt &amp; AI Agent Template Library.
      </p>
    </main>
  );
}
