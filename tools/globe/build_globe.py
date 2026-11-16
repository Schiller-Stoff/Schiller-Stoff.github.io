#!/usr/bin/env python3
"""Build the DERLA globe data file from the public DERLA map extract.

Offline generator, run by hand; its output is committed as
`data/globe/derla-globe.js`, a single self-contained script that assigns
`window.DERLA_GLOBE`.  Nothing here runs at page load and the page needs no
fetch, no tiles and no third-party request.

    python3 tools/globe/build_globe.py \
        --derla /tmp/opencode/derla-clean.geojson \
        --natural-earth /tmp/opencode/ne0.geojson \
        --admin1 /tmp/opencode/ne10-admin1.geojson

Inputs
  - DERLA's cleaned map extract (4,393 Point features).  `--map-html` can
    extract the same records from a saved copy of DERLA's map page instead;
    that path filters the six malformed coordinate pairs on the live page and
    reports them.  The cleaned extract is already the result of that filter.
  - Natural Earth 1:50m admin-0 countries (public domain) for the world.
  - Natural Earth 1:10m admin-1 states/provinces (public domain) for the nine
    Austrian states.  The full-resolution polygons are also used for the
    point-in-state assignment; only the emitted outlines are simplified.

Output
  - `data/globe/derla-globe.js`
  - one JSON object, compact separators, deterministic key order.  Geometry is
    stored as flat [lon, lat, ...] rings (no repeated closing vertex), outer
    rings counter-clockwise, holes clockwise, so a renderer can fill with the
    nonzero rule and stroke the same rings.
  - `data/globe/globe-fallback.svg` — 720 x 380 orthographic fallback at the
    Austria pose, with the nine state paths, one national outline, and the
    deduplicated dot/square field.  Classes only; the host stylesheet owns
    colour and weight.
  - `data/globe/globe-locator.svg` — a 96 x 96 orthographic locator: limb,
    visible world land and Austria highlighted.  Classes only, no script.
  - `data/globe/state-rows.html` — the nine static `tr.globe-states__row`
    rows in AT-1..AT-9 order, for the no-JS state table.

The three static artefacts are regenerated on every build and compared byte
for byte by `--check`, so neither language tree can drift from the data.

Why this shape: 4,393 titles and addresses dominate the payload.  Parallel
arrays plus string tables for the repeated layer/type/date/access values keep
the file at roughly half a megabyte raw instead of one verbose object per
record; the renderer walks the arrays by index.  Detail URLs are stored as the
DERLA pid and rebuilt from `meta.detailTemplate`, which saves ~150 KB and keeps
the 377 overlap placeholders (no pid) honest with `null`.
"""

from __future__ import annotations

import argparse
import gzip
import json
import math
import re
import sys
import urllib.request
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
CACHE = Path("/tmp/opencode")

DERLA_MAP_URL = (
    "https://gams.uni-graz.at/context:derlageo/sdef:Context/get"
    "?locale=de&mode=map"
)
NE50_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/"
    "geojson/ne_50m_admin_0_countries.geojson"
)
NE10_URL = (
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/"
    "geojson/ne_10m_admin_1_states_provinces.geojson"
)
DERLA_BASE = "https://gams.uni-graz.at"
DETAIL_TEMPLATE = DERLA_BASE + "/archive/objects/{pid}/methods/sdef:TEI/get"

EXTRACTION_DATE = "2026-11-13"
BUILD_DATE = "2026-11-16"

# Austria's extent, generously padded, exactly as the storymap uses it.  The
# six malformed records on DERLA's map page (latitudes such as 47805794.0 and
# one point at lon = lat = 48.149028) fall outside this box.
LON_MIN, LON_MAX = 9.4, 17.2
LAT_MIN, LAT_MAX = 46.3, 49.1

# The nine states in DERLA's data are all inside this box; the four records
# that are genuinely abroad (three in Switzerland, one in Germany) are still
# inside it and must be kept with state = null.
FOREIGN_COUNTRY = re.compile(
    r"\b(Schweiz|Deutschland|Liechtenstein|Italien|Slowenien|Slowakei|"
    r"Tschechien|Ungarn)\b",
    re.IGNORECASE,
)
YEAR = re.compile(r"^(1[89]\d\d|20\d\d)$")

# Simplification is in degrees (lon/lat).  At a 900px globe 1° is ~2.5px, so
# 0.9° is ~2.2px: enough for a small world layer, while the box around Austria
# and its neighbours gets 0.2° (~0.5px).  Antarctica is a single empty shape
# and gets 2°.  States use 0.004° (~0.4km, ~0.3px at 600px).
WORLD_COARSE = 1.3
WORLD_FINE = 0.35
WORLD_ANTARCTICA = 2.0
EUROPE_BOX = (5.0, 25.0, 42.0, 55.0)
WORLD_MIN_RING_AREA = 0.03  # deg²; smaller islands are omitted outside Europe
WORLD_DECIMALS = 2
STATE_TOLERANCE = 0.006
STATE_DECIMALS = 3
POINT_DECIMALS = 4
PID_PREFIX = "o:derla."
NEAREST_KM = 5.0

REQUIRED_COUNTRIES = (
    "Austria",
    "Germany",
    "Czechia",
    "Slovakia",
    "Hungary",
    "Slovenia",
    "Italy",
    "Switzerland",
    "Liechtenstein",
)

MAX_RAW_BYTES = 600_000
MAX_GZIP_BYTES = 160_000
MAX_WORLD_BYTES = 40_000
MAX_STATES_BYTES = 15_000

# Static artefacts.  Both SVGs are inline-ready: no script, no <style>, no
# inline fill/stroke, and title/desc are the only ids, so the host stylesheet
# owns every colour and weight.  The fallback fits the national outline to the
# 720 x 380 box with 8% padding on the limiting axis; the locator puts the same
# pose in a 96 x 96 disc with a 46-unit limb.
FALLBACK_WIDTH, FALLBACK_HEIGHT = 720, 380
FALLBACK_PADDING = 0.08
FALLBACK_SIMPLIFY = 0.4  # screen px, state and outline rings
FALLBACK_DECIMALS = 1
LOCATOR_SIZE = 96
LOCATOR_RADIUS = 46
LOCATOR_SIMPLIFY = 1.0  # screen px, world land
LOCATOR_AUSTRIA_SIMPLIFY = 0.3
OUTLINE_DECIMALS = 6  # raw state borders share vertices exactly at this grid
MAX_FALLBACK_BYTES = 55_000
MAX_LOCATOR_BYTES = 6_144


# ---------------------------------------------------------------- input


def fetch(url: str) -> str:
    request = urllib.request.Request(url, headers={"User-Agent": "derla-globe/1.0"})
    with urllib.request.urlopen(request, timeout=180) as response:
        return response.read().decode("utf-8")


def read_json(path: Path, label: str, url: str, allow_fetch: bool) -> dict:
    if path.exists():
        try:
            return json.loads(path.read_text(encoding="utf-8"))
        except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
            raise SystemExit(f"{label}: cannot read {path}: {error}") from error
    if allow_fetch:
        print(f"fetching {label} from {url}")
        try:
            return json.loads(fetch(url))
        except (OSError, UnicodeDecodeError, json.JSONDecodeError) as error:
            raise SystemExit(f"{label}: cannot fetch {url}: {error}") from error
    raise SystemExit(
        f"{label}: missing {path}\n"
        f"  save a copy there, pass another path, or use --fetch (official URL: {url})"
    )


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


def in_austria_box(lon: float, lat: float) -> bool:
    return LON_MIN <= lon <= LON_MAX and LAT_MIN <= lat <= LAT_MAX


def extract_derla_html(html: str) -> tuple[list[dict], dict]:
    """Extract, filter malformed coordinates, and never drop a usable record."""
    collection = embedded_feature_collection(html)
    features = collection.get("features")
    if not isinstance(features, list):
        raise SystemExit("DERLA map page: data object has no features array")

    kept: list[dict] = []
    dropped: list[dict] = []
    for feature in features:
        coords = (feature.get("geometry") or {}).get("coordinates") or [None, None]
        try:
            lon, lat = float(coords[0]), float(coords[1])
            finite = math.isfinite(lon) and math.isfinite(lat)
        except (TypeError, ValueError, IndexError):
            finite = False
            lon = lat = None
        if finite and in_austria_box(lon, lat):
            kept.append(feature)
        else:
            props = feature.get("properties") or {}
            dropped.append(
                {
                    "pid": props.get("pid"),
                    "title": props.get("title"),
                    "address": props.get("address"),
                    "coordinates": coords,
                }
            )
    return kept, {"raw": len(features), "kept": len(kept), "dropped": dropped}


def extract_derla(map_html: Path) -> tuple[list[dict], dict]:
    try:
        html = map_html.read_text(encoding="utf-8")
    except OSError as error:
        raise SystemExit(f"--map-html: cannot read {map_html}: {error}") from error
    return extract_derla_html(html)


