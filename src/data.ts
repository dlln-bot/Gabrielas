export const brand = {
  name: "Gabrielas",
  line: "Rörelsens hus",
  address: "Vällingby torg 43",
  area: "Vällingby Centrum, Stockholm",
  phone: "073-33 53 715",
  phoneHref: "tel:+46733353715",
  email: "dans@gabrielas.se",
  booking: "https://minaaktiviteter.se",
  founded: 2009,
  instagram: "https://instagram.com",
};

export type DisciplineId = "balett" | "jazz" | "orient" | "sma" | "senior" | "street";

export type Discipline = {
  id: DisciplineId;
  /** Label as it reads inside the Gabrielas family, e.g. "Gabrielas Balett". */
  house: string;
  name: string;
  kicker: string;
  ages: string;
  intro: string;
  body: string;
  words: string[];
  bg: string;
  fg: string;
  soon?: boolean;
};

export const disciplines: Discipline[] = [
  {
    id: "balett", house: "Gabrielas Balett", name: "Balett", kicker: "Sedan 2009 · hjärtat i huset", ages: "3–100 år",
    intro: "Klassisk balett med rötter i Bukarest, från första plié till tåspets.",
    body: "Här började allt. Gabrielas Balett är husets klassiska skola — nivåindelade grupper där precision, hållning och musikalitet byggs upp steg för steg. Från lekfull barnbalett till avancerade vuxenklasser och tåspets.",
    words: ["Plié", "Tendu", "Arabesque", "Révérence"],
    bg: "#f3d3d8", fg: "#2b0d14",
  },
  {
    id: "jazz", house: "Gabrielas Jazz & Contemporary", name: "Jazz & Contemporary", kicker: "Energi · uttryck · musik", ages: "8 år – vuxen",
    intro: "Jazzens puls möter den moderna dansens frihet.",
    body: "Snabba kombinationer, golvarbete och stora rörelser. Jazz Contemporary blandar jazzens energi med modern dans — för dig som vill röra dig med hela kroppen och hitta ditt eget uttryck.",
    words: ["Groove", "Release", "Isolation", "Flow"],
    bg: "#ff5a36", fg: "#1c0703",
  },
  {
    id: "orient", house: "Gabrielas Orient", name: "Orientalisk dans", kicker: "Tradition · kontroll · mjukhet", ages: "tonår & vuxen",
    intro: "Mjuka, kontrollerade rörelser med rötter i en lång danstradition.",
    body: "Under ledning av Konstantina Buni, grundare av Raks el Hawanem, utforskar du orientalisk dans — isolationer, rytm och en rörelsekvalitet som är både stark och följsam.",
    words: ["Shimmy", "Maya", "Taksim", "Raks"],
    bg: "#e8b54a", fg: "#291800",
  },
  {
    id: "sma", house: "Gabrielas Små", name: "Små dansare", kicker: "Lek · fantasi · rytm", ages: "3–7 år",
    intro: "Den första dansen — med fantasi, musik och massor av rörelseglädje.",
    body: "Barnbalett och Dansmix för de yngsta. Vi leker fram positioner, rytm och koordination i en trygg miljö där varje barn får växa i sin egen takt.",
    words: ["Hoppa", "Snurra", "Sträck", "Buga"],
    bg: "#b7e2d3", fg: "#0c2a21",
  },
  {
    id: "senior", house: "Gabrielas Senior", name: "Senior i rörelse", kicker: "Hållning · rörlighet · glädje", ages: "50–100 år",
    intro: "Balett och jazz anpassat efter kropp och erfarenhet.",
    body: "Det är aldrig för sent. Seniorbalett och seniorjazz i lugnare tempo — för rörlighet, balans och hållning, men framför allt för glädjen att dansa tillsammans.",
    words: ["Balans", "Andning", "Hållning", "Gemenskap"],
    bg: "#cbc3f3", fg: "#18133a",
  },
  {
    id: "street", house: "Gabrielas Street", name: "Street & Hiphop", kicker: "Ny inriktning · under uppbyggnad", ages: "10 år – vuxen",
    intro: "Nästa kapitel i huset. Beats, battles och egen stil.",
    body: "Vi bygger en ny inriktning för street- och hiphopdans. Anmäl ditt intresse så hör vi av oss när de första klasserna öppnar.",
    words: ["Bounce", "Rock", "Freeze", "Cypher"],
    bg: "#d8f55c", fg: "#141a00", soon: true,
  },
];

export const byId = Object.fromEntries(disciplines.map((d) => [d.id, d])) as Record<DisciplineId, Discipline>;

