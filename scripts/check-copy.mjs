#!/usr/bin/env node
/**
 * Copy check: fails the build if any banned phrasing appears in rendered
 * site source. Turns the founder's standing copy rulings into enforcement
 * instead of memory. Runs as `prebuild` (so Netlify refuses to ship it) and
 * via `npm run check:copy` locally.
 *
 * Comments are stripped before scanning, so rulings can be documented in
 * code comments without tripping the check. To add a rule, add a row to
 * BANNED with the ruling and date that justify it.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../src/", import.meta.url));

const BANNED = [
  {
    re: /at no cost|free of charge/i,
    why: "partner path reads as a contribution between peers: use 'contributed directly to' (founder ruling 2026-08-19)",
  },
  {
    re: /open to everyone|open to all|open to anyone|any family can shop|no income requirements/i,
    why: "resale path stays unqualified: 'for all families throughout the community' (founder rulings 2026-08-19, 2026-08-22)",
  },
  {
    re: /directly to (children|a child|kids|a kid)/i,
    why: "CCOF's chain of custody ends at the partner: goods reach children through partners; 'directly' attaches to the partner, never the child (founder ruling 2026-08-23)",
  },
  {
    re: /every (purchase|dollar|gift|cent) (is |goes |gets )?(reinvested|funds|to local)/i,
    why: "no pass-through overclaims: proceeds are reinvested, never 'every purchase/dollar' (locked guardrail; founder ruling 2026-08-22)",
  },
  {
    re: /late 2026|fall 2026|this fall/i,
    why: "the storefront opens in 2027 (corrected 2026-08-19)",
  },
  {
    re: /early 2027/i,
    why: "the year is stated as plain '2027', never 'early 2027' (founder ruling 2026-09-03)",
  },
  {
    re: /flagship/i,
    why: "'flagship' is retired: the Closet is the storefront program, one of two sibling programs beside direct-to-partner distribution (founder ruling 2026-09-03)",
  },
  {
    re: /rolling out|bins are on their way/i,
    why: "no bin count, date, or location claims until host agreements are signed (founder ruling 2026-08-19)",
  },
  {
    re: /cribs & bassinets|cribs and bassinets/i,
    why: "declined items are never solicited (safety policy 2026-08-18)",
  },
  {
    re: /by inspection|ensure(s|d)? safety|certif(y|ied) (as )?safe|clear(s|ed)? (it|them|items) as safe/i,
    why: "never state or imply that CCOF inspects, verifies, or certifies items as safe (decal error caught 2026-08-19)",
  },
  // Quality-warranty vocabulary (insurance binding conditions, USLI Q19a/b/c;
  // founder ruling 2026-08-24): describing an action CCOF performs on an item
  // reads as a warranty of quality. Say what CCOF refuses, never what it
  // certifies.
  {
    re: /inspect(s|ed|ing|ion)?\b/i,
    why: "no process claims on items: 'inspected/inspection' reads as a quality warranty (insurance ruling 2026-08-24)",
  },
  {
    re: /clean(ed|ing)\b|saniti[sz]|launder|\bwashed\b/i,
    why: "no process claims: 'cleaned/cleaning' reads as modifying items and as a quality warranty ('clean' as a donor-request adjective is fine)",
  },
  {
    re: /refurbish|recondition|\brestored\b|\brepaired\b|safety.checked|quality.checked|hand.selected/i,
    why: "no refurbish/repair/safety-check/hand-select claims (insurance ruling 2026-08-24; 'safety-checked' is the decal error class)",
  },
  {
    re: /\bguaranteed?\b|warrant(y|ies|ed)/i,
    why: "no warranty or guarantee language; disclaimers of warranties/guarantees are the opposite and are exempted where they live",
    exempt: ["app/terms/", "app/privacy/", "PartnerApplicationForm"],
  },
  {
    re: /like new|perfect condition/i,
    why: "no condition-outcome claims (insurance ruling 2026-08-24)",
  },
  {
    re: /vetted (items|goods|donations)/i,
    why: "'vetted' applies to partner organizations only, never to goods",
  },
  {
    re: /—/,
    why: "no em dashes anywhere on the site (PR #77); use commas, colons, or restructure",
  },
];

function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full, out);
    else if (/\.(ts|tsx)$/.test(name)) out.push(full);
  }
  return out;
}

/** Yield [lineNumber, text] with block and line comments removed. */
function* codeLines(source) {
  let inBlock = false;
  const lines = source.split("\n");
  for (let i = 0; i < lines.length; i++) {
    let text = lines[i];
    if (inBlock) {
      const end = text.indexOf("*/");
      if (end === -1) continue;
      text = text.slice(end + 2);
      inBlock = false;
    }
    text = text.replace(/\/\*[\s\S]*?\*\//g, "");
    const start = text.indexOf("/*");
    if (start !== -1) {
      text = text.slice(0, start);
      inBlock = true;
    }
    if (/^\s*\/\//.test(text)) continue;
    // Trailing line comments. Requires whitespace before the slashes so
    // "https://" inside a string literal is never mistaken for a comment.
    text = text.replace(/(^|\s)\/\/.*$/, "$1");
    yield [i + 1, text];
  }
}

const hits = [];
for (const file of walk(ROOT)) {
  const source = readFileSync(file, "utf8");
  const rel = relative(process.cwd(), file);
  const perLineMatched = new Set();
  const strippedLines = [];
  for (const [line, text] of codeLines(source)) {
    strippedLines.push(text);
    for (const rule of BANNED) {
      if (rule.exempt && rule.exempt.some((frag) => file.includes(frag))) continue;
      if (rule.re.test(text)) {
        perLineMatched.add(rule);
        hits.push({ file: rel, line, text: text.trim(), why: rule.why });
      }
    }
  }
  // Second pass on whitespace-collapsed content: JSX wraps prose across
  // source lines, so a banned phrase can straddle a line break and evade the
  // per-line scan ("open\n to everyone" escaped this way until 2026-09-03).
  // Rules that already hit per-line are skipped to avoid duplicate reports.
  const collapsed = strippedLines.join(" ").replace(/\s+/g, " ");
  for (const rule of BANNED) {
    if (rule.exempt && rule.exempt.some((frag) => file.includes(frag))) continue;
    if (perLineMatched.has(rule)) continue;
    const m = collapsed.match(rule.re);
    if (m) {
      const at = collapsed.indexOf(m[0]);
      const context = collapsed.slice(Math.max(0, at - 40), at + m[0].length + 40);
      hits.push({
        file: rel,
        line: "wrapped",
        text: `…${context}…`,
        why: `${rule.why} [phrase wraps across source lines]`,
      });
    }
  }
}

if (hits.length) {
  console.error(`\nCopy check FAILED: ${hits.length} banned phrasing(s) found.\n`);
  for (const h of hits) {
    console.error(`  ${h.file}:${h.line}\n    ${h.text.slice(0, 140)}\n    -> ${h.why}\n`);
  }
  process.exit(1);
}
console.log("Copy check passed: no banned phrasings in src/.");
