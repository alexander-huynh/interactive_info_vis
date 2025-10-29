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
const NOTE_BASE   = [255, 229, 94];   // active
const NOTE_DONE   = [255, 242, 160];  // completed (lighter)
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
          // inner background
          p.fill(18);
          p.rect(x + INSET, y + INSET, SIZE - INSET * 2, SIZE - INSET * 2, 6);
          // per-second fill
          p.fill(240);
          p.rect(x + INSET, y + INSET, (SIZE - INSET * 2) * f, SIZE - INSET * 2, 6);
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
