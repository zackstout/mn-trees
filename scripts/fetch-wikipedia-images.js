#!/usr/bin/env node
// Fetches Wikipedia image URLs for each water bird species.
// Uses the Wikipedia REST API (no key required).
//
// Usage:
//   node fetch-wikipedia-images.js
//   node fetch-wikipedia-images.js --output images.json
//
// Output: JSON mapping scientific name -> { url, page }

function arg(flag, fallback) {
  const i = process.argv.indexOf(flag);
  return i !== -1 ? process.argv[i + 1] : fallback;
}

const SPECIES_FILE = arg("--species", "./waterbird-species.js");
const OUTPUT_FILE = arg("--output", "waterbird-images.json");

const waterbirds = require(require("path").resolve(SPECIES_FILE));

// Flatten all species into a single list
function allSpecies(data) {
  const list = [];
  for (const group of data) {
    if (group.subsections) {
      for (const sub of group.subsections) {
        list.push(...sub.species);
      }
    } else {
      list.push(...group.species);
    }
  }
  return list;
}

// Format a common name as a Wikipedia page title:
// capitalize first word only, replace spaces with underscores
// e.g. "Horned Grebe" -> "Horned_grebe"
function toWikiTitle(commonName) {
  const lower = commonName.toLowerCase();
  return (lower.charAt(0).toUpperCase() + lower.slice(1)).replace(/ /g, "_");
}

// Extract the first image URL from within the infobox table of a Wikipedia HTML page.
// Finds the table with class containing "infobox" or "biota", then grabs the first
// upload.wikimedia.org img src inside it.
function extractInforboxImage(html) {
  // Find the start of the infobox table
  const infoboxMatch = html.match(/<table[^>]+class="[^"]*(?:infobox|biota)[^"]*"/i);
  if (!infoboxMatch) return null;

  const tableStart = infoboxMatch.index;

  // Walk forward tracking table nesting depth to find the matching </table>
  let depth = 0;
  let pos = tableStart;
  while (pos < html.length) {
    const openIdx = html.indexOf("<table", pos);
    const closeIdx = html.indexOf("</table", pos);

    if (openIdx !== -1 && (closeIdx === -1 || openIdx < closeIdx)) {
      depth++;
      pos = openIdx + 6;
    } else if (closeIdx !== -1) {
      depth--;
      pos = closeIdx + 7;
      if (depth === 0) break;
    } else {
      break;
    }
  }

  const infoboxHtml = html.slice(tableStart, pos);

  // Find the first <img src="..."> pointing to wikimedia
  const imgMatch = infoboxHtml.match(/<img[^>]+src="(\/\/upload\.wikimedia\.org\/[^"]+)"/i);
  if (!imgMatch) return null;

  // Src is protocol-relative; return as https
  return "https:" + imgMatch[1];
}

// Fetch the Wikipedia page for a given title and extract the infobox image.
// Returns null for imageUrl if the page 404s or has no infobox image.
async function fetchPageImage(title) {
  const pageUrl = `https://en.wikipedia.org/wiki/${title}`;
  const res = await fetch(pageUrl, {
    headers: { "User-Agent": "mn-trees-image-fetcher/1.0 (educational project)" },
  });
  if (res.status === 404) return { imageUrl: null, pageUrl, notFound: true };
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const html = await res.text();
  return { imageUrl: extractInforboxImage(html), pageUrl };
}

// Try common name first, fall back to scientific name on 404 or missing image
async function fetchWikipediaImage(commonName, scientificName) {
  const commonTitle = toWikiTitle(commonName);
  const first = await fetchPageImage(commonTitle);
  if (first.imageUrl) return { imageUrl: first.imageUrl, pageUrl: first.pageUrl };

  // Fallback: try scientific name
  const sciTitle = scientificName.replace(/ /g, "_");
  const fallback = await fetchPageImage(sciTitle);
  if (fallback.imageUrl) return { imageUrl: fallback.imageUrl, pageUrl: fallback.pageUrl };

  return { imageUrl: null, pageUrl: first.pageUrl, note: "No infobox image found" };
}

async function main() {
  const species = allSpecies(waterbirds);
  console.log(`Fetching images for ${species.length} species...\n`);

  const results = {};

  for (const bird of species) {
    process.stdout.write(`  ${bird.common} (${bird.scientific})... `);
    try {
      const result = await fetchWikipediaImage(bird.common, bird.scientific);
      results[bird.scientific] = {
        common: bird.common,
        imageUrl: result.imageUrl,
        pageUrl: result.pageUrl,
        ...(result.note ? { note: result.note } : {}),
      };
      console.log(result.imageUrl ? "✓" : "✗ (no image)");
    } catch (err) {
      results[bird.scientific] = {
        common: bird.common,
        imageUrl: null,
        error: err.message,
      };
      console.log(`✗ (error: ${err.message})`);
    }

    // Polite delay to avoid hammering Wikipedia
    await new Promise((r) => setTimeout(r, 150));
  }

  const fs = require("fs");
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));

  const found = Object.values(results).filter((r) => r.imageUrl).length;
  console.log(`\nDone. ${found}/${species.length} images found.`);
  console.log(`Results written to ${OUTPUT_FILE}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
