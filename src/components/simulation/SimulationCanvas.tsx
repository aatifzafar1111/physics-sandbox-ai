import { useEffect, useRef, useState } from "react";

export type ViewMode = "orbit" | "pan" | "zoom";

type Vec3 = { x: number; y: number; z: number };

const DEG = Math.PI / 180;

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

/**
 * SimulationCanvas
 * ----------------
 * Isolated rendering zone. A developer can replace the 2D projection renderer
 * below with a Three.js / Cannon.js scene mounted on the same <canvas> ref.
 */
export function SimulationCanvas({
  mode,
  resetSignal,
}: {
  mode: ViewMode;
  resetSignal: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [, force] = useState(0);

  const view = useRef({ yaw: -28, pitch: 18, zoom: 1, ox: 0, oy: 0 });
  const modeRef = useRef(mode);
  modeRef.current = mode;

  useEffect(() => {
    view.current = { yaw: -28, pitch: 18, zoom: 1, ox: 0, oy: 0 };
    force((n) => n + 1);
  }, [resetSignal]);

  // Wheel zoom (non-passive so the page doesn't scroll)
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      view.current.zoom = clamp(view.current.zoom * Math.exp(-dy * 0.0015), 0.4, 4);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  // Pointer drag: orbit / pan / zoom depending on active tool
  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let dragging = false;
    let lx = 0;
    let ly = 0;

    const down = (e: PointerEvent) => {
      dragging = true;
      lx = e.clientX;
      ly = e.clientY;
      el.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      const dx = e.clientX - lx;
      const dy = e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      const v = view.current;
      if (modeRef.current === "orbit") {
        v.yaw += dx * 0.35;
        v.pitch = clamp(v.pitch + dy * 0.25, -5, 70);
      } else if (modeRef.current === "pan") {
        v.ox += dx;
        v.oy += dy;
      } else {
        v.zoom = clamp(v.zoom * Math.exp(-dy * 0.005), 0.4, 4);
      }
    };
    const up = (e: PointerEvent) => {
      dragging = false;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    };
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    let raf = 0;

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      const w = Math.max(1, Math.round(rect.width * dpr));
      const h = Math.max(1, Math.round(rect.height * dpr));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, rect.width, rect.height);

      const v = view.current;
      const scale = (Math.min(rect.width, rect.height) / 26) * v.zoom;
      const cx = rect.width / 2 + v.ox;
      const cy = rect.height * 0.66 + v.oy;

      const cyaw = Math.cos(v.yaw * DEG);
      const syaw = Math.sin(v.yaw * DEG);
      const cp = Math.cos(v.pitch * DEG);
      const sp = Math.sin(v.pitch * DEG);

      const project = (p: Vec3) => {
        const x = p.x * cyaw + p.z * syaw;
        const z = -p.x * syaw + p.z * cyaw;
        const y = p.y;
        return { x: cx + x * scale, y: cy - (y * cp - z * sp) * scale };
      };

      const line = (a: Vec3, b: Vec3, color: string, width = 1) => {
        const p1 = project(a);
        const p2 = project(b);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      };

      const ink = "rgba(31,26,24,0.9)";
      const faint = "rgba(31,26,24,0.10)";
      const label = "rgba(90,82,78,0.95)";

      // Ground grid (x/z plane)
      for (let i = -10; i <= 10; i += 2) {
        line({ x: i, y: 0, z: -6 }, { x: i, y: 0, z: 6 }, faint);
        line({ x: -10, y: 0, z: i * 0.6 }, { x: 10, y: 0, z: i * 0.6 }, faint);
      }

      // Axes
      line({ x: -10.5, y: 0, z: 0 }, { x: 10.5, y: 0, z: 0 }, ink, 1.2); // x
      line({ x: 0, y: 0, z: 0 }, { x: 0, y: 11, z: 0 }, ink, 1.2); // y
      line({ x: 0, y: 0, z: -7 }, { x: 0, y: 0, z: 7 }, ink, 1.2); // z

      ctx.font = "10px Inter, sans-serif";
      ctx.fillStyle = label;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // x ticks
      for (let i = -10; i <= 8; i += 2) {
        if (i === 0) continue;
        const p = project({ x: i, y: 0, z: 0 });
        ctx.fillText(String(i), p.x, p.y + 12);
      }
      // y ticks
      for (let i = 2; i <= 10; i += 2) {
        const p = project({ x: 0, y: i, z: 0 });
        ctx.fillText(String(i), p.x - 14, p.y);
      }

      const yLab = project({ x: 0, y: 11.6, z: 0 });
      ctx.fillText("y (m)", yLab.x, yLab.y);
      const xLab = project({ x: 11.6, y: 0, z: 0 });
      ctx.fillText("x (m)", xLab.x, xLab.y);
      const zLab = project({ x: 0, y: 0, z: 7.8 });
      ctx.fillText("z (m)", zLab.x, zLab.y);

      // Arrow heads
      const arrow = (tip: Vec3, back: Vec3) => {
        const t = project(tip);
        const b = project(back);
        const a = Math.atan2(t.y - b.y, t.x - b.x);
        ctx.fillStyle = ink;
        ctx.beginPath();
        ctx.moveTo(t.x, t.y);
        ctx.lineTo(t.x - 7 * Math.cos(a - 0.4), t.y - 7 * Math.sin(a - 0.4));
        ctx.lineTo(t.x - 7 * Math.cos(a + 0.4), t.y - 7 * Math.sin(a + 0.4));
        ctx.closePath();
        ctx.fill();
      };
      arrow({ x: 10.5, y: 0, z: 0 }, { x: 9, y: 0, z: 0 });
      arrow({ x: 0, y: 11, z: 0 }, { x: 0, y: 9.5, z: 0 });
      arrow({ x: 0, y: 0, z: 7 }, { x: 0, y: 0, z: 5.5 });

      // Projectile trajectory: v0 = 20 m/s @ 45°, launched from x = -7
      const v0 = 20;
      const th = 45 * DEG;
      const g = 9.81;
      const x0 = -7;
      const tf = (2 * v0 * Math.sin(th)) / g;
      const pts: Vec3[] = [];
      for (let i = 0; i <= 26; i++) {
        const t = (i / 26) * tf;
        pts.push({
          x: x0 + v0 * Math.cos(th) * t * 0.62,
          y: (v0 * Math.sin(th) * t - 0.5 * g * t * t) * 0.62,
          z: 0,
        });
      }

      ctx.strokeStyle = "rgba(31,26,24,0.22)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      pts.forEach((p, i) => {
        const q = project(p);
        if (i === 0) ctx.moveTo(q.x, q.y);
        else ctx.lineTo(q.x, q.y);
      });
      ctx.stroke();

      ctx.fillStyle = "rgba(31,26,24,0.92)";
      pts.forEach((p) => {
        const q = project(p);
        ctx.beginPath();
        ctx.arc(q.x, q.y, 3.2, 0, Math.PI * 2);
        ctx.fill();
      });

      // Apex + range annotations
      const origin: Vec3 = { x: 0, y: 0, z: 0 };
      const apex = pts.reduce<Vec3>((a, b) => (b.y > a.y ? b : a), pts[0] ?? origin);
      const apexP = project(apex);
      ctx.setLineDash([3, 4]);
      line({ x: apex.x, y: 0, z: 0 }, apex, "rgba(129,40,52,0.45)");
      ctx.setLineDash([]);
      ctx.fillStyle = "oklch(0.42 0.13 20)";
      ctx.font = "10px Inter, sans-serif";
      ctx.fillText("Maximum Height", apexP.x, apexP.y - 14);

      const last = pts[pts.length - 1];
      const lastP = project(last);
      ctx.fillText("Range", lastP.x + 6, lastP.y + 16);

      // Cannon model at launch point
      const base = project({ x: x0, y: 0, z: 0 });
      const barrelEnd = project({ x: x0 + 1.5, y: 1.5, z: 0 });
      ctx.strokeStyle = "rgba(31,26,24,0.95)";
      ctx.lineCap = "round";
      ctx.lineWidth = 9;
      ctx.beginPath();
      ctx.moveTo(base.x, base.y - 4);
      ctx.lineTo(barrelEnd.x, barrelEnd.y);
      ctx.stroke();
      ctx.lineCap = "butt";
      ctx.fillStyle = "rgba(31,26,24,0.95)";
      ctx.beginPath();
      ctx.arc(base.x - 4, base.y - 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(base.x + 8, base.y - 2, 5, 0, Math.PI * 2);
      ctx.fill();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, []);

  const cursor =
    mode === "pan" ? "cursor-grab" : mode === "zoom" ? "cursor-zoom-in" : "cursor-move";

  return (
    <div
      ref={wrapRef}
      className={`canvas-grid relative h-full w-full touch-none overflow-hidden rounded-xl border border-border bg-background ${cursor}`}
    >
      <canvas ref={canvasRef} className="h-full w-full" aria-label="3D simulation viewport" />
    </div>
  );
}
