import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { brand, byId, courses, type DisciplineId, type Who } from "../data";
import { Glyph } from "./Glyph";
import { Split, ease } from "./motion";

const ages: { id: Who; label: string }[] = [
  { id: "barn", label: "3–7 år" },
  { id: "mellan", label: "8–12 år" },
  { id: "tonar", label: "Tonår" },
  { id: "vuxen", label: "Vuxen" },
  { id: "senior", label: "50+" },
];

const moods: { label: string; d: DisciplineId[] }[] = [
  { label: "Precision & klassik", d: ["balett"] },
  { label: "Energi & uttryck", d: ["jazz", "street"] },
  { label: "Mjukt & sinnligt", d: ["orient"] },
  { label: "Lek & fantasi", d: ["sma"] },
  { label: "Lugnt & hållbart", d: ["senior"] },
  { label: "Överraska mig", d: [] },
];

export function Finder() {
  const [who, setWho] = useState<Who | null>(null);
  const [mood, setMood] = useState<number | null>(null);

  const results = useMemo(() => {
    if (!who) return { list: [], fallback: false };
    const m = mood === null ? [] : moods[mood].d;
    const byAge = courses.filter((c) => c.who.includes(who));
    const hit = m.length ? byAge.filter((c) => c.d.some((d) => m.includes(d))) : byAge;
    // If the mood has nothing for this age, show what the age group can do instead of a dead end.
    return { list: hit.length ? hit : byAge, fallback: !hit.length && m.length > 0 };
  }, [who, mood]);

  const list = results.list;
  const top = list[0] ? byId[list[0].d[0]] : null;
  const bg = top ? top.bg : "#f4efe7";
  const fg = top ? top.fg : "#0f0d0c";

  return (
    <motion.section
      id="hitta"
      className="finder"
      style={{ ["--f-bg" as string]: bg, ["--f-fg" as string]: fg }}
      animate={{ backgroundColor: bg, color: fg }}
      transition={{ duration: 0.8, ease }}
      aria-labelledby="finder-h"
    >
      {top && (
        <div className="finder-glyph" aria-hidden><Glyph id={top.id} color={fg} layers={4} strokeWidth={1} /></div>
      )}
      <div className="container-x relative py-32">
        <p className="eyebrow mb-6">Hitta din dans</p>
        <h2 id="finder-h" className="h-section max-w-4xl">
          <Split text="Två frågor." /> <Split text="Sen vet vi." className="italic" delay={0.2} />
        </h2>

        <fieldset className="mt-16">
          <legend className="finder-q"><span className="finder-step">1</span>Vem ska dansa?</legend>
          <div className="chips">
            {ages.map((a) => (
              <button key={a.id} type="button" className="chip" aria-pressed={who === a.id} onClick={() => setWho(a.id)}>
                {a.label}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-12" disabled={!who} style={{ opacity: who ? 1 : 0.35, transition: "opacity .4s" }}>
          <legend className="finder-q"><span className="finder-step">2</span>Hur vill du röra dig?</legend>
          <div className="chips">
            {moods.map((m, i) => (
              <button key={m.label} type="button" className="chip" aria-pressed={mood === i} onClick={() => setMood(i)}>
                {m.label}
              </button>
            ))}
          </div>
        </fieldset>

        <div className="mt-16 min-h-[8rem]" aria-live="polite">
          {who && (
            <>
              <p className="mb-6 text-sm opacity-70">
                {results.fallback ? "Den känslan har vi inte för den åldern än — men det här passar:" : `${list.length} klasser passar`}
              </p>
              <motion.ul layout className="finder-results">
                <AnimatePresence mode="popLayout">
                  {list.map((c) => {
                    const d = byId[c.d[0]];
                    return (
                      <motion.li
                        layout
                        key={c.name + c.age}
                        initial={{ opacity: 0, y: 30, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.5, ease }}
                      >
                        <a href={`#/dans/${d.id}`} className="result" style={{ background: d.fg, color: d.bg }} data-cursor="Läs">
                          <span className="flex items-center justify-between text-xs uppercase tracking-[0.18em] opacity-80">
                            {d.house}{c.isNew && <span className="badge" style={{ background: d.bg, color: d.fg }}>Ny</span>}
                          </span>
                          <span className="result-name">{c.name}</span>
                          <span className="text-sm opacity-80">{c.age} · {c.text}</span>
                        </a>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </motion.ul>
              <a href={brand.booking} target="_blank" rel="noreferrer" className="btn mt-10" style={{ background: fg, color: bg }}>
                Boka gratis provlektion →
              </a>
            </>
          )}
        </div>
      </div>
    </motion.section>
  );
}
