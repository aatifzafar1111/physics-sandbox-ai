import { BookOpenText, ChevronRight, X } from "lucide-react";

const STEPS = [
  {
    time: "t = 0.00s",
    title: "Initial conditions",
    body: "The bob is released from rest at θ₀ = 32°. All energy is gravitational potential: PE = mgh ≈ 12.4 J.",
  },
  {
    time: "t = 0.71s",
    title: "Passing equilibrium",
    body: "At the lowest point potential energy has fully converted to kinetic energy. Velocity peaks at v ≈ 2.23 m/s.",
  },
  {
    time: "t = 1.42s",
    title: "Opposite extreme",
    body: "With zero air resistance, the bob reaches θ = −32° exactly — total mechanical energy is conserved.",
  },
];

const EQUATIONS = ["T = 2π√(L/g) ≈ 2.01 s", "E = mgh + ½mv² = const", "τ = −mgL·sinθ"];

export function ExplanationSidebar({ onClose }: { onClose: () => void }) {
  return (
    <aside className="flex h-full w-full flex-col border-l border-border glass-panel">
      <header className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2">
          <BookOpenText className="size-4 text-accent" />
          <h2 className="text-sm font-semibold tracking-tight">AI Explanation</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Collapse explanation panel"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          <X className="size-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-5 py-4 scrollbar-thin">
        <p className="rounded-lg border border-border bg-secondary/60 p-3 font-mono text-xs leading-relaxed text-muted-foreground">
          Prompt: “Simulate a pendulum with a mass of 5 kg and no air resistance.”
        </p>

        <h3 className="mt-5 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Governing equations
        </h3>
        <ul className="space-y-1.5">
          {EQUATIONS.map((eq) => (
            <li
              key={eq}
              className="rounded-md border border-border bg-background/60 px-3 py-2 font-mono text-xs text-primary"
            >
              {eq}
            </li>
          ))}
        </ul>

        <h3 className="mt-5 mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Step-by-step
        </h3>
        <ol className="relative space-y-4 border-l border-border pl-4">
          {STEPS.map((s) => (
            <li key={s.time} className="relative">
              <span className="absolute -left-[21px] top-1 size-2 rounded-full bg-accent glow-accent" />
              <span className="inline-block rounded border border-border bg-secondary px-1.5 py-0.5 font-mono text-[10px] text-accent">
                {s.time}
              </span>
              <h4 className="mt-1.5 text-sm font-medium">{s.title}</h4>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </div>

      <footer className="border-t border-border p-3">
        <button
          type="button"
          className="flex w-full items-center justify-between rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        >
          Ask a follow-up about damping or drive forces
          <ChevronRight className="size-3.5" />
        </button>
      </footer>
    </aside>
  );
}
