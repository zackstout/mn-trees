#!/usr/bin/env python3
"""
add_inat_photos.py

Fetches a representative photo from the iNaturalist API for each species in
the Minneapolis trees overview and inserts it as a new 'Photo' column,
keeping the existing Wikipedia links in place.

Usage:
    pip install requests
    python add_inat_photos.py

The script modifies minneapolis-trees-overview.md in place. Run it once —
re-running will duplicate the Photo column (it does not check for an existing
one). If you need to re-run, revert the file first.

TODO: iNaturalist's taxa endpoint returns a single default (representative)
photo per species. To get leaf- and bark-specific photos instead, query the
observations endpoint filtered by taxon_id and a keyword like "leaf" or
"bark" in the description, then rank results by community ID quality. That
approach requires 2–3 API calls per species and some heuristic matching, but
the photo URLs from that endpoint use the same stable S3 format as the ones
returned here.
"""

import re
import sys
import time

import requests

# ── Config ────────────────────────────────────────────────────────────────────

MDFILE = "minneapolis-trees-overview.md"
INAT_API = "https://api.inaturalist.org/v1/taxa"
REQUEST_DELAY = 0.5   # seconds between calls — iNaturalist asks for politeness


# ── iNaturalist lookup ────────────────────────────────────────────────────────

def get_inat_photo_url(raw_sci_name: str) -> str | None:
    """
    Return the medium-sized default photo URL for a taxon, or None if not found.

    Strips markdown italics and trailing qualifiers (e.g. 'spp.') before
    searching, then accepts the first result regardless of rank so that
    genus-level entries like 'Malus spp.' still resolve.
    """
    name = raw_sci_name.strip().strip("_").strip()
    name = re.sub(r"\s+spp\..*$", "", name, flags=re.IGNORECASE)

    if not name:
        return None

    try:
        resp = requests.get(
            INAT_API,
            params={"q": name, "per_page": 1},
            timeout=10,
        )
        resp.raise_for_status()
        results = resp.json().get("results", [])
        if results:
            photo = results[0].get("default_photo") or {}
            return photo.get("medium_url") or photo.get("small_url")
    except requests.RequestException as exc:
        print(f"  Warning: API error for '{name}': {exc}", file=sys.stderr)

    return None


# ── Table processing ──────────────────────────────────────────────────────────

def add_photo_column(table_lines: list[str]) -> list[str]:
    """
    Given the raw lines of one markdown table, insert a Photo column
    immediately before the Wikipedia column if the table has both a
    'Scientific Name' column and a 'Wikipedia' column.

    Returns the (possibly modified) lines unchanged if neither condition holds.
    """
    if len(table_lines) < 2:
        return table_lines

    # Split header into cells, stripping whitespace for comparison
    header_cells = [c.strip() for c in table_lines[0].split("|")]

    if "Scientific Name" not in header_cells or "Wikipedia" not in header_cells:
        return table_lines

    wiki_col = header_cells.index("Wikipedia")   # 1-based position within split
    sci_col  = header_cells.index("Scientific Name")

    result = []
    for row_idx, line in enumerate(table_lines):
        parts = line.split("|")

        if row_idx == 0:
            # Header
            parts.insert(wiki_col, " Photo ")
            result.append("|".join(parts))

        elif row_idx == 1:
            # Separator (---|---|...)
            parts.insert(wiki_col, " --- ")
            result.append("|".join(parts))

        else:
            # Data row — fetch photo
            try:
                raw_sci = parts[sci_col].strip()
            except IndexError:
                result.append(line)
                continue

            print(f"  {raw_sci}")
            url = get_inat_photo_url(raw_sci)
            time.sleep(REQUEST_DELAY)

            photo_cell = f" ![photo]({url}) " if url else "  "
            parts.insert(wiki_col, photo_cell)
            result.append("|".join(parts))

    return result


# ── File I/O ──────────────────────────────────────────────────────────────────

def process_file(path: str) -> None:
    with open(path, "r", encoding="utf-8") as fh:
        raw_lines = fh.readlines()

    output: list[str] = []
    table_buf: list[str] = []

    def flush_table():
        nonlocal table_buf
        if table_buf:
            for tl in add_photo_column(table_buf):
                output.append(tl + "\n")
            table_buf = []

    for line in raw_lines:
        if line.lstrip().startswith("|"):
            table_buf.append(line.rstrip("\n"))
        else:
            flush_table()
            output.append(line)

    flush_table()  # handle a table at the very end of the file

    with open(path, "w", encoding="utf-8") as fh:
        fh.writelines(output)


# ── Entry point ───────────────────────────────────────────────────────────────

if __name__ == "__main__":
    print(f"Processing {MDFILE} …\n")
    process_file(MDFILE)
    print("\nDone.")
