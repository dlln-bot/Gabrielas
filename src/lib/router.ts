import { useEffect, useState } from "react";
import { byId, type DisciplineId } from "../data";

export type Route =
  | { page: "home" }
  | { page: "dans"; id: DisciplineId }
  | { page: "aktiviteter" }
  | { page: "schema" }
  | { page: "huset" }
  | { page: "kontakt" };

export const nav = [
  { href: "#/dans/balett", label: "Inriktningar" },
  { href: "#/aktiviteter", label: "Aktiviteter" },
  { href: "#/schema", label: "Schema" },
  { href: "#/huset", label: "Huset" },
  { href: "#/kontakt", label: "Kontakt" },
];

function read(): Route {
  const [a, b] = window.location.hash.replace(/^#\/?/, "").split(/[?#]/)[0].split("/");
  if (a === "dans" && b && b in byId) return { page: "dans", id: b as DisciplineId };
  if (a === "aktiviteter" || a === "schema" || a === "huset" || a === "kontakt") return { page: a };
  return { page: "home" };
}

export const routeKey = (r: Route) => (r.page === "dans" ? `dans/${r.id}` : r.page);

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(read);
  useEffect(() => {
    const on = () => setRoute(read());
    window.addEventListener("hashchange", on);
    return () => window.removeEventListener("hashchange", on);
  }, []);
  return route;
}
