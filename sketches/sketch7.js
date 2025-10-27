// Example 3
registerSketch('sk7', function (p) {

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
  };

  p.draw = function () {
    p.background(240);
    p.clock();
  }

  p.clock = function () {
    let h = p.hour();
    let m = p.minute();
    let s = p.second();

    // Center + sizing
    p.translate(p.width / 2, p.height / 2);
    const R = p.min(p.width, p.height) * 0.45;   // outer radius

    // Concentric circles
    p.noStroke();
    p.fill(0);            // big black circle
    p.circle(0, 0, R * 2);

    p.fill(255);          // inner white circle
    p.circle(0, 0, R * 1.5);

    p.fill(0);            // small black center circle (hub)
    p.circle(0, 0, R * 0.14);

    // Angles (0° at 12 o'clock)
    const aS = p.map(s, 0, 60, 0, 360) - 90;
    const aM = p.map(m, 0, 60, 0, 360) - 90;
    const aH = p.map(h, 0, 12, 0, 360) - 90;

    // Tick marks (hours)
    p.stroke(255);
    p.strokeWeight(2);
    for (let i = 0; i < 12; i++) {
      const a = i * 30 - 90;
      const x1 = p.cos(a) * (R * 0.88);
      const y1 = p.sin(a) * (R * 0.88);
      const x2 = p.cos(a) * (R * 0.97);
      const y2 = p.sin(a) * (R * 0.97);
      p.line(x1, y1, x2, y2);
    }

    // Helper to draw a hand with halo so it contrasts on both colors
    p.hand = function (angleDeg, len, thick) {
      p.push();
      p.rotate(angleDeg);
      // black halo
      p.stroke(0);
      p.strokeWeight(thick + 4);
      p.line(0, 0, len, 0);
      // white center
      p.stroke(255);
      p.strokeWeight(thick);
      p.line(0, 0, len, 0);
      p.pop();
    }

    // Hands: hour, minute, second
    p.hand(aH, R * 0.55, 8);
    p.hand(aM, R * 0.75, 6);
    // second hand (thinner, extends farther)
    p.push();
    p.rotate(aS);
    p.stroke(0);
    p.strokeWeight(4);
    p.line(0, 0, R * 0.9, 0);  // black halo
    p.stroke(255);
    p.strokeWeight(2);
    p.line(0, 0, R * 0.9, 0);  // white center
    p.pop();

    // center cap on top
    p.noStroke();
    p.fill(0);
    p.circle(0, 0, R * 0.08);

  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
