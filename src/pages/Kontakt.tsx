import { useState, type FormEvent } from "react";
import { brand, disciplines } from "../data";
import { Magnetic, Reveal } from "../components/motion";
import { PageHero } from "./PageHero";

export default function Kontakt() {
  const [sent, setSent] = useState(false);
  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const body = `Namn: ${f.get("namn")}\nIntresse: ${f.get("intresse")}\n\n${f.get("meddelande")}`;
    window.location.href = `mailto:${brand.email}?subject=${encodeURIComponent("Fråga från gabrielas.se")}&body=${encodeURIComponent(body)}`;
    setSent(true);
  };
  return (
    <div className="bg-ink text-paper">
      <PageHero eyebrow="Kontakt" title="Säg" accent="hej." dark />
      <section className="container-x grid gap-20 pb-32 lg:grid-cols-2">
        <div className="space-y-12">
          <Reveal>
            <p className="eyebrow text-paper/50 mb-3">Ring eller skriv</p>
            <a href={brand.phoneHref} className="contact-big link-underline">{brand.phone}</a><br />
            <a href={`mailto:${brand.email}`} className="contact-big link-underline">{brand.email}</a>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="eyebrow text-paper/50 mb-3">Hitta hit</p>
            <p className="text-2xl">{brand.address}</p>
            <p className="text-paper/60">{brand.area} · några minuter från tunnelbanan</p>
            <a className="link-underline mt-3 inline-block" target="_blank" rel="noreferrer"
               href={`https://maps.google.com/?q=${encodeURIComponent(brand.address + ", Vällingby")}`}>Öppna i kartan →</a>
          </Reveal>
        </div>
        <Reveal delay={0.15}>
          <form className="form" onSubmit={submit}>
            <label>
              <span>Namn</span>
              <input name="namn" required autoComplete="name" />
            </label>
            <label>
              <span>Vad är du intresserad av?</span>
              <select name="intresse" defaultValue="">
                <option value="" disabled>Välj inriktning</option>
                {disciplines.map((d) => <option key={d.id}>{d.house}</option>)}
                <option>Aktiviteter & event</option>
                <option>Något annat</option>
              </select>
            </label>
            <label>
              <span>Meddelande</span>
              <textarea name="meddelande" rows={5} required />
            </label>
            <Magnetic><button className="btn btn-rouge" type="submit">Skicka →</button></Magnetic>
            {sent && <p className="text-sm text-paper/60" role="status">Ditt e-postprogram öppnas med meddelandet ifyllt.</p>}
          </form>
        </Reveal>
      </section>
    </div>
  );
}
