import { Button } from "@ai-template/ui";
import Link from "next/link";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-4xl px-6 pb-24">
      <div className="flex flex-col items-center gap-6 rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-brand-600)] px-8 py-16 text-center shadow-[var(--shadow-soft-lg)]">
        <h2 className="text-3xl font-semibold tracking-tight text-white">
          Ready to build with production-grade AI templates?
        </h2>
        <p className="max-w-xl text-white/90">
          Browse the catalog, copy a prompt, and ship — or contribute a template for the tool you
          use every day.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button asChild size="lg" variant="secondary">
            <Link href="/templates">Browse templates</Link>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-white text-[var(--color-brand-700)] hover:bg-white/90"
          >
            <Link href="https://github.com/DipakMandlik/AI-TEMPLATE">Contribute on GitHub</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
