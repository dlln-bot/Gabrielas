import { brand, disciplines } from "../data";
import { nav } from "../lib/router";
import { Magnetic, Marquee } from "./motion";

export function Footer() {
  return (
    <footer className="footer">
      <div className="container-x pt-28 pb-16">
        <p className="eyebrow text-paper/60">Första lektionen är gratis</p>
        <a href={brand.booking} target="_blank" rel="noreferrer" className="footer-cta" data-cursor="Boka">
          Kom och <em>prova</em> →
        </a>
        <div className="mt-24 grid gap-12 sm:grid-cols-2 lg:grid-cols-4 text-paper/80">
          <div>
            <p className="eyebrow text-paper/50 mb-4">Besök</p>
            <p>{brand.address}</p>
            <p>{brand.area}</p>
          </div>
          <div>
            <p className="eyebrow text-paper/50 mb-4">Kontakt</p>
            <p><a className="link-underline" href={brand.phoneHref}>{brand.phone}</a></p>
            <p><a className="link-underline" href={`mailto:${brand.email}`}>{brand.email}</a></p>
          </div>
          <div>
            <p className="eyebrow text-paper/50 mb-4">Inriktningar</p>
            <ul className="space-y-1">
              {disciplines.map((d) => (
                <li key={d.id}>
                  <a className="footer-disc link-underline" href={`#/dans/${d.id}`} style={{ ["--dot" as string]: d.bg }}>{d.house}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow text-paper/50 mb-4">Huset</p>
            <ul className="space-y-1">
              {nav.slice(1).map((n) => <li key={n.href}><a className="link-underline" href={n.href}>{n.label}</a></li>)}
            </ul>
            <div className="mt-6">
              <Magnetic><a className="btn btn-ghost-light" href={brand.booking} target="_blank" rel="noreferrer">Boka på Mina Aktiviteter</a></Magnetic>
            </div>
          </div>
        </div>
      </div>
      <Marquee className="footer-mark" base={40}>
        <span className="px-[0.15em]">gabrielas</span><span className="px-[0.15em] text-rouge italic">rörelsens hus</span>
      </Marquee>
      <div className="container-x flex flex-wrap justify-between gap-4 py-6 text-xs text-paper/50">
        <p>© {new Date().getFullYear()} Gabrielas · Vällingby sedan {brand.founded}</p>
        <p>Gabrielas Balett är en del av Gabrielas</p>
      </div>
    </footer>
  );
}
