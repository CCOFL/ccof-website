# CCOF Brand Assets

The official brand identity for The Children's Collective of Florida, versioned
alongside the website so the design system has a single source of truth.

## Standards
- **`CCOF_Brand_Standards_Guide.html`** — the locked Brand Standards Guide v1.1 (May 27, 2026). HEX values are authoritative; reject substitutes.

**Palette** (also implemented in `src/app/globals.css`):
| Role | HEX |
|---|---|
| Sage (primary) | `#6F8764` |
| Darker Sage (H1, icons, hover) | `#5F7658` |
| Coral (accent, ~10%) | `#EF7F6D` |
| Charcoal-Sage (H3, dark sections) | `#1E2B24` |
| Warm White (backgrounds) | `#FAF9F5` |
| Body text | `#2C342E` |
| Captions/metadata | `#6F7771` |

**Typeface:** Nunito Sans (throughout).

> Accessibility note: on the website, the brand sage/coral/muted tones are
> *deepened within the same hue* for small text and filled buttons so they clear
> WCAG AA — the large/decorative uses keep the locked HEX. See `globals.css`.

## Logos — board-approved **Logo v3** (adopted 2026-07-03)

The active logo system lives in [`public/brand/`](../public/brand/) (served to the site):
- `CCOF_Logo_v3_Stacked.svg` — **primary** "Open Hands" stacked lockup (light backgrounds)
- `CCOF_Logo_v3_Stacked_Reverse.svg` — reverse colorway (sage/dark backgrounds; used in the footer)
- `CCOF_Logo_v3_Icon.svg` — encircled **icon** (header, favicons, any small/square placement)
- `CCOF_Logo_v3_Icon_Reverse.svg` — reverse icon
- `CCOF_Logo_v3_Stacked_1000.png` (schema.org logo) · `_2600.png` (OG source) · `_Reverse_1000.png` · `CCOF_Logo_v3_Icon_1000.png`
- `CCOF_Logo_v3_Favicon_{512,180,64,32}.png` — pre-rendered favicons

On-spec sage `#6F8764` / coral `#EF7F6D`; wordmark outlined (no font dependency). Do not use the
stacked lockup below ~120px wide — switch to the icon.

**Usage in the app:** header icon → `public/brand/CCOF_Logo_v3_Icon.svg`; footer →
`CCOF_Logo_v3_Stacked_Reverse.svg`; favicons/app icons → `metadata.icons` in
`src/app/layout.tsx`; OG image → `src/app/opengraph-image.png` (generated from the v3 2600 PNG on
warm white); schema logo → `src/components/JsonLd.tsx`.

The previous **v1** mark (and its source SVGs) is retired in
[`archive/logo-v1/`](../archive/logo-v1/) — do not use. (The "v2 interim" redesign was never
deployed, so there are no v2 files in the repo.)
