#!/usr/bin/env python3
"""Build the MEMOR city map for the CV plate and the MEMOR storymap page.

Offline generator, run by hand; its output is committed inside `index.html`
and `memor.html` between the `memor:begin` / `memor:end` markers, exactly like
the DERLA map in `tools/storymap/build_map.py`. Nothing here runs at page load
and neither page gains a dependency.

    python3 tools/memor/build_map.py --splice index.html --splice memor.html

Inputs
  - MEMOR's public EVENTS GeoJSON. Pass a saved copy with `--events` to work
    offline; the default URL is the file the MEMOR map app loads.
  - The Graz municipal boundary: the Nominatim result for OSM relation 34719
    (`--boundary`, saved), because the City of Graz's own geodata is under
    service terms rather than an open licence. OSM data is ODbL 1.0 and is
    credited in the plate caption and the page colophon.
  - Optional Natural Earth 1:50m countries (`--natural-earth`) for the country
    split in the report only. Not used by the SVG.

Output
  - One `<svg>` fragment: the city boundary and one path of last voluntary
    addresses. Coincident addresses are emitted once per whole viewBox unit,
    so the path counts visible positions, not records. All counts in the prose
    stay record counts.

Why one dot class: MEMOR records forced residences too, but only 16 of 496
forced-residence records fall at nine Graz addresses besides the Feldhof
institution; the rest are in Vienna, Salzburg and the occupied Netherlands.
A second class drawn on a Graz outline would imply that forced residence was
a minor local phenomenon, and a square risks being read as one of DERLA's
sites of terror. The forced addresses are a chapter of the page, not a layer
on this map. See redesignv10.md §4.
"""

from __future__ import annotations

import argparse
import collections
import json
import math
import os
import re
import statistics
import sys
import textwrap
import urllib.request
from pathlib import Path

EVENTS_URL = "https://ns-opfer-graz.at/static/apps/map/EVENTS.952315e3.json"
NE_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/"
    "geojson/ne_50m_admin_0_countries.geojson"
)

# Graz, generously padded: a record outside is a geocoding error, not a place
# this map can show. All 808 last voluntary addresses fall inside.
LON_MIN, LON_MAX = 15.30, 15.58
LAT_MIN, LAT_MAX = 46.98, 47.16

VIEW_W, PAD = 600, 12
BOUNDARY_EPSILON = 1.0  # viewBox units; 1,992 boundary points -> ~286

RESIDENCE = "voluntary_residence"
FORCED = "forced_residence"
DEATH = "death"


# ---------------------------------------------------------------- extraction


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "memor-build/1.0"})
    with urllib.request.urlopen(request, timeout=120) as response:
        return response.read().decode("utf-8")


def load_events(path: Path | None) -> list[dict]:
    """Flatten MEMOR's one-feature-per-address GeoJSON into event records.

    A feature either carries a single event inline or an `events` array for
    everyone recorded at that address. Both shapes appear in the same file.
    """
    collection = json.loads(
        path.read_text(encoding="utf-8") if path else fetch(EVENTS_URL)
    )
    events: list[dict] = []
    for feature in collection["features"]:
        geometry = feature.get("geometry") or {}
        properties = feature["properties"]
        rows = properties.get("events") or [properties]
        for row in rows:
            event = dict(row)
            event["geometry"] = geometry
            events.append(event)
    return events


def tags(event: dict) -> list[str]:
    return event.get("tags") or []


def coordinates(event: dict) -> tuple[float, float] | None:
    coords = (event.get("geometry") or {}).get("coordinates")
    try:
        lon, lat = float(coords[0]), float(coords[1])
    except (TypeError, ValueError, IndexError):
        return None
    return lon, lat


def usable(point: tuple[float, float] | None) -> bool:
    if point is None:
        return False
    lon, lat = point
    return LON_MIN <= lon <= LON_MAX and LAT_MIN <= lat <= LAT_MAX


def boundary_ring(path: Path | None) -> list[tuple[float, float]]:
    """Return the outer ring as (lon, lat), whatever shape the file takes.

    Accepts a saved Nominatim search result (a list with `geojson`), a bare
    GeoJSON Polygon, or a Feature/FeatureCollection.
    """
    if path is None:
        raise SystemExit(
            "--boundary is required: save the Nominatim polygon for OSM relation 34719"
        )
    data = json.loads(path.read_text(encoding="utf-8"))
    if isinstance(data, list):
        data = data[0]["geojson"]
    if data.get("type") == "FeatureCollection":
        data = data["features"][0]
    if data.get("type") == "Feature":
        data = data["geometry"]
    if data["type"] == "Polygon":
        ring = data["coordinates"][0]
    elif data["type"] == "MultiPolygon":
        ring = max(data["coordinates"], key=lambda polygon: len(polygon[0]))[0]
    else:
        raise SystemExit(f"unexpected boundary geometry: {data['type']}")
    return [(float(lon), float(lat)) for lon, lat in ring]


