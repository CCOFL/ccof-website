/**
 * Unit tests for the partner-application rules. Run with `npm test`
 * (node --test, native TypeScript stripping, zero dependencies).
 * The .ts specifier is intentional: node resolves it directly, and
 * tsconfig has allowImportingTsExtensions for exactly this file.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  validatePartnerApplication,
  normalizePartnerApplication,
  isEin,
  isPhone,
  isZip,
  isLink,
  isIsoDate,
  type PartnerApplicationValues,
} from "./partnerApplicationRules.ts";

function makeValid(): PartnerApplicationValues {
  return {
    orgLegalName: "TEST Example Partner Org, Inc.",
    ein: "00-0000000",
    fdacsStatus: "registered",
    fdacsReg: "CH00000",
    fdacsExemptionBasis: "",
    sunbizDoc: "",
    irsLetterUrl: "https://example.org/determination-letter",
    website: "",
    streetAddress: "1 Example Way",
    city: "Stuart",
    state: "FL",
    zip: "34997",
    phone: "(000) 000-0000",
    mission: "TEST mission text.",
    counties: "Martin",
    referralSources: "TEST referral text.",
    contactName: "Test Person",
    contactTitle: "Director",
    email: "test@example.org",
    needs: "TEST needs text.",
    volumeEstimate: "",
    goodsDirectAck: true,
    childPrivacyAck: true,
    relatedParty: "no",
    relatedPartyDetail: "",
    signerName: "Test Person",
    signerTitle: "Director",
    signerDate: "2026-10-15",
    vettingAck: true,
    publicityPreference: "do_not_name",
  };
}

test("a complete application has no errors", () => {
  assert.deepEqual(validatePartnerApplication(makeValid()), {});
});

test("FDACS: a choice is required", () => {
  const v = { ...makeValid(), fdacsStatus: "" };
  assert.ok(validatePartnerApplication(v).fdacsStatus);
});

test("FDACS: registered requires the registration number", () => {
  const v = { ...makeValid(), fdacsReg: "" };
  assert.ok(validatePartnerApplication(v).fdacsReg);
});

test("FDACS: exemption requires a basis, and then passes", () => {
  const missing = { ...makeValid(), fdacsStatus: "exempt", fdacsReg: "" };
  assert.ok(validatePartnerApplication(missing).fdacsExemptionBasis);
  const given = { ...missing, fdacsExemptionBasis: "Religious institution." };
  const e = validatePartnerApplication(given);
  assert.equal(e.fdacsStatus, undefined);
  assert.equal(e.fdacsReg, undefined);
  assert.equal(e.fdacsExemptionBasis, undefined);
});

test("both acknowledgments are required", () => {
  assert.ok(
    validatePartnerApplication({ ...makeValid(), goodsDirectAck: false })
      .goodsDirectAck,
  );
  assert.ok(
    validatePartnerApplication({ ...makeValid(), childPrivacyAck: false })
      .childPrivacyAck,
  );
});

test("related party: answer required; yes requires detail; no does not", () => {
  assert.ok(
    validatePartnerApplication({ ...makeValid(), relatedParty: "" })
      .relatedParty,
  );
  assert.ok(
    validatePartnerApplication({ ...makeValid(), relatedParty: "yes" })
      .relatedPartyDetail,
  );
  const yesWithDetail = validatePartnerApplication({
    ...makeValid(),
    relatedParty: "yes",
    relatedPartyDetail: "Board member is the founder's cousin.",
  });
  assert.equal(yesWithDetail.relatedParty, undefined);
  assert.equal(yesWithDetail.relatedPartyDetail, undefined);
});

test("typed signature: name, title, and date are each required", () => {
  assert.ok(
    validatePartnerApplication({ ...makeValid(), signerName: "" }).signerName,
  );
  assert.ok(
    validatePartnerApplication({ ...makeValid(), signerTitle: "" }).signerTitle,
  );
  assert.ok(
    validatePartnerApplication({ ...makeValid(), signerDate: "" }).signerDate,
  );
});

test("address and phone are required with format checks", () => {
  assert.ok(
    validatePartnerApplication({ ...makeValid(), streetAddress: "" })
      .streetAddress,
  );
  assert.ok(validatePartnerApplication({ ...makeValid(), zip: "123" }).zip);
  assert.equal(
    validatePartnerApplication({ ...makeValid(), zip: "34997-1234" }).zip,
    undefined,
  );
  assert.ok(validatePartnerApplication({ ...makeValid(), phone: "123" }).phone);
});

test("IRS letter link is optional, format-checked only when provided", () => {
  assert.equal(
    validatePartnerApplication({ ...makeValid(), irsLetterUrl: "" })
      .irsLetterUrl,
    undefined,
  );
  assert.ok(
    validatePartnerApplication({ ...makeValid(), irsLetterUrl: "my letter" })
      .irsLetterUrl,
  );
  assert.equal(
    validatePartnerApplication({
      ...makeValid(),
      irsLetterUrl: "drive.google.com/file/d/abc/view",
    }).irsLetterUrl,
    undefined,
  );
});

test("signer date must be a real YYYY-MM-DD date", () => {
  assert.ok(
    validatePartnerApplication({ ...makeValid(), signerDate: "today" })
      .signerDate,
  );
  assert.equal(
    validatePartnerApplication({ ...makeValid(), signerDate: "2026-10-15" })
      .signerDate,
    undefined,
  );
});

test("normalize blanks values from unchosen branches", () => {
  const n = normalizePartnerApplication({
    ...makeValid(),
    fdacsStatus: "exempt",
    fdacsReg: "CH99999",
    fdacsExemptionBasis: "Religious institution.",
    relatedParty: "no",
    relatedPartyDetail: "stale text",
    publicityPreference: "do_not_name",
  });
  assert.equal(n.fdacsReg, "");
  assert.equal(n.fdacsExemptionBasis, "Religious institution.");
  assert.equal(n.relatedPartyDetail, "");
  assert.deepEqual(validatePartnerApplication(n), {});
});

test("naming permission needs no separate media contact (signer approves)", () => {
  const v = { ...makeValid(), publicityPreference: "may_name" };
  assert.deepEqual(validatePartnerApplication(v), {});
});

test("format helpers", () => {
  assert.ok(isEin("00-0000000"));
  assert.ok(isEin("000000000"));
  assert.ok(!isEin("00-00000"));
  assert.ok(isPhone("000-000-0000"));
  assert.ok(isPhone("1 (000) 000-0000"));
  assert.ok(!isPhone("12345"));
  assert.ok(isZip("34997"));
  assert.ok(!isZip("3499"));
  assert.ok(isLink("https://example.org/letter.pdf"));
  assert.ok(isLink("HTTPS://EXAMPLE.ORG/LETTER.PDF"));
  assert.ok(isLink("drive.google.com/file/d/abc/view"));
  assert.ok(!isLink("https://example.org/x see attached"));
  assert.ok(!isLink("ftp://example.org"));
  assert.ok(isIsoDate("2026-10-15"));
  assert.ok(!isIsoDate("10/15/2026"));
});
