import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { activities, brand, disciplines, stats, teachers, byId } from "../data";
import { Glyph } from "../components/Glyph";
import { Counter, LiveWordmark, Magnetic, Marquee, Reveal, ScrollFill, Split, ease } from "../components/motion";
import { Finder } from "../components/Finder";
import { useMedia, useReducedMotion } from "../lib/useReducedMotion";

export default function Home() {
  return (
    <>
      <Hero />
      <Band />
      <section className="container-x py-32 md:py-48">
        <p className="eyebrow mb-10">Ett hus — många rörelser</p>
        <ScrollFill
          className="manifest"
          text="Gabrielas är ett hus för dans i alla former. Här möts *klassisk balett och jazz, orientalisk dans och barnens första steg — från tre till hundra år. Samma golv, samma musik, samma *glädje."
        />
      </section>
      <Disciplines />
      <Finder />
      <ActivitiesPreview />
      <Story />
      <TeachersRow />
    </>
  );
}

function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const [i, setI] = useState(0);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) return;
    const t = setInterval(() => setI((n) => (n + 1) % disciplines.length), 2600);
    return () => clearInterval(t);
  }, [reduced]);
  const d = disciplines[i];

  return (
    <section ref={ref} className="hero">
      <motion.div className="hero-glyph" style={{ opacity: fade }} aria-hidden>
        <AnimatePresence mode="popLayout">
          <motion.div
            key={d.id}
            className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.9, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 1.08, rotate: 8 }}
            transition={{ duration: 1.2, ease }}
          >
            <Glyph id={d.id} color={d.bg} layers={5} strokeWidth={1.1} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <div className="container-x relative flex min-h-[100svh] flex-col justify-between pt-28 pb-10">
        <motion.div
          className="hero-meta"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.1 }}
        >
          <span>Vällingby · Stockholm</span>
          <span className="hidden md:inline">Balett — Jazz — Contemporary — Orient — Barn — Senior</span>
          <span>Est. {brand.founded}</span>
        </motion.div>

        <motion.div style={{ y, scale }} className="origin-bottom-left">
          <h1 className="sr-only">Gabrielas – Rörelsens hus. Dansskola i Vällingby för alla från 3 till 100 år.</h1>
          <LiveWordmark text="Gabrielas" className="hero-mark" />
          <div className="mt-6 grid items-end gap-8 md:grid-cols-[1.2fr_1fr]">
            <p className="hero-sub">
              <Split text="Rörelsens hus." className="italic text-rouge" delay={0.9} />{" "}
              <Split text="Ett hem för" delay={1.05} />{" "}
              <span className="rotator" aria-live="polite">
                <AnimatePresence mode="wait">
                  <motion.a
                    key={d.id}
                    href={`#/dans/${d.id}`}
                    className="rotator-word"
                    style={{ color: d.bg }}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: "0%", opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.55, ease }}
                  >
                    {d.name.toLowerCase()}
                  </motion.a>
                </AnimatePresence>
              </span>
            </p>
            <motion.div
              className="flex flex-wrap gap-3 md:justify-end"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.4, ease }}
            >
              <Magnetic><a href="#hitta" className="btn btn-light" data-cursor="Hitta">Hitta din dans</a></Magnetic>
              <Magnetic><a href={brand.booking} target="_blank" rel="noreferrer" className="btn btn-rouge">Gratis provlektion</a></Magnetic>
            </motion.div>
          </div>
        </motion.div>
      </div>
      <motion.div className="scroll-cue" style={{ opacity: fade }} aria-hidden>
        <span>Scrolla</span><i />
      </motion.div>
    </section>
  );
}

function Star() {
  return (
    <svg viewBox="0 0 24 24" className="mx-[0.4em] inline-block h-[0.5em] w-[0.5em] align-middle" aria-hidden>
      <path d="M12 0c.6 6.6 5.4 11.4 12 12-6.6.6-11.4 5.4-12 12-.6-6.6-5.4-11.4-12-12C6.6 11.4 11.4 6.6 12 0Z" fill="currentColor" />
    </svg>
  );
}

function Band() {
  return (
    <div className="band">
      <Marquee>
        {disciplines.map((d) => (
          <span key={d.id} className="band-item">
            <span>{d.name}</span>
            <Star />
          </span>
        ))}
      </Marquee>
    </div>
  );
}

/* ——— Pinned horizontal chapters, one per discipline ——— */

function Disciplines() {
  const wide = useMedia("(min-width: 900px)");
  const reduced = useReducedMotion();
  if (!wide || reduced) {
    return (
      <section aria-labelledby="disc-h">
        <h2 id="disc-h" className="sr-only">Inriktningar</h2>
        {disciplines.map((d, i) => <Panel key={d.id} d={d} i={i} />)}
      </section>
    );
  }
  return <Horizontal />;
}

