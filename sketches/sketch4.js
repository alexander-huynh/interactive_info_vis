// Instance-mode sketch for tab 4
registerSketch('sk4', function (p) {
  const N = 25;          // number of tokens
  const LINE_Y = 100;    // y-position of the clothesline
  const TOKEN_Y = 160;   // hanging token y
  const LEFT = 40, RIGHT = 660; // line endpoints (fixed)
  const R = 10;          // token radius
  const GROUND_Y = TOKEN_Y + 180; // rest position for fallen tokens

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
  p.background(12);

    // clothesline
    p.stroke(180);
    p.strokeWeight(2);
    p.line(LEFT, LINE_Y, RIGHT, LINE_Y);

    const m = p.minute() % N; // fallen tokens count
    for (let i = 0; i < N; i++) {
      const x = p.map(i, 0, N - 1, LEFT, RIGHT);
      if (i < m) {
        // fallen token at ground
        p.noStroke();
        p.fill(180, 150, 60);
        p.circle(x, GROUND_Y, R * 2);
        continue;
      }

      // string
      p.stroke(140);
      p.line(x, LINE_Y, x, TOKEN_Y - 18);

      // token
      p.noStroke();
      p.fill(255, 200, 0);
      p.circle(x, TOKEN_Y, R * 2);
    }
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
