import opentype from "opentype.js";
import fs from "fs";
const F = (p) => opentype.parse(fs.readFileSync(p).buffer.slice(0));
export const font = {
  fr: (w, st = "normal") => F(`../../../node_modules/@fontsource/fraunces/files/fraunces-latin-${w}-${st}.woff`),
  ge: (w) => F(`../../../node_modules/@fontsource/geist/files/geist-latin-${w}-normal.woff`),
};
// returns {d, width, bbox} for text at size, with extra tracking (em units fraction)
export function text(f, str, size, { x = 0, y = 0, track = 0 } = {}) {
  let cx = x, d = "";
  const glyphs = f.stringToGlyphs(str);
  glyphs.forEach((g, i) => {
    const p = g.getPath(cx, y, size); d += p.toPathData(2);
    let adv = (g.advanceWidth / f.unitsPerEm) * size;
    if (i < glyphs.length - 1) adv += (f.getKerningValue(g, glyphs[i + 1]) / f.unitsPerEm) * size;
    cx += adv + track * size;
  });
  const width = cx - x - track * size;
  const pp = new opentype.Path(); 
  return { d, width };
}
