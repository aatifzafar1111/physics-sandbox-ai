import { useEffect, useRef } from "react";
import { Crosshair, Maximize2, Rotate3d } from "lucide-react";

/**
 * SimulationCanvas
 * ----------------
 * Isolated 3D rendering zone. A developer can mount a Three.js / Cannon.js
 * renderer onto the <canvas> ref below without touching the rest of the app
 * shell. Until then it renders a stylized placeholder "lab bench" scene.
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
      const parent = canvas.parentElement;
      if (!parent) return;
      canvas.width = parent.clientWidth * window.devicePixelRatio;
      canvas.height = parent.clientHeight * window.devicePixelRatio;
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      t += 0.008;
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;
      const dpr = window.devicePixelRatio;

      // Wireframe pendulum placeholder — replace with real physics engine output
      const length = 180 * dpr;
      const angle = Math.sin(t * 1.6) * 0.55;
      const px = cx + Math.sin(angle) * length;
      const py = cy - 60 * dpr + Math.cos(angle) * length;

      // Pivot mount
      ctx.strokeStyle = "rgba(148, 163, 255, 0.5)";
      ctx.lineWidth = 2 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx - 40 * dpr, cy - 60 * dpr);
      ctx.lineTo(cx + 40 * dpr, cy - 60 * dpr);
      ctx.stroke();

      // Rod
      ctx.strokeStyle = "rgba(148, 163, 255, 0.85)";
      ctx.lineWidth = 2.5 * dpr;
      ctx.beginPath();
      ctx.moveTo(cx, cy - 60 * dpr);
      ctx.lineTo(px, py);
      ctx.stroke();

      // Motion trail
      ctx.strokeStyle = "rgba(192, 132, 252, 0.28)";
      ctx.lineWidth = 1.5 * dpr;
      ctx.beginPath();
      ctx.arc(cx, cy - 60 * dpr, length, Math.PI / 2 - 0.55, Math.PI / 2 + 0.55);
      ctx.stroke();

      // Bob with glow
      const grad = ctx.createRadialGradient(px, py, 0, px, py, 46 * dpr);
      grad.addColorStop(0, "rgba(129, 140, 248, 0.85)");
      grad.addColorStop(1, "rgba(129, 140, 248, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(px, py, 46 * dpr, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = "rgba(165, 180, 252, 1)";
      ctx.beginPath();
      ctx.arc(px, py, 16 * dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(216, 180, 254, 0.9)";
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
    <div className="canvas-grid relative h-full w-full overflow-hidden rounded-xl border border-border bg-background shadow-[inset_0_0_80px_-30px_var(--color-glow)]">
      <canvas ref={canvasRef} className="h-full w-full" aria-label="3D simulation viewport" />

      {/* Crosshair overlays to imply 3D space */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-muted-foreground/20">
        <Crosshair className="size-8" strokeWidth={1} />
      </div>

      {/* HUD chips */}
      <div className="absolute left-4 top-4 flex items-center gap-2 rounded-md glass-panel border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        <Rotate3d className="size-3.5 text-primary" />
        scene: pendulum_5kg_vacuum
      </div>
      <div className="absolute bottom-4 left-4 rounded-md glass-panel border border-border px-3 py-1.5 font-mono text-[11px] text-muted-foreground">
        t = 0.00s · g = 9.81 m/s² · drag = 0
      </div>
      <button
        type="button"
        className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-md glass-panel border border-border text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-ring"
        aria-label="Fullscreen viewport"
      >
        <Maximize2 className="size-4" />
      </button>
    </div>
  );
}
