import { motion } from "framer-motion";
import { useState } from "react";
import { activities, brand } from "../data";
import { Glyph } from "../components/Glyph";
import { ease } from "../components/motion";
import { PageHero } from "./PageHero";

const glyphFor = ["balett", "sma", "jazz", "orient", "street", "senior"] as const;

export default function Aktiviteter() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="bg-ink text-paper">
      <PageHero eyebrow="Utanför salen" title="Scen, läger" accent="& fest." dark>
        Dansen tar inte slut när lektionen gör det. Föreställningar, lovverksamhet och nya sätt att mötas kring rörelse.
      </PageHero>
      <section className="container-x pb-32">
        <ul className="border-t border-paper/15">
          {activities.map((a, i) => {
            const isOpen = open === i;
            return (
              <li key={a.id} className="border-b border-paper/15">
                <button className="act-row" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : i)}>
                  <span className="act-num">{String(i + 1).padStart(2, "0")}</span>
                  <span className="act-title">{a.title}</span>
                  <span className="hidden md:block text-paper/50">{a.kicker}</span>
                  <span className="flex items-center gap-3">
                    {a.soon && <span className="badge">Snart</span>}
                    <motion.span className="act-plus" animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.4, ease }}>+</motion.span>
                  </span>
                </button>
                <motion.div
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-10 pb-12 md:grid-cols-[1fr_1fr] md:pl-[5.5rem]">
                    <div>
                      <p className="text-xl leading-relaxed text-paper/80 max-w-xl">{a.text}</p>
                      <a
                        className="btn btn-rouge mt-8"
                        href={a.soon ? `mailto:${brand.email}?subject=${encodeURIComponent(a.title)}` : brand.booking}
                        target={a.soon ? undefined : "_blank"}
                        rel="noreferrer"
                      >
                        {a.soon ? "Anmäl intresse" : "Boka"} →
                      </a>
                    </div>
                    <div className="act-glyph"><Glyph id={glyphFor[i]} color="var(--color-rouge)" layers={4} /></div>
                  </div>
                </motion.div>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
