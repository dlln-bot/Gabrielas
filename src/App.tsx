import { MotionConfig, motion, useScroll, useSpring } from "framer-motion";
import { useEffect, useState } from "react";
import { byId } from "./data";
import { routeKey, useRoute, type Route } from "./lib/router";
import { scrollToTop, useSmoothScroll } from "./lib/lenis";
import { useReducedMotion } from "./lib/useReducedMotion";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { Cursor } from "./components/motion";
import { Curtain, type Phase } from "./components/Curtain";
import Home from "./pages/Home";
import Dans from "./pages/Dans";
import Aktiviteter from "./pages/Aktiviteter";
import Schema from "./pages/Schema";
import Huset from "./pages/Huset";
import Kontakt from "./pages/Kontakt";

function meta(r: Route) {
  switch (r.page) {
    case "dans": { const d = byId[r.id]; return { title: d.house, label: d.name, bg: d.bg, fg: d.fg }; }
    case "aktiviteter": return { title: "Aktiviteter", label: "Aktiviteter", bg: "#0f0d0c", fg: "#f4efe7" };
    case "schema": return { title: "Schema", label: "Veckan", bg: "#f4efe7", fg: "#0f0d0c" };
    case "huset": return { title: "Huset", label: "Huset", bg: "#ff5a36", fg: "#1c0703" };
    case "kontakt": return { title: "Kontakt", label: "Hej!", bg: "#0f0d0c", fg: "#f4efe7" };
    default: return { title: "", label: "gabrielas.", bg: "#0f0d0c", fg: "#f4efe7" };
  }
}

function View({ route }: { route: Route }) {
  switch (route.page) {
    case "dans": return <Dans id={route.id} />;
    case "aktiviteter": return <Aktiviteter />;
    case "schema": return <Schema />;
    case "huset": return <Huset />;
    case "kontakt": return <Kontakt />;
    default: return <Home />;
  }
}

export default function App() {
  const route = useRoute();
  const reduced = useReducedMotion();
  useSmoothScroll(!reduced);
  // The visible page lags the URL while the curtain covers the screen, so content swaps out of sight.
  // Nothing plays on first paint, so the page is readable at once (and for crawlers/previews).
  const [shown, setShown] = useState(route);
  const [phase, setPhase] = useState<Phase>("idle");
  const key = routeKey(route);
  useEffect(() => {
    if (key === routeKey(shown)) return;
    if (reduced) { setShown(route); scrollToTop(); return; }
    setPhase("cover");
    const a = setTimeout(() => { setShown(route); scrollToTop(); setPhase("reveal"); }, 950);
    const b = setTimeout(() => setPhase("idle"), 1900);
    return () => { clearTimeout(a); clearTimeout(b); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
  const m = meta(route);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  useEffect(() => {
    document.title = m.title ? `${m.title} · Gabrielas` : "Gabrielas · Rörelsens hus";
  }, [m.title]);

  return (
    <MotionConfig reducedMotion="user">
      <a className="skip-link" href="#main">Hoppa till innehållet</a>
      <motion.div className="progress" style={{ scaleX: progress }} aria-hidden />
      <div className="grain" aria-hidden />
      <Cursor />
      <Header route={shown} />
      <Curtain label={m.label} bg={m.bg} fg={m.fg} phase={phase} />
      <main id="main" key={routeKey(shown)}>
        <View route={shown} />
      </main>
      <Footer />
    </MotionConfig>
  );
}
