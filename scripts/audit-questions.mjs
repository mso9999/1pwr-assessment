#!/usr/bin/env node
/**
 * Parse Q from src/App.jsx and report POE / length-skew flags.
 * Run: node scripts/audit-questions.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const appPath = path.join(__dirname, "..", "src", "App.jsx");
const text = fs.readFileSync(appPath, "utf8");
const lines = text.split("\n");
const start = lines.findIndex((l) => l.includes("const Q = ["));
const end = lines.findIndex((l, i) => i > start && l.trim() === "];");
if (start < 0 || end < 0) {
  console.error("Could not find Q array bounds in App.jsx");
  process.exit(1);
}
const block = lines.slice(start, end + 1).join("\n");
const qExpr = block.replace(/^const Q =\s*/, "").replace(/;\s*$/, "");
const Q = eval(qExpr);

let severe = 0;
const rows = [];
for (let qi = 0; qi < Q.length; qi++) {
  const q = Q[qi];
  const opts = q[3];
  const ci = q[4];
  const lens = opts.map((s) => String(s).length);
  const c = lens[ci];
  const others = lens.filter((_, i) => i !== ci);
  const maxO = Math.max(...others);
  const avgO = others.reduce((a, b) => a + b, 0) / 3;
  const gap = c - maxO;
  const ratio = c / avgO;
  if (gap > 80 || ratio > 1.85) {
    severe++;
    rows.push({ qi, gap, ratio: ratio.toFixed(2), dom: q[0], preview: q[2].slice(0, 70) });
  }
}
rows.sort((a, b) => b.gap - a.gap);

console.log(`Questions: ${Q.length}`);
console.log(`Severe length skew (correct > max other by >80 chars OR ratio >1.85): ${severe}`);
console.log("Top 15 by gap:");
rows.slice(0, 15).forEach((r) => {
  console.log(`  [${r.qi}] gap=${r.gap} ratio=${r.ratio} ${r.dom} — ${r.preview}`);
});
