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
    let k = 0;                    // running cell index
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const x = PAD + c * (SIZE + GAP);
        const y = PAD + r * (SIZE + GAP);
        if (k === idx) { p.fill(255); } else { p.fill(90); }
        p.rect(x, y, SIZE, SIZE, 10);
        k++;
      }
    }
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
