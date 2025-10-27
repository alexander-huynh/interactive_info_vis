// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  const HORIZON_Y = 220;   // y-position of horizon line
  const SUN_Y = 160;   // fixed sun height above horizon
  const MARGIN = 40;    // left/right padding
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
    p.background(10);

    // horizon
    p.stroke(120);
    p.line(0, HORIZON_Y, p.width, HORIZON_Y);

    // 25-minute smooth progress left -> right
    const t = ((p.minute() % 25) + p.second() / 60) / 25; // 0..1
    const x = p.lerp(MARGIN, p.width - MARGIN, t);

    // sun
    p.noStroke();
    p.fill(255, 200, 0);
    p.circle(x, SUN_Y, 40);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