def print_dropped(stats: dict) -> None:
    print(f"DERLA page records   {stats['raw']}")
    print(f"malformed dropped    {len(stats['dropped'])}")
    for row in stats["dropped"]:
        print(
            "  dropped            "
            f"{row['coordinates']} | {row['title']} | {row['address']}"
        )


def load_derla(args) -> tuple[list[dict], dict]:
    if args.map_html:
        features, stats = extract_derla(args.map_html)
        print_dropped(stats)
        if not features:
            raise SystemExit("--map-html: no usable records")
        return features, stats

    if not args.derla.exists():
        if args.fetch:
            print(f"fetching DERLA map page from {DERLA_MAP_URL}")
            try:
                features, stats = extract_derla_html(fetch(DERLA_MAP_URL))
            except OSError as error:
                raise SystemExit(f"DERLA: cannot fetch {DERLA_MAP_URL}: {error}") from error
            print_dropped(stats)
            if not features:
                raise SystemExit("DERLA: the official map page yielded no usable records")
            return features, stats
        raise SystemExit(
            f"DERLA: missing {args.derla}\n"
            f"  save a copy there, pass another path, use --map-html, or use "
            f"--fetch (official URL: {DERLA_MAP_URL})"
        )

    collection = read_json(args.derla, "DERLA", DERLA_MAP_URL, False)
    if collection.get("type") != "FeatureCollection":
        raise SystemExit(f"DERLA: {args.derla} is not a FeatureCollection")
    features = collection.get("features")
    if not isinstance(features, list) or not features:
        raise SystemExit(f"DERLA: {args.derla} has no features")

    # The committed extract is the already-filtered one.  Do not silently drop
    # anything: a coordinate outside the padded Austrian extent is a data
    # problem the operator must see.
    outside = []
    for feature in features:
        geometry = feature.get("geometry") or {}
        coords = geometry.get("coordinates") or [None, None]
        try:
            lon, lat = float(coords[0]), float(coords[1])
        except (TypeError, ValueError, IndexError):
            outside.append((feature, coords, "not a numeric Point"))
            continue
        if geometry.get("type") != "Point":
            outside.append((feature, coords, "not a Point"))
        elif not (math.isfinite(lon) and math.isfinite(lat)):
            outside.append((feature, coords, "non-finite coordinate"))
        elif not in_austria_box(lon, lat):
            outside.append((feature, coords, "outside the Austrian padded extent"))
    if outside:
        details = "\n".join(
            f"  {coords} | {(feature.get('properties') or {}).get('pid')} | {why}"
            for feature, coords, why in outside[:20]
        )
        raise SystemExit(
            f"DERLA: {len(outside)} record(s) failed validation; nothing written.\n"
            f"{details}\n"
            "  Use --map-html to extract the live map page (which reports and "
            "drops malformed coordinates), or fix the extract first."
        )
    return features, {"raw": len(features), "kept": len(features), "dropped": []}


# ---------------------------------------------------------------- geometry


def open_ring(ring: list) -> list[tuple[float, float]]:
    points = [(float(pair[0]), float(pair[1])) for pair in ring]
    if len(points) > 1 and points[0] == points[-1]:
        points = points[:-1]
    return points


def simplify(
    points: list[tuple[float, float]], epsilon: float
) -> list[tuple[float, float]]:
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
    return [point for point, kept in zip(points, keep) if kept]


def signed_area(points: list[tuple[float, float]]) -> float:
    return sum(
        points[i][0] * points[(i + 1) % len(points)][1]
        - points[(i + 1) % len(points)][0] * points[i][1]
        for i in range(len(points))
    ) / 2.0


def bbox(points: list[tuple[float, float]]) -> tuple[float, float, float, float]:
    xs = [point[0] for point in points]
    ys = [point[1] for point in points]
    return min(xs), min(ys), max(xs), max(ys)


def intersects(points: list[tuple[float, float]], box: tuple[float, ...]) -> bool:
    min_x, min_y, max_x, max_y = bbox(points)
    return not (
        max_x < box[0] or min_x > box[2] or max_y < box[1] or min_y > box[3]
    )


def quantize_ring(
    points: list[tuple[float, float]], decimals: int
) -> list[tuple[float, float]] | None:
    """Round, drop consecutive duplicates, keep the ring open, reject slivers."""
    result: list[tuple[float, float]] = []
    for x, y in points:
        qx, qy = round(x, decimals), round(y, decimals)
        if qx == 0:
            qx = 0.0
        if qy == 0:
            qy = 0.0
        point = (qx, qy)
        if result and result[-1] == point:
            continue
        result.append(point)
    if len(result) > 1 and result[0] == result[-1]:
        result.pop()
    if len(result) < 3 or abs(signed_area(result)) < 1e-12:
        return None
    return result


def orient(ring: list[tuple[float, float]], outer: bool) -> list[tuple[float, float]]:
    """RFC 7946-style: outer rings CCW, holes CW (nonzero fill)."""
    area = signed_area(ring)
    if (outer and area < 0) or (not outer and area > 0):
        return list(reversed(ring))
    return ring


def flat_ring(ring: list[tuple[float, float]]) -> list[float]:
    out: list[float] = []
    for x, y in ring:
        out.extend((x, y))
    return out


def polygons_of(geometry: dict) -> list[list[list]]:
    if geometry.get("type") == "Polygon":
        return [geometry["coordinates"]]
    if geometry.get("type") == "MultiPolygon":
        return geometry["coordinates"]
    return []


# ---------------------------------------------------------------- states


def point_in_ring(x: float, y: float, ring: list[list[float]]) -> bool:
    """Ray casting; the caller subtracts holes."""
    inside = False
    j = len(ring) - 1
    for i in range(len(ring)):
        xi, yi = ring[i][0], ring[i][1]
        xj, yj = ring[j][0], ring[j][1]
        if ((yi > y) != (yj > y)) and (
            x < (xj - xi) * (y - yi) / ((yj - yi) or 1e-12) + xi
        ):
            inside = not inside
        j = i
    return inside


def point_in_geometry(x: float, y: float, geometry: dict) -> bool:
    for polygon in polygons_of(geometry):
        if not polygon:
            continue
        if point_in_ring(x, y, polygon[0]) and not any(
            point_in_ring(x, y, hole) for hole in polygon[1:]
        ):
            return True
    return False


def segment_km(
    x: float, y: float, ax: float, ay: float, bx: float, by: float
) -> float:
    """Point-to-segment distance in km, local equirectangular at the point."""
    scale = math.cos(math.radians(y))
    px, py = (x - ax) * scale, y - ay
    dx, dy = (bx - ax) * scale, by - ay
    length = dx * dx + dy * dy
    t = 0.0 if length == 0 else max(0.0, min(1.0, (px * dx + py * dy) / length))
    return math.hypot(px - t * dx, py - t * dy) * 111.32


def distance_to_geometry_km(x: float, y: float, geometry: dict) -> float:
    best = math.inf
    for polygon in polygons_of(geometry):
        for ring in polygon:
            for i in range(len(ring) - 1):
                best = min(
                    best,
                    segment_km(
                        x, y, ring[i][0], ring[i][1], ring[i + 1][0], ring[i + 1][1]
                    ),
                )
    return best


def state_centroid(ring: list[tuple[float, float]]) -> tuple[float, float]:
    """Area-weighted centroid of an open outer ring, longitude scaled by cos φ."""
    mean_lat = sum(point[1] for point in ring) / len(ring)
    scale = math.cos(math.radians(mean_lat))
    area = cx = cy = 0.0
    for i in range(len(ring)):
        x1, y1 = ring[i][0] * scale, ring[i][1]
        x2, y2 = ring[(i + 1) % len(ring)][0] * scale, ring[(i + 1) % len(ring)][1]
        cross = x1 * y2 - x2 * y1
        area += cross
        cx += (x1 + x2) * cross
        cy += (y1 + y2) * cross
    area /= 2.0
    if abs(area) < 1e-12:
        return (
            sum(point[0] for point in ring) / len(ring),
            sum(point[1] for point in ring) / len(ring),
        )
    return cx / (6.0 * area) / scale, cy / (6.0 * area)


def load_states(admin1: dict) -> list[dict]:
    features = [
        feature
        for feature in admin1.get("features", [])
        if (feature.get("properties") or {}).get("adm0_a3") == "AUT"
    ]
    if len(features) != 9:
        raise SystemExit(
            f"admin-1: expected Austria's 9 states, found {len(features)}; "
            "check the Natural Earth 1:10m file"
        )
    states = []
    for feature in features:
        props = feature["properties"]
        code = props.get("iso_3166_2")
        if not code:
            raise SystemExit(f"admin-1: state without iso_3166_2: {props.get('name')}")
        states.append(
            {
                "id": code,
                "name": props.get("name_de") or props.get("name"),
                "nameEn": props.get("name_en") or props.get("name"),
                "geometry": feature["geometry"],
                "label": (props.get("longitude"), props.get("latitude")),
            }
        )
    states.sort(key=lambda state: state["id"])
    return states


