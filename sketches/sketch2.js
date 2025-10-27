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
    for (let r = 0; r < N; r++) {
      for (let c = 0; c < N; c++) {
        const x = PAD + c * (SIZE + GAP);
        const y = PAD + r * (SIZE + GAP);
        p.fill(90);
        p.rect(x, y, SIZE, SIZE, 10);
      }
    }
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
