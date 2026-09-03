import { useState, type FormEvent } from "react";
import { Loader2, Sparkles } from "lucide-react";

const SUGGESTIONS = [
  "Pendulum, 5 kg, no air resistance",
  "Double-slit photon interference",
  "Projectile at 45°, Mars gravity",
];

export function PromptBar({ onGenerate }: { onGenerate?: (prompt: string) => void }) {
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    if (!value.trim() || loading) return;
    setLoading(true);
    onGenerate?.(value.trim());
    // Simulated generation latency — wire to a real model call later
    setTimeout(() => setLoading(false), 2200);
  };

  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-5 z-20 flex justify-center px-4">
      <form
        onSubmit={submit}
        className="pointer-events-auto w-full max-w-2xl rounded-2xl glass-panel border border-border shadow-2xl shadow-background/80"
      >
        <div className="flex items-center gap-2 p-2 pl-4">
          <Sparkles className="size-4 shrink-0 text-accent" />
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Simulate a pendulum with a mass of 5 kg and no air resistance…"
            aria-label="Describe a physics simulation"
            className="h-10 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !value.trim()}
            className="flex h-10 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-medium text-primary-foreground transition-all hover:brightness-110 focus-visible:outline-2 focus-visible:outline-ring disabled:cursor-not-allowed disabled:opacity-50 glow-accent"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                Generating
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate
              </>
            )}
          </button>
        </div>
        <div className="flex flex-wrap items-center gap-2 border-t border-border px-4 py-2">
          <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            try:
          </span>
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setValue(s)}
              className="rounded-full border border-border px-2.5 py-1 font-mono text-[10px] text-muted-foreground transition-colors hover:border-primary/50 hover:text-foreground"
            >
              {s}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
}
