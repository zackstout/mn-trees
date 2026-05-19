#!/usr/bin/env node
// Reads waterbird-images.json and injects an Image column into every species
// table in minneapolis-waterbirds-overview.md.
// Writes output to minneapolis-waterbirds-overview-with-images.md.
//
// Usage:
//   node scripts/add-images-to-doc.js

const fs = require("fs");
const path = require("path");

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

const ROOT = path.resolve(__dirname, "..");
const SOURCE = arg("--source", path.join(ROOT, "minneapolis-waterbirds-overview.md"));
const OUTPUT = arg("--output", SOURCE.replace(".md", "-with-images.md"));
const IMAGES = arg("--images", path.join(ROOT, "waterbird-images.json"));

const images = JSON.parse(fs.readFileSync(IMAGES, "utf8"));

// Build a lookup from scientific name -> markdown image cell
// e.g.  ![Mallard](https://upload.wikimedia.org/...)
function imageCell(scientificName) {
  const entry = images[scientificName];
  if (!entry || !entry.imageUrl) return "";
  return `![${entry.common}](${entry.imageUrl})`;
}

// Extract the bare scientific name from a table cell that may contain italics:
// "_Anas platyrhynchos_"  ->  "Anas platyrhynchos"
function parseScientificName(cell) {
  return cell.trim().replace(/^_|_$/g, "").trim();
}

// Process a single markdown table (array of raw lines).
// If the header row already contains an "Image" column, skip.
// Otherwise append an Image column to every row.
function processTable(lines) {
  if (lines.length < 2) return lines;

  const headerLine = lines[0];

  // Already has an image column — leave it alone
  if (/\bimage\b/i.test(headerLine)) return lines;

  // Detect which column index holds the scientific name by checking header
  const headers = headerLine.split("|").map((c) => c.trim());
  const sciIdx = headers.findIndex((h) => /scientific/i.test(h));
  if (sciIdx === -1) return lines; // can't find scientific column, skip

  return lines.map((line, i) => {
    const isSeparator = /^\|[\s\-:|]+\|/.test(line);

    if (isSeparator) {
      // Add a separator cell for the new column
      return line.replace(/\|?\s*$/, "| ----- |");
    }

    const cells = line.split("|");
    // cells[0] is empty (before leading |), cells[sciIdx] is scientific name
    const scientific = parseScientificName(cells[sciIdx] || "");
    const cell = i === 0 ? " Image " : ` ${imageCell(scientific)} `;

    return line.replace(/\|?\s*$/, `|${cell}|`);
  });
}

function processMarkdown(source) {
  const lines = source.split("\n");
  const result = [];
  let tableBuffer = [];
  let inTable = false;

  function flushTable() {
    const processed = processTable(tableBuffer);
    result.push(...processed);
    tableBuffer = [];
    inTable = false;
  }

  for (const line of lines) {
    const isTableRow = /^\|/.test(line);

    if (isTableRow) {
      inTable = true;
      tableBuffer.push(line);
    } else {
      if (inTable) flushTable();
      result.push(line);
    }
  }

  if (inTable) flushTable();

  return result.join("\n");
}

const source = fs.readFileSync(SOURCE, "utf8");
const output = processMarkdown(source);
fs.writeFileSync(OUTPUT, output);
console.log(`Written to ${OUTPUT}`);
