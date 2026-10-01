# Gabrielas logo

One ribbon-gymnastics ribbon, released from the stick and caught mid-turn, sweeps round to form a **G**. It twists once, so the ink front turns away and its rouge lining shows. The crossbar is the stick and the rouge dot is the dancer's hand.

The mark is generated from a parametric curve, like the dance lines in `src/components/Glyph.tsx`. Open `brand-sheet.html` for the full brand sheet, including a live, breathing version of the ribbon.

| File | Use |
| --- | --- |
| `gabrielas-logo-horizontal*.svg` | Site header, signage, email signatures |
| `gabrielas-logo-stacked*.svg` | Posters, studio door, social avatars |
| `gabrielas-mark*.svg` | The ribbon G on its own |
| `gabrielas-wordmark*.svg` | The name on its own |
| `gabrielas-app-icon.svg`, `gabrielas-favicon.svg` | App and touch icons; heavier cut for 16–48 px |
| `png/` | Raster exports (transparent backgrounds) |

Colourways: default (ink and rouge on paper), `-reverse` (paper and rouge on ink), `-mono-ink`, `-mono-paper`.
Colours: Ink `#0F0D0C`, Paper `#F4EFE7`, Rouge `#FF5A36`. Type: Fraunces Light (wordmark), Geist (tagline), both converted to outlines.

## Regenerating

```bash
npm i --no-save opentype.js @fontsource/fraunces @fontsource/geist playwright-core
node brand/logo/source/build.mjs brand/logo
CHROME_PATH=/path/to/chrome node brand/logo/source/png.mjs
```

The mark's shape is set by `MARK` in `source/build.mjs`.
