/**
 * Boundary tests for the December 2026 match-note date gate. Run with
 * `npm test` (node --test, native TypeScript stripping, zero dependencies).
 * The .ts specifier is intentional, same as partnerApplicationRules.test.ts.
 *
 * The gate is defined on the America/New_York calendar; December dates there
 * are EST (UTC-5), so each case below is pinned via its UTC equivalent.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { isDecemberMatchWindow } from "./decemberMatch.ts";

test("one minute before December 1, 2026 Eastern is outside the window", () => {
  // Nov 30 2026 23:59 ET == Dec 1 04:59 UTC
  assert.equal(isDecemberMatchWindow(new Date("2026-12-01T04:59:00Z")), false);
});

test("midnight Eastern on December 1, 2026 opens the window", () => {
  // Dec 1 2026 00:00 ET == 05:00 UTC
  assert.equal(isDecemberMatchWindow(new Date("2026-12-01T05:00:00Z")), true);
});

test("mid-December 2026 is inside the window", () => {
  assert.equal(isDecemberMatchWindow(new Date("2026-12-15T17:00:00Z")), true);
});

test("the last Eastern minute of December 31, 2026 is inside the window", () => {
  // Dec 31 2026 23:59 ET == Jan 1 2027 04:59 UTC
  assert.equal(isDecemberMatchWindow(new Date("2027-01-01T04:59:00Z")), true);
});

test("midnight Eastern on January 1, 2027 closes the window", () => {
  // Jan 1 2027 00:00 ET == 05:00 UTC
  assert.equal(isDecemberMatchWindow(new Date("2027-01-01T05:00:00Z")), false);
});

test("December of a later year stays closed (year-pinned offer)", () => {
  assert.equal(isDecemberMatchWindow(new Date("2027-12-05T17:00:00Z")), false);
});
