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
      let xDraw = x;
      if (i === m) {
        const swing = p.sin(p.millis() / 700) * 6; // subtle sway
        xDraw += swing;
        p.fill(220);
        p.textSize(12);
        p.textAlign(p.CENTER, p.BOTTOM);
        p.text(`${m + 1}/${N}`, xDraw, TOKEN_Y - 24); // identify progress

      }
      if (i < m) {
        // fallen token at ground (draw apple)
        p.noStroke();
        // apple body
        p.fill(220, 40, 40);
        p.push();
        p.translate(x, GROUND_Y);
        p.circle(0, 0, R * 2);
        // stem
        p.stroke(90, 60, 30);
        p.strokeWeight(2);
        p.line(0, -R, 0, -R - 8);
        // leaf
        p.noStroke();
        p.fill(40, 160, 60);
        p.ellipse(5, -R - 6, 10, 6, 0);
        p.pop();
        continue;
      }

      // string
      p.stroke(140);
      p.line(xDraw, LINE_Y, xDraw, TOKEN_Y - 18);


      // token → apple
      p.noStroke();
      // apple body
      p.fill(220, 40, 40);
      p.push();
      p.translate(xDraw, TOKEN_Y);
      p.circle(0, 0, R * 2);
      // stem
      p.stroke(90, 60, 30);
      p.strokeWeight(2);
      p.line(0, -R, 0, -R - 8);
      // leaf
      p.noStroke();
      p.fill(40, 160, 60);
      p.ellipse(5, -R - 6, 10, 6, 0);
      p.pop();

    }
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
