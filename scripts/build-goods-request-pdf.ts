/**
 * Builds the fillable Partner Goods Request PDF (public/forms/
 * partner-goods-request.pdf) AND the Google Form parity checklist
 * (docs/partner-request-parity.md) from the one content module,
 * src/lib/partnerRequest.ts — so neither can drift from the site.
 *
 * Run: npm run build:pdf   (deliberate regeneration; output is committed,
 * and this script is NOT part of prebuild)
 *
 * Brand Standards v4 (locked): Warm White page #FAF9F5, Warm Sage #748865
 * headings/rules, Deep Sage #667859 small text, Coral #E68B71 borders only,
 * Coral Deep #B25034 small coral labels, Ink #2C342E body. Nunito Sans
 * embedded from scripts/assets/fonts (OFL statics). Logo: the v4 Color
 * Horizontal PNG from the brand package; the wordmark is never re-typeset.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import {
  PDFDocument,
  PDFFont,
  PDFPage,
  PDFName,
  PDFArray,
  PDFString,
  rgb,
  type Color,
} from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { GOODS_REQUEST as R, FORM_QUESTIONS } from "../src/lib/partnerRequest.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT_PDF = join(ROOT, "public/forms/partner-goods-request.pdf");
const OUT_PARITY = join(ROOT, "docs/partner-request-parity.md");

// ——— Brand tokens ———
const hex = (h: string): Color => {
  const n = parseInt(h.slice(1), 16);
  return rgb(((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255);
};
const WARM_WHITE = hex("#FAF9F5");
const SAGE = hex("#748865");
const DEEP_SAGE = hex("#667859");
const CORAL = hex("#E68B71");
const CORAL_DEEP = hex("#B25034");
const INK = hex("#2C342E");
const PANEL_SAGE = rgb(0.927, 0.933, 0.906); // sage tint on warm white
const FIELD_BG = rgb(1, 1, 1);
const FIELD_BORDER = hex("#B9C2AE");

const PAGE_W = 612; // US Letter
const PAGE_H = 792;
const MARGIN = 46;
const CONTENT_W = PAGE_W - MARGIN * 2;

async function main() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);
  doc.setTitle("Partner Goods Request | The Children's Collective of Florida");
  doc.setAuthor("The Children's Collective of Florida, Inc.");
  doc.setSubject("Printable and fillable goods request for partner organizations");

  const fontDir = join(ROOT, "scripts/assets/fonts");
  const regular = await doc.embedFont(readFileSync(join(fontDir, "NunitoSans-Regular.ttf")), { subset: false });
  const semibold = await doc.embedFont(readFileSync(join(fontDir, "NunitoSans-SemiBold.ttf")), { subset: false });
  const bold = await doc.embedFont(readFileSync(join(fontDir, "NunitoSans-Bold.ttf")), { subset: false });
  const logo = await doc.embedPng(readFileSync(join(ROOT, "scripts/assets/CCOF_Logo_v4_Color_Horizontal_2600.png")));

  const form = doc.getForm();
  const pages: PDFPage[] = [];

  // ——— helpers ———
  const wrap = (text: string, font: PDFFont, size: number, maxW: number): string[] => {
    const out: string[] = [];
    for (const para of text.split("\n")) {
      let line = "";
      for (const word of para.split(" ")) {
        const probe = line ? `${line} ${word}` : word;
        if (font.widthOfTextAtSize(probe, size) <= maxW) line = probe;
        else {
          if (line) out.push(line);
          line = word;
        }
      }
      out.push(line);
    }
    return out;
  };

  type Cursor = { page: PDFPage; y: number }; // y measured from TOP

  const text = (
    c: Cursor,
    s: string,
    o: { font?: PDFFont; size?: number; color?: Color; x?: number; maxW?: number; lineGap?: number; advance?: boolean } = {},
  ): number => {
    const font = o.font ?? regular;
    const size = o.size ?? 9;
    const x = o.x ?? MARGIN;
    const maxW = o.maxW ?? PAGE_W - x - MARGIN;
    const gap = o.lineGap ?? 2.6;
    const lines = wrap(s, font, size, maxW);
    let y = c.y;
    for (const ln of lines) {
      c.page.drawText(ln, { x, y: PAGE_H - y - size, size, font, color: o.color ?? INK });
      y += size + gap;
    }
    if (o.advance !== false) c.y = y;
    return lines.length;
  };

  const link = (c: Cursor, prefix: string, display: string, uri: string, o: { size?: number; color?: Color; x?: number } = {}) => {
    const size = o.size ?? 9;
    const x = o.x ?? MARGIN;
    c.page.drawText(prefix, { x, y: PAGE_H - c.y - size, size, font: regular, color: o.color ?? INK });
    const px = x + regular.widthOfTextAtSize(prefix, size);
    c.page.drawText(display, { x: px, y: PAGE_H - c.y - size, size, font: semibold, color: SAGE });
    const w = semibold.widthOfTextAtSize(display, size);
    c.page.drawLine({
      start: { x: px, y: PAGE_H - c.y - size - 1.5 },
      end: { x: px + w, y: PAGE_H - c.y - size - 1.5 },
      thickness: 0.6,
      color: SAGE,
    });
    addLink(c.page, px - 1, PAGE_H - c.y - size - 3, w + 2, size + 6, uri);
    c.y += size + 2.6;
  };

  const addLink = (page: PDFPage, x: number, y: number, w: number, h: number, uri: string) => {
    const ann = doc.context.register(
      doc.context.obj({
        Type: "Annot",
        Subtype: "Link",
        Rect: [x, y, x + w, y + h],
        Border: [0, 0, 0],
        A: { Type: "Action", S: "URI", URI: PDFString.of(uri) },
      }),
    );
    let annots = page.node.lookup(PDFName.of("Annots"), PDFArray);
    if (!annots) {
      annots = doc.context.obj([]) as PDFArray;
      page.node.set(PDFName.of("Annots"), annots);
    }
    annots.push(ann);
  };

  const label = (c: Cursor, s: string, required = false, o: { x?: number; size?: number } = {}) => {
    const size = o.size ?? 8;
    const x = o.x ?? MARGIN;
    c.page.drawText(s, { x, y: PAGE_H - c.y - size, size, font: semibold, color: INK });
    if (required) {
      const w = semibold.widthOfTextAtSize(s, size);
      c.page.drawText(" *", { x: x + w, y: PAGE_H - c.y - size, size, font: bold, color: CORAL_DEEP });
    }
    c.y += size + 3;
  };

  const textField = (c: Cursor, name: string, o: { x?: number; w?: number; h?: number; multiline?: boolean; fontSize?: number } = {}) => {
    const x = o.x ?? MARGIN;
    const w = o.w ?? CONTENT_W;
    const h = o.h ?? 17;
    const f = form.createTextField(name);
    if (o.multiline) f.enableMultiline();
    f.addToPage(c.page, {
      x,
      y: PAGE_H - c.y - h,
      width: w,
      height: h,
      borderWidth: 0.8,
      borderColor: FIELD_BORDER,
      backgroundColor: FIELD_BG,
    });
    f.setFontSize(o.fontSize ?? 9);
    c.y += h + 4;
  };

  const checkbox = (c: Cursor, name: string, labelText: string, o: { x?: number; size?: number; maxW?: number } = {}) => {
    const x = o.x ?? MARGIN;
    const size = o.size ?? 9;
    const box = 10;
    const cb = form.createCheckBox(name);
    cb.addToPage(c.page, {
      x,
      y: PAGE_H - c.y - box - 1,
      width: box,
      height: box,
      borderWidth: 1,
      borderColor: DEEP_SAGE,
      backgroundColor: FIELD_BG,
    });
    const tx = x + box + 6;
    const lines = wrap(labelText, regular, size, o.maxW ?? PAGE_W - tx - MARGIN);
    let y = c.y;
    for (const ln of lines) {
      c.page.drawText(ln, { x: tx, y: PAGE_H - y - size, size, font: regular, color: INK });
      y += size + 2.4;
    }
    c.y = Math.max(y, c.y + box + 4);
  };

  const radioOption = (c: Cursor, group: ReturnType<typeof form.createRadioGroup>, value: string, o: { x?: number; size?: number; maxW?: number } = {}) => {
    const x = o.x ?? MARGIN;
    const size = o.size ?? 9;
    const dot = 10;
    group.addOptionToPage(value, c.page, {
      x,
      y: PAGE_H - c.y - dot - 1,
      width: dot,
      height: dot,
      borderWidth: 1,
      borderColor: DEEP_SAGE,
      backgroundColor: FIELD_BG,
    });
    const tx = x + dot + 6;
    const lines = wrap(value, regular, size, o.maxW ?? PAGE_W - tx - MARGIN);
    let y = c.y;
    for (const ln of lines) {
      c.page.drawText(ln, { x: tx, y: PAGE_H - y - size, size, font: regular, color: INK });
      y += size + 2.4;
    }
    c.y = Math.max(y, c.y + dot + 4);
  };

  const sectionHead = (c: Cursor, s: string) => {
    c.page.drawRectangle({ x: MARGIN, y: PAGE_H - c.y - 14, width: 4, height: 14, color: SAGE });
    c.page.drawText(s, { x: MARGIN + 11, y: PAGE_H - c.y - 12.5, size: 12.5, font: semibold, color: SAGE });
    c.y += 20;
  };

  const newPage = (slimTitle?: string): Cursor => {
    const page = doc.addPage([PAGE_W, PAGE_H]);
    pages.push(page);
    page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: WARM_WHITE });
    const c: Cursor = { page, y: 34 };
    if (!slimTitle) {
      // Full header: logo left, title right, coral rule.
      const lh = 46;
      const ls = logo.scale(lh / logo.height);
      page.drawImage(logo, { x: MARGIN, y: PAGE_H - 34 - lh, width: ls.width, height: ls.height });
      const t = R.pdfTitle;
      const tw = semibold.widthOfTextAtSize(t, 21);
      page.drawText(t, { x: PAGE_W - MARGIN - tw, y: PAGE_H - 56, size: 21, font: semibold, color: SAGE });
      const sw = regular.widthOfTextAtSize(R.pdfSubtitle, 9);
      page.drawText(R.pdfSubtitle, { x: PAGE_W - MARGIN - sw, y: PAGE_H - 70, size: 9, font: regular, color: DEEP_SAGE });
      page.drawLine({ start: { x: MARGIN, y: PAGE_H - 92 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 92 }, thickness: 2, color: CORAL });
      c.y = 104;
    } else {
      const lh = 26;
      const ls = logo.scale(lh / logo.height);
      page.drawImage(logo, { x: MARGIN, y: PAGE_H - 30 - lh, width: ls.width, height: ls.height });
      const t = `${R.pdfTitle}  |  ${slimTitle}`;
      const tw = semibold.widthOfTextAtSize(t, 13);
      page.drawText(t, { x: PAGE_W - MARGIN - tw, y: PAGE_H - 46, size: 13, font: semibold, color: SAGE });
      page.drawLine({ start: { x: MARGIN, y: PAGE_H - 64 }, end: { x: PAGE_W - MARGIN, y: PAGE_H - 64 }, thickness: 1.5, color: CORAL });
      c.y = 76;
    }
    return c;
  };

  const footers = () => {
    pages.forEach((page, i) => {
      const y1 = 40;
      page.drawLine({ start: { x: MARGIN, y: y1 + 14 }, end: { x: PAGE_W - MARGIN, y: y1 + 14 }, thickness: 0.6, color: FIELD_BORDER });
      page.drawText(R.footer.orgLine, { x: MARGIN, y: y1 + 2, size: 7, font: regular, color: DEEP_SAGE });
      page.drawText(`${R.footer.custodyLine}  ${R.footer.rev}`, { x: MARGIN, y: y1 - 8, size: 7, font: regular, color: DEEP_SAGE });
      const pg = `Page ${i + 1} of ${pages.length}`;
      const w = regular.widthOfTextAtSize(pg, 7);
      page.drawText(pg, { x: PAGE_W - MARGIN - w, y: y1 + 2, size: 7, font: regular, color: DEEP_SAGE });
    });
  };

  // ============ PAGE 1 — How to submit + About your request ============
  let c = newPage();

  // HOW TO SUBMIT panel
  const panelTop = c.y;
  const panelH = 92;
  c.page.drawRectangle({ x: MARGIN, y: PAGE_H - panelTop - panelH, width: CONTENT_W, height: panelH, color: PANEL_SAGE });
  c.y = panelTop + 10;
  text(c, "HOW TO SUBMIT", { font: bold, size: 8, color: CORAL_DEEP, x: MARGIN + 12 });
  c.y += 2;
  link(c, R.submit.onlinePrefix, R.submit.onlineDisplay, R.submit.onlineUrl, { x: MARGIN + 12 });
  c.y += 1;
  link(c, R.submit.emailPrefix, R.submit.emailDisplay, R.submit.emailMailto, { x: MARGIN + 12, size: 8.6 });
  c.y += 1;
  text(c, R.submit.responseLine, { size: 8.6, color: DEEP_SAGE, x: MARGIN + 12, maxW: CONTENT_W - 24 });
  c.y += 1;
  link(c, R.submit.eligibilityPrefix, R.submit.eligibilityDisplay, R.submit.applyUrl, { x: MARGIN + 12, size: 8.6, color: DEEP_SAGE });
  c.y = panelTop + panelH + 12;

  // PRIVACY panel (coral border)
  const privTop = c.y;
  const privH = 46;
  c.page.drawRectangle({
    x: MARGIN, y: PAGE_H - privTop - privH, width: CONTENT_W, height: privH,
    borderColor: CORAL, borderWidth: 1.4, color: WARM_WHITE,
  });
  c.y = privTop + 10;
  text(c, R.privacyPanelHeading.toUpperCase(), { font: bold, size: 8.6, color: CORAL_DEEP, x: MARGIN + 12, maxW: CONTENT_W - 24 });
  c.y += 1;
  text(c, R.privacyPanelBody, { size: 8.8, x: MARGIN + 12, maxW: CONTENT_W - 24 });
  c.y = privTop + privH + 16;

  sectionHead(c, "A.  About your request");
  c.y += 2;

  // Two-column labeled fields
  const col2 = MARGIN + CONTENT_W / 2 + 10;
  const colW = CONTENT_W / 2 - 10;
  const row = (l1: string, r1: boolean, n1: string, l2: string, r2: boolean, n2: string) => {
    const startY = c.y;
    label(c, l1, r1);
    textField(c, n1, { w: colW });
    const endLeft = c.y;
    c.y = startY;
    label(c, l2, r2, { x: col2 });
    textField(c, n2, { x: col2, w: colW });
    c.y = Math.max(endLeft, c.y) + 2;
  };
  row("Requesting organization name", true, "org_name", "Date of request", true, "request_date");
  row("Your name and title", true, "name_title", "Email", true, "email");
  // phone + approved-by (helper under the right column)
  {
    const startY = c.y;
    label(c, "Your phone", true);
    textField(c, "phone", { w: colW });
    const endLeft = c.y;
    c.y = startY;
    label(c, "Approved by (name and title)", false, { x: col2 });
    textField(c, "approved_by", { x: col2, w: colW });
    text(c, R.approvedByHelper, { size: 7.2, color: DEEP_SAGE, x: col2, maxW: colW });
    c.y = Math.max(endLeft, c.y) + 4;
  }

  label(c, "Who is this request for?", true, { size: 9 });
  const whoGroup = form.createRadioGroup("who_for");
  radioOption(c, whoGroup, R.whoFor[0]);
  radioOption(c, whoGroup, R.whoFor[1]);
  c.y += 6;

  label(c, "How urgent is this request?", true, { size: 9 });
  const urgGroup = form.createRadioGroup("urgency");
  {
    const startY = c.y;
    radioOption(c, urgGroup, R.urgency[0], { maxW: colW - 20 });
    const l1 = c.y;
    radioOption(c, urgGroup, R.urgency[2], { maxW: colW - 20 });
    const left = c.y;
    c.y = startY;
    radioOption(c, urgGroup, R.urgency[1], { x: col2, maxW: colW - 20 });
    c.y = l1;
    radioOption(c, urgGroup, R.urgency[3], { x: col2, maxW: colW - 20 });
    c.y = Math.max(left, c.y) + 6;
  }

  {
    const startY = c.y;
    label(c, "Number of children this request serves", true);
    textField(c, "num_children", { w: 70 });
    const endLeft = c.y;
    c.y = startY + 1;
    text(c, R.childCountHelper, { size: 7.2, color: DEEP_SAGE, x: MARGIN + 240, maxW: CONTENT_W - 240 });
    c.y = Math.max(endLeft, c.y);
  }

  // ============ PAGE 2 — Items needed + each child ============
  c = newPage("Items needed");

  sectionHead(c, "B.  Items needed");
  text(c, R.categoriesHelper, { size: 8.4, color: DEEP_SAGE });
  c.y += 4;
  label(c, "Item categories", true, { size: 9 });
  const cats = [...R.categories, R.otherOptionPdf];
  cats.forEach((opt, i) => checkbox(c, `cat_${i + 1}`, opt));
  c.y += 6;

  sectionHead(c, "C.  About each child  (age, gender and sizes only)");
  text(c, `Clothing fit: ${R.childBlock.fitLine.charAt(0).toLowerCase()}${R.childBlock.fitLine.slice(1)} Leave blank or mark "Not sure" if unknown.`, { size: 8, color: DEEP_SAGE });
  c.y += 3;

  const childFieldKeys = ["age", "gender", "tops", "bottoms", "shoes", "underwear", "pajamas"];
  const childColW = [34, 46, 42, 46, 42, 92, 46];
  for (let n = 1; n <= R.childBlock.count; n++) {
    const blockTop = c.y;
    // chip
    c.page.drawRectangle({ x: MARGIN, y: PAGE_H - blockTop - 13, width: 52, height: 13, color: SAGE });
    c.page.drawText(`CHILD ${n}`, { x: MARGIN + 7, y: PAGE_H - blockTop - 10.5, size: 7.5, font: bold, color: WARM_WHITE });
    // size fields in a row
    let fx = MARGIN + 62;
    for (let i = 0; i < childFieldKeys.length; i++) {
      c.page.drawText(R.childBlock.fields[i], { x: fx, y: PAGE_H - blockTop - 7, size: 6.4, font: regular, color: DEEP_SAGE });
      const f = form.createTextField(`child${n}_${childFieldKeys[i]}`);
      f.addToPage(c.page, {
        x: fx, y: PAGE_H - blockTop - 25, width: childColW[i], height: 14,
        borderWidth: 0.8, borderColor: FIELD_BORDER, backgroundColor: FIELD_BG,
      });
      f.setFontSize(8);
      fx += childColW[i] + 8;
    }
    c.y = blockTop + 30;
    // fit radios
    c.page.drawText("Fit:", { x: MARGIN, y: PAGE_H - c.y - 8, size: 8, font: semibold, color: INK });
    const fitGroup = form.createRadioGroup(`child${n}_fit`);
    let rx = MARGIN + 24;
    for (const opt of R.childBlock.fitOptions) {
      fitGroup.addOptionToPage(opt, c.page, {
        x: rx, y: PAGE_H - c.y - 9.5, width: 9, height: 9,
        borderWidth: 1, borderColor: DEEP_SAGE, backgroundColor: FIELD_BG,
      });
      c.page.drawText(opt, { x: rx + 12, y: PAGE_H - c.y - 8, size: 7.6, font: regular, color: INK });
      rx += 12 + regular.widthOfTextAtSize(opt, 7.6) + 14;
    }
    c.y += 13;
    text(c, R.childBlock.notesLabel, { size: 6.8, color: DEEP_SAGE });
    textField(c, `child${n}_notes`, { h: 20, multiline: true, fontSize: 8 });
    c.y += 2;
  }
  text(c, R.childBlock.moreLine, { size: 8, color: DEEP_SAGE });
  c.y += 4;

  label(c, "Bulk request only: briefly describe what you need", false, { size: 9 });
  text(c, R.bulkHelper, { size: 7.2, color: DEEP_SAGE });
  textField(c, "bulk_details", { h: 26, multiline: true });

  // ============ PAGE 3 — Delivery and confirmation ============
  c = newPage("Delivery and confirmation");

  sectionHead(c, "D.  Delivery and confirmation");
  c.y += 2;
  label(c, "Delivery or pickup", true, { size: 9 });
  const delGroup = form.createRadioGroup("delivery");
  radioOption(c, delGroup, R.delivery[0]);
  radioOption(c, delGroup, R.delivery[1]);
  c.y += 8;

  label(c, "Delivery address (your office, not a family's home)");
  textField(c, "delivery_address", { h: 30, multiline: true });
  c.y += 4;
  label(c, "On-site contact and best delivery times");
  textField(c, "onsite_contact");
  c.y += 4;
  label(c, "Delivery instructions (check-in, parking, visitor requirements)");
  textField(c, "delivery_instructions", { h: 30, multiline: true });
  c.y += 12;

  label(c, "Please confirm", true, { size: 9 });
  c.y += 1;
  checkbox(c, "confirm_no_pii", R.confirmations[0]);
  c.y += 2;
  checkbox(c, "confirm_approved", R.confirmations[1]);

  // ——— finish ———
  form.updateFieldAppearances(regular);
  footers();
  mkdirSync(dirname(OUT_PDF), { recursive: true });
  writeFileSync(OUT_PDF, await doc.save());

  // ============ docs/partner-request-parity.md ============
  const rows = FORM_QUESTIONS.map((q) => {
    const where = "pdfOnly" in q && q.pdfOnly ? "PDF only (paper)" : "Form + PDF";
    const opts = "options" in q && q.options ? q.options.map((o: string) => `"${o}"`).join(" · ") : "";
    const helper = "helper" in q && q.helper ? q.helper.replace(/\n/g, " ") : "";
    return `| ${q.q} | ${q.type} | ${q.required ? "REQUIRED" : "optional"} | ${where} | ${opts} | ${helper} |`;
  }).join("\n");
  const parity = `# Partner Goods Request — Google Form parity checklist

**Generated by \`npm run build:pdf\` from \`src/lib/partnerRequest.ts\` — do not edit by hand.**
After ANY edit to the Google Form behind /request, compare the live respondent view
(https://childrenscollectivefl.org/request) against this table. Every wording and
required flag must match. The PDF is regenerated from the same module, so if this
file is current, the PDF matches too.

**Form title:** ${R.formTitle}
**Form settings:** collect email addresses ON · send responders a copy of their response: Always · new-response email notifications ON.

| Question | Type | Required | Where | Options | Helper text |
|---|---|---|---|---|---|
${rows}

**Item categories note:** the paper form's last option reads "${R.otherOptionPdf}" (its notes live in the child blocks); the Google Form's reads "${R.otherOptionForm}". Approved structural variance, founder 2026-11-01.

**Confirmation message (after submit):**
> ${R.formConfirmation}

**Form description must carry:** the duffel-standard sentence, partner-organizations-only eligibility with the /partner-apply link, the age-gender-size privacy line, the email option ("Prefer to email? Please email ${R.submit.emailDisplay}") as the last line before the tagline, and zero bare instances of the organizational acronym anywhere on the form (title included).
`;
  mkdirSync(dirname(OUT_PARITY), { recursive: true });
  writeFileSync(OUT_PARITY, parity);

  const fieldCount = form.getFields().length;
  console.log(`PDF written: ${OUT_PDF}`);
  console.log(`Pages: ${pages.length} · AcroForm fields: ${fieldCount}`);
  console.log(`Parity checklist written: ${OUT_PARITY}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
