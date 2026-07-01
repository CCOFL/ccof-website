# Milestone 8 — Spanish translation (proper i18n)

**Status:** planned (not started). Treat as its own milestone, not a same-day fix.
**Goal:** the full site is available in Spanish — real i18n, not a machine-translate widget.

## Constraint to surface up front

The **legal / FDACS disclosure and tax language** (`FL_DISCLOSURE`, `TAX_NOTE` in
`src/lib/site.ts`) must be **human-reviewed** before shipping in Spanish. Plan to scaffold
i18n and translate UI copy, but gate the legal strings behind a human translator/attorney
review — do not ship a raw machine translation of legal text.

## Current state

- All UI copy already lives in one place: `src/lib/site.ts` (mission, pillars, giving cycle,
  impact stats, founder copy, donation presets, legal disclosures, nav, etc.). This is a big
  head start — most strings are centralized, not scattered in JSX.
- Some copy is still inline in page/component JSX (headings, intros, button labels, form
  microcopy). These need extraction.
- App Router, Next 16. No i18n library installed.

## Recommended approach: `next-intl` with App Router locale segment

`next-intl` is the best-maintained App-Router-native option (works with RSC, no client
bloat). Default English stays at `/`; Spanish under `/es`.

### Steps

1. **Install + wire routing.**
   ```bash
   npm i next-intl
   ```
   - Add `src/i18n/routing.ts` (locales `['en','es']`, `defaultLocale: 'en'`,
     `localePrefix: 'as-needed'` so English stays at `/` and Spanish at `/es`).
   - Add the `next-intl` plugin to `next.config.ts` and the middleware for locale detection.
   - Move routes under `src/app/[locale]/` (App Router locale segment) and add
     `setRequestLocale` for static rendering.
2. **Externalize copy into message catalogs.** Create `messages/en.json` and
   `messages/es.json`. Migrate `src/lib/site.ts` strings + the inline JSX copy into keyed
   messages (namespaces: `nav`, `home`, `about`, `donate`, `forms`, `legal`, `footer`, …).
   Keep structured data (pillars, giving cycle, impact stats) as arrays in the catalog or as
   typed config keyed by locale.
3. **Translate.** Machine-translate the non-legal UI copy as a first pass, then human-edit.
   **Route the legal/tax strings to a human translator** and keep an English fallback until
   reviewed (flag untranslated legal keys so they never silently ship machine output).
4. **Language switcher.** Add an accessible control in `Header` — a real `<button>`/link with
   `aria-label` (e.g. "Cambiar idioma a Español" / "Switch language to English"). Persist the
   choice (cookie via `next-intl` or `localStorage`) and preserve the current path on switch.
5. **Per-locale `<html lang>`.** Set `lang={locale}` in the `[locale]` layout so it is `es`
   on Spanish pages.
6. **SEO.** Emit `hreflang` alternates (`en`, `es`, `x-default`) and locale-aware
   `canonical`/OpenGraph URLs via `generateMetadata`. Update `sitemap.ts` and `robots.ts` to
   include both locales.
7. **Locale-aware formatting.** Use `next-intl`'s number/date formatters where figures are
   shown (impact stats, donation amounts, dates) so Spanish formatting is correct.
8. **QA.** Verify every page, nav item, form label, error message, and the email/contact
   flows render fully translated; check the count-up still works with localized number
   formatting; re-run the task-7 a11y checks on `/es`.

## Files touched (high level)

- New: `messages/en.json`, `messages/es.json`, `src/i18n/routing.ts`, middleware.
- Moved: `src/app/*` → `src/app/[locale]/*`.
- Edited: `next.config.ts`, `layout.tsx` (locale layout + `lang`), `Header` (switcher),
  `site.ts` (split copy into catalogs or per-locale config), `sitemap.ts`, `robots.ts`,
  every page/component with inline copy.

## Acceptance

A visitor can switch to Spanish from any page and get fully translated content;
`<html lang="es">` is set on Spanish pages; `hreflang` tags are present; legal copy is
human-reviewed before launch.

## Rough effort

3–5 days: ~1 day routing/scaffold + middleware + `[locale]` migration, ~1–2 days copy
extraction into catalogs, ~1 day translation pass + switcher + hreflang/SEO, ~0.5 day QA.
Legal-copy human review runs in parallel and gates the final ship. Best as its own multi-PR
milestone (scaffold → extraction → translation/switcher → SEO/QA).