# ---------------------------------------------------------------- projection


def simplify(
    points: list[tuple[float, float]], epsilon: float
) -> list[tuple[float, float]]:
    """Douglas-Peucker, iterative so a ragged boundary cannot blow the stack."""
    if len(points) < 3:
        return points
    keep = [False] * len(points)
    keep[0] = keep[-1] = True
    stack = [(0, len(points) - 1)]
    while stack:
        a, b = stack.pop()
        if b <= a + 1:
            continue
        x1, y1 = points[a]
        x2, y2 = points[b]
        dx, dy = x2 - x1, y2 - y1
        length = math.hypot(dx, dy)
        if length < 1e-15:
            continue
        best, index = -1.0, None
        for i in range(a + 1, b):
            x, y = points[i]
            distance = abs(dy * x - dx * y + x2 * y1 - y2 * x1) / length
            if distance > best:
                best, index = distance, i
        if best > epsilon:
            keep[index] = True
            stack += [(a, index), (index, b)]
    return [point for point, kept in zip(points, keep) if kept]


def project_factory(ring: list[tuple[float, float]]):
    """Local equirectangular fitted to the boundary, longitude scaled by cos φ.

    A city this small needs no conic projection; the aspect ratio is the only
    thing that must be right, and cos(latitude) carries it.
    """
    lat0 = statistics.fmean(lat for _, lat in ring)
    min_lon = min(lon for lon, _ in ring)
    max_lon = max(lon for lon, _ in ring)
    min_lat = min(lat for _, lat in ring)
    max_lat = max(lat for _, lat in ring)
    kx = math.cos(math.radians(lat0))
    scale = (VIEW_W - 2 * PAD) / ((max_lon - min_lon) * kx)
    height = (max_lat - min_lat) * scale + 2 * PAD

    def project(lon: float, lat: float) -> tuple[float, float]:
        return (
            PAD + (lon - min_lon) * kx * scale,
            PAD + (max_lat - lat) * scale,
        )

    return project, height


# ---------------------------------------------------------------- editorials

# MEMOR's place names are free text: "Tötungsanstalt Hartheim", "Hartheim",
# "KZ Auschwitz", "KZ Auschwitz, Polen" are one site. The page says 74 places
# of death, so the grouping lives here, in one readable table, where a reader
# can disagree with it. Order matters: first match wins.
SITE_CANON = [
    (r"hartheim", "Hartheim"),
    (r"^kz auschwitz|auschwitz", "Auschwitz"),
    (r"theresienstadt", "Theresienstadt"),
    (r"maly trostinec", "Maly Trostinec"),
    (r"treblinka", "Treblinka"),
    (r"jasenovac", "Jasenovac"),
    (r"dachau", "Dachau"),
    (r"buchenwald", "Buchenwald"),
    (r"ravensbrück", "Ravensbrück"),
    (r"brandenburg", "Brandenburg-Görden"),
    (r"landesgericht graz", "Landesgericht Graz (execution site)"),
    (r"landesgericht wien", "Landesgericht Wien (execution site)"),
    (r"mauthausen", "Mauthausen"),
    (r"sobibor", "Sobibór"),
    (r"litzmannstadt", "Litzmannstadt (Łódź)"),
    (r"riga", "Riga"),
    (r"sachsenhausen", "Sachsenhausen"),
    (r"belzec|bełżec", "Bełżec"),
    (r"stutthof", "Stutthof"),
    (r"flossenbürg", "Flossenbürg"),
    (r"gusen", "Gusen"),
]

# Forced addresses: the page lists cities and institutions, never present-day
# residential addresses. These buckets are the page's own editorial grouping.
FORCED_BUCKETS = [
    (r"Feldhof", "Feldhof institution (Graz)"),
    (r"1020 Wien", "Vienna, 2nd district"),
    (r"Wien", "Vienna, elsewhere"),
    (r"Salzburg", "Salzburg-Maxglan"),
    (r"Niederlande|Amsterdam|Oud-Beijerland", "Occupied Netherlands"),
    (r"Steinhof", "Steinhof institution (Vienna)"),
    (r"Graz", "Other Graz addresses"),
]


def canon_site(name: str) -> str:
    lowered = name.lower()
    for pattern, label in SITE_CANON:
        if re.search(pattern, lowered):
            return label
    return name


def forced_bucket(name: str) -> str:
    for pattern, label in FORCED_BUCKETS:
        if re.search(pattern, name, re.IGNORECASE):
            return label
    return "Camps, prisons, other"


# ---------------------------------------------------------------- reporting


