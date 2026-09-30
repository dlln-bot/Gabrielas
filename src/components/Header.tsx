import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { brand, disciplines, type DisciplineId } from "../data";
import { nav, type Route } from "../lib/router";
import { lockScroll } from "../lib/lenis";
import { Glyph } from "./Glyph";
import { Magnetic, ease, easeInOut } from "./motion";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`logo ${className}`}>
      gabrielas<span className="logo-dot">.</span>
    </span>
  );
}

export function Header({ route }: { route: Route }) {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > 200 && v > prev);
  });

  useEffect(() => setOpen(false), [route]);
  useEffect(() => { lockScroll(open); }, [open]);

  return (
    <>
      <motion.header
        className="site-header"
        animate={{ y: hidden && !open ? "-120%" : "0%" }}
        transition={{ duration: 0.5, ease }}
      >
        <a href="#/" className="blend" aria-label="Gabrielas – till startsidan" data-cursor="Hem"><Logo /></a>
        <div className="flex items-center gap-3">
          <Magnetic>
            <a href={brand.booking} target="_blank" rel="noreferrer" className="btn btn-rouge hidden sm:inline-flex">
              Boka provlektion
            </a>
          </Magnetic>
          <button className="menu-btn blend" aria-expanded={open} aria-controls="menu" onClick={() => setOpen((o) => !o)}>
            <span className="menu-lines" data-open={open} aria-hidden><i /><i /></span>
            <span>{open ? "Stäng" : "Meny"}</span>
          </button>
        </div>
      </motion.header>
      <AnimatePresence>{open && <Menu onClose={() => setOpen(false)} />}</AnimatePresence>
    </>
  );
}

function Menu({ onClose }: { onClose: () => void }) {
  const [hover, setHover] = useState<DisciplineId>("balett");
  const ref = useRef<HTMLDivElement>(null);
  const active = disciplines.find((d) => d.id === hover)!;

  useEffect(() => {
    const el = ref.current!;
    el.querySelector<HTMLElement>("a")?.focus();
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key !== "Tab") return;
      const f = [...el.querySelectorAll<HTMLElement>("a, button")];
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener("keydown", key);
    return () => window.removeEventListener("keydown", key);
  }, [onClose]);

  return (
    <motion.div
      id="menu"
      ref={ref}
      role="dialog"
      aria-modal
      aria-label="Meny"
      className="menu"
      initial={{ clipPath: "inset(0 0 100% 0)" }}
      animate={{ clipPath: "inset(0 0 0% 0)" }}
      exit={{ clipPath: "inset(100% 0 0% 0)" }}
      transition={{ duration: 0.8, ease: easeInOut }}
    >
      <motion.div className="menu-bg" animate={{ backgroundColor: active.bg }} transition={{ duration: 0.6, ease }} />
      <div className="menu-glyph" style={{ color: active.fg }}>
        <Glyph id={active.id} layers={6} strokeWidth={1.4} />
      </div>
      <div className="menu-grid" style={{ color: active.fg }}>
        <div>
          <p className="eyebrow mb-6 opacity-70">Inriktningar</p>
          <ul className="menu-list">
            {disciplines.map((d, i) => (
              <li key={d.id} className="split-mask block">
                <motion.a
                  href={`#/dans/${d.id}`}
                  onPointerEnter={() => setHover(d.id)}
                  onFocus={() => setHover(d.id)}
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.9, ease, delay: 0.35 + i * 0.05 }}
                  className="menu-link"
                  data-active={hover === d.id}
                >
                  <span className="menu-num">0{i + 1}</span>
                  {d.name}
                  {d.soon && <span className="badge ml-3">Snart</span>}
                </motion.a>
              </li>
            ))}
          </ul>
        </div>
        <motion.div
          className="flex flex-col justify-end gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease }}
        >
          <ul className="space-y-2 text-2xl">
            {nav.slice(1).map((n) => (
              <li key={n.href}><a className="link-underline" href={n.href}>{n.label}</a></li>
            ))}
          </ul>
          <div className="text-sm leading-relaxed opacity-80">
            <p>{brand.address}, {brand.area}</p>
            <p><a className="link-underline" href={brand.phoneHref}>{brand.phone}</a> · <a className="link-underline" href={`mailto:${brand.email}`}>{brand.email}</a></p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