function Horizontal() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const n = disciplines.length;
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${((n - 1) / n) * 100}%`]);
  const [idx, setIdx] = useState(0);
  useEffect(() => scrollYProgress.on("change", (v) => setIdx(Math.min(n - 1, Math.round(v * (n - 1))))), [scrollYProgress, n]);

  return (
    <section ref={ref} style={{ height: `${n * 100}vh` }} className="relative" aria-labelledby="disc-h">
      <h2 id="disc-h" className="sr-only">Inriktningar</h2>
      <div className="sticky top-0 h-screen overflow-hidden">
        <motion.div className="flex h-full" style={{ x, width: `${n * 100}%` }}>
          {disciplines.map((d, i) => <Panel key={d.id} d={d} i={i} horizontal />)}
        </motion.div>
        <div className="chapter-ui" style={{ color: disciplines[idx].fg }}>
          <span>{String(idx + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}</span>
          <div className="chapter-bar"><motion.i style={{ scaleX: scrollYProgress }} /></div>
          <span>Inriktningar</span>
        </div>
      </div>
    </section>
  );
}

function Panel({ d, i, horizontal }: { d: (typeof disciplines)[number]; i: number; horizontal?: boolean }) {
  return (
    <article className="panel" style={{ background: d.bg, color: d.fg, width: horizontal ? `${100 / disciplines.length}%` : undefined }}>
      <div className="panel-glyph"><Glyph id={d.id} color={d.fg} layers={5} strokeWidth={1.3} /></div>
      <div className="panel-inner">
        <div className="flex items-start justify-between gap-6">
          <span className="panel-num">{String(i + 1).padStart(2, "0")}</span>
          <span className="eyebrow text-right">{d.kicker}</span>
        </div>
        <div>
          <p className="eyebrow mb-4 opacity-70">{d.house}</p>
          <h3 className="panel-title">{d.name}</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
            <p className="max-w-md text-lg leading-relaxed">{d.intro}</p>
            <div className="flex items-center gap-4">
              <span className="pill" style={{ borderColor: d.fg }}>{d.ages}</span>
              {d.soon && <span className="pill" style={{ background: d.fg, color: d.bg }}>Snart</span>}
              <Magnetic>
                <a href={`#/dans/${d.id}`} className="circle-btn" style={{ background: d.fg, color: d.bg }} data-cursor="Utforska" aria-label={`Utforska ${d.name}`}>
                  →
                </a>
              </Magnetic>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ——— Activities ——— */

function ActivitiesPreview() {
  return (
    <section className="bg-ink text-paper py-32">
      <div className="container-x">
        <div className="mb-16 flex flex-wrap items-end justify-between gap-6">
          <h2 className="h-section"><Split text="Mer än" /> <Split text="lektioner." className="italic text-rouge" delay={0.15} /></h2>
          <a href="#/aktiviteter" className="link-underline text-lg">Alla aktiviteter →</a>
        </div>
        <div className="bento">
          {activities.map((a, i) => (
            <Reveal key={a.id} delay={i * 0.06} className={`bento-cell bento-${i}`}>
              <a href="#/aktiviteter" className="bento-card" data-cursor="Läs">
                <div className="flex justify-between">
                  <span className="eyebrow text-paper/60">{a.tag}</span>
                  {a.soon && <span className="badge">Snart</span>}
                </div>
                <div>
                  <p className="text-sm text-paper/60 mb-2">{a.kicker}</p>
                  <h3 className="bento-title">{a.title}</h3>
                  <p className="bento-text">{a.text}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ——— Gabriela ——— */

function Story() {
  const g = teachers[0];
  return (
    <section className="container-x py-32 md:py-44">
      <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="eyebrow mb-6">Från Bukarest till Vällingby</p>
          <Reveal>
            <div className="portrait">
              <Glyph id="balett" color="var(--color-rouge)" layers={7} strokeWidth={1} />
              <span className="portrait-cap">Gabriela Teleki · Grundare</span>
            </div>
          </Reveal>
        </div>
        <div className="flex flex-col justify-between gap-16">
          <ScrollFill className="quote" text={`“${g.quote}”`} />
          <Reveal><p className="max-w-xl text-lg leading-relaxed text-ink/70">{g.bio}</p></Reveal>
          <div className="grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="border-t border-ink/15 pt-4">
                <Counter to={s.n} className="stat" />
                <p className="mt-2 text-sm text-ink/60">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function TeachersRow() {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <section className="container-x pb-32">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
        <h2 className="h-section"><Split text="Pedagogerna" /></h2>
        <a href="#/huset" className="link-underline text-lg">Möt hela huset →</a>
      </div>
      <ul className="border-t border-ink/15" onPointerLeave={() => setHover(null)}>
        {teachers.map((t, i) => (
          <li key={t.name} className="teacher-row" onPointerEnter={() => setHover(i)} data-dim={hover !== null && hover !== i}>
            <span className="teacher-name">{t.name}</span>
            <span className="hidden text-ink/60 md:block">{t.role}</span>
            <span className="flex gap-1.5">
              {t.d.map((id) => <i key={id} className="dot" style={{ background: byId[id].bg }} title={byId[id].name} />)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
