import {
  animate, motion, useAnimationFrame, useInView, useMotionValue, useScroll, useSpring,
  useTransform, useVelocity, type MotionValue,
} from "framer-motion";
import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";
import { useFinePointer, useReducedMotion } from "../lib/useReducedMotion";

export const ease = [0.22, 1, 0.36, 1] as const;
export const easeInOut = [0.76, 0, 0.24, 1] as const;

/** Words slide up out of a clipping mask, one after another. */
export function Split({ text, className, delay = 0, as: Tag = "span", stagger = 0.06 }: {
  text: string; className?: string; delay?: number; as?: "span" | "h1" | "h2" | "h3" | "p"; stagger?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" });
  const MotionTag = motion[Tag] as typeof motion.span;
  return (
    <MotionTag ref={ref as never} className={className} aria-label={text}>
      {text.split(" ").map((w, i, all) => (
        <Fragment key={i}>
          <span className="split-mask" aria-hidden>
            <motion.span
              className="inline-block"
              initial={{ y: "110%", rotate: 4 }}
              animate={inView ? { y: "0%", rotate: 0 } : undefined}
              transition={{ duration: 1, ease, delay: delay + i * stagger }}
            >
              {w}
            </motion.span>
          </span>
          {i < all.length - 1 && " "}
        </Fragment>
      ))}
    </MotionTag>
  );
}

export function Reveal({ children, delay = 0, y = 40, className }: { children: ReactNode; delay?: number; y?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -8% 0px" }}
      transition={{ duration: 1, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Text whose words light up one by one as the paragraph scrolls through the viewport. */
export function ScrollFill({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 85%", "end 45%"] });
  const words = text.split(" ");
  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <FillWord key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>{w}</FillWord>
      ))}
    </p>
  );
}

function FillWord({ children, progress, range }: { children: string; progress: MotionValue<number>; range: [number, number] }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  const italic = children.startsWith("*");
  return (
    <>
      <motion.span style={{ opacity }} className={italic ? "font-display italic text-rouge" : undefined}>
        {italic ? children.slice(1) : children}
      </motion.span>{" "}
    </>
  );
}

/** Pulls its child toward the pointer while hovered. */
export function Magnetic({ children, strength = 0.35 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useSpring(0, { stiffness: 180, damping: 14, mass: 0.2 });
  const y = useSpring(0, { stiffness: 180, damping: 14, mass: 0.2 });
  const fine = useFinePointer();
  return (
    <motion.span
      ref={ref}
      className="inline-block"
      style={{ x, y }}
      onPointerMove={(e) => {
        if (!fine || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        x.set((e.clientX - r.left - r.width / 2) * strength);
        y.set((e.clientY - r.top - r.height / 2) * strength);
      }}
      onPointerLeave={() => { x.set(0); y.set(0); }}
    >
      {children}
    </motion.span>
  );
}

/** Infinite marquee that speeds up, reverses and skews with scroll velocity. */
export function Marquee({ children, base = 70, className }: { children: ReactNode; base?: number; className?: string }) {
  const x = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useSpring(useVelocity(scrollY), { damping: 50, stiffness: 400 });
  const factor = useTransform(velocity, [-2000, 0, 2000], [-4, 1, 4], { clamp: false });
  const skew = useTransform(velocity, [-2000, 2000], [8, -8]);
  const dir = useRef(1);
  const track = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduced || !track.current) return;
    const f = factor.get();
    if (f < 0) dir.current = -1; else if (f > 0) dir.current = 1;
    const half = track.current.scrollWidth / 2;
    let next = x.get() - dir.current * (base / 1000) * delta * Math.max(1, Math.abs(f));
    if (next <= -half) next += half;
    if (next > 0) next -= half;
    x.set(next);
  });

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className ?? ""}`} aria-hidden>
      <motion.div ref={track} className="inline-flex" style={{ x, skewX: reduced ? 0 : skew }}>
        <div className="inline-flex shrink-0">{children}</div>
        <div className="inline-flex shrink-0">{children}</div>
      </motion.div>
    </div>
  );
}

export function Counter({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [v, setV] = useState(to);
  useEffect(() => {
    if (!inView) return;
    const from = to > 1000 ? to - 60 : 0;
    const c = animate(from, to, { duration: 2, ease, onUpdate: (n) => setV(Math.round(n)) });
    return () => c.stop();
  }, [inView, to]);
  return <span ref={ref} className={className}>{v}</span>;
}

/** Two-part cursor: a precise dot and a lagging ring that grows and shows a label over links. */
export function Cursor() {
  const fine = useFinePointer();
  const x = useMotionValue(-100), y = useMotionValue(-100);
  const rx = useSpring(x, { stiffness: 260, damping: 26, mass: 0.4 });
  const ry = useSpring(y, { stiffness: 260, damping: 26, mass: 0.4 });
  const [label, setLabel] = useState<string | null>(null);
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!fine) return;
    const move = (e: PointerEvent) => {
      x.set(e.clientX); y.set(e.clientY);
      const el = (e.target as HTMLElement).closest<HTMLElement>("a, button, [data-cursor], label, select, input, textarea");
      setHot(!!el);
      setLabel(el?.dataset.cursor ?? null);
    };
    window.addEventListener("pointermove", move);
    document.documentElement.classList.add("has-cursor");
    return () => { window.removeEventListener("pointermove", move); document.documentElement.classList.remove("has-cursor"); };
  }, [fine, x, y]);

  if (!fine) return null;
  return (
    <>
      <motion.div className="cursor-dot" style={{ x, y }} aria-hidden />
      <motion.div
        className="cursor-ring"
        style={{ x: rx, y: ry }}
        animate={{ width: label ? 96 : hot ? 56 : 32, height: label ? 96 : hot ? 56 : 32, backgroundColor: label ? "var(--color-rouge)" : "rgba(0,0,0,0)" }}
        transition={{ duration: 0.35, ease }}
        aria-hidden
      >
        {label && <span>{label}</span>}
      </motion.div>
    </>
  );
}

/**
 * The wordmark as an instrument: every letter's weight, softness and height follow the
 * pointer, so moving across "Gabrielas" makes it breathe like a dancer's port de bras.
 */
export function LiveWordmark({ text, className, intro = true }: { text: string; className?: string; intro?: boolean }) {
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const wrap = useRef<HTMLSpanElement>(null);
  const reduced = useReducedMotion();
  const fine = useFinePointer();

  useEffect(() => {
    if (reduced) return;
    let px = -9999, py = -9999, raf = 0;
    const cur = letters.current.map(() => ({ w: 380, s: 0 }));
    const on = (e: PointerEvent) => { px = e.clientX; py = e.clientY; };
    const start = performance.now();
    const tick = (now: number) => {
      const t = (now - start) / 1000;
      letters.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        let target = 0;
        if (fine && px > -9000) {
          const d = Math.hypot(px - (r.left + r.width / 2), (py - (r.top + r.height / 2)) * 0.6);
          target = Math.max(0, 1 - d / (r.height * 1.4));
        } else {
          // Touch screens get a slow wave travelling through the word instead.
          target = (Math.sin(t * 1.4 - i * 0.7) + 1) / 2 * 0.8;
        }
        const c = cur[i];
        c.w += (300 + target * 600 - c.w) * 0.12;
        c.s += (target * 100 - c.s) * 0.12;
        el.style.fontVariationSettings = `"wght" ${c.w.toFixed(0)}, "SOFT" ${c.s.toFixed(0)}, "WONK" 1, "opsz" 144`;
        el.style.transform = `translateY(${(-target * 0.06).toFixed(3)}em) scaleY(${(1 + target * 0.06).toFixed(3)})`;
      });
      raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", on);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); window.removeEventListener("pointermove", on); };
  }, [reduced, fine, text]);

  return (
    <span ref={wrap} className={className} aria-label={text} role="img">
      {[...text].map((ch, i) => (
        <span key={i} className="split-mask" aria-hidden>
          <motion.span
            className="inline-block"
            initial={intro ? { y: "105%" } : false}
            animate={{ y: "0%" }}
            transition={{ duration: 1.3, ease, delay: 0.25 + i * 0.06 }}
          >
            <span ref={(el) => { letters.current[i] = el; }} className="inline-block origin-bottom will-change-transform">{ch}</span>
          </motion.span>
        </span>
      ))}
    </span>
  );
}
