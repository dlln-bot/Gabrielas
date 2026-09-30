import { motion, useScroll } from "framer-motion";
import { useRef } from "react";
import { byId, teachers } from "../data";
import { Reveal, ScrollFill, Split } from "../components/motion";
import { PageHero } from "./PageHero";

const timeline = [
  { year: "Bukarest", text: "Gabriela Teleki utbildar sig till dansare och dansar professionellt i fyra år, med turnéer till Aten, Budapest och Italien." },
  { year: "1977", text: "Gabriela kommer till Sverige och undervisar i gymnastik, balett och dans på flera privata skolor." },
  { year: "2009", text: "Gabrielas Balett & Dansskola öppnar på Vällingby torg." },
  { year: "2026", text: "Sex pedagoger undervisar sex dagar i veckan — från barnbalett till seniorjazz." },
  { year: "Nu", text: "Skolan blir Gabrielas: ett hus för alla dansformer, där Gabrielas Balett är hjärtat." },
];

const values = [
  { t: "Alla kroppar", d: "Från tre till hundra år. Dansen anpassas efter dig — inte tvärtom." },
  { t: "Riktig teknik", d: "Pedagoger från Kungliga Balettskolan, Operan, DOCH och Balettakademien." },
  { t: "En gemenskap", d: "Samma golv för alla. Syskon, föräldrar och far- och morföräldrar möts här." },
];

export default function Huset() {
  const line = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: line, offset: ["start 70%", "end 50%"] });
  return (
    <>
      <PageHero eyebrow="Om Gabrielas" title="Ett hus byggt" accent="på dans.">
        Det som började som en balettskola i Vällingby växer nu till ett hus för många sätt att röra sig.
      </PageHero>

      <section className="container-x pb-32">
        <ol ref={line} className="timeline">
          <motion.i className="timeline-line" style={{ scaleY: scrollYProgress }} aria-hidden />
          {timeline.map((t) => (
            <li key={t.year} className="timeline-item">
              <Reveal><p className="timeline-year">{t.year}</p></Reveal>
              <Reveal delay={0.1}><p className="text-lg leading-relaxed text-ink/75 max-w-lg">{t.text}</p></Reveal>
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-rouge text-[#1c0703] py-32">
        <div className="container-x">
          <ScrollFill className="manifest" text="Vi tror att dans är ett språk som alla kan lära sig. Det enda som krävs är att du kliver in i salen." />
          <div className="mt-24 grid gap-12 md:grid-cols-3">
            {values.map((v, i) => (
              <Reveal key={v.t} delay={i * 0.1}>
                <p className="font-display text-3xl mb-3">{v.t}</p>
                <p className="leading-relaxed opacity-80">{v.d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="container-x py-32">
        <h2 className="h-section mb-16"><Split text="Pedagogerna" /></h2>
        <div className="grid gap-x-10 gap-y-16 md:grid-cols-2">
          {teachers.map((t, i) => (
            <Reveal key={t.name} delay={(i % 2) * 0.1}>
              <article className="grid grid-cols-[5.5rem_1fr] gap-6">
                <div className="teacher-mono" style={{ background: byId[t.d[0]].bg, color: byId[t.d[0]].fg }}>
                  {t.name.split(" ").map((p) => p[0]).join("")}
                </div>
                <div>
                  <p className="font-display text-3xl leading-tight">{t.name}</p>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-sm text-ink/60">
                    {t.role} ·
                    {t.d.map((id) => <a key={id} href={`#/dans/${id}`} className="chip-mini" style={{ background: byId[id].bg, color: byId[id].fg }}>{byId[id].name}</a>)}
                  </p>
                  <p className="mt-4 leading-relaxed text-ink/75">{t.bio}</p>
                  {t.quote && <p className="mt-4 font-display italic text-xl text-rouge">“{t.quote}”</p>}
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
