#!/usr/bin/env python3
"""Build the storymap's inline Austria map from DERLA's public map data.

Offline generator, run by hand; its output is committed inside `storymap.html`
between the `map:begin` / `map:end` markers, exactly like the WebP derivatives
in `images/`. Nothing here runs at page load, and the page stays a plain file.

    python3 tools/storymap/build_map.py --splice storymap.html

Inputs
  - DERLA map page: `https://gams.uni-graz.at/context:derlageo/...?mode=map`.
    The GeoJSON is embedded inline in `window.derla_mapp.data`. Pass a saved
    copy with `--map-html` to work offline.
  - Natural Earth 1:50m countries (public domain) for the Austria outline.
    Pass a saved copy with `--natural-earth`.

Output
  - One `<svg>` fragment: outline path, all 4,393 points as one path, and the
    `Orte des Terrors` records as one path of squares.

Why SVG and not a map library: 4,393 dots cost ~44KB as a single path, the
outline ~3KB, and the result needs no tiles, no runtime JSON, no pan/zoom and
no third-party request. Inline (not `<img>`) so print and forced-colours rules
can restyle it with `currentColor`.
"""

from __future__ import annotations

import argparse
import json
import math
import re
import sys
import urllib.request
from pathlib import Path

MAP_URL = (
    "https://gams.uni-graz.at/context:derlageo/sdef:Context/get"
    "?locale=de&mode=map"
)
NE_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/"
    "geojson/ne_50m_admin_0_countries.geojson"
)

# Austria's extent, generously padded: anything outside is a malformed record,
# not a real place.
LON_MIN, LON_MAX = 9.4, 17.2
LAT_MIN, LAT_MAX = 46.3, 49.1

# Albers equal-area conic, tuned for Austria.
PHI1, PHI2, PHI0, LAM0 = 46.5, 49.5, 47.5, 14.5

VIEW_W, VIEW_H = 720, 380
PAD = 14


# ---------------------------------------------------------------- extraction


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "storymap-build/1.0"})
    with urllib.request.urlopen(req, timeout=120) as res:
        return res.read().decode("utf-8")


def embedded_feature_collection(html: str) -> dict:
    """Pull `data: { ... }` out of `window.derla_mapp` with a brace matcher."""
    anchor = html.find("window.derla_mapp")
    if anchor < 0:
        raise SystemExit("window.derla_mapp not found; DERLA changed its map page")
    start = html.find("data:", anchor)
    start = html.find("{", start)
    depth, in_string, escaped = 0, False, False
    for i in range(start, len(html)):
        ch = html[i]
        if in_string:
            if escaped:
                escaped = False
            elif ch == "\\":
                escaped = True
            elif ch == '"':
                in_string = False
        else:
            if ch == '"':
                in_string = True
            elif ch == "{":
                depth += 1
            elif ch == "}":
                depth -= 1
                if depth == 0:
                    return json.loads(html[start : i + 1])
    raise SystemExit("unterminated data object on the DERLA map page")


def usable(feature: dict) -> bool:
    coords = (feature.get("geometry") or {}).get("coordinates") or [None, None]
    try:
        lon, lat = float(coords[0]), float(coords[1])
    except (TypeError, ValueError):
        return False
    return LON_MIN <= lon <= LON_MAX and LAT_MIN <= lat <= LAT_MAX


def terror(feature: dict) -> bool:
    return str(feature["properties"].get("layer", "")).startswith("Orte des Terrors")


# ---------------------------------------------------------------- projection


def albers(lon: float, lat: float) -> tuple[float, float]:
    phi1, phi2 = math.radians(PHI1), math.radians(PHI2)
    phi0, lam0 = math.radians(PHI0), math.radians(LAM0)
    n = (math.sin(phi1) + math.sin(phi2)) / 2
    c = math.cos(phi1) ** 2 + 2 * n * math.sin(phi1)
    rho0 = math.sqrt(c - 2 * n * math.sin(phi0)) / n
    phi = math.radians(lat)
    rho = math.sqrt(c - 2 * n * math.sin(phi)) / n
    theta = n * (math.radians(lon) - lam0)
    return rho * math.sin(theta), rho0 - rho * math.cos(theta)


def simplify(points: list[tuple[float, float]], epsilon: float) -> list[tuple[float, float]]:
    """Douglas-Peucker, iterative so a long coastline cannot blow the stack."""
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
    return [p for p, k in zip(points, keep) if k]


def austria_rings(geojson: dict) -> list[list[tuple[float, float]]]:
    country = next(
        f for f in geojson["features"] if f["properties"].get("ADMIN") == "Austria"
    )
    geometry = country["geometry"]
    polygons = (
        [geometry["coordinates"]]
        if geometry["type"] == "Polygon"
        else geometry["coordinates"]
    )
    rings = []
    for polygon in polygons:
        for ring in polygon:
            points = [albers(lon, lat) for lon, lat in ring]
            if len(points) > 1 and points[0] == points[-1]:
                points = points[:-1]
            rings.append(points)
    return rings


