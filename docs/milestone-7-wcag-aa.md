# Milestone 7 — WCAG 2.1 AA compliance pass

**Status:** planned (not started). Treat as its own milestone, not a same-day fix.
**Goal:** the site meets WCAG 2.1 AA, the practical bar for ADA Title III.

## Where we already are (baseline — don't redo)

The codebase is already accessibility-conscious; the audit should confirm, not rebuild:

- `lang="en"` on `<html>`, a working skip-link to `#main`, and `header`/`nav`/`main`/`footer`
  landmarks (`src/app/layout.tsx`).
- Global `:focus-visible` ring (3px sage outline) on all interactive elements
  (`src/app/globals.css`).
- `prefers-reduced-motion` guard zeroes every transition/animation globally; counters,
  marquee, reveals, and the hero fade all respect it (tasks 1–6).
- Muted/caption gray and small-text coral were already deepened to clear AA on the warm
  background (see comments in `globals.css`).
- Buttons/inputs use `min-h-[44px]`/`min-h-[48px]`; the mobile menu toggle is `h-11 w-11`.

## Gaps to close

1. **Contrast — full audit.** Verify every text/background pair against AA (4.5:1 body,
   3:1 large text & UI). Highest-risk pairs to measure:
   - `text-cream/75` and `text-cream/80` on `bg-sage` (WhereItGoesTeaser, ImpactStats onDark,
     closing section) — translucent cream on sage may fall under 4.5:1.
   - `text-ink/80`, `text-muted` on `bg-cream`/`bg-cream-dark`.
   - Coral accents (`text-coral-deep`) on cream — already tuned, but re-measure.
   - Disabled button state (`disabled:opacity-60`) is exempt, but note it.
2. **Per-page `<h1>` + heading order.** Confirm exactly one `<h1>` per route and no skipped
   levels. `PageHero`/`SectionHeading` render headings — audit each page
   (`/`, `/about`, `/donate`, `/how-it-works`, `/partner`, `/contact`, `/where-it-goes`,
   `/collective-kids-closet`, legal pages).
3. **Form error announcement.** `ContactForm`, `DonationForm`, `EmailCapture`: associate
   each input with a `<label>`, wire validation errors via `aria-describedby`, and put the
   error region in an `aria-live="polite"` (or `role="alert"`) container so screen readers
   announce them. DonationForm already uses `aria-live` on the outcome line and `role="alert"`
   on the error — extend the same pattern to required-field errors and the custom-amount input.
4. **Images.** Confirm meaningful images have descriptive `alt` and decorative ones use
   `alt=""`. The hero alt is descriptive; audit `closet-goods.jpg` and any icon imagery.
5. **Touch targets.** Sweep for any interactive control under 44×44px (icon-only links,
   footer social links, inline text links that act as buttons).
6. **Keyboard pass.** Tab through every page: logical order, visible focus throughout, no
   traps; mobile menu open/close and the donate flow fully operable; `Esc` closes the menu.

## Tooling (none installed yet)

```bash
npm i -D @axe-core/cli pa11y       # or @axe-core/playwright for CI
npx serve .next  # or run `next start` then point the tools at the running site
npx axe http://localhost:3000 --tags wcag2a,wcag2aa
npx pa11y http://localhost:3000
```

Run Lighthouse (Chrome DevTools or `lighthouse` CLI) for the Accessibility score.
Capture **before/after** scores per page and list each fixed violation.

## Deliverables

- Automated axe/Lighthouse/pa11y runs with **no serious violations** across all routes.
- Keyboard-only and screen-reader spot-check of the donate flow documented as passing.
- A short **Accessibility Statement** page (`/accessibility`) describing conformance target,
  known limitations, and a contact for accommodation requests; link it in the footer.

## Acceptance

Automated axe/Lighthouse a11y pass with no serious violations; keyboard-only and
screen-reader spot-checks of the donate flow succeed.

## Rough effort

1–2 focused days: ~0.5 day audit + tooling, ~1 day fixes (mostly contrast tweaks and form
ARIA), ~0.5 day verification + statement page. One PR (or a small PR per area: contrast,
forms, statement page).