def haversine(a: tuple[float, float], b: tuple[float, float]) -> float:
    lon1, lat1 = a
    lon2, lat2 = b
    radius = 6371.0088
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp = p2 - p1
    dl = math.radians(lon2 - lon1)
    h = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * radius * math.asin(math.sqrt(h))


def country_lookup(geojson: dict):
    """Point-in-polygon over Natural Earth's first rings, for the report only."""
    rings = []
    for feature in geojson["features"]:
        name = feature["properties"].get("NAME") or feature["properties"].get("ADMIN")
        geometry = feature["geometry"]
        parts = (
            [geometry["coordinates"]]
            if geometry["type"] == "Polygon"
            else geometry["coordinates"]
            if geometry["type"] == "MultiPolygon"
            else []
        )
        for polygon in parts:
            rings.append((name, polygon[0]))

    def inside(point: tuple[float, float], ring: list[list[float]]) -> bool:
        x, y = point
        result = False
        j = len(ring) - 1
        for i, (xi, yi) in enumerate(ring):
            xj, yj = ring[j]
            if ((yi > y) != (yj > y)) and (
                x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi
            ):
                result = not result
            j = i
        return result

    def lookup(point: tuple[float, float]) -> str:
        for name, ring in rings:
            if inside(point, ring):
                return name
        return "Unknown"

    return lookup


def report(events: list[dict], persons: int, natural_earth: Path | None) -> None:
    voluntary = [e for e in events if RESIDENCE in tags(e)]
    forced = [e for e in events if FORCED in tags(e)]
    deaths = [e for e in events if DEATH in tags(e)]

    def addresses(rows: list[dict]) -> int:
        return len({e.get("place_name") for e in rows})

    by_person: dict[str, list[dict]] = collections.defaultdict(list)
    for event in events:
        by_person[event["person_id"]].append(event)
    without_death = sum(
        1 for rows in by_person.values() if not any(DEATH in tags(e) for e in rows)
    )
    without_address = sum(
        1 for rows in by_person.values() if not any(RESIDENCE in tags(e) for e in rows)
    )

    sites = collections.Counter(canon_site(e["place_name"]) for e in deaths)
    years: collections.Counter[int] = collections.Counter()
    for event in deaths:
        match = re.search(r"(\d{4})$", str(event.get("date") or ""))
        if match:
            years[int(match.group(1))] += 1

    print(f"persons in events    {persons}")
    print(f"voluntary events     {len(voluntary)}")
    print(f"voluntary addresses  {addresses(voluntary)}")
    print(f"forced events        {len(forced)}")
    print(f"forced addresses     {addresses(forced)}")
    print(f"death events         {len(deaths)}")
    print(f"death place names    {addresses(deaths)}")
    print(f"canonical sites      {len(sites)}")
    print(f"no voluntary address {without_address}")
    print(f"no recorded death    {without_death}")
    print(f"dated deaths         {sum(years.values())}")
    print(f"death years          {sorted(years.items())}")
    print(f"top sites            {sites.most_common(10)}")
    print(
        "forced buckets       "
        f"{collections.Counter(forced_bucket(e['place_name']) for e in forced).most_common()}"
    )

    # Distances and the country split are not map work: a death site in Poland
    # is outside the city bbox by design, so `usable()` must not gate them.
    distances = []
    for rows in by_person.values():
        home = next((e for e in rows if RESIDENCE in tags(e)), None)
        end = next((e for e in rows if DEATH in tags(e)), None)
        if home and end and coordinates(home) and coordinates(end):
            distances.append(haversine(coordinates(home), coordinates(end)))
    bins = collections.Counter()
    for km in distances:
        if km <= 250:
            bins["0-250"] += 1
        elif km <= 500:
            bins["251-500"] += 1
        elif km <= 1000:
            bins["501-1000"] += 1
        elif km <= 1500:
            bins["1001-1500"] += 1
        else:
            bins[">1500"] += 1
    if distances:
        print(f"distances            {len(distances)} pairs, mean {round(statistics.fmean(distances))} km")
        print(f"distance bins        {dict(sorted(bins.items()))}")

    if natural_earth:
        lookup = country_lookup(json.loads(natural_earth.read_text(encoding="utf-8")))
        countries = collections.Counter(
            lookup(coordinates(e)) for e in deaths if coordinates(e)
        )
        print(f"deaths by country    {countries.most_common()}")
        print(
            "outside Austria      "
            f"{sum(n for c, n in countries.items() if c != 'Austria')}"
        )


