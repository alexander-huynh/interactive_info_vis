// Example 5
registerSketch('sk9', function (p) {

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

    // Center + sizing
    p.translate(p.width / 2, p.height / 2);
    const R = p.min(p.width, p.height) * 0.45;   // outer radius

    // Angles (0° at 12 o'clock)
    const aS = p.map(s, 0, 60, 0, 360) - 90;
    const aM = p.map(m, 0, 60, 0, 360) - 90;
    const aH = p.map(h, 0, 12, 0, 360) - 90;

    // Draw glowing sun at center
    for (let r = 120; r > 0; r -= 10) {
      p.fill(255, 180, 0, p.map(r, 120, 0, 10, 255));
      p.circle(0, 0, r * 1.5);
    }

    // Radii for orbits
    const rS = 180;
    const rM = 130;
    const rH = 80;

    // Second "planet"
    p.fill(100, 180, 255);
    p.circle(p.cos(aS) * rS, p.sin(aS) * rS, 20);

    // Minute "planet"
    p.fill(100, 255, 150);
    p.circle(p.cos(aM) * rM, p.sin(aM) * rM, 30);

    // Hour "planet"
    p.fill(255, 100, 150);
    p.circle(p.cos(aH) * rH, p.sin(aH) * rH, 40);

    // Orbits (thin glowing rings)
    p.noFill();
    p.stroke(255, 255, 255, 40);
    p.strokeWeight(2);
    p.ellipse(0, 0, rS * 2, rS * 2);
    p.ellipse(0, 0, rM * 2, rM * 2);
    p.ellipse(0, 0, rH * 2, rH * 2);

  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