export type Who = "barn" | "mellan" | "tonar" | "vuxen" | "senior";
export type Course = { d: DisciplineId[]; who: Who[]; age: string; name: string; text: string; isNew?: boolean };

export const courses: Course[] = [
  { d: ["balett", "sma"], who: ["barn"], age: "3–4 år", name: "Barnbalett", text: "En lekfull första kontakt med balettens positioner, rytm och fantasi." },
  { d: ["balett", "sma"], who: ["barn"], age: "4–6 år", name: "Barnbalett", text: "Grundteknik och hållning i en trygg, lekfull miljö." },
  { d: ["sma"], who: ["barn"], age: "4–6 år", name: "Barndans Dansmix", text: "Blandad dans och rörelseglädje för de yngsta." },
  { d: ["sma", "balett"], who: ["barn"], age: "5–7 år", name: "Dansmix balett", text: "Ett steg närmare klassisk balett, med en mix av stilar." },
  { d: ["balett"], who: ["mellan", "tonar"], age: "från 7 år", name: "Klassisk balett", text: "Nivåindelade grupper med fokus på precision, styrka och musikalitet." },
  { d: ["balett"], who: ["tonar"], age: "tonår", name: "Tåspets", text: "För elever som är redo att dansa på tå, under noggrann handledning." },
  { d: ["balett"], who: ["vuxen"], age: "vuxen nybörjare", name: "Klassisk balett", text: "Grundteknik och hållning — det är aldrig för sent att börja." },
  { d: ["balett"], who: ["vuxen"], age: "vuxen avancerad", name: "Klassisk balett", text: "Komplexa kombinationer och uttryck för erfarna dansare." },
  { d: ["balett"], who: ["vuxen"], age: "vuxen", name: "Tåspets", text: "Tåspetsteknik för vuxna med balettbakgrund." },
  { d: ["jazz"], who: ["mellan"], age: "8–12 år", name: "Jazz", text: "Energisk jazzdans för mellanstadieåldern.", isNew: true },
  { d: ["jazz"], who: ["tonar"], age: "13+ år", name: "Jazz Contemporary", text: "Uttrycksfull dans som blandar jazzens energi med modern dans." },
  { d: ["jazz"], who: ["vuxen"], age: "vuxen", name: "Jazz Contemporary", text: "Vuxenklass för dig som vill dansa med hela kroppen.", isNew: true },
  { d: ["orient"], who: ["tonar", "vuxen"], age: "tonår & vuxen", name: "Orientalisk dans", text: "Mjuka, kontrollerade rörelser med rötter i orientalisk danstradition." },
  { d: ["senior", "balett"], who: ["senior"], age: "50–100 år", name: "Seniorbalett", text: "Balett anpassad efter kropp och erfarenhet — rörlighet, hållning och glädje." },
  { d: ["senior", "jazz"], who: ["senior"], age: "65+ år", name: "Seniorjazz", text: "Jazzdans i lugnare tempo för dig som vill hålla dig i rörelse." },
];

export type Slot = { name: string; age: string; d: DisciplineId[] };
export const week: { day: string; short: string; slots: Slot[] }[] = [
  { day: "Måndag", short: "Mån", slots: [
    { name: "Seniorbalett", age: "50+", d: ["senior", "balett"] },
    { name: "Barnbalett", age: "3–4 år", d: ["sma", "balett"] },
    { name: "Tåspets", age: "vuxen", d: ["balett"] },
    { name: "Klassisk balett", age: "15–18 år", d: ["balett"] },
    { name: "Jazz Contemporary", age: "vuxen", d: ["jazz"] },
  ]},
  { day: "Tisdag", short: "Tis", slots: [
    { name: "Klassisk balett", age: "8–9 år", d: ["balett"] },
    { name: "Klassisk balett", age: "11–12 år", d: ["balett"] },
    { name: "Klassisk balett", age: "13–14 år", d: ["balett"] },
    { name: "Klassisk balett, avancerad", age: "vuxen", d: ["balett"] },
  ]},
  { day: "Onsdag", short: "Ons", slots: [] },
  { day: "Torsdag", short: "Tor", slots: [
    { name: "Seniorbalett", age: "50+", d: ["senior", "balett"] },
    { name: "Balett", age: "4–7 år", d: ["sma", "balett"] },
    { name: "Klassisk balett, nybörjare", age: "vuxen", d: ["balett"] },
    { name: "Orientalisk dans", age: "tonår & vuxen", d: ["orient"] },
  ]},
  { day: "Fredag", short: "Fre", slots: [
    { name: "Seniorjazz", age: "65+", d: ["senior", "jazz"] },
    { name: "Dansmix balett", age: "5–7 år", d: ["sma", "balett"] },
    { name: "Tåspets", age: "tonår", d: ["balett"] },
    { name: "Jazz Contemporary", age: "13+ år", d: ["jazz"] },
  ]},
  { day: "Lördag", short: "Lör", slots: [
    { name: "Barnbalett", age: "4–5 år", d: ["sma", "balett"] },
    { name: "Klassisk balett", age: "8–16 år", d: ["balett"] },
  ]},
  { day: "Söndag", short: "Sön", slots: [
    { name: "Barnbalett", age: "från 3 år", d: ["sma", "balett"] },
    { name: "Balett", age: "5–8 år", d: ["sma", "balett"] },
    { name: "Klassisk balett", age: "från 10 år", d: ["balett"] },
    { name: "Tåspets", age: "", d: ["balett"] },
  ]},
];