# ---------------------------------------------------------------- rendering


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--events", type=Path, help="saved MEMOR EVENTS GeoJSON")
    parser.add_argument("--boundary", type=Path, help="saved Nominatim boundary JSON")
    parser.add_argument("--natural-earth", type=Path, help="report-only country split")
    parser.add_argument("--out", type=Path, default=Path("tools/memor/graz-map.svg"))
    parser.add_argument(
        "--splice",
        type=Path,
        action="append",
        help="replace the memor map block in this HTML file (repeatable)",
    )
    args = parser.parse_args()

    events = load_events(args.events)
    persons = len({event["person_id"] for event in events})
    ring = boundary_ring(args.boundary)

    project, height = project_factory(ring)
    boundary = [project(lon, lat) for lon, lat in ring]
    # Simplify the open ring: Douglas-Peucker on a closed ring sees two
    # identical endpoints and reduces the city to a line.
    if boundary[0] == boundary[-1]:
        boundary = boundary[:-1]
    outline = simplify(boundary, BOUNDARY_EPSILON)
    outline_d = (
        "M" + "L".join(f"{x:.1f},{y:.1f}" for x, y in outline) + "Z"
    )

    seen: set[tuple[int, int]] = set()
    positions = []
    for event in events:
        if RESIDENCE not in tags(event):
            continue
        point = coordinates(event)
        if not usable(point):
            continue
        x, y = project(*point)
        key = (round(x), round(y))
        if key in seen:
            continue
        seen.add(key)
        positions.append(key)
    positions.sort()
    dots = "".join(f"M{x},{y}h0" for x, y in positions)

    # The padded city bbox is a geocoding guard, not a filter: every last
    # voluntary address should fall inside it. If not, the map silently loses
    # records, so the run says how many.
    outside = sum(
        1 for e in events if RESIDENCE in tags(e) and not usable(coordinates(e))
    )

    addresses = len(
        {e.get("place_name") for e in events if RESIDENCE in tags(e)}
    )
    svg = "\n".join(
        [
            (
                f'<svg class="map__svg" viewBox="0 0 {VIEW_W} {height:.1f}" width="{VIEW_W}"'
                ' role="img" aria-labelledby="memor-map-title memor-map-desc"'
                ' preserveAspectRatio="xMidYMid meet">'
            ),
            '  <title id="memor-map-title">Last voluntary addresses of people persecuted in Graz</title>',
            (
                f'  <desc id="memor-map-desc">{addresses} last voluntary addresses of Graz'
                " residents persecuted under National Socialism, drawn inside the"
                f" present-day city boundary. Positions overlap at this scale: they"
                f" collapse to {len(positions)} visible points. Addresses are today's"
                " geocodes of historical addresses; no names are shown.</desc>"
            ),
            f'  <path class="map__outline" d="{outline_d}"/>',
            f'  <path class="map__address" d="{dots}"/>',
            "</svg>",
        ]
    )

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(svg + "\n", encoding="utf-8")

    print(f"boundary points      {len(ring)}")
    print(f"boundary simplified  {len(outline)}")
    print(f"outside bbox         {outside}")
    print(f"address positions    {len(positions)}")
    print(f"viewBox              {VIEW_W} x {height:.1f}")
    print(f"svg bytes            {len(svg)}")
    print(f"wrote                {args.out}")

    if args.splice:
        pattern = re.compile(
            r"([ \t]*)<!-- memor:begin -->.*?<!-- memor:end -->", re.DOTALL
        )
        rendered: list[tuple[Path, str]] = []
        for page_path in args.splice:
            page = page_path.read_text(encoding="utf-8")
            match = pattern.search(page)
            if not match:
                raise SystemExit(f"no memor:begin / memor:end markers in {page_path}")
            indent = match.group(1)
            body = textwrap.indent(svg, indent + "  ")
            block = f"{indent}<!-- memor:begin -->\n{body}\n{indent}<!-- memor:end -->"
            rendered.append((page_path, block))

        # One artefact, two hosts. Refuse to write anything if the blocks would
        # differ (indentation aside), so a half-finished run cannot leave the CV
        # and the page with different maps.
        def normalise(block: str) -> str:
            return "\n".join(line.strip() for line in block.splitlines())

        if len({normalise(block) for _, block in rendered}) > 1:
            raise SystemExit("map blocks differ between hosts; nothing written")

        for page_path, block in rendered:
            page = page_path.read_text(encoding="utf-8")
            match = pattern.search(page)
            if not match:
                raise SystemExit(f"lost memor markers in {page_path}")
            updated = page[: match.start()] + block + page[match.end() :]
            # Temp file + rename: an interrupted run leaves the page intact.
            temp = page_path.with_name(f"{page_path.name}.tmp")
            temp.write_text(updated, encoding="utf-8")
            os.replace(temp, page_path)
            print(f"spliced into         {page_path}")

    report(events, persons, args.natural_earth)


if __name__ == "__main__":
    sys.exit(main())
