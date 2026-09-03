import { useEffect, useRef } from "react";
import { Maximize2, Rotate3d } from "lucide-react";

/**
 * SimulationCanvas
 * ----------------
 * Isolated rendering zone styled as engineering graph paper. A developer can
 * mount a Three.js / Cannon.js renderer onto the <canvas> ref below without
 * touching the rest of the app shell.
 */
export function SimulationCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      resize();
      t += 0.008;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const dpr = window.devicePixelRatio || 1;

      const length = 180 * dpr;
      const angle = Math.sin(t * 1.6) * 0.55;
      const px = cx + Math.sin(angle) * length;
      const py = cy - 60 * dpr + Math.cos(angle) * length;

      // Arc path (dashed construction line)
      ctx.save();
      ctx.setLineDash([4 * dpr, 5 * dpr]);
      ctx.strokeStyle = "rgba(107, 114, 128, 0.45)";
      ctx.lineWidth = 1 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy - 60 * dpr, length, Math.PI / 2 - 0.55, Math.PI / 2 + 0.55);
      ctx.stroke();
      ctx.restore();

      // Pivot mount
      ctx.strokeStyle = "rgba(17, 24, 39, 0.9)";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx - 40 * dpr, cy - 60 * dpr);
      ctx.lineTo(cx + 40 * dpr, cy - 60 * dpr);
      ctx.stroke();

      // Hatching under the mount
      ctx.lineWidth = 1 * dpr;
      ctx.strokeStyle = "rgba(75, 85, 99, 0.55)";
      for (let i = -40; i <= 32; i += 8) {
        ctx.beginPath();
        ctx.moveTo(cx + i * dpr, cy - 60 * dpr);
        ctx.lineTo(cx + (i + 8) * dpr, cy - 68 * dpr);
        ctx.stroke();
      }

      // String
      ctx.strokeStyle = "rgba(17, 24, 39, 0.95)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 60 * dpr);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Pivot dot
      ctx.fillStyle = "rgba(17, 24, 39, 1)";
      ctx.beginPath();
      ctx.arc(cx, cy - 60 * dpr, 3 * dpr, 0, Math.PI * 2);
      ctx.fill();

      // Matte solid bob
      ctx.fillStyle = "rgba(37, 99, 235, 1)";
      ctx.beginPath();
      ctx.arc(px, py, 16 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(17, 24, 39, 0.9)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="canvas-grid relative h-full w-full overflow-hidden rounded-lg border border-border bg-background">
      <canvas ref={canvasRef} className="h-full w-full" aria-label="3D simulation viewport" />

      {/* HUD chips */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        <Rotate3d className="size-3.5 text-primary" />
        scene: pendulum_5kg_vacuum
      </div>
      <div className="absolute bottom-4 left-4 rounded-md border border-border bg-background px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        t = 0.00s · g = 9.81 m/s² · drag = 0
      </div>
      <button
        type="button"
        className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-md border border-border bg-background text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        aria-label="Fullscreen viewport"
      >
        <Maximize2 className="size-4" />
      </button>
    </div>
  );
}