export type Activity = { id: string; title: string; kicker: string; text: string; tag: string; soon?: boolean };
export const activities: Activity[] = [
  { id: "scen", title: "Föreställningar", kicker: "Varje vår", tag: "Scen",
    text: "Terminen avslutas på riktig scen. Senast: “Från film till scen” på Järfälla Kulturscen — elever i alla åldrar, en publik, en kväll." },
  { id: "lager", title: "Sommarläger", kicker: "Vecka 33", tag: "Läger",
    text: "En hel vecka med dans, rörelse och gemenskap mitt i sommarlovet. Flera stilar, nya vänner och en uppvisning sista dagen." },
  { id: "prova", title: "Gratis provlektion", kicker: "Hela terminen", tag: "Prova",
    text: "Osäker på vilken dans som är din? Kom och prova en lektion utan kostnad — i vilken inriktning du vill." },
  { id: "workshop", title: "Workshops & masterclass", kicker: "Helger", tag: "Fördjupning", soon: true,
    text: "Intensiva helgpass med gästpedagoger — repertoar, koreografi och teknik på djupet." },
  { id: "kalas", title: "Danskalas", kicker: "För barn 4–10 år", tag: "Kalas", soon: true,
    text: "Fira födelsedagen i studion. En pedagog, en koreografi, musik och en liten föreställning för gästerna." },
  { id: "event", title: "Företag & event", kicker: "På beställning", tag: "Event", soon: true,
    text: "Dansworkshop för teamet, uppträdande till er fest eller en första brudvals som sitter." },
];

export type Teacher = { name: string; role: string; d: DisciplineId[]; bio: string; quote?: string };
export const teachers: Teacher[] = [
  { name: "Gabriela Teleki", role: "Grundare & konstnärlig ledare", d: ["balett", "senior"],
    bio: "Dansutbildad i Bukarest med fyra år som professionell dansös och turnéer i Aten, Budapest och Italien. Kom till Sverige 1977 och öppnade skolan i Vällingby 2009.",
    quote: "Dansen förenar människor över alla gränser, oavsett språk, hudfärg eller religion." },
  { name: "Maria Maté", role: "Pedagog", d: ["balett", "sma"],
    bio: "Kungliga Svenska Balettskolan, Drottningholmsteatern och Kungliga Operan. Danspedagogexamen från DOCH." },
  { name: "Sabine Langeland", role: "Pedagog", d: ["balett", "jazz"],
    bio: "Född i Köpenhamn, utbildad på Balettakademiens yrkesutbildning i balett, modern och jazz.",
    quote: "Dans är mitt liv, och att undervisa är min andra stora passion." },
  { name: "Johanna Hasselqvist", role: "Pedagog", d: ["jazz"],
    bio: "Kungliga Svenska Balettskolans moderna linje. Specialiserad på modern dans och koreografi." },
  { name: "Konstantina Buni", role: "Pedagog", d: ["orient"],
    bio: "Grundare av Raks el Hawanem, en av Sveriges ledande grupper inom orientalisk dans." },
  { name: "Nadja Alve", role: "Pedagog", d: ["balett", "sma"],
    bio: "Professionellt utbildad i Finland med balett som huvudämne. Fokus på hälsosam teknik och hållbar träning." },
];

export const stats = [
  { n: 1977, label: "Gabriela kommer till Sverige" },
  { n: 2009, label: "Huset öppnar i Vällingby" },
  { n: 6, label: "Pedagoger" },
  { n: 97, label: "Års åldersspann i studion", suffix: "" },
];
