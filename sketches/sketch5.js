// === Paths (adjust if needed) ===
const GEOJSON_PATH = "./../data/countries.geo.json";
const CSV_PATH = "./../data/2019.csv";

registerSketch('sk5', function (p) {
  // --- State ---
  let world = null;                 // GeoJSON
  let table = null;                 // p5.Table
  let features = [];
  const nameToScore = new Map();
  let minScore = 10, maxScore = 0;

  // Hover
  let hoverCountry = null;
  let hoverScore = null;

  // Visual settings
  const C_MIN = '#d8e6f3';
  const C_MID = '#5ca0d6';
  const C_MAX = '#004e89';
  const BG = "#f7f9fb";
  const PAD = 40;       // inner padding for map
  const TOP_PAD = 90;   // space for title/subtitle

  // CSV header candidates
// add "Country or region" to the list
const COUNTRY_CANDIDATES = [
  "country","Country","Country name","Country or region","Entity","Location"
];

  const SCORE_CANDIDATES   = ["score","Score","Happiness score","Ladder score","Life Ladder"];

  // Name fixes
  const NAME_FIX = {
    "United States": "United States of America",
    "USA": "United States of America",
    "U.S.": "United States of America",
    "UK": "United Kingdom",
    "Russia": "Russian Federation",
    "South Korea": "Republic of Korea",
    "North Korea": "Democratic People's Republic of Korea",
    "Czechia": "Czech Republic",
    "Ivory Coast": "Côte d'Ivoire",
    "Congo (Brazzaville)": "Republic of the Congo",
    "Congo (Kinshasa)": "Democratic Republic of the Congo",
    "Syria": "Syrian Arab Republic",
    "Vietnam": "Viet Nam",
    "Laos": "Lao People's Democratic Republic",
    "Eswatini": "Swaziland",
    "Cape Verde": "Cabo Verde",
    "Micronesia": "Federated States of Micronesia",
    "Bolivia": "Bolivia (Plurinational State of)",
    "Venezuela": "Venezuela (Bolivarian Republic of)",
    "Tanzania": "United Republic of Tanzania",
    "Moldova": "Republic of Moldova",
    "Palestine": "Palestine, State of"
  };

  // Narrative callouts (lon,lat)
  const CALLOUTS = [
    { name: "Finland",       lon: 25.0,  lat: 64.0 },
    { name: "Afghanistan",   lon: 67.7,  lat: 33.9 },
    { name: "United States", lon: -98.6, lat: 39.8 },
    { name: "South Africa",  lon: 24.0,  lat: -29.0 }
  ];

  p.preload = function () {
    world = p.loadJSON(GEOJSON_PATH);
    table = p.loadTable(CSV_PATH, "csv", "header");
  };

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.pixelDensity(2);

    // Build score lookup
    const { countryCol, scoreCol } = detectColumns(table);
    for (let r = 0; r < table.getRowCount(); r++) {
      const raw = table.getString(r, countryCol);
      const val = parseFloat(table.getString(r, scoreCol));
      if (!raw || isNaN(val)) continue;
      const fixed = normalizeName(raw.trim());
      nameToScore.set(fixed, val);
      if (val < minScore) minScore = val;
      if (val > maxScore) maxScore = val;
    }
    if (!isFinite(minScore) || !isFinite(maxScore)) { minScore = 0; maxScore = 10; }

    // Flatten features
    if (world && world.type === "FeatureCollection") {
      features = world.features || [];
    } else if (world && world.features) {
      features = world.features;
    }

    p.noLoop(); // draw once; hover will trigger redraws
  };

  p.draw = function () {
    p.background(BG);

    // Title + subtitle (in-canvas so exports look right)
    drawTitles();

    // Map area transform (reserve TOP_PAD)
    p.push();
    p.translate(0, TOP_PAD);

    hoverCountry = null;
    hoverScore = null;

    p.stroke(255);
    p.strokeWeight(0.5);

    for (const f of features) {
      const geom = f.geometry;
      if (!geom) continue;

      const prop = f.properties || {};
      const rawName = prop.ADMIN || prop.name || prop.NAME || prop.Country || "";
      const name = normalizeName(String(rawName));
      const score = nameToScore.get(name);
      const fillCol = (score != null) ? scaleColor(score, minScore, maxScore) : p.color(230,233,236);

      p.fill(fillCol);

      if (geom.type === "Polygon") {
        drawPolygon(geom.coordinates);
        if (pointInMultiPolygon(geom.coordinates, p.mouseX, p.mouseY, TOP_PAD)) {
          hoverCountry = name;
          hoverScore = score;
        }
      } else if (geom.type === "MultiPolygon") {
        drawMultiPolygon(geom.coordinates);
        if (pointInMultiPolygon(geom.coordinates.flat(), p.mouseX, p.mouseY, TOP_PAD)) {
          hoverCountry = name;
          hoverScore = score;
        }
      }
    }

    // Legend + callouts
    drawLegend();
    drawCallouts();

    p.pop();

    // Tooltip last, on top
    drawTooltip();
  };

  // --- Events ---
  p.mouseMoved = function () { p.redraw(); };
  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    p.redraw();
  };

  // --- Helpers ---
  function detectColumns(tbl) {
    const headers = tbl.columns;
    const find = (cands) => {
      for (const c of cands) {
        const idx = headers.indexOf(c);
        if (idx !== -1) return c;
      }
      return cands === COUNTRY_CANDIDATES ? headers[0] : headers[1];
    };
    return { countryCol: find(COUNTRY_CANDIDATES), scoreCol: find(SCORE_CANDIDATES) };
  }

  function normalizeName(n) {
    if (!n) return "";
    const t = n.trim();
    return NAME_FIX[t] || t;
  }

  // Equirectangular projection to canvas
  function project(lon, lat) {
    const x = p.map(lon, -180, 180, PAD, p.width - PAD);
    const y = p.map(lat, 90, -90, PAD, p.height - PAD); // invert Y for north-up
    return [x, y];
  }

  function drawPolygon(rings) {
    for (const ring of rings) {
      p.beginShape();
      for (const coord of ring) {
        const [lon, lat] = coord;
        const [x, y] = project(lon, lat);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
    }
  }

  function drawMultiPolygon(polys) {
    for (const poly of polys) drawPolygon(poly);
  }

  // Point-in-polygon (ray cast)
  function pointInRing(ring, px, py) {
    let inside = false;
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [lonI, latI] = ring[i];
      const [lonJ, latJ] = ring[j];
      const [xi, yi] = project(lonI, latI);
      const [xj, yj] = project(lonJ, latJ);
      const intersect = ((yi > py) !== (yj > py)) && (px < (xj - xi) * (py - yi) / ((yj - yi) + 1e-12) + xi);
      if (intersect) inside = !inside;
    }
    return inside;
  }

  function pointInMultiPolygon(rings, px, py, topPad) {
    const yAdj = py - topPad; // account for translate
    for (const ring of rings) {
      if (pointInRing(ring, px, yAdj)) return true;
    }
    return false;
  }

  // 3-stop ramp
  function scaleColor(value, vmin, vmax) {
    const t = p.constrain((value - vmin) / (vmax - vmin + 1e-9), 0, 1);
    if (t < 0.5) {
      const u = p.map(t, 0, 0.5, 0, 1);
      return p.lerpColor(p.color(C_MIN), p.color(C_MID), u);
    } else {
      const u = p.map(t, 0.5, 1, 0, 1);
      return p.lerpColor(p.color(C_MID), p.color(C_MAX), u);
    }
  }

  function drawLegend() {
    const w = Math.min(360, p.width - PAD * 2);
    const x = PAD;
    const y = p.height - PAD - 28;
    const h = 14;

    for (let i = 0; i < w; i++) {
      const t = i / (w - 1);
      const val = p.lerp(minScore, maxScore, t);
      const col = scaleColor(val, minScore, maxScore);
      p.stroke(col);
      p.line(x + i, y, x + i, y + h);
    }

    p.noStroke();
    p.fill(50);
    p.textSize(12);
    p.textAlign(p.LEFT, p.BOTTOM);
    p.text("Happiness Score (0–10)", x, y - 6);

    p.fill(60);
    p.textAlign(p.CENTER, p.TOP);
    const mid = (minScore + maxScore) / 2;
    p.text(p.nfc(minScore, 1), x, y + h + 2);
    p.text(p.nfc(mid, 1), x + w / 2, y + h + 2);
    p.text(p.nfc(maxScore, 1), x + w, y + h + 2);
  }

  function drawCallouts() {
    p.textSize(13);
    p.textAlign(p.LEFT, p.CENTER);
    for (const c of CALLOUTS) {
      const [x, y] = project(c.lon, c.lat);
      const nm = normalizeName(c.name);
      const sc = nameToScore.get(nm);
      p.noStroke();
      p.fill(0, 120);
      p.circle(x, y, 4);
      p.fill(30);
      p.text(`${c.name}: ${sc != null ? p.nf(sc, 1, 2) : "n/a"}`, x + 6, y);
    }
  }

  function drawTitles() {
    p.noStroke();
    p.fill(20);
    p.textAlign(p.LEFT, p.TOP);

    p.textSize(26);
    p.text("Happiness Around the World", PAD, 16);

    p.fill(70);
    p.textSize(14);
    p.text(
      "Average self-reported life evaluation. Lighter = lower, deeper blue = higher. Countries with no data shown in light gray.",
      PAD, 48
    );
  }

  function drawTooltip() {
    if (!hoverCountry) return;
    const lines = [
      hoverCountry,
      (hoverScore != null ? `Score: ${p.nf(hoverScore, 1, 2)}` : "No data")
    ];

    p.textSize(14);
    let w = 0;
    for (const t of lines) w = Math.max(w, p.textWidth(t));
    const pad = 8;
    const h = lines.length * 18 + pad * 2;

    let x = p.mouseX + 12;
    let y = p.mouseY + 12;
    if (x + w + pad * 2 > p.width - 6) x = p.width - w - pad * 2 - 6;
    if (y + h > p.height - 6) y = p.height - h - 6;

    p.noStroke();
    p.fill(255, 245);
    p.rect(x, y, w + pad * 2, h, 8);
    p.fill(20);

    let ty = y + pad + 2;
    for (const t of lines) {
      p.text(t, x + pad, ty);
      ty += 18;
    }
  }
});
