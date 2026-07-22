import { Check, X } from "lucide-react";

const ROWS = [
  { label: "Runs fully self-hosted, zero required SaaS accounts", them: false, us: true },
  { label: "Content validated by a schema, enforced in CI", them: false, us: true },
  { label: "Real automated test suite (unit, e2e, accessibility)", them: false, us: true },
  { label: "Owned, single design system across every page", them: false, us: true },
  { label: "Providers modeled as equal, first-class citizens", them: false, us: true },
  { label: "Global keyboard-first command palette", them: false, us: true },
];

export function WhySection() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-20">
      <div className="mx-auto mb-10 max-w-2xl text-center">
        <h2 className="text-3xl font-semibold tracking-tight text-[var(--color-foreground)]">
          Why AI-TEMPLATE
        </h2>
        <p className="mt-3 text-[var(--color-muted)]">
          Not a fork. A ground-up rebuild that closes the gaps found in the inspiration project —
          see the full audit in{" "}
          <a
            href="https://github.com/DipakMandlik/AI-TEMPLATE/blob/main/roadmap.md"
            className="text-[var(--color-brand-600)] underline underline-offset-4"
          >
            roadmap.md
          </a>
          .
        </p>
      </div>
      <div className="overflow-hidden rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-soft-sm)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]">
              <th className="px-6 py-3 font-medium">Capability</th>
              <th className="w-28 px-6 py-3 text-center font-medium">Inspiration</th>
              <th className="w-28 px-6 py-3 text-center font-medium">AI-TEMPLATE</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label} className="border-b border-[var(--color-border)] last:border-0">
                <td className="px-6 py-4 text-[var(--color-foreground)]">{row.label}</td>
                <td className="px-6 py-4">
                  <MarkIcon value={row.them} />
                </td>
                <td className="px-6 py-4">
                  <MarkIcon value={row.us} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function MarkIcon({ value }: { value: boolean }) {
  return value ? (
    <Check className="mx-auto size-4 text-[var(--color-brand-600)]" aria-label="Yes" />
  ) : (
    <X className="mx-auto size-4 text-[var(--color-muted)]" aria-label="No" />
  );
}
