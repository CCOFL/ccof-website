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

## Logos (`logos/`)
- `01_primary_stacked.svg` — primary stacked lockup (icon + wordmark)
- `02_icon_only.svg` — icon mark (used in the site header / favicon)
- `04_horizontal_ccof.svg` — horizontal lockup
- `*_warm_white_bg.svg` — variants placed on the warm-white background
- `CCOF_Favicon_Simplified.svg` / `CCOF_Favicon_AppTile.svg` — favicons
- `CCOF_Logo_System_Spec_Sheet.svg` — usage/spacing spec sheet

SVGs only (scalable, on-spec `#6F8764` / `#EF7F6D`). High-res PNG exports are kept
out of the repo to avoid bloat — regenerate from these SVGs as needed.

The website uses `public/ccof-icon.svg` (header mark), `public/ccof-logo-horizontal.svg`,
and `src/app/icon.svg` (favicon), all derived from these sources.