# ---------------------------------------------------------------- rendering


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--map-html", type=Path, help="saved DERLA map page")
    parser.add_argument("--natural-earth", type=Path, help="saved NE 1:50m countries")
    parser.add_argument("--out", type=Path, default=Path("tools/storymap/austria-map.svg"))
    parser.add_argument("--splice", type=Path, help="replace the map block in this HTML file")
    args = parser.parse_args()

    html = (
        args.map_html.read_text(encoding="utf-8")
        if args.map_html
        else fetch(MAP_URL)
    )
    collection = embedded_feature_collection(html)
    raw = collection["features"]
    features = [f for f in raw if usable(f)]

    ne = json.loads(
        args.natural_earth.read_text(encoding="utf-8")
        if args.natural_earth
        else fetch(NE_URL)
    )
    rings = austria_rings(ne)

    xs = [p[0] for ring in rings for p in ring]
    ys = [p[1] for ring in rings for p in ring]
    min_x, max_x, min_y, max_y = min(xs), max(xs), min(ys), max(ys)
    scale = min((VIEW_W - 2 * PAD) / (max_x - min_x), (VIEW_H - 2 * PAD) / (max_y - min_y))
    off_x = PAD + (VIEW_W - 2 * PAD - (max_x - min_x) * scale) / 2
    off_y = PAD + (VIEW_H - 2 * PAD - (max_y - min_y) * scale) / 2

    def screen(x: float, y: float) -> tuple[float, float]:
        """Projected Albers coordinates to viewBox coordinates."""
        return off_x + (x - min_x) * scale, off_y + (max_y - y) * scale

    def px(lon: float, lat: float) -> tuple[float, float]:
        return screen(*albers(lon, lat))

    # 0.5px tolerance on screen: the outline stays legible and costs ~3KB.
    # `rings` are already projected, so they must not go through `px` again.
    outline_d = []
    for ring in rings:
        simplified = simplify(ring, 0.5 / scale)
        if len(simplified) < 3:
            simplified = ring
        points = " ".join(f"{x:.1f},{y:.1f}" for x, y in (screen(*p) for p in simplified))
        outline_d.append("M" + points + "Z")

    def dots(selected: list[dict], width: float) -> str:
        """Zero-length subpaths: round caps make dots, square caps make squares."""
        return "".join(
            f"M{round(x)},{round(y)}h0"
            for x, y in (px(f["geometry"]["coordinates"][0], f["geometry"]["coordinates"][1]) for f in selected)
        )

    terror_features = [f for f in features if terror(f)]
    marker_features = [f for f in features if not terror(f)]

    svg = f"""      <svg class="map__svg" viewBox="0 0 {VIEW_W} {VIEW_H}" role="img" aria-labelledby="map-title map-desc" preserveAspectRatio="xMidYMid meet">
        <title id="map-title">Documented places of remembrance in Austria</title>
        <desc id="map-desc">{len(features):,} points, one per DERLA record: {len(marker_features):,} memorial markers and {len(terror_features):,} sites of terror. The distribution is densest in Vienna and along the eastern edge, and sparse in the western Alps. Exact positions are approximate at this scale.</desc>
        <path class="map__outline" d="{' '.join(outline_d)}"/>
        <path class="map__dots" d="{dots(marker_features, 1.5)}"/>
        <path class="map__terror" d="{dots(terror_features, 2.6)}"/>
      </svg>"""

    args.out.parent.mkdir(parents=True, exist_ok=True)
    args.out.write_text(svg + "\n", encoding="utf-8")

    # Facts used in the prose. Printed so the text can be checked against data.
    dated = []
    for feature in features:
        match = re.search(r"(1[89]\d\d|20\d\d)", str(feature["properties"].get("date", "")))
        if match:
            dated.append(int(match.group(1)))
    decades: dict[int, int] = {}
    for year in dated:
        decades[(year // 10) * 10] = decades.get((year // 10) * 10, 0) + 1
    print(f"features extracted   {len(raw)}")
    print(f"usable               {len(features)}")
    print(f"terror               {len(terror_features)}")
    print(f"markers              {len(marker_features)}")
    print(f"dated                {len(dated)}")
    print(f"decades              {sorted(decades.items())}")
    print(f"svg bytes            {len(svg)}")
    print(f"wrote                {args.out}")

    if args.splice:
        page = args.splice.read_text(encoding="utf-8")
        pattern = re.compile(
            r"(<!-- map:begin -->\n)(.*?)(\n\s*<!-- map:end -->)", re.DOTALL
        )
        if not pattern.search(page):
            raise SystemExit(f"no map:begin / map:end markers in {args.splice}")
        page = pattern.sub(lambda m: m.group(1) + svg + m.group(3), page)
        args.splice.write_text(page, encoding="utf-8")
        print(f"spliced into         {args.splice}")


if __name__ == "__main__":
    sys.exit(main())
