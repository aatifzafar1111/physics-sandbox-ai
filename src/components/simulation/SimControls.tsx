import { Hand, Orbit, RotateCcw, Search } from "lucide-react";
import type { ViewMode } from "./SimulationCanvas";

export function SimControls({
  mode,
  onMode,
  onReset,
}: {
  mode: ViewMode;
  onMode: (m: ViewMode) => void;
  onReset: () => void;
}) {
  const items: { id: ViewMode; label: string; Icon: typeof Hand }[] = [
    { id: "orbit", label: "Orbit", Icon: Orbit },
    { id: "pan", label: "Pan", Icon: Hand },
    { id: "zoom", label: "Zoom", Icon: Search },
  ];

  return (
    <div className="pointer-events-auto flex items-center gap-1 rounded-full border border-border bg-background px-1.5 py-1 soft-shadow">
      {items.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onMode(id)}
          aria-pressed={mode === id}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
            mode === id
              ? "border border-primary/40 bg-primary/8 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Icon className="size-3.5" />
          {label}
        </button>
      ))}
      <button
        type="button"
        onClick={onReset}
        className="flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      >
        <RotateCcw className="size-3.5" />
        Reset
      </button>
    </div>
  );
}
