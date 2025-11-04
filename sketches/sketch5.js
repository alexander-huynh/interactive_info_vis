// === Paths (adjust if needed) ===
const CSV_PATH = "./../data/2019.csv";

registerSketch('sk5', function (p) {
  // ---- Social-media layout (square) ----
  const CANVAS     = 1080;
  const LEFT_PAD   = 80;
  const RIGHT_PAD  = 80;
  const TOP_MARGIN = 24;
  const BOT_PAD    = 180;

  // Label column (like the corruption chart)
  const LABEL_COL_W = 260;
  const LABEL_GAP   = 12;

  // Row layout
  const ROW_H       = 52;
  const DOT_R_MAIN  = 9;
  const DOT_R_DIM   = 6;

  // Colors
  const COL_BG        = "#f7f9fb";
  const COL_AXIS      = p => p.color(205);
  const COL_GRID      = p => p.color(230);
  const COL_LABEL     = p => p.color(25);
  const COL_LABEL_DIM = p => p.color(80);
  const COL_MUTED     = p => p.color(160,160,160,160);
  const COL_MUTED_DOT = p => p.color(150,150,150);
  const COL_GDP       = p => p.color(120,120,120);
  const COL_SCORE     = p => p.color("#1f77b4");

  // Column detection
  const COUNTRY_CANDS = ["Country or region","Country","country","Entity","Location"];
  const SCORE_CANDS   = ["Score","Happiness score","Ladder score","Life Ladder","score"];
  const GDP_CANDS     = ["GDP per capita","Log GDP per capita","GDP","gdp"];

  // ---- Data state ----
  let table = null;
  // rows will be TOP-15 with global-normalized values:
  // {country, score, gdp, nScoreGlobal, nGdpGlobal}
  let rows  = [];
  let x0, x1, w;
  let axisY = 0;
  let rowsStartY = 0;
  let plottedN = 0;
  let hovered = null;

  // windowed (zoom) scale bounds in GLOBAL-normalized units [0..100]
  let winLo = 0;
  let winHi = 100;
  const GAMMA = 0.85; // <1 spreads high-end slightly; =1 disables

  p.preload = function () {
    table = p.loadTable(CSV_PATH, "csv", "header");
  };

  p.setup = function () {
    p.createCanvas(CANVAS, CANVAS);
    p.pixelDensity(2);
    p.textFont("system-ui, -apple-system, Segoe UI, Roboto, sans-serif");

    // Plot area X bounds (after fixed label column)
    x0 = LEFT_PAD + LABEL_COL_W + LABEL_GAP;
    x1 = p.width - RIGHT_PAD;
    w  = x1 - x0;

    // ---------- Build data with GLOBAL normalization ----------
    const { cCol, sCol, gCol } = detectColumns(table);

    const allRows = [];
    for (let r = 0; r < table.getRowCount(); r++) {
      const country = table.getString(r, cCol);
      const score   = parseFloat(table.getString(r, sCol));
      const gdp     = parseFloat(table.getString(r, gCol));
      if (!country || !isFinite(score) || !isFinite(gdp)) continue;
      allRows.push({ country, score, gdp });
    }

    // Global min/max from the FULL dataset (keeps context honest)
    const sMinG = Math.min(...allRows.map(d => d.score));
    const sMaxG = Math.max(...allRows.map(d => d.score));
    const gMinG = Math.min(...allRows.map(d => d.gdp));
    const gMaxG = Math.max(...allRows.map(d => d.gdp));

    for (const d of allRows) {
      d.nScoreGlobal = safe01(d.score, sMinG, sMaxG) * 100;
      d.nGdpGlobal   = safe01(d.gdp,   gMinG, gMaxG) * 100;
    }

    // Top 15 by raw happiness score
    allRows.sort((a, b) => b.score - a.score);
    rows = allRows.slice(0, 15);

    // Define a zoom window from the TOP-15 (but STILL in global-normalized units)
    const topMin = Math.min(...rows.map(d => Math.min(d.nScoreGlobal, d.nGdpGlobal)));
    const topMax = Math.max(...rows.map(d => Math.max(d.nScoreGlobal, d.nGdpGlobal)));
    const span   = Math.max(1e-6, topMax - topMin);
    const padPct = 0.08;
    winLo = Math.max(0, topMin - span * padPct);
    winHi = Math.min(100, topMax + span * padPct);

    p.noLoop();
  };

  p.mouseMoved = function () { p.redraw(); };

  p.draw = function () {
    p.background(COL_BG);
    drawTitleAndLayout();
    drawAxis();
    drawRows();
    drawLegend();
    drawTooltip();
  };

  // ---------- helpers ----------
  function detectColumns(tbl) {
    const H = tbl.columns;
    const pick = (cands, fb) => cands.find(c => H.includes(c)) || H[fb];
    return { cCol: pick(COUNTRY_CANDS,0), sCol: pick(SCORE_CANDS,1), gCol: pick(GDP_CANDS,2) };
  }

  function safe01(v, vmin, vmax) {
    if (!isFinite(v)) return 0;
    if (vmax === vmin) return 0.5;
    return Math.max(0, Math.min(1, (v - vmin) / (vmax - vmin)));
  }

  // GLOBAL mapper: 0..100 (absolute, global normalization) to pixels
  function xFromNorm(global01to100) {
    const t = Math.max(0, Math.min(1, global01to100 / 100));
    return x0 + t * w;
  }

  // WINDOW (zoomed) mapper over [winLo..winHi] (both in global units 0..100)
  function xFromWindow(global01to100) {
    let u = (global01to100 - winLo) / Math.max(1e-6, (winHi - winLo));
    u = Math.max(0, Math.min(1, u));
    if (GAMMA !== 1) u = Math.pow(u, GAMMA); // mild spacing tweak
    return x0 + u * w;
  }

  function drawTitleAndLayout() {
    p.fill(COL_LABEL(p));
    p.textAlign(p.LEFT, p.TOP);
    p.textWrap(p.WORD);

    const TITLE_SIZE = 48;
    const SUB_SIZE   = 22;
    const titleX = LEFT_PAD;
    const titleY = TOP_MARGIN;
    const textW  = p.width - LEFT_PAD - RIGHT_PAD;

    p.textSize(TITLE_SIZE);
    p.textLeading(TITLE_SIZE * 1.1);
    p.text("Economic prosperity isn’t a perfect predictor of life satisfaction", titleX, titleY, textW);
    const titleH = TITLE_SIZE * 1.1 * 2;

    p.fill(70);
    p.textSize(SUB_SIZE);
    p.textLeading(SUB_SIZE * 1.35);
    const subY = titleY + titleH + 8;
    p.text(
      "Top happiest countries (2019). Each line compares a country's GDP per capita with its reported life satisfaction.",
      titleX, subY, textW
    );
    const subH = SUB_SIZE * 1.35 * 1.4;

    rowsStartY = subY + subH + 28;
    axisY      = p.height - BOT_PAD + 10;
    const usableH = axisY - 28 - rowsStartY;

    plottedN = Math.max(0, Math.floor(usableH / ROW_H));
    if (plottedN > rows.length) plottedN = rows.length;
  }

  function drawAxis() {
    const y = axisY;
    const gridTop = rowsStartY - ROW_H * 0.4;
    const gridBot = y - 28;

    // Faint GLOBAL reference grid at 0/25/50/75/100 (context)
    p.stroke(COL_GRID(p));
    p.strokeWeight(1);
    for (const t of [0, 25, 50, 75, 100]) {
      const xx = xFromNorm(t);
      p.line(xx, gridTop, xx, gridBot);
    }

    // Main axis baseline
    p.stroke(COL_AXIS(p));
    p.strokeWeight(2);
    p.line(x0, y, x1, y);

    // Main ticks along the WINDOW scale, labeled in GLOBAL units
    p.textAlign(p.CENTER, p.TOP);
    p.textSize(18);
    p.fill(90);

    const MAIN_TICKS = 5; // creates 6 ticks (0..5)
    for (let i = 0; i <= MAIN_TICKS; i++) {
      const gv = lerp(winLo, winHi, i / MAIN_TICKS);  // global value in [0..100]
      const xx = xFromWindow(gv);
      p.stroke(COL_AXIS(p));
      p.line(xx, y, xx, y + 8);
      p.noStroke();
      p.text(Math.round(gv), xx, y + 12);
    }

    p.fill(70);
    p.textSize(18);
    p.text("Global normalized position (zoomed view)", (x0 + x1) / 2, y + 36);
  }

  function drawRows() {
    hovered = null;
    const view = rows.slice(0, plottedN);
    const xLabel = LEFT_PAD + LABEL_COL_W - LABEL_GAP;

    for (let i = 0; i < view.length; i++) {
      const d = view[i];
      const y = rowsStartY + i * ROW_H;

      // Country label
      p.textAlign(p.RIGHT, p.CENTER);
      p.textSize(20);
      p.fill(COL_LABEL(p));
      p.text(d.country, xLabel, y);

      // Dumbbell using WINDOW mapping but GLOBAL-normalized values
      const xG = xFromWindow(d.nGdpGlobal);
      const xS = xFromWindow(d.nScoreGlobal);

      p.stroke(COL_MUTED(p));
      p.strokeWeight(3);
      p.strokeCap(p.ROUND);
      p.line(xG, y, xS, y);

      p.noStroke();
      p.fill(COL_GDP(p));
      p.circle(xG, y, DOT_R_DIM * 2);

      p.fill(COL_SCORE(p));
      p.circle(xS, y, DOT_R_DIM * 2);

      // Delta (in GLOBAL-normalized points)
      const delta = Math.round(d.nScoreGlobal - d.nGdpGlobal);
      if (Math.abs(delta) >= 3) {
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(14);
        p.fill(90);
        p.text((delta >= 0 ? "+" : "") + delta, xS + 8, y);
      }

      // Hover hitbox
      const r = DOT_R_DIM + 4;
      if (p.dist(p.mouseX, p.mouseY, xG, y) <= r || p.dist(p.mouseX, p.mouseY, xS, y) <= r) {
        hovered = { y, xG, xS, row: d };
      }
    }
  }

  function drawLegend() {
    const y = p.height - BOT_PAD + 86;
    const x = LEFT_PAD;

    p.noStroke();
    p.textAlign(p.LEFT, p.CENTER);
    p.textSize(20);
    p.fill(30);
    p.text("Legend", x, y);

    p.fill(COL_GDP(p));
    p.circle(x + 100, y, 14);
    p.fill(40);
    p.textSize(18);
    p.text("GDP per capita (global-normalized, zoomed axis)", x + 120, y);

    p.fill(COL_SCORE(p));
    p.circle(x + 560, y, 14);
    p.fill(40);
    p.text("Happiness score (global-normalized, zoomed axis)", x + 580, y);
  }

  function drawTooltip() {
    if (!hovered) return;
    const d = hovered.row;

    const delta = d.nScoreGlobal - d.nGdpGlobal;
    const lines = [
      d.country,
      `Happiness: ${p.nf(d.score, 1, 2)}`,
      `GDP per capita: ${p.nf(d.gdp, 1, 3)}`,
      `Δ (norm, global): ${(delta >= 0 ? "+" : "") + p.nf(delta, 1, 1)}`
    ];

    p.textSize(20);
    let wMax = 0;
    for (const t of lines) wMax = Math.max(wMax, p.textWidth(t));
    const pad = 10;
    const h = lines.length * 24 + pad * 2;

    let x = p.mouseX + 16;
    let y = p.mouseY + 16;
    if (x + wMax + pad * 2 > p.width - 8) x = p.width - wMax - pad * 2 - 8;
    if (y + h > axisY - 8) y = axisY - h - 12;

    p.noStroke();
    p.fill(255, 245);
    p.rect(x, y, wMax + pad * 2, h, 10);
    p.fill(20);
    let yy = y + pad + 4;
    for (const t of lines) { p.text(t, x + pad, yy); yy += 24; }
  }

  // small linear interpolation helper
  function lerp(a, b, t) { return a + (b - a) * t; }
});
