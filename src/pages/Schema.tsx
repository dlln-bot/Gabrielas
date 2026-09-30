import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { brand, byId, disciplines, week, type DisciplineId } from "../data";
import { ease } from "../components/motion";
import { PageHero } from "./PageHero";

export default function Schema() {
  const [f, setF] = useState<DisciplineId | "alla">("alla");
  const live = disciplines.filter((d) => !d.soon);
  return (
    <>
      <PageHero eyebrow="Höstterminen 2026" title="Sex dagar" accent="i veckan.">
        Filtrera på inriktning. Exakta tider och lediga platser ser du när du bokar via Mina Aktiviteter.
      </PageHero>
      <section className="container-x pb-32">
        <div className="chips mb-12" role="group" aria-label="Filtrera schemat">
          <button className="chip" aria-pressed={f === "alla"} onClick={() => setF("alla")}>Alla</button>
          {live.map((d) => (
            <button key={d.id} className="chip chip-dot" aria-pressed={f === d.id} onClick={() => setF(d.id)} style={{ ["--dot" as string]: d.bg }}>
              {d.name}
            </button>
          ))}
        </div>
        <div className="week">
          {week.map((w) => {
            const slots = w.slots.filter((s) => f === "alla" || s.d.includes(f));
            return (
              <div key={w.day} className="week-day">
                <p className="week-head"><span className="md:hidden">{w.day}</span><span className="hidden md:inline">{w.short}</span></p>
                <motion.ul layout className="space-y-2">
                  <AnimatePresence mode="popLayout">
                    {slots.map((s) => {
                      const d = byId[f === "alla" ? s.d[s.d.length - 1] : f];
                      return (
                        <motion.li
                          layout
                          key={s.name + s.age}
                          className="slot"
                          style={{ background: d.bg, color: d.fg }}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          transition={{ duration: 0.4, ease }}
                        >
                          <span className="font-medium leading-tight">{s.name}</span>
                          {s.age && <span className="text-sm opacity-75">{s.age}</span>}
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                  {!slots.length && <li className="text-sm text-ink/40 py-3">{w.slots.length ? "—" : "Vilodag"}</li>}
                </motion.ul>
              </div>
            );
          })}
        </div>
        <a href={brand.booking} target="_blank" rel="noreferrer" className="btn btn-dark mt-14">Se tider & boka →</a>
      </section>
    </>
  );
}
