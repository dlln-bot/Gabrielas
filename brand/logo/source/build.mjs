import { centreline, ribbon } from "./ribbon.mjs";
import { font, text } from "./text.mjs";
import fs from "fs";
const OUT = process.argv[2];
fs.mkdirSync(OUT, { recursive: true });
const INK = "#0f0d0c", PAPER = "#f4efe7", ROUGE = "#ff5a36";
export const MARK = { c: { tail: 76, flare: 0.3, a1: 340, a0: 62, grow: 0.08 }, r: { twists: [0.54], W: 30, tIn: 0.46, tOut: 0.4 }, dot: [122, 128, 6] };
const faces = ribbon(centreline(MARK.c), MARK.r);
// bbox of the mark
let xs = [], ys = [];
for (const f of faces) { const n = f.d.match(/-?\d+\.?\d*/g).map(Number); for (let i = 0; i < n.length; i += 2) { xs.push(n[i]); ys.push(n[i + 1]); } }
const bb = { x0: Math.min(...xs), y0: Math.min(...ys), x1: Math.max(...xs), y1: Math.max(...ys) };
bb.w = bb.x1 - bb.x0; bb.h = bb.y1 - bb.y0;
console.log("mark bbox", bb);

const markG = (front, back, dot, tx, ty, s) =>
  `<g transform="translate(${tx.toFixed(2)} ${ty.toFixed(2)}) scale(${s.toFixed(4)}) translate(${(-bb.x0).toFixed(2)} ${(-bb.y0).toFixed(2)})">` +
  faces.map((f) => `<path d="${f.d}" fill="${f.front ? front : back}"/>`).join("") +
  `<circle cx="${MARK.dot[0]}" cy="${MARK.dot[1]}" r="${MARK.dot[2]}" fill="${dot}"/></g>`;

const svg = (w, h, body, title, bg) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-label="${title}"><title>${title}</title>${bg ? `<rect width="${w}" height="${h}" fill="${bg}"/>` : ""}${body}</svg>\n`;

const schemes = {
  "": { front: INK, back: ROUGE, dot: ROUGE, type: INK },
  "-reverse": { front: PAPER, back: ROUGE, dot: ROUGE, type: PAPER },
  "-mono-ink": { front: INK, back: INK, dot: INK, type: INK },
  "-mono-paper": { front: PAPER, back: PAPER, dot: PAPER, type: PAPER },
};
const WORD = "GABRIELAS", TAG = "RÖRELSENS HUS · DANS I ALLA FORMER";
const fr = font.fr(300), ge = font.ge(400);

for (const [suf, c] of Object.entries(schemes)) {
  // 1. mark
  const pad = 16, S = 512, s = (S - 2 * pad) / Math.max(bb.w, bb.h);
  fs.writeFileSync(`${OUT}/gabrielas-mark${suf}.svg`, svg(S, S, markG(c.front, c.back, c.dot, (S - bb.w * s) / 2, (S - bb.h * s) / 2, s), "Gabrielas"));

  // 2. horizontal lockup
  {
    const mh = 140, ms = mh / bb.h, mw = bb.w * ms;
    const size = 64, gap = 44, x = mw + gap;
    const wm = text(fr, WORD, size, { x, y: 0, track: 0.16 });
    const tg = text(ge, TAG, 13.2, { x: x + 3, y: 0, track: 0.36 });
    const cap = 0.7 * size; // Fraunces cap height ≈ .7em
    const blockH = cap + 22 + 10;
    const top = (mh - blockH) / 2;
    const W = Math.ceil(x + Math.max(wm.width, tg.width + 3) + 2);
    const body = markG(c.front, c.back, c.dot, 0, 0, ms) +
      `<g transform="translate(0 ${(top + cap).toFixed(2)})"><path d="${wm.d}" fill="${c.type}"/></g>` +
      `<g transform="translate(0 ${(top + cap + 32).toFixed(2)})"><path d="${tg.d}" fill="${c.type}" opacity=".72"/></g>`;
    fs.writeFileSync(`${OUT}/gabrielas-logo-horizontal${suf}.svg`, svg(W, mh, body, "Gabrielas — Rörelsens hus"));
  }

  // 3. stacked lockup
  {
    const size = 58;
    const wm = text(fr, WORD, size, { x: 0, y: 0, track: 0.2 });
    const tg = text(ge, TAG, 12.4, { x: 0, y: 0, track: 0.38 });
    const W = Math.ceil(Math.max(wm.width, tg.width) + 8);
    const mh = 220, ms = mh / bb.h, mw = bb.w * ms;
    const cap = 0.7 * size;
    const y1 = mh + 54 + cap, y2 = y1 + 34, H = Math.ceil(y2 + 6);
    const body = markG(c.front, c.back, c.dot, (W - mw) / 2, 0, ms) +
      `<g transform="translate(${((W - wm.width) / 2).toFixed(2)} ${y1})"><path d="${wm.d}" fill="${c.type}"/></g>` +
      `<g transform="translate(${((W - tg.width) / 2).toFixed(2)} ${y2})"><path d="${tg.d}" fill="${c.type}" opacity=".72"/></g>`;
    fs.writeFileSync(`${OUT}/gabrielas-logo-stacked${suf}.svg`, svg(W, H, body, "Gabrielas — Rörelsens hus"));
  }

  // 4. wordmark only
  {
    const size = 80, wm = text(fr, WORD, size, { x: 0, y: 0, track: 0.16 }), cap = 0.7 * size;
    fs.writeFileSync(`${OUT}/gabrielas-wordmark${suf}.svg`, svg(Math.ceil(wm.width + 2), Math.ceil(cap + 2), `<g transform="translate(0 ${cap + 1})"><path d="${wm.d}" fill="${c.type}"/></g>`, "Gabrielas"));
  }
}

// 5. app icon / favicon: ink tile, paper ribbon, rouge reverse
{
  const S = 512, s = (S * 0.66) / Math.max(bb.w, bb.h);
  const body = `<rect width="${S}" height="${S}" rx="112" fill="${INK}"/>` + markG(PAPER, ROUGE, ROUGE, (S - bb.w * s) / 2, (S - bb.h * s) / 2, s);
  fs.writeFileSync(`${OUT}/gabrielas-app-icon.svg`, svg(S, S, body, "Gabrielas"));
  // small sizes get a heavier cut of the same ribbon so it survives 16–32 px
  const fav = ribbon(centreline(MARK.c), { ...MARK.r, W: 46, tIn: 0.38, tOut: 0.32 });
  const s2 = (64 * 0.74) / Math.max(bb.w, bb.h), o = (64 - Math.max(bb.w, bb.h) * s2) / 2;
  fs.writeFileSync(`${OUT}/gabrielas-favicon.svg`, svg(64, 64, `<rect width="64" height="64" rx="14" fill="${INK}"/>` +
    `<g transform="translate(${o.toFixed(2)} ${(o + 1).toFixed(2)}) scale(${s2.toFixed(4)}) translate(${-bb.x0} ${-bb.y0})">` +
    fav.map((f) => `<path d="${f.d}" fill="${f.front ? PAPER : ROUGE}"/>`).join("") + `<circle cx="${MARK.dot[0]}" cy="${MARK.dot[1]}" r="12" fill="${ROUGE}"/></g>`, "Gabrielas"));
}

