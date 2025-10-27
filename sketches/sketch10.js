// Example 6
registerSketch('sk10', function (p) {

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.angleMode(p.DEGREES);
    p.noStroke();
  };

  p.draw = function () {
    p.background(10, 10, 30);
    p.clock();
  }

  p.clock = function () {
    let h = p.hour();
    let m = p.minute();
    let s = p.second();

    // Ratios
    const rs = s / 60;        // 0..1
    const rm = m / 60;        // 0..1
    const rh = h / 12;        // 0..1

    // Center + sizing
    p.translate(p.width / 2, p.height / 2);
    const R = p.min(p.width, p.height) * 0.45;   // outer radius

    // Guide circle
    p.noFill();
    p.stroke(60);
    p.strokeWeight(2);
    p.circle(0, 0, R * 2);

    // Helper to draw a ring arc with nice caps
    function ring(progress, radius, weight, col) {
      p.push();
      p.rotate(-90); // start at top (12 o'clock)
      p.stroke(col);
      p.strokeWeight(weight);
      p.strokeCap(p.SQUARE);
      p.noFill();
      // background track
      p.stroke(40);
      p.arc(0, 0, radius * 2, radius * 2, 0, 360);
      // progress arc
      p.stroke(col);
      p.arc(0, 0, radius * 2, radius * 2, 0, 360 * progress);
      p.pop();
    }

    // Rings: seconds (outer), minutes (middle), hours (inner)
    ring(rs, R, 16, p.color(90, 180, 255));
    ring(rm, R * 0.78, 18, p.color(120, 255, 170));
    ring(rh, R * 0.56, 20, p.color(255, 120, 160));

    // Droplet for seconds endpoint
    p.push();
    const a = 360 * rs - 90;
    const x = p.cos(a) * R;
    const y = p.sin(a) * R;
    p.noStroke();
    p.fill(90, 180, 255);
    p.circle(x, y, 14);
    p.pop();

    // Center labels
    p.fill(230);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(28);


    p.text(`${h}:${m}:${s}`, 0, 6);

    p.textSize(12);
    p.fill(160);
    p.text('HOUR  •  MIN  •  SEC', 0, 36);

  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
