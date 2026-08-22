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
    re: /late 2026|fall 2026|this fall/i,
    why: "the storefront opens early 2027 (corrected 2026-08-19)",
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
  for (const [line, text] of codeLines(source)) {
    for (const rule of BANNED) {
      if (rule.re.test(text)) {
        hits.push({ file: relative(process.cwd(), file), line, text: text.trim(), why: rule.why });
      }
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
