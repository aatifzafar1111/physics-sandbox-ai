import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Atom, PanelRightClose, PanelRightOpen, Plus } from "lucide-react";
import { SimulationCanvas } from "../components/simulation/SimulationCanvas";
import { PromptBar } from "../components/simulation/PromptBar";
import { ExplanationSidebar } from "../components/simulation/ExplanationSidebar";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PhysicsAI — Text-to-3D Physics Simulation Lab" },
      {
        name: "description",
        content:
          "Describe any physics scenario in plain language and watch it rendered as an interactive 3D simulation with step-by-step AI explanations.",
      },
      { property: "og:title", content: "PhysicsAI — Text-to-3D Physics Simulation Lab" },
      {
        property: "og:description",
        content:
          "Describe any physics scenario in plain language and watch it rendered as an interactive 3D simulation with step-by-step AI explanations.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const apply = () => setSidebarOpen(!mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-canvas text-foreground">
      {/* Top navbar */}
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-2.5">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Atom className="size-4.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">
            Physics<span className="text-primary">AI</span>
          </span>
          <span className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground sm:inline">
            lab · v0.9
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            aria-label={sidebarOpen ? "Hide explanation panel" : "Show explanation panel"}
            className="flex size-9 items-center justify-center rounded-md border border-border text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring lg:hidden"
          >
            {sidebarOpen ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
          </button>
          <button
            type="button"
            className="flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <Plus className="size-4" />
            New Simulation
          </button>
        </div>
      </header>

      {/* Main region */}
      <div className="relative flex min-h-0 flex-1">
        {/* Canvas + floating prompt */}
        <main className="relative min-w-0 flex-1 p-3 pb-0 sm:p-4 sm:pb-0">
          <SimulationCanvas />
          <PromptBar />
        </main>

        {/* Explanation sidebar — desktop inline, mobile overlay */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-30 bg-foreground/20 lg:hidden"
              onClick={() => setSidebarOpen(false)}
              aria-hidden
            />
            <div className="fixed inset-y-14 right-0 z-40 w-[min(24rem,88vw)] lg:static lg:z-auto lg:w-[28%] lg:min-w-80">
              <ExplanationSidebar onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
