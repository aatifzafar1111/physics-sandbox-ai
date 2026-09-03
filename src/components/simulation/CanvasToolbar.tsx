import { Box, Circle, Donut, Hand, Move, MousePointer2, Maximize } from "lucide-react";

export type ToolId = "select" | "move" | "ball" | "block" | "torus" | "expand";

const TOOLS: { id: ToolId; label: string; Icon: typeof Hand }[] = [
  { id: "select", label: "Selection cursor", Icon: MousePointer2 },
  { id: "move", label: "Move object", Icon: Move },
  { id: "ball", label: "Add sphere", Icon: Circle },
  { id: "block", label: "Add block", Icon: Box },
  { id: "torus", label: "Add torus", Icon: Donut },
  { id: "expand", label: "Fit to view", Icon: Maximize },
];

export function CanvasToolbar({
  active,
  onChange,
}: {
  active: ToolId;
  onChange: (t: ToolId) => void;
}) {
  return (
    <div className="absolute left-3 top-1/2 z-10 flex -translate-y-1/2 flex-col gap-1 rounded-lg border border-border bg-background p-1 soft-shadow">
      {TOOLS.map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          title={label}
          aria-label={label}
          aria-pressed={active === id}
          onClick={() => onChange(id)}
          className={`flex size-8 items-center justify-center rounded-md transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
            active === id
              ? "bg-primary/10 text-primary"
              : "text-muted-foreground hover:bg-secondary hover:text-foreground"
          }`}
        >
          <Icon className="size-4" />
        </button>
      ))}
    </div>
  );
}
