import { useEffect, useRef } from "react";
import type { DisciplineId } from "../data";
import { useReducedMotion } from "../lib/useReducedMotion";

/**
 * Every dance has its own line. Each discipline gets a parametric curve that is redrawn every
 * frame, so the "illustration" is the movement itself: pirouette loops for ballet, sharp
 * syncopation for jazz, hip circles for oriental dance and so on.
 */
type Curve = (u: number, t: number, layer: number) => [number, number];

const TAU = Math.PI * 2;

const curves: Record<DisciplineId, Curve> = {
  // A slowly turning figure eight — a pirouette traced from above.
  balett: (u, t, l) => {
    const a = u * TAU, r = 0.78 - l * 0.09;
    const x = Math.sin(a + t * 0.3) * r;
    const y = Math.sin(2 * a) * r * 0.55;
    const rot = t * 0.12 + l * 0.18;
    return [x * Math.cos(rot) - y * Math.sin(rot), x * Math.sin(rot) + y * Math.cos(rot)];
  },
  // High-frequency Lissajous with a syncopated phase jump.
  jazz: (u, t, l) => {
    const a = u * TAU;
    const kick = Math.sin(t * 1.4) > 0.6 ? 0.35 : 0;
    return [Math.sin(3 * a + t * 0.9 + l * 0.3) * 0.82, Math.sin(4 * a + kick + l * 0.2) * 0.72];
  },
  // Rose curve — hip circles and figure eights.
  orient: (u, t, l) => {
    const a = u * TAU;
    const k = 3 + Math.sin(t * 0.2) * 0.35;
    const r = Math.cos(k * a + t * 0.25) * (0.85 - l * 0.1);
    return [r * Math.cos(a), r * Math.sin(a)];
  },
  // Curtate cycloid — bouncing loops across the frame.
  sma: (u, t, l) => {
    const a = u * TAU * 4 + t * 1.2;
    const x = (u * 2 - 1) * 0.9 + Math.cos(a) * 0.18;
    const y = Math.sin(a) * 0.3 - Math.abs(Math.sin(u * Math.PI * 3 + t)) * 0.35 + 0.2 + l * 0.08;
    return [x, y];
  },
  // Parallel, breathing sine ribbons.
  senior: (u, t, l) => {
    const x = u * 2 - 1;
    return [x * 0.95, Math.sin(u * TAU * 1.2 + t * 0.6 + l * 0.5) * 0.28 + (l - 2) * 0.16];
  },
  // Quantised Lissajous — hard stops and freezes.
  street: (u, t, l) => {
    const a = u * TAU;
    const q = (v: number) => Math.round(v * 6) / 6;
    return [q(Math.sin(2 * a + t * 0.7 + l * 0.2)) * 0.8, q(Math.sin(3 * a + l * 0.35)) * 0.72];
  },
};

type Props = { id: DisciplineId; color?: string; layers?: number; className?: string; speed?: number; strokeWidth?: number };

export function Glyph({ id, color = "currentColor", layers = 4, className, speed = 1, strokeWidth = 1.2 }: Props) {
  const svg = useRef<SVGSVGElement>(null);
  const paths = useRef<(SVGPathElement | null)[]>([]);
  const reduced = useReducedMotion();

  useEffect(() => {
    const curve = curves[id];
    const steps = id === "street" ? 220 : 360;
    const draw = (t: number) => {
      for (let l = 0; l < layers; l++) {
        let d = "";
        for (let i = 0; i <= steps; i++) {
          const [x, y] = curve(i / steps, t - l * 0.18, l);
          d += `${i ? "L" : "M"}${(x * 100).toFixed(2)} ${(y * 100).toFixed(2)}`;
        }
        paths.current[l]?.setAttribute("d", d);
      }
    };
    if (reduced) { draw(1.5); return; }

    let raf = 0, visible = true;
    const start = performance.now();
    const loop = (now: number) => {
      if (visible) draw(((now - start) / 1000) * speed);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; });
    if (svg.current) io.observe(svg.current);
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [id, layers, reduced, speed]);

  return (
    <svg ref={svg} viewBox="-110 -110 220 220" className={className} aria-hidden fill="none">
      {Array.from({ length: layers }, (_, l) => (
        <path
          key={l}
          ref={(el) => { paths.current[l] = el; }}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={1 - l / (layers + 0.5)}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}
