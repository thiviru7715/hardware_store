#!/usr/bin/env node
/*
 * Update Tool Shop machinery prices from a CSV file.
 *
 *   node scripts/update-machinery-prices.js data/machinery-prices.csv            # apply
 *   node scripts/update-machinery-prices.js data/machinery-prices.csv --dry-run  # preview only
 *
 * CSV columns: model,price[,quantity]   (extra columns such as name/brand are ignored)
 * API URL comes from API_URL (defaults to the deployed Fly.io backend).
 */
const fs = require("fs");
const path = require("path");

const API_URL = process.env.API_URL || "https://hardware-store-api.fly.dev";
const args = process.argv.slice(2);
const file = args.find((a) => !a.startsWith("--"));
const dryRun = args.includes("--dry-run");

if (!file) {
  console.error("Usage: node scripts/update-machinery-prices.js <file.csv> [--dry-run]");
  process.exit(1);
}

// Minimal CSV parser that handles quoted values
const parseLine = (line) => {
  const out = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (quoted) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') quoted = false;
      else cur += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") { out.push(cur.trim()); cur = ""; }
    else cur += ch;
  }
  out.push(cur.trim());
  return out;
};

const lines = fs.readFileSync(path.resolve(file), "utf8").split(/\r?\n/).filter((l) => l.trim());
const header = parseLine(lines[0]).map((h) => h.toLowerCase());
const iModel = header.indexOf("model");
const iPrice = header.indexOf("price");
const iQty = header.indexOf("quantity");
if (iModel === -1 || iPrice === -1) {
  console.error('CSV must have a header row with at least "model" and "price" columns.');
  process.exit(1);
}

const updates = [];
const skipped = [];
lines.slice(1).forEach((line, n) => {
  const c = parseLine(line);
  const price = parseFloat((c[iPrice] || "").replace(/[^0-9.]/g, ""));
  if (!c[iModel] || Number.isNaN(price)) {
    skipped.push(`row ${n + 2}: ${line}`);
    return;
  }
  const row = { model: c[iModel], price };
  if (iQty !== -1 && c[iQty] !== undefined && c[iQty] !== "") {
    const q = parseInt(c[iQty], 10);
    if (!Number.isNaN(q)) row.quantity = q;
  }
  updates.push(row);
});

(async () => {
  console.log(`${updates.length} valid row(s), ${skipped.length} skipped.`);
  skipped.forEach((s) => console.log("  skipped", s));

  // Show what will change compared with the live prices
  const res = await fetch(`${API_URL}/machinery`);
  if (!res.ok) throw new Error(`Could not load current machinery (${res.status})`);
  const current = await res.json();
  const byModel = new Map(current.filter((m) => m.model).map((m) => [m.model.toLowerCase(), m]));

  for (const u of updates) {
    const m = byModel.get(u.model.toLowerCase());
    if (!m) console.log(`  ?  ${u.model}: not in database`);
    else if (Number(m.price) !== u.price) {
      const pct = (((u.price - m.price) / m.price) * 100).toFixed(1);
      console.log(`  ✎  ${u.model}: Rs.${Number(m.price)} → Rs.${u.price} (${pct > 0 ? "+" : ""}${pct}%)`);
    }
  }

  if (dryRun) {
    console.log("Dry run — nothing was changed.");
    return;
  }

  const put = await fetch(`${API_URL}/machinery/prices/bulk`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ updates, source: "antigravity" }),
  });
  const body = await put.json();
  if (!put.ok) throw new Error(body.message || `Update failed (${put.status})`);
  console.log(`Done: ${body.updated} updated.` + (body.notFound.length ? ` Not found: ${body.notFound.join(", ")}` : ""));
})().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
