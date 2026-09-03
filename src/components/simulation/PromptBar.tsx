import { useState, type FormEvent } from "react";
import { Loader2, SendHorizonal, Settings2, Sparkles } from "lucide-react";

const EXAMPLES = [
  "Pendulum motion",
  "Spring-mass system",
  "Colliding spheres",
  "Inclined plane",
  "Wave on a string",
];

export function PromptBar({ onGenerate }: { onGenerate?: (prompt: string) => void }) {
  const [value, setValue] = useState(
    "Simulate projectile motion with an initial velocity of 20 m/s at 45 degrees...",
  );
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    setLoading(true);
    onGenerate?.(value.trim());
    setTimeout(() => setLoading(false), 1800);
  };

  return (
    <form
      onSubmit={submit}
      className="pointer-events-auto w-full max-w-3xl rounded-xl border border-border bg-background px-4 py-3 card-shadow"
    >
      <div className="flex items-start gap-3">
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Sparkles className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <label
            htmlFor="physics-prompt"
            className="block text-xs font-medium text-muted-foreground"
          >
            Describe the physics simulation you want to create...
          </label>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border bg-background px-3">
              <input
                id="physics-prompt"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Simulate projectile motion with an initial velocity of 20 m/s at 45 degrees..."
                className="h-10 min-w-0 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              />
              <button
                type="button"
                aria-label="Simulation settings"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
              >
                <Settings2 className="size-4" />
              </button>
            </div>
            <button
              type="submit"
              disabled={loading || !value.trim()}
              className="flex h-10 shrink-0 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 active:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <SendHorizonal className="size-4" />
              )}
              {loading ? "Generating" : "Generate"}
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 pl-11">
        <span className="text-[11px] font-medium text-muted-foreground">Examples:</span>
        {EXAMPLES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setValue(s)}
            className="rounded-md border border-border bg-secondary px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {s}
          </button>
        ))}
      </div>
    </form>
  );
}
