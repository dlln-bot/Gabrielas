import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { brand, byId, courses, disciplines, teachers, week, type DisciplineId } from "../data";
import { Glyph } from "../components/Glyph";
import { Magnetic, Marquee, Reveal, Split, ease } from "../components/motion";

export default function Dans({ id }: { id: DisciplineId }) {
  const d = byId[id];
  const i = disciplines.findIndex((x) => x.id === id);
  const next = disciplines[(i + 1) % disciplines.length];
  const list = courses.filter((c) => c.d.includes(id));
  const days = week.map((w) => ({ ...w, slots: w.slots.filter((s) => s.d.includes(id)) })).filter((w) => w.slots.length);
  const staff = teachers.filter((t) => t.d.includes(id));
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const gy = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const gr = useTransform(scrollYProgress, [0, 1], [0, 25]);

  return (
    <div style={{ ["--d-bg" as string]: d.bg, ["--d-fg" as string]: d.fg }}>
      <section ref={ref} className="dans-hero" style={{ background: d.bg, color: d.fg }}>
        <motion.div className="dans-glyph" style={{ y: gy, rotate: gr }}>
          <Glyph id={id} color={d.fg} layers={7} strokeWidth={1.2} />
        </motion.div>
        <div className="container-x relative flex min-h-[100svh] flex-col justify-end pb-16 pt-32">
          <motion.p className="eyebrow mb-6" initial={{ opacity: 0 }} animate={{ opacity: 0.75 }} transition={{ delay: 0.8 }}>
            {String(i + 1).padStart(2, "0")} — {d.house}
          </motion.p>
          <Split as="h1" text={d.name} className="dans-title" delay={0.5} stagger={0.1} />
          <div className="mt-10 grid gap-8 md:grid-cols-[1.3fr_1fr] md:items-end">
            <Reveal delay={0.9}><p className="text-xl leading-relaxed md:text-2xl max-w-2xl">{d.intro}</p></Reveal>
            <Reveal delay={1}>
              <div className="flex flex-wrap items-center gap-3 md:justify-end">
                <span className="pill" style={{ borderColor: d.fg }}>{d.ages}</span>
                <span className="pill" style={{ borderColor: d.fg }}>{d.kicker}</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="py-10" style={{ background: d.fg, color: d.bg }}>
        <Marquee base={60}>
          {d.words.map((w) => <span key={w} className="dans-word">{w}<span className="mx-[0.5em] opacity-40">/</span></span>)}
        </Marquee>
      </div>

      <section className="container-x grid gap-16 py-28 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <p className="eyebrow mb-6">Om inriktningen</p>
          <Reveal><p className="text-2xl leading-snug md:text-3xl font-display">{d.body}</p></Reveal>
          {id === "balett" && (
            <Reveal delay={0.1}>
              <div className="heritage">
                <p className="eyebrow mb-3">Gabrielas Balett</p>
                <p>Skolan som startade allt. Sedan 2009 har Gabrielas Balett & Dansskola varit Vällingbys hem för klassisk balett — nu är den en del av Gabrielas.</p>
              </div>
            </Reveal>
          )}
          <div className="mt-10">
            <Magnetic>
              {d.soon ? (
                <a className="btn" style={{ background: d.fg, color: d.bg }} href={`mailto:${brand.email}?subject=Intresse: ${d.name}`}>Anmäl intresse →</a>
              ) : (
                <a className="btn" style={{ background: d.fg, color: d.bg }} href={brand.booking} target="_blank" rel="noreferrer">Boka gratis provlektion →</a>
              )}
            </Magnetic>
          </div>
        </div>

        <div>
          <p className="eyebrow mb-6">Klasser</p>
          {list.length ? (
            <ul className="border-t border-ink/15">
              {list.map((c, n) => (
                <motion.li
                  key={c.name + c.age}
                  className="class-row"
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease, delay: n * 0.05 }}
                >
                  <span className="class-age">{c.age}</span>
                  <span>
                    <span className="class-name">{c.name}{c.isNew && <span className="badge ml-3 align-middle" style={{ background: d.bg, color: d.fg }}>Ny</span>}</span>
                    <span className="block text-ink/60 mt-1">{c.text}</span>
                  </span>
                </motion.li>
              ))}
            </ul>
          ) : (
            <p className="text-lg text-ink/60 border-t border-ink/15 pt-6">Klasserna öppnar snart. Anmäl ditt intresse så hör vi av oss först av alla.</p>
          )}
        </div>
      </section>

      {days.length > 0 && (
        <section className="container-x pb-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <h2 className="h-section"><Split text="Veckan" /></h2>
            <a className="link-underline" href="#/schema">Hela schemat →</a>
          </div>
          <div className="week-mini">
            {days.map((w) => (
              <Reveal key={w.day}>
                <div className="week-mini-day">
                  <p className="eyebrow mb-4">{w.day}</p>
                  <ul className="space-y-3">
                    {w.slots.map((s, k) => (
                      <li key={k} className="slot" style={{ background: d.bg, color: d.fg }}>
                        <span className="font-medium">{s.name}</span>
                        <span className="text-sm opacity-75">{s.age}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {staff.length > 0 && (
        <section className="container-x pb-28">
          <p className="eyebrow mb-8">Dina pedagoger</p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {staff.map((t, n) => (
              <Reveal key={t.name} delay={n * 0.08}>
                <div className="teacher-card">
                  <div className="teacher-mono" style={{ background: d.bg, color: d.fg }}>
                    {t.name.split(" ").map((p) => p[0]).join("")}
                  </div>
                  <p className="mt-6 font-display text-2xl">{t.name}</p>
                  <p className="text-sm text-ink/60">{t.role}</p>
                  <p className="mt-4 text-ink/75 leading-relaxed">{t.bio}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      <a href={`#/dans/${next.id}`} className="next" style={{ background: next.bg, color: next.fg }} data-cursor="Nästa">
        <div className="container-x relative py-24">
          <p className="eyebrow mb-4 opacity-70">Nästa inriktning</p>
          <p className="next-title">{next.name} <span className="next-arrow">→</span></p>
        </div>
        <div className="next-glyph"><Glyph id={next.id} color={next.fg} layers={3} /></div>
      </a>
    </div>
  );
}