def build_state_outlines(states: list[dict]) -> dict:
    built = []
    source_points = output_points = ring_count = 0
    for state in states:
        polygons = []
        largest = None
        largest_area = -1.0
        for polygon in polygons_of(state["geometry"]):
            if not polygon:
                continue
            outer_raw = open_ring(polygon[0])
            source_points += len(outer_raw)
            outer = quantize_ring(simplify(outer_raw, STATE_TOLERANCE), STATE_DECIMALS)
            if outer is None:
                raise SystemExit(f"states: {state['id']} outer ring collapsed")
            outer = orient(outer, outer=True)
            rings = [flat_ring(outer)]
            for hole_raw in polygon[1:]:
                hole_points = open_ring(hole_raw)
                source_points += len(hole_points)
                hole = quantize_ring(
                    simplify(hole_points, STATE_TOLERANCE), STATE_DECIMALS
                )
                if hole is not None:
                    rings.append(flat_ring(orient(hole, outer=False)))
            polygons.append(rings)
            area = abs(signed_area(outer))
            if area > largest_area:
                largest_area = area
                largest = [flat_ring(outer)] + rings[1:]
        if not polygons:
            raise SystemExit(f"states: {state['id']} has no usable polygon")
        centroid_ring = [
            (largest[0][i], largest[0][i + 1]) for i in range(0, len(largest[0]), 2)
        ]
        centroid = state_centroid(centroid_ring)
        centroid = [round(centroid[0], 4), round(centroid[1], 4)]
        # The centroid must be inside the state; otherwise the label would sit
        # in a neighbour.  Every NE 1:10m state passes, but keep the guard.
        if not point_in_geometry(centroid[0], centroid[1], state["geometry"]):
            label = state["label"]
            if label and label[0] is not None and point_in_geometry(
                float(label[0]), float(label[1]), state["geometry"]
            ):
                centroid = [round(float(label[0]), 4), round(float(label[1]), 4)]
            else:
                raise SystemExit(f"states: no label point inside {state['id']}")
        output_points += sum(len(ring) // 2 for rings in polygons for ring in rings)
        ring_count += sum(len(rings) for rings in polygons)
        built.append(
            {
                "id": state["id"],
                "name": state["name"],
                "nameEn": state["nameEn"],
                "centroid": centroid,
                "polys": polygons,
            }
        )
    return {
        "states": built,
        "sourcePoints": source_points,
        "outputPoints": output_points,
        "rings": ring_count,
    }


# ---------------------------------------------------------------- world


def build_world(ne0: dict) -> dict:
    def emergency_ring(polygons: list[list[list]]) -> list[float] | None:
        """Keep a shape for a small country the coarse tolerance collapses.

        Tries progressively finer tolerances on the largest raw ring, first at
        the world's 2-decimal grid, then at 3 decimals for sub-0.01° states.
        Returns None only when even 3 decimals cannot make a triangle.
        """
        raws = []
        for polygon in polygons:
            if not polygon:
                continue
            ring = open_ring(polygon[0])
            if len(ring) >= 3:
                raws.append(ring)
        if not raws:
            return None
        raw = max(raws, key=lambda ring: abs(signed_area(ring)))
        for decimals in (WORLD_DECIMALS, 3):
            for tolerance in (
                WORLD_COARSE,
                0.6,
                0.4,
                0.2,
                0.1,
                0.05,
                0.02,
                0.01,
                0.005,
                0.0,
            ):
                ring = quantize_ring(simplify(raw, tolerance), decimals)
                if ring is not None:
                    return flat_ring(orient(ring, outer=True))
        return None

    countries = []
    for feature in ne0.get("features", []):
        props = feature.get("properties") or {}
        name = (props.get("ADMIN") or props.get("NAME") or "").strip()
        if not name:
            continue
        code = (props.get("ISO_A3") or props.get("ADM0_A3") or "").strip()
        if not code or code == "-99":
            code = (props.get("ADM0_A3") or "").strip()
        countries.append((name, code, polygons_of(feature.get("geometry") or {})))
    countries.sort(key=lambda row: (row[0].casefold(), row[1]))

    names = [row[0] for row in countries]
    missing = [name for name in REQUIRED_COUNTRIES if name not in names]
    if missing:
        raise SystemExit(f"admin-0: missing countries {missing}; check the 1:50m file")

    out_names, out_codes, out_polys = [], [], []
    source_points = output_points = ring_count = dropped_rings = 0
    for name, code, polygons in countries:
        candidates = []
        for polygon in polygons:
            if not polygon:
                continue
            outer_raw = open_ring(polygon[0])
            source_points += len(outer_raw)
            if len(outer_raw) < 3:
                continue
            europe = intersects(outer_raw, EUROPE_BOX)
            if name == "Antarctica":
                tolerance = WORLD_ANTARCTICA
            elif europe:
                tolerance = WORLD_FINE
            else:
                tolerance = WORLD_COARSE
            outer = quantize_ring(simplify(outer_raw, tolerance), WORLD_DECIMALS)
            if outer is None:
                dropped_rings += 1
                continue
            rings = [flat_ring(orient(outer, outer=True))]
            for hole_raw in polygon[1:]:
                hole_points = open_ring(hole_raw)
                source_points += len(hole_points)
                hole = quantize_ring(
                    simplify(hole_points, tolerance), WORLD_DECIMALS
                )
                if hole is not None:
                    rings.append(flat_ring(orient(hole, outer=False)))
                else:
                    dropped_rings += 1
            candidates.append((abs(signed_area(outer)), europe, rings))

        if not candidates:
            # A tiny island state: keep its largest ring even below the area
            # threshold, so every country still has a shape.
            ring = emergency_ring(polygons)
            if ring is not None:
                candidates.append((1.0, False, [ring]))
            if not candidates:
                out_names.append(name)
                out_codes.append(code)
                out_polys.append([])
                continue

        kept = [
            row
            for row in candidates
            if row[1] or row[0] >= WORLD_MIN_RING_AREA or name == "Antarctica"
        ]
        if not kept:
            kept = [max(candidates, key=lambda row: row[0])]
        else:
            dropped_rings += len(candidates) - len(kept)
        polygons_out = [row[2] for row in kept]
        out_names.append(name)
        out_codes.append(code)
        out_polys.append(polygons_out)
        output_points += sum(len(ring) // 2 for rings in polygons_out for ring in rings)
        ring_count += sum(len(rings) for rings in polygons_out)

    return {
        "names": out_names,
        "codes": out_codes,
        "polys": out_polys,
        "sourcePoints": source_points,
        "outputPoints": output_points,
        "rings": ring_count,
        "droppedRings": dropped_rings,
        "countries": len(out_names),
    }


# ---------------------------------------------------------------- static artefacts


def orthographic(lon0: float, lat0: float):
    """Return a unit-disc orthographic projection, north-up."""
    phi0 = math.radians(lat0)
    lam0 = math.radians(lon0)

    def project(lon: float, lat: float) -> tuple[float, float, float]:
        phi = math.radians(lat)
        lam = math.radians(lon) - lam0
        cos_c = (
            math.sin(phi0) * math.sin(phi)
            + math.cos(phi0) * math.cos(phi) * math.cos(lam)
        )
        x = math.cos(phi) * math.sin(lam)
        y = (
            math.cos(phi0) * math.sin(phi)
            - math.sin(phi0) * math.cos(phi) * math.cos(lam)
        )
        return x, y, cos_c

    return project


def national_outline(states: list[dict]) -> list[list[tuple[float, float]]]:
    """Trace Austria's national border from the state rings.

    Shared state borders are stored as the same two vertices in both states.
    Quantizing to 1e-6 and dropping every edge seen twice leaves only the
    national ring, so the fallback gets one clean border without a second,
    hand-maintained outline.
    """
    edges: dict[tuple, int] = {}
    for state in states:
        for polygon in polygons_of(state["geometry"]):
            for ring in polygon:
                points = [
                    (round(x, OUTLINE_DECIMALS), round(y, OUTLINE_DECIMALS))
                    for x, y in open_ring(ring)
                ]
                for index, start in enumerate(points):
                    end = points[(index + 1) % len(points)]
                    edge = tuple(sorted((start, end)))
                    edges[edge] = edges.get(edge, 0) + 1

    remaining = [edge for edge, count in edges.items() if count == 1]
    adjacency: dict[tuple[float, float], list[tuple[float, float]]] = {}
    for start, end in remaining:
        adjacency.setdefault(start, []).append(end)
        adjacency.setdefault(end, []).append(start)
    for point in adjacency:
        adjacency[point].sort()

    unbalanced = {
        point: len(neighbours)
        for point, neighbours in adjacency.items()
        if len(neighbours) != 2
    }
    if unbalanced:
        raise SystemExit(
            "outline: shared state borders did not cancel cleanly "
            f"({len(unbalanced)} vertices with degree != 2); check the "
            "admin-1 source"
        )

    used: set[tuple] = set()
    rings: list[list[tuple[float, float]]] = []
    for start in sorted(adjacency):
        for neighbour in adjacency[start]:
            first = tuple(sorted((start, neighbour)))
            if first in used:
                continue
            ring = [start]
            previous, current = start, neighbour
            used.add(first)
            while current != start:
                ring.append(current)
                options = [
                    point for point in adjacency[current] if point != previous
                ]
                if not options:
                    raise SystemExit("outline: open ring while tracing borders")
                next_point = options[0]
                used.add(tuple(sorted((current, next_point))))
                previous, current = current, next_point
                if len(ring) > len(adjacency) + 1:
                    raise SystemExit("outline: ring trace did not close")
            rings.append(ring)

    if len(used) != len(remaining):
        raise SystemExit(
            f"outline: traced {len(used)} of {len(remaining)} border edges"
        )
    rings.sort(key=lambda ring: abs(signed_area(ring)), reverse=True)
    return rings


def fallback_screen(outline: list[list[tuple[float, float]]]):
    """Fit the national outline into the fallback viewBox, 8% on each axis."""
    project = orthographic(14.15, 47.65)
    projected = [
        project(lon, lat)[:2] for ring in outline for lon, lat in ring
    ]
    min_x, min_y, max_x, max_y = bbox(projected)
    span_x, span_y = max_x - min_x, max_y - min_y
    if span_x <= 0 or span_y <= 0:
        raise SystemExit("fallback: national outline has no extent")
    scale = min(
        FALLBACK_WIDTH * (1 - 2 * FALLBACK_PADDING) / span_x,
        FALLBACK_HEIGHT * (1 - 2 * FALLBACK_PADDING) / span_y,
    )
    offset_x = FALLBACK_WIDTH / 2 - scale * (min_x + max_x) / 2
    offset_y = FALLBACK_HEIGHT / 2 + scale * (min_y + max_y) / 2

    def screen(lon: float, lat: float) -> tuple[float, float]:
        x, y, _ = project(lon, lat)
        return offset_x + scale * x, offset_y - scale * y

    return screen, scale, (min_x, min_y, max_x, max_y)


def svg_ring(
    points: list[tuple[float, float]], simplify_px: float, decimals: int
) -> str | None:
    """Projected ring -> one closed SVG subpath, or None when it collapses."""
    points = simplify(points, simplify_px)
    out: list[tuple[float, float]] = []
    for x, y in points:
        qx, qy = round(x, decimals), round(y, decimals)
        if qx == 0:
            qx = 0.0
        if qy == 0:
            qy = 0.0
        point = (qx, qy)
        if out and out[-1] == point:
            continue
        out.append(point)
    if len(out) > 1 and out[0] == out[-1]:
        out.pop()
    if len(out) < 3 or abs(signed_area(out)) < 1e-9:
        return None
    return "M" + "L".join(f"{x:g},{y:g}" for x, y in out) + "Z"


def fallback_state_paths(globe: dict, screen) -> list[tuple[str, str]]:
    paths = []
    for state in globe["states"]:
        parts = []
        for polygon in state["polys"]:
            for ring in polygon:
                points = [
                    (ring[index], ring[index + 1])
                    for index in range(0, len(ring), 2)
                ]
                path = svg_ring(
                    [screen(lon, lat) for lon, lat in points],
                    FALLBACK_SIMPLIFY,
                    FALLBACK_DECIMALS,
                )
                if path:
                    parts.append(path)
        paths.append((state["id"], "".join(parts)))
    return paths


def fallback_marks(
    globe: dict, screen
) -> tuple[list[tuple[int, int]], list[tuple[int, int]]]:
    """Deduplicate per rounded screen position and class, in input order."""
    points = globe["points"]
    layers = points["layers"]
    dots: list[tuple[int, int]] = []
    terror: list[tuple[int, int]] = []
    seen: set[tuple[int, int, bool]] = set()
    for index, (lon, lat) in enumerate(zip(points["lon"], points["lat"])):
        x, y = screen(lon, lat)
        mark = (round(x), round(y))
        is_terror = str(layers[points["layer"][index]]).startswith(
            "Orte des Terrors"
        )
        key = (mark[0], mark[1], is_terror)
        if key in seen:
            continue
        seen.add(key)
        (terror if is_terror else dots).append(mark)
    return dots, terror


def build_fallback(globe: dict, outline: list[list[tuple[float, float]]]):
    screen, scale, unit_bbox = fallback_screen(outline)
    state_paths = fallback_state_paths(globe, screen)
    outline_d = "".join(
        path
        for path in (
            svg_ring(
                [screen(lon, lat) for lon, lat in ring],
                FALLBACK_SIMPLIFY,
                FALLBACK_DECIMALS,
            )
            for ring in outline
        )
        if path
    )
    dots, terror = fallback_marks(globe, screen)
    counts = globe["meta"]["counts"]
    title = "DERLA places of remembrance in Austria"
    desc = (
        f"{counts['records']:,} records at "
        f"{counts['distinctCoordinates4dp']:,} positions; "
        f"{counts['sitesOfTerror']:,} sites of terror. Orthographic view "
        "centred on 47.65 N, 14.15 E; positions are approximate geocodes. "
        "DERLA is authoritative."
    )
    lines = [
        '<svg xmlns="http://www.w3.org/2000/svg" class="globe-fallback" '
        'viewBox="0 0 720 380" preserveAspectRatio="xMidYMid meet" '
        'role="img" aria-labelledby="globe-fallback-title '
        'globe-fallback-desc">',
        f'  <title id="globe-fallback-title">{title}</title>',
        f'  <desc id="globe-fallback-desc">{desc}</desc>',
    ]
    for state_id, path in state_paths:
        lines.append(
            f'  <path class="globe-fallback__state" '
            f'data-state="{state_id}" d="{path}"/>'
        )
    lines.append(f'  <path class="globe-fallback__outline" d="{outline_d}"/>')
    lines.append(
        '  <path class="globe-fallback__dots" d="'
        + "".join(f"M{x},{y}h0" for x, y in dots)
        + '"/>'
    )
    lines.append(
        '  <path class="globe-fallback__terror" d="'
        + "".join(f"M{x},{y}h0" for x, y in terror)
        + '"/>'
    )
    lines.append("</svg>")
    text = "\n".join(lines) + "\n"
    screen_points = [screen(lon, lat) for ring in outline for lon, lat in ring]
    screen_bbox = bbox(screen_points)
    state_stats = [
        (
            state_id,
            path.count("M"),
            path.count("M") + path.count("L"),
            len(path.encode("utf-8")),
        )
        for state_id, path in state_paths
    ]
    return text, {
        "records": counts["records"],
        "positions": counts["distinctCoordinates4dp"],
        "sitesOfTerror": counts["sitesOfTerror"],
        "dots": len(dots),
        "terrorMarks": len(terror),
        "statePaths": state_stats,
        "outlinePoints": outline_d.count("M") + outline_d.count("L"),
        "scale": scale,
        "unitBBox": unit_bbox,
        "screenBBox": screen_bbox,
        "bytes": len(text.encode("utf-8")),
        "gzip": len(gzip.compress(text.encode("utf-8"), 9, mtime=0)),
    }


def clip_visible_ring(
    ring: list[tuple[float, float]], project
) -> list[tuple[list[tuple[float, float]], bool]]:
    """Clip a lon/lat ring to the visible hemisphere of an orthographic view."""
    projected = []
    for lon, lat in ring:
        x, y, cos_c = project(lon, lat)
        projected.append((x, y, cos_c))
    if len(projected) < 2:
        return []
    visible = [point[2] >= 0 for point in projected]
    if all(visible):
        return [([(point[0], point[1]) for point in projected], True)]
    if not any(visible):
        return []

    lines: list[tuple[list[tuple[float, float]], bool]] = []
    current: list[tuple[float, float]] = []
    count = len(projected)
    for index in range(count):
        point = projected[index]
        following = projected[(index + 1) % count]
        point_visible = point[2] >= 0
        following_visible = following[2] >= 0
        if point_visible and following_visible:
            if not current:
                current = [(point[0], point[1])]
            current.append((following[0], following[1]))
        elif point_visible and not following_visible:
            if not current:
                current = [(point[0], point[1])]
            t = point[2] / (point[2] - following[2])
            x = point[0] + t * (following[0] - point[0])
            y = point[1] + t * (following[1] - point[1])
            length = math.hypot(x, y)
            if length > 0:
                x, y = x / length, y / length
            current.append((x, y))
            lines.append((current, False))
            current = []
        elif not point_visible and following_visible:
            t = point[2] / (point[2] - following[2])
            x = point[0] + t * (following[0] - point[0])
            y = point[1] + t * (following[1] - point[1])
            length = math.hypot(x, y)
            if length > 0:
                x, y = x / length, y / length
            current = [(x, y), (following[0], following[1])]
    if current:
        lines.append((current, False))
    return lines


def build_locator(globe: dict, outline: list[list[tuple[float, float]]]):
    project = orthographic(14.15, 47.65)
    centre = LOCATOR_SIZE / 2

    def screen(x: float, y: float) -> tuple[float, float]:
        return centre + LOCATOR_RADIUS * x, centre - LOCATOR_RADIUS * y

    segments: list[tuple[list[tuple[int, int]], bool]] = []
    visible_points = 0
    for country in globe["world"]["polys"]:
        for polygon in country:
            if not polygon:
                continue
            ring = polygon[0]
            points = [
                (ring[index], ring[index + 1])
                for index in range(0, len(ring), 2)
            ]
            for line, closed in clip_visible_ring(points, project):
                visible_points += len(line)
                screen_points = [screen(x, y) for x, y in line]
                screen_points = simplify(screen_points, LOCATOR_SIMPLIFY)
                out: list[tuple[int, int]] = []
                for x, y in screen_points:
                    qx, qy = round(x), round(y)
                    if out and out[-1] == (qx, qy):
                        continue
                    out.append((qx, qy))
                if len(out) > 1 and out[0] == out[-1]:
                    out.pop()
                if len(out) < 2:
                    continue
                segments.append((out, closed and len(out) >= 3))

    land_d = "".join(
        "M"
        + "L".join(f"{x},{y}" for x, y in points)
        + ("Z" if closed and len(points) >= 3 else "")
        for points, closed in segments
    )

    austria_parts = []
    for ring in outline:
        screen_points = []
        for lon, lat in ring:
            x, y, _ = project(lon, lat)
            screen_points.append(screen(x, y))
        screen_points = simplify(screen_points, LOCATOR_AUSTRIA_SIMPLIFY)
        out: list[tuple[float, float]] = []
        for x, y in screen_points:
            qx, qy = round(x, 1), round(y, 1)
            if qx == 0:
                qx = 0.0
            if qy == 0:
                qy = 0.0
            if out and out[-1] == (qx, qy):
                continue
            out.append((qx, qy))
        if len(out) > 1 and out[0] == out[-1]:
            out.pop()
        if len(out) >= 3:
            austria_parts.append(
                "M" + "L".join(f"{x:g},{y:g}" for x, y in out) + "Z"
            )
    austria_d = "".join(austria_parts)

    title = "Locator globe"
    desc = (
        "Orthographic view centred on Austria at 47.65 N, 14.15 E; Austria "
        "is highlighted. Decorative inset, not an interactive control."
    )
    text = "\n".join(
        [
            '<svg xmlns="http://www.w3.org/2000/svg" class="globe-locator" '
            'viewBox="0 0 96 96" preserveAspectRatio="xMidYMid meet" '
            'role="img" aria-labelledby="globe-locator-title '
            'globe-locator-desc">',
            f'  <title id="globe-locator-title">{title}</title>',
            f'  <desc id="globe-locator-desc">{desc}</desc>',
            '  <circle class="globe-locator__limb" cx="48" cy="48" r="46"/>',
            f'  <path class="globe-locator__land" d="{land_d}"/>',
            f'  <path class="globe-locator__austria" d="{austria_d}"/>',
            "</svg>",
        ]
    ) + "\n"
    return text, {
        "visiblePoints": visible_points,
        "landSegments": len(segments),
        "landPoints": sum(len(points) for points, _ in segments),
        "austriaPoints": austria_d.count("L") + austria_d.count("M"),
        "bytes": len(text.encode("utf-8")),
        "gzip": len(gzip.compress(text.encode("utf-8"), 9, mtime=0)),
    }


def build_state_rows(globe: dict):
    total = globe["meta"]["counts"]["records"]
    rows = []
    stats = []
    for state in globe["states"]:
        share = f"{state['count'] / total * 100:.1f}%"
        rows.append(
            f'<tr class="globe-states__row" data-state="{state["id"]}">'
            f'<th scope="row">{escape(state["nameEn"])}</th>'
            f'<td>{state["count"]}</td>'
            f'<td>{share}</td>'
            f'<td>{state["terrorCount"]}</td>'
            "</tr>"
        )
        stats.append(
            {
                "id": state["id"],
                "nameEn": state["nameEn"],
                "count": state["count"],
                "share": share,
                "terrorCount": state["terrorCount"],
            }
        )
    return "\n".join(rows) + "\n", stats


def build_static_artefacts(globe: dict, states: list[dict]) -> dict:
    outline = national_outline(states)
    fallback, fallback_stats = build_fallback(globe, outline)
    locator, locator_stats = build_locator(globe, outline)
    state_rows, state_rows_stats = build_state_rows(globe)
    return {
        "fallback": fallback,
        "locator": locator,
        "stateRows": state_rows,
        "fallbackStats": fallback_stats,
        "locatorStats": locator_stats,
        "stateRowsStats": state_rows_stats,
    }


# ---------------------------------------------------------------- records


def assign_states(
    features: list[dict], states: list[dict]
) -> tuple[list[int | None], dict]:
    """Point-in-polygon over full-resolution NE 1:10m states, then nearest.

    A record outside all nine polygons is assigned to the nearest state only if
    it is within 5 km and its address does not name another country.  The four
    records that are genuinely in Switzerland/Germany stay `None`; nothing is
    clipped and nothing is silently moved.
    """
    state_index = {state["id"]: i for i, state in enumerate(states)}
    assigned: list[int | None] = []
    stats = {
        "pip": 0,
        "nearest": [],
        "unassigned": [],
        "multiple": [],
    }
    for feature in features:
        lon, lat = (float(value) for value in feature["geometry"]["coordinates"][:2])
        hits = [
            state_index[state["id"]]
            for state in states
            if point_in_geometry(lon, lat, state["geometry"])
        ]
        if len(hits) == 1:
            assigned.append(hits[0])
            stats["pip"] += 1
            continue
        if len(hits) > 1:
            stats["multiple"].append((lon, lat, hits))
        distances = sorted(
            (
                distance_to_geometry_km(lon, lat, state["geometry"]),
                state_index[state["id"]],
                state["id"],
            )
            for state in states
        )
        nearest_km, nearest_index, nearest_id = distances[0]
        props = feature.get("properties") or {}
        address = str(props.get("address") or "")
        foreign = bool(FOREIGN_COUNTRY.search(address))
        if not hits and nearest_km <= NEAREST_KM and not foreign:
            assigned.append(nearest_index)
            stats["nearest"].append(
                {
                    "coordinates": [lon, lat],
                    "state": nearest_id,
                    "km": nearest_km,
                    "address": address or None,
                    "pid": props.get("pid"),
                }
            )
        else:
            assigned.append(None)
            if len(hits) > 1:
                reason = "inside more than one state"
            elif foreign:
                reason = "foreign address"
            else:
                reason = "outside all states"
            stats["unassigned"].append(
                {
                    "coordinates": [lon, lat],
                    "nearest": nearest_id,
                    "km": nearest_km,
                    "address": address or None,
                    "pid": props.get("pid"),
                    "title": props.get("title"),
                    "reason": reason,
                }
            )
    return assigned, stats


def build_points(
    features: list[dict], assignment: list[int | None]
) -> dict:
    layers = sorted({str((f.get("properties") or {}).get("layer") or "") for f in features})
    types = sorted({str((f.get("properties") or {}).get("type") or "") for f in features})
    dates = sorted(
        {(f.get("properties") or {}).get("date") for f in features},
        key=lambda value: (value is not None, "" if value is None else str(value)),
    )
    publics = sorted(
        {(f.get("properties") or {}).get("publicAvailable") for f in features},
        key=lambda value: (value is None, "" if value is None else str(value)),
    )
    layer_index = {value: i for i, value in enumerate(layers)}
    type_index = {value: i for i, value in enumerate(types)}
    date_index = {value: i for i, value in enumerate(dates)}
    public_index = {value: i for i, value in enumerate(publics)}

    lon_out, lat_out = [], []
    title_out, address_out, pid_out = [], [], []
    layer_out, type_out, date_out, public_out, state_out = (
        [],
        [],
        [],
        [],
        [],
    )
    for index, feature in enumerate(features):
        props = feature.get("properties") or {}
        lon, lat = (float(value) for value in feature["geometry"]["coordinates"][:2])
        lon_out.append(round(lon, POINT_DECIMALS))
        lat_out.append(round(lat, POINT_DECIMALS))
        title_out.append(str(props.get("title") or ""))
        address = str(props.get("address") or "").strip()
        address_out.append(address or None)
        pid = props.get("pid")
        if pid:
            if not str(pid).startswith(PID_PREFIX):
                raise SystemExit(f"records: unexpected pid {pid!r}")
            pid_out.append(str(pid)[len(PID_PREFIX) :])
        else:
            pid_out.append(None)
        layer_out.append(layer_index[str(props.get("layer") or "")])
        type_out.append(type_index[str(props.get("type") or "")])
        date_out.append(date_index[props.get("date")])
        public_out.append(public_index[props.get("publicAvailable")])
        state_out.append(assignment[index])

    return {
        "lon": lon_out,
        "lat": lat_out,
        "title": title_out,
        "address": address_out,
        "pidSuffix": pid_out,
        "layer": layer_out,
        "type": type_out,
        "date": date_out,
        "public": public_out,
        "state": state_out,
        "layers": layers,
        "types": types,
        "dates": dates,
        "publics": publics,
    }


# ---------------------------------------------------------------- output


def js_json(value) -> str:
    """JSON that cannot terminate a script block or break a JS literal."""
    text = json.dumps(value, ensure_ascii=False, separators=(",", ":"))
    return (
        text.replace("</", "<\\/")
        .replace("\u2028", "\\u2028")
        .replace("\u2029", "\\u2029")
    )


def build_globe(args) -> tuple[dict, dict, dict, dict]:
    features, derla_stats = load_derla(args)
    ne0 = read_json(args.natural_earth, "admin-0", NE50_URL, args.fetch)
    admin1 = read_json(args.admin1, "admin-1", NE10_URL, args.fetch)

    states = load_states(admin1)
    state_data = build_state_outlines(states)
    world_data = build_world(ne0)

    assignment, assignment_stats = assign_states(features, states)
    points = build_points(features, assignment)

    by_state = {state["id"]: 0 for state in states}
    terror_by_state = {state["id"]: 0 for state in states}
    for feature, index in zip(features, assignment):
        if index is None:
            continue
        props = feature.get("properties") or {}
        state_id = states[index]["id"]
        by_state[state_id] += 1
        if str(props.get("layer") or "").startswith("Orte des Terrors"):
            terror_by_state[state_id] += 1
    total = len(features)
    for i, state in enumerate(states):
        state_data["states"][i]["count"] = by_state[state["id"]]
        state_data["states"][i]["terrorCount"] = terror_by_state[state["id"]]
        state_data["states"][i]["share"] = round(by_state[state["id"]] / total, 4)

    terror_total = sum(terror_by_state.values())
    distinct_exact = len(
        {
            (
                float(feature["geometry"]["coordinates"][0]),
                float(feature["geometry"]["coordinates"][1]),
            )
            for feature in features
        }
    )
    distinct_4dp = len(
        {
            (
                round(float(feature["geometry"]["coordinates"][0]), POINT_DECIMALS),
                round(float(feature["geometry"]["coordinates"][1]), POINT_DECIMALS),
            )
            for feature in features
        }
    )
    assigned_total = sum(1 for index in assignment if index is not None)
    dated_total = sum(
        1 for index in points["date"] if YEAR.match(str(points["dates"][index]))
    )
    with_detail = sum(1 for value in points["pidSuffix"] if value)

    meta = {
        "title": "DERLA places of remembrance — globe data",
        "source": "DERLA — Digitales Erinnerungs- und Lernort-Archiv, Universität Graz",
        "sourceUrl": "https://gams.uni-graz.at/context:derlageo",
        "dataUrl": DERLA_MAP_URL,
        "licence": (
            "DERLA data: CC BY-NC 4.0. Natural Earth 1:50m and 1:10m: public domain."
        ),
        "extraction": EXTRACTION_DATE,
        "built": args.build_date,
        "counts": {
            "records": total,
            "states": len(states),
            "assigned": assigned_total,
            "unassigned": total - assigned_total,
            "nearestAssigned": len(assignment_stats["nearest"]),
            "sitesOfTerror": terror_total,
            "distinctCoordinates": distinct_exact,
            "distinctCoordinates4dp": distinct_4dp,
            "dated": dated_total,
            "withDetail": with_detail,
            "withoutDetail": total - with_detail,
            "worldCountries": world_data["countries"],
            "worldRings": world_data["rings"],
            "worldPoints": world_data["outputPoints"],
            "stateRings": state_data["rings"],
            "statePoints": state_data["outputPoints"],
        },
        "detail": {
            "pidPrefix": PID_PREFIX,
            "url": DETAIL_TEMPLATE,
            "note": (
                "points.pidSuffix holds the DERLA pid without its common "
                "'o:derla.' prefix. Full pid = meta.detail.pidPrefix + "
                "points.pidSuffix; the detail URL replaces {pid} in "
                "meta.detail.url with the full pid. The 377 overlap "
                "placeholders have no pid and therefore null."
            ),
        },
        "yearRule": (
            "points.date indexes points.dates. A year is the date string when "
            "it matches ^(18|19|20)\\d\\d$; otherwise null ('-', '5/46', "
            "'klar' and null are the only non-year values)."
        ),
        "projection": (
            "WGS84 longitude/latitude, unprojected. The renderer projects the "
            "sphere (orthographic is the intended globe). Rings are flat "
            "[lon,lat,...] arrays without a repeated closing vertex; outer "
            "rings are counter-clockwise and holes clockwise, so nonzero fill "
            "works. World rings are normally quantized to 2 decimals (~1.1 km), "
            "states to 3 (~100 m), points to 4 (~11 m); a sub-pixel microstate "
            "may keep a 3-decimal emergency ring."
        ),
        "assignment": (
            "Points are assigned to the nine states by point-in-polygon over "
            "the full-resolution Natural Earth 1:10m admin-1 polygons, holes "
            "included. Records outside all states take the nearest state only "
            "within 5 km and only when the address names no other country; "
            "otherwise state is null. Nothing is clipped."
        ),
        "world": {
            "source": "Natural Earth 1:50m admin-0 countries",
            "licence": "Public domain",
            "simplification": (
                "Douglas-Peucker in degrees: 1.3° worldwide, 0.35° inside the "
                "Austria neighbourhood box (5–25 E, 42–55 N), 2° Antarctica. "
                "Outer rings below 0.03 deg² are omitted outside that box; "
                "every country keeps at least its largest polygon."
            ),
            "quantization": "Normally 2 decimals (≈1.1 km); sub-pixel emergency rings may use 3.",
        },
        "states": {
            "source": "Natural Earth 1:10m admin-1 states/provinces",
            "licence": "Public domain",
            "simplification": "Douglas-Peucker 0.006° (~0.7 km), quantized to 3 decimals.",
        },
        "disclaimer": (
            "Positions are approximate geocodes of documented places, not "
            "survey data. DERLA is the authoritative record. The extract is a "
            "snapshot, not a complete inventory; coincident points are kept "
            "one per record and the renderer may group them. No images are "
            "included; detail pages live on gams.uni-graz.at."
        ),
    }

    globe = {
        "meta": meta,
        "world": {
            "names": world_data["names"],
            "codes": world_data["codes"],
            "polys": world_data["polys"],
        },
        "states": state_data["states"],
        "points": points,
    }
    artefacts = build_static_artefacts(globe, states)
    return globe, assignment_stats, {
        "derla": derla_stats,
        "world": world_data,
        "states": state_data,
    }, artefacts


def render(globe: dict) -> str:
    header = (
        "/* DERLA globe data — generated by tools/globe/build_globe.py; "
        "do not edit. Source: DERLA (CC BY-NC 4.0), Natural Earth (public domain). */\n"
    )
    return header + "window.DERLA_GLOBE=" + js_json(globe) + ";\n"


# ---------------------------------------------------------------- validation


def json_bytes(value) -> int:
    return len(js_json(value).encode("utf-8"))


def validate(globe: dict, payload: str) -> list[str]:
    problems: list[str] = []
    meta = globe["meta"]
    counts = meta["counts"]
    points = globe["points"]
    states = globe["states"]
    world = globe["world"]

    raw = len(payload.encode("utf-8"))
    gz = len(gzip.compress(payload.encode("utf-8"), 9, mtime=0))
    if raw > MAX_RAW_BYTES:
        problems.append(f"payload {raw} bytes exceeds {MAX_RAW_BYTES}")
    if gz > MAX_GZIP_BYTES:
        problems.append(f"gzip {gz} bytes exceeds {MAX_GZIP_BYTES}")
    if json_bytes(world) > MAX_WORLD_BYTES:
        problems.append(
            f"world {json_bytes(world)} bytes exceeds {MAX_WORLD_BYTES}"
        )
    if json_bytes({"states": states}) > MAX_STATES_BYTES:
        problems.append(
            f"states {json_bytes({'states': states})} bytes exceeds {MAX_STATES_BYTES}"
        )

    records = counts["records"]
    if records != len(points["lon"]):
        problems.append("points.lon length does not match counts.records")
    for key in (
        "lat",
        "title",
        "address",
        "pidSuffix",
        "layer",
        "type",
        "date",
        "public",
        "state",
    ):
        if len(points[key]) != records:
            problems.append(f"points.{key} length does not match counts.records")
    if len(states) != 9:
        problems.append(f"expected 9 states, found {len(states)}")
    if len({state["id"] for state in states}) != len(states):
        problems.append("duplicate state id")
    if counts["assigned"] + counts["unassigned"] != records:
        problems.append("assigned + unassigned does not equal records")
    state_total = sum(1 for index in points["state"] if index is not None)
    if state_total != counts["assigned"]:
        problems.append("state array does not match counts.assigned")
    if sum(state["count"] for state in states) != counts["assigned"]:
        problems.append("state counts do not sum to counts.assigned")
    if sum(state["terrorCount"] for state in states) != counts["sitesOfTerror"]:
        problems.append("state terror counts do not sum to counts.sitesOfTerror")
    if counts["sitesOfTerror"] != 232:
        problems.append(f"sites of terror {counts['sitesOfTerror']} != 232")

    state_ids = [state["id"] for state in states]
    for i, index in enumerate(points["state"]):
        if index is not None and not (0 <= index < len(states)):
            problems.append(f"point {i} has invalid state index {index}")
    for i, value in enumerate(points["pidSuffix"]):
        if value is not None and not re.fullmatch(r"[a-z]+\d+", value):
            problems.append(f"point {i} has an unexpected pid suffix {value!r}")
    for i, (lon, lat) in enumerate(zip(points["lon"], points["lat"])):
        if not (math.isfinite(lon) and math.isfinite(lat)):
            problems.append(f"point {i} has a non-finite coordinate")
    for key in ("layer", "type", "date", "public"):
        table = points["layers" if key == "layer" else key + "s"]
        for i, index in enumerate(points[key]):
            if not (0 <= index < len(table)):
                problems.append(f"point {i} has invalid {key} index {index}")
    if len(world["names"]) != len(world["codes"]) or len(world["names"]) != len(world["polys"]):
        problems.append("world names/codes/polys length mismatch")
    for name in REQUIRED_COUNTRIES:
        if name not in world["names"]:
            problems.append(f"world is missing {name}")

    def check_rings(polys, label):
        for p_index, polygon in enumerate(polys):
            if not polygon:
                problems.append(f"{label} polygon {p_index} has no rings")
                continue
            for r_index, ring in enumerate(polygon):
                if len(ring) < 6 or len(ring) % 2:
                    problems.append(f"{label} polygon {p_index} ring {r_index} is malformed")
                    continue
                pairs = [(ring[i], ring[i + 1]) for i in range(0, len(ring), 2)]
                if pairs[0] == pairs[-1]:
                    problems.append(f"{label} polygon {p_index} ring {r_index} is closed")
                area = signed_area(pairs)
                outer = r_index == 0
                if (outer and area <= 0) or (not outer and area >= 0):
                    problems.append(
                        f"{label} polygon {p_index} ring {r_index} has wrong orientation"
                    )

    for state in states:
        check_rings(state["polys"], f"state {state['id']}")
    for code, polys in zip(world["codes"], world["polys"]):
        check_rings(polys, f"world {code}")
    return problems


def validate_artefacts(artefacts: dict, globe: dict) -> list[str]:
    problems: list[str] = []
    fallback = artefacts["fallback"]
    locator = artefacts["locator"]
    rows = artefacts["stateRows"]

    for label, text, limit in (
        ("fallback", fallback, MAX_FALLBACK_BYTES),
        ("locator", locator, MAX_LOCATOR_BYTES),
    ):
        raw = len(text.encode("utf-8"))
        if raw > limit:
            problems.append(f"{label} {raw} bytes exceeds {limit}")
        if "<style" in text or " style=" in text:
            problems.append(f"{label} carries an inline style")
        if "fill=" in text or "stroke=" in text:
            problems.append(f"{label} carries inline fill/stroke")
        if "<script" in text:
            problems.append(f"{label} contains a script")
        if text.count("<title") != 1 or text.count("<desc") != 1:
            problems.append(f"{label} must carry one title and one desc")
        ids = re.findall(r'\bid="([^"]+)"', text)
        expected_ids = [f"globe-{label}-title", f"globe-{label}-desc"]
        if ids != expected_ids:
            problems.append(f"{label} ids {ids} != {expected_ids}")
        if 'preserveAspectRatio="xMidYMid meet"' not in text:
            problems.append(f"{label} lost preserveAspectRatio")
        if 'role="img"' not in text:
            problems.append(f"{label} lost role=img")

    if 'viewBox="0 0 720 380"' not in fallback:
        problems.append("fallback viewBox is not 0 0 720 380")
    if 'viewBox="0 0 96 96"' not in locator:
        problems.append("locator viewBox is not 0 0 96 96")
    if 'class="globe-locator__limb" cx="48" cy="48" r="46"' not in locator:
        problems.append("locator limb circle is missing")
    if 'class="globe-locator__land"' not in locator:
        problems.append("locator land path is missing")
    if 'class="globe-locator__austria"' not in locator:
        problems.append("locator Austria path is missing")
    if "aria-hidden" in locator:
        problems.append("locator sets aria-hidden; the host must")

    state_ids = re.findall(
        r'<path class="globe-fallback__state" data-state="([^"]+)"',
        fallback,
    )
    expected_states = [f"AT-{index}" for index in range(1, 10)]
    if state_ids != expected_states:
        problems.append(f"fallback state ids {state_ids} != {expected_states}")
    for name in ("outline", "dots", "terror"):
        count = fallback.count(f'class="globe-fallback__{name}"')
        if count != 1:
            problems.append(f"fallback has {count} {name} paths (expected 1)")

    stats = artefacts["fallbackStats"]
    for key, class_name in (("dots", "dots"), ("terrorMarks", "terror")):
        match = re.search(
            rf'class="globe-fallback__{class_name}" d="([^"]*)"', fallback
        )
        if match is None:
            problems.append(f"fallback {class_name} path has no d")
        elif match.group(1).count("M") != stats[key]:
            problems.append(
                f"fallback {class_name} subpaths "
                f"{match.group(1).count('M')} != {stats[key]}"
            )
    for state_id, subpaths, _points, _bytes in stats["statePaths"]:
        match = re.search(rf'data-state="{state_id}" d="([^"]*)"', fallback)
        if match is None or match.group(1).count("M") != subpaths:
            problems.append(
                f"fallback {state_id} subpaths do not match {subpaths}"
            )
    if stats["records"] != globe["meta"]["counts"]["records"]:
        problems.append("fallback stats records do not match the globe")
    if stats["positions"] != globe["meta"]["counts"]["distinctCoordinates4dp"]:
        problems.append("fallback stats positions do not match the globe")
    if stats["sitesOfTerror"] != globe["meta"]["counts"]["sitesOfTerror"]:
        problems.append("fallback stats terror count does not match the globe")

    if "<button" in rows or "<select" in rows:
        problems.append("state rows must not contain controls")
    row_re = re.compile(
        r'<tr class="globe-states__row" data-state="(AT-\d)">'
        r'<th scope="row">([^<]+)</th>'
        r'<td>(\d+)</td><td>([0-9.]+%)</td><td>(\d+)</td></tr>'
    )
    found = row_re.findall(rows)
    if len(found) != 9:
        problems.append(f"state rows found {len(found)} rows (expected 9)")
    else:
        total = globe["meta"]["counts"]["records"]
        for state, row in zip(globe["states"], found):
            row_id, name, count, share, terror = row
            expected_share = f"{state['count'] / total * 100:.1f}%"
            if row_id != state["id"]:
                problems.append(f"state row id {row_id} != {state['id']}")
            if name != escape(state["nameEn"]):
                problems.append(f"state row {row_id} name {name!r} is wrong")
            if count != str(state["count"]):
                problems.append(f"state row {row_id} count {count} is wrong")
            if share != expected_share:
                problems.append(
                    f"state row {row_id} share {share} != {expected_share}"
                )
            if terror != str(state["terrorCount"]):
                problems.append(f"state row {row_id} terror {terror} is wrong")
    if len(rows.splitlines()) != 9:
        problems.append(
            f"state rows file has {len(rows.splitlines())} lines (expected 9)"
        )
    return problems


def print_artefacts(artefacts: dict) -> None:
    fallback = artefacts["fallbackStats"]
    locator = artefacts["locatorStats"]
    rows = artefacts["stateRowsStats"]
    print()
    print(f"fallback records     {fallback['records']:,}")
    print(f"fallback positions   {fallback['positions']:,}")
    print(f"fallback sites       {fallback['sitesOfTerror']}")
    print(f"fallback dot marks   {fallback['dots']}")
    print(f"fallback terror      {fallback['terrorMarks']}")
    print(
        "fallback screen marks "
        f"{fallback['dots'] + fallback['terrorMarks']}"
    )
    subpaths = sum(row[1] for row in fallback["statePaths"])
    state_bytes = sum(row[3] for row in fallback["statePaths"])
    print(
        f"fallback state paths {subpaths} subpaths / {state_bytes} bytes"
    )
    print("  state  subpaths  points  bytes")
    for state_id, count, points, size in fallback["statePaths"]:
        print(f"  {state_id} {count:>8} {points:>7} {size:>6}")
    print(f"fallback outline pts {fallback['outlinePoints']}")
    min_x, min_y, max_x, max_y = fallback["screenBBox"]
    print(
        f"fallback screen bbox {min_x:.2f},{min_y:.2f} to {max_x:.2f},{max_y:.2f}"
    )
    print(f"fallback bytes       {fallback['bytes']} raw / {fallback['gzip']} gzip")
    print(f"locator bytes        {locator['bytes']} raw / {locator['gzip']} gzip")
    print(
        f"locator land/points  {locator['landSegments']} / "
        f"{locator['landPoints']} ({locator['visiblePoints']} visible)"
    )
    print("state rows")
    for row in rows:
        print(
            f"  {row['id']} {row['nameEn']:<18} {row['count']:>5} "
            f"{row['share']:>6} {row['terrorCount']:>4}"
        )


def print_counts(globe: dict, payload: str, stats: dict, check_status: str | None) -> None:
    meta = globe["meta"]
    counts = meta["counts"]
    points = globe["points"]
    print(f"records              {counts['records']}")
    print(f"states               {counts['states']}")
    print(f"assigned             {counts['assigned']}")
    print(f"unassigned           {counts['unassigned']}")
    print(f"nearest-assigned     {counts['nearestAssigned']}")
    print(f"sites of terror      {counts['sitesOfTerror']}")
    print(f"distinct coordinates {counts['distinctCoordinates']} exact")
    print(f"distinct at 4dp      {counts['distinctCoordinates4dp']}")
    print(f"dated                {counts['dated']}")
    print(f"with detail pid      {counts['withDetail']}")
    print(f"without detail pid   {counts['withoutDetail']}")
    print(f"world countries      {counts['worldCountries']}")
    print(f"world rings/points   {counts['worldRings']} / {counts['worldPoints']}")
    print(f"state rings/points   {counts['stateRings']} / {counts['statePoints']}")
    print()
    print("state                 records  terror   share")
    for state in globe["states"]:
        print(
            f"{state['id']} {state['name']:<18} {state['count']:>7} "
            f"{state['terrorCount']:>7}  {state['share']:.4f}"
        )
    print()
    print("world source points  " + str(stats["world"]["sourcePoints"]))
    print("world output points  " + str(stats["world"]["outputPoints"]))
    print("world dropped rings  " + str(stats["world"]["droppedRings"]))
    print("state source points  " + str(stats["states"]["sourcePoints"]))
    print("state output points  " + str(stats["states"]["outputPoints"]))
    print(f"payload bytes        {len(payload.encode('utf-8'))}")
    print(f"gzip bytes           {len(gzip.compress(payload.encode('utf-8'), 9, mtime=0))}")
    print(f"world bytes          {json_bytes(globe['world'])}")
    print(f"states bytes         {json_bytes({'states': globe['states']})}")
    if check_status is not None:
        print(f"check                {check_status}")


def report_anomalies(stats: dict, globe: dict) -> None:
    assignment = stats["assignment"]
    if assignment["nearest"]:
        print()
        print("nearest-state assignments (outside NE 1:10m outlines, <= 5 km):")
        for row in assignment["nearest"]:
            print(
                f"  {row['state']} {row['km']:.2f} km | {row['coordinates']} | "
                f"{row['address']} | {row['pid']}"
            )
    if assignment["unassigned"]:
        print()
        print("kept with state = null:")
        for row in assignment["unassigned"]:
            print(
                f"  {row['reason']} (nearest {row['nearest']} {row['km']:.2f} km) | "
                f"{row['coordinates']} | {row['address']} | {row['title']} | {row['pid']}"
            )
    if assignment["multiple"]:
        print()
        print("points inside more than one state:")
        for row in assignment["multiple"]:
            print(f"  {row}")
    points = globe["points"]
    no_address = sum(1 for value in points["address"] if value is None)
    no_pid = sum(1 for value in points["pidSuffix"] if value is None)
    print()
    print(f"records without address {no_address}")
    print(f"records without pid     {no_pid} (all titled 'Überlappende Zeichen')")
    odd_dates = sorted(
        {
            str(value)
            for value in points["dates"]
            if value is not None and not YEAR.match(str(value))
        }
    )
    print(f"non-year date values    {odd_dates}")
    print(f"public values           {points['publics']}")


# ---------------------------------------------------------------- main


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Build the committed DERLA globe data file."
    )
    parser.add_argument(
        "--derla",
        type=Path,
        default=CACHE / "derla-clean.geojson",
        help="cleaned DERLA FeatureCollection (default: the working cache)",
    )
    parser.add_argument(
        "--map-html",
        type=Path,
        help="saved DERLA map page; extracts the records instead of --derla",
    )
    parser.add_argument(
        "--natural-earth",
        type=Path,
        default=CACHE / "ne0.geojson",
        help="Natural Earth 1:50m admin-0 countries",
    )
    parser.add_argument(
        "--admin1",
        type=Path,
        default=CACHE / "ne10-admin1.geojson",
        help="Natural Earth 1:10m admin-1 states",
    )
    parser.add_argument(
        "--out-dir",
        type=Path,
        default=ROOT / "data/globe",
        help="output directory (default: data/globe)",
    )
    parser.add_argument(
        "--fallback",
        type=Path,
        help="fallback SVG (default: <out-dir>/globe-fallback.svg)",
    )
    parser.add_argument(
        "--locator",
        type=Path,
        help="locator SVG (default: <out-dir>/globe-locator.svg)",
    )
    parser.add_argument(
        "--state-rows",
        type=Path,
        help="state table rows (default: <out-dir>/state-rows.html)",
    )
    parser.add_argument(
        "--build-date",
        default=BUILD_DATE,
        help=f"date written to meta.built (default: {BUILD_DATE}; fixed for determinism)",
    )
    parser.add_argument(
        "--check",
        action="store_true",
        help="rebuild in memory and compare with the committed files; write nothing",
    )
    parser.add_argument(
        "--fetch",
        action="store_true",
        help="fetch official sources when an input path is missing (explicit opt-in)",
    )
    parser.add_argument(
        "--quiet",
        action="store_true",
        help="print only the final status line",
    )
    args = parser.parse_args()

    globe, assignment_stats, stats, artefacts = build_globe(args)
    stats["assignment"] = assignment_stats
    payload = render(globe)
    problems = validate(globe, payload) + validate_artefacts(artefacts, globe)
    if problems:
        for problem in problems:
            print(f"validation: {problem}", file=sys.stderr)
        raise SystemExit(f"validation failed with {len(problems)} problem(s); nothing written")

    fallback_path = args.fallback or args.out_dir / "globe-fallback.svg"
    locator_path = args.locator or args.out_dir / "globe-locator.svg"
    state_rows_path = args.state_rows or args.out_dir / "state-rows.html"
    outputs = [
        ("derla-globe.js", args.out_dir / "derla-globe.js", payload),
        ("fallback", fallback_path, artefacts["fallback"]),
        ("locator", locator_path, artefacts["locator"]),
        ("state rows", state_rows_path, artefacts["stateRows"]),
    ]

    if args.check:
        statuses = []
        for label, path, text in outputs:
            expected = text.encode("utf-8")
            if not path.exists():
                statuses.append((label, path, "MISSING", 0, len(expected)))
                continue
            current = path.read_bytes()
            status = "OK" if current == expected else "STALE"
            statuses.append((label, path, status, len(current), len(expected)))
        failed = [row for row in statuses if row[2] != "OK"]
        if args.quiet:
            if failed:
                print(
                    "check                "
                    + ", ".join(
                        f"{label} {status}"
                        for label, _, status, _, _ in statuses
                    )
                )
            else:
                print("check                OK")
        else:
            print_counts(globe, payload, stats, None)
            report_anomalies(stats, globe)
            print_artefacts(artefacts)
            print()
            for label, path, status, actual, expected in statuses:
                if status == "OK":
                    print(f"check {label:<12} OK ({actual} bytes)")
                elif status == "MISSING":
                    print(f"check {label:<12} MISSING ({path})")
                else:
                    print(
                        f"check {label:<12} STALE ({actual} bytes on disk, "
                        f"{expected} bytes built)"
                    )
        if failed:
            raise SystemExit(1)
        return

    for label, path, text in outputs:
        path.parent.mkdir(parents=True, exist_ok=True)
        temp = path.with_name(path.name + ".tmp")
        temp.write_bytes(text.encode("utf-8"))
        temp.replace(path)
        if not args.quiet:
            print(f"wrote {label:<12} {path}")
    if not args.quiet:
        print_counts(globe, payload, stats, None)
        report_anomalies(stats, globe)
        print_artefacts(artefacts)
    else:
        print(f"wrote                {len(outputs)} files")


if __name__ == "__main__":
    sys.exit(main())
