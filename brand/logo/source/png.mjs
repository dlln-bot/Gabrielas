import { chromium } from "playwright-core";
import fs from "fs";
const D = new URL("..", import.meta.url).pathname.replace(/\/$/, "");
fs.mkdirSync(D + "/png", { recursive: true });
const jobs = [
  ["gabrielas-mark", 2048], ["gabrielas-mark-reverse", 2048], ["gabrielas-logo-horizontal", 3000], ["gabrielas-logo-horizontal-reverse", 3000],
  ["gabrielas-logo-stacked", 2000], ["gabrielas-logo-stacked-reverse", 2000], ["gabrielas-app-icon", 1024], ["gabrielas-app-icon", 180, "-180"],
  ["gabrielas-favicon", 32, "-32"], ["gabrielas-favicon", 16, "-16"],
];
const b = await chromium.launch({ executablePath: process.env.CHROME_PATH });
for (const [n, w, suf = ""] of jobs) {
  const src = fs.readFileSync(`${D}/${n}.svg`, "utf8");
  const [, vw, vh] = src.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const h = Math.round((w * vh) / vw);
  const p = await b.newPage({ viewport: { width: w, height: h } });
  await p.setContent(`<style>html,body{margin:0;background:transparent}</style><img src="data:image/svg+xml;base64,${Buffer.from(src).toString("base64")}" width="${w}" height="${h}" style="display:block">`);
  await p.waitForTimeout(100);
  await p.screenshot({ path: `${D}/png/${n}${suf}.png`, omitBackground: true }); await p.close();
}
await b.close();
