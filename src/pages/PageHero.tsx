import type { ReactNode } from "react";
import { Split } from "../components/motion";

export function PageHero({ eyebrow, title, accent, children, dark }: { eyebrow: string; title: string; accent?: string; children?: ReactNode; dark?: boolean }) {
  return (
    <section className={dark ? "bg-ink text-paper" : ""}>
      <div className="container-x pt-40 pb-20 md:pt-52">
        <p className="eyebrow mb-8 opacity-70">{eyebrow}</p>
        <h1 className="page-title">
          <Split text={title} delay={0.4} />{accent && <> <Split text={accent} className="italic text-rouge" delay={0.6} /></>}
        </h1>
        {children && <div className="mt-10 max-w-2xl text-xl leading-relaxed opacity-80">{children}</div>}
      </div>
    </section>
  );
}
