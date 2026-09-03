import { useState } from "react";
import { ChevronDown, ChevronRight, Settings, Sparkles, X } from "lucide-react";
import { InlineMath, BlockMath } from "react-katex";

type Tab = "explanation" | "equations" | "parameters";

const KEY_CONCEPTS = [
  "Gravity provides constant downward acceleration g",
  "Horizontal motion is uniform (constant velocity)",
  "Vertical motion is uniformly accelerated",
  "Trajectory is a parabola",
];

const STEPS = [
  "Set initial velocity v₀ and launch angle θ",
  "Compute initial velocity components",
  "Update position using kinematic equations",
  "Repeat for each time step Δt = 0.01 s",
  "Render trajectory in 3D space",
];

const OBSERVATIONS = [
  "Maximum height reached is ~10.2 m",
  "Total time of flight is ~2.89 s",
  "Horizontal range is ~40.8 m",
];

const PARAMETERS = [
  ["Initial velocity", "20 m/s"],
  ["Launch angle", "45°"],
  ["Gravity", "9.81 m/s²"],
  ["Air resistance", "None"],
  ["Time step", "0.01 s"],
];

function SectionTitle({ title, time }: { title: string; time: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <h3 className="text-sm font-semibold text-foreground">{title}</h3>
      <span className="shrink-0 font-mono text-[10px] text-primary">{time}</span>
    </div>
  );
}

export function ExplanationSidebar({ onClose }: { onClose: () => void }) {
  const [tab, setTab] = useState<Tab>("explanation");
  const [paramsOpen, setParamsOpen] = useState(false);

  const tabs: { id: Tab; label: string }[] = [
    { id: "explanation", label: "Explanation" },
    { id: "equations", label: "Equations" },
    { id: "parameters", label: "Parameters" },
  ];

  return (
    <aside className="flex h-full w-full flex-col border-l border-border bg-background">
      <header className="flex items-center justify-between border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-primary" />
          <h2 className="text-sm font-semibold tracking-tight">AI Explanation</h2>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close explanation panel"
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          <X className="size-4" />
        </button>
      </header>

      <nav className="flex border-b border-border px-2" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex-1 border-b-2 px-2 py-2.5 text-xs font-medium transition-colors ${
              tab === t.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-thin">
        {tab === "explanation" && (
          <div className="space-y-6">
            <section className="space-y-1.5">
              <SectionTitle title="Projectile Motion" time="10:32:15 AM" />
              <p className="text-[13px] leading-relaxed text-muted-foreground">
                A projectile is launched with an initial velocity <InlineMath math="v_0" /> at an
                angle <InlineMath math="\theta" /> to the horizontal, moving under the influence of
                gravity (no air resistance).
              </p>
            </section>

            <section className="space-y-1.5">
              <SectionTitle title="Key Concepts" time="10:32:17 AM" />
              <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
                {KEY_CONCEPTS.map((c) => (
                  <li key={c}>{c}</li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <SectionTitle title="Equations Used" time="10:32:20 AM" />
              <ul className="space-y-2 text-foreground">
                {[
                  "x(t) = v_0 \\cos\\theta\\; t",
                  "y(t) = v_0 \\sin\\theta\\; t - \\tfrac{1}{2} g t^2",
                  "T = \\frac{2 v_0 \\sin\\theta}{g}",
                  "R = \\frac{v_0^2 \\sin 2\\theta}{g}",
                ].map((m, i) => (
                  <li
                    key={m}
                    className="flex items-center gap-3 rounded-md bg-secondary px-3 py-2 text-[13px]"
                  >
                    <BlockMath math={m} />
                    {i === 2 && (
                      <span className="text-[11px] text-muted-foreground">(Time of flight)</span>
                    )}
                    {i === 3 && <span className="text-[11px] text-muted-foreground">(Range)</span>}
                  </li>
                ))}
              </ul>
            </section>

            <section className="space-y-2">
              <SectionTitle title="Simulation Steps" time="10:32:22 AM" />
              <ol className="space-y-1.5">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex gap-2 text-[13px] leading-relaxed text-muted-foreground">
                    <span className="mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full bg-primary text-[9px] font-semibold text-primary-foreground">
                      {i + 1}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </section>

            <section className="space-y-1.5">
              <SectionTitle title="Observations" time="10:32:30 AM" />
              <ul className="list-disc space-y-1 pl-4 text-[13px] leading-relaxed text-muted-foreground">
                {OBSERVATIONS.map((o) => (
                  <li key={o}>{o}</li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {tab === "equations" && (
          <div className="space-y-3">
            {[
              ["Horizontal position", "x(t) = v_0 \\cos\\theta\\; t"],
              ["Vertical position", "y(t) = v_0 \\sin\\theta\\; t - \\tfrac{1}{2} g t^2"],
              ["Velocity components", "v_x = v_0\\cos\\theta,\\quad v_y = v_0\\sin\\theta - g t"],
              ["Maximum height", "H = \\frac{v_0^2 \\sin^2\\theta}{2g}"],
              ["Time of flight", "T = \\frac{2 v_0 \\sin\\theta}{g}"],
              ["Range", "R = \\frac{v_0^2 \\sin 2\\theta}{g}"],
            ].map(([label, math]) => (
              <div key={label} className="rounded-md border border-border p-3">
                <p className="mb-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                  {label}
                </p>
                <BlockMath math={math} />
              </div>
            ))}
          </div>
        )}

        {tab === "parameters" && (
          <dl className="divide-y divide-border overflow-hidden rounded-md border border-border">
            {PARAMETERS.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between px-3 py-2.5 text-[13px]">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>

      <div className="border-t border-border">
        <button
          type="button"
          onClick={() => setParamsOpen((v) => !v)}
          aria-expanded={paramsOpen}
          className="flex w-full items-center justify-between px-4 py-3 text-xs font-medium text-foreground transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-ring"
        >
          <span className="flex items-center gap-2">
            <Settings className="size-4 text-muted-foreground" />
            Simulation Parameters
          </span>
          {paramsOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
        </button>
        {paramsOpen && (
          <dl className="space-y-1.5 px-4 pb-3 text-[12px]">
            {PARAMETERS.map(([k, v]) => (
              <div key={k} className="flex items-center justify-between">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </aside>
  );
}
