// Instance-mode sketch for tab 2
registerSketch('sk2', function (p) {
  const N = 5;
  const SIZE = 60;
  const GAP = 12;
  const PAD = 20;
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
    p.background(18);
    const idx = p.minute() % 25;  // active cell index 0..24
    const f = p.second() / 60;   // 0..1 progress within the minute
    const INSET = 6;             // inner padding for the fill bar
    let k = 0;                    // running cell index

    // Post-it palette
    const NOTE_BASE = [255, 229, 94];   // active
    const NOTE_DONE = [255, 242, 160];  // completed (lighter)
    const NOTE_FUTURE = [210, 190, 80];   // future (dimmer)

    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const x = PAD + c * (SIZE + GAP);
        const y = PAD + r * (SIZE + GAP);
        if (k < idx) {
          p.fill(200);      // completed minutes (lighter)
        } else if (k === idx) {
          p.fill(255);      // active minute (bright)
        } else {
          p.fill(70);       // future minutes (darker)
        }
        p.rect(x, y, SIZE, SIZE, 10);

        if (k < idx) {
          p.fill(...NOTE_DONE);       // completed minutes
        } else if (k === idx) {
          p.fill(...NOTE_BASE);       // active minute
        } else {
          p.fill(...NOTE_FUTURE);     // future minutes
        }
        p.rect(x, y, SIZE, SIZE, 10);

        if (k === idx) {
          p.noStroke();
          // horizontal writing lines (left→right), advancing row-by-row
          const innerX = x + INSET;
          const innerY = y + INSET;
          const innerW = SIZE - INSET * 2;
          const innerH = SIZE - INSET * 2;

          // how many lines to "write" across
          const LINES = 6;
          const perLine = 1 / LINES;
          const lineIdx = Math.min(LINES - 1, Math.floor(f / perLine));  // which line we're on
          const lineFrac = (f - lineIdx * perLine) / perLine;            // 0..1 progress on current line

          p.push();
          p.drawingContext.save();

          // clip to inner rounded rect (keeps strokes inside corners)
          p.drawingContext.beginPath();
          p.rect(innerX, innerY, innerW, innerH, 6);
          p.drawingContext.clip();

          // draw completed lines + the current partial line
          p.stroke(20);                 // black ink on yellow paper
          p.strokeWeight(3);
          p.strokeCap(p.ROUND);

          // margins so lines don't touch the edges
          const leftPad = 8;
          const rightPad = 8;
          const topPad = 8;
          const bottomPad = 8;

          const span = innerW - leftPad - rightPad;
          for (let i = 0; i < LINES; i++) {
            const yPad = p.map(i, 0, LINES - 1, topPad, innerH - bottomPad);
            const x0 = innerX + leftPad;
            const x1Full = innerX + leftPad + span;

            if (i < lineIdx) {
              // fully completed line
              p.line(x0, innerY + yPad, x1Full, innerY + yPad);
            } else if (i === lineIdx) {
              // current line, partial
              const x1 = x0 + span * lineFrac;
              p.line(x0, innerY + yPad, x1, innerY + yPad);
            }
            // future lines: draw nothing
          }

          p.drawingContext.restore();
          p.pop();

        }

        if (k === idx) {
          // outline to make the active sticky pop
          p.noFill(); p.stroke(255); p.strokeWeight(2);
          p.rect(x, y, SIZE, SIZE, 10);
          p.noStroke();

          // tiny label above active sticky
          p.fill(220);
          p.textAlign(p.CENTER, p.BOTTOM);
          p.textSize(12);
          p.text(`${idx + 1}/25`, x + SIZE / 2, y - 4);
        }

        k++;
      }
    }
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
