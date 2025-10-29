// Instance-mode sketch for tab 3
registerSketch('sk3', function (p) {
  const HORIZON_Y = 220;   // y-position of horizon line
  const SUN_Y = 160;   // fixed sun height above horizon
  const MARGIN = 40;    // left/right padding
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };
  p.draw = function () {
  // 25-minute progress 0..1
  const t = ((p.minute() % 25) + p.second() / 60) / 25;

  // sky: twilight → daylight
  const skyStart = p.color(20, 28, 48);
  const skyEnd   = p.color(180, 210, 255);
  p.background(p.lerpColor(skyStart, skyEnd, t));


    // horizon
    p.stroke(120);
    p.line(0, HORIZON_Y, p.width, HORIZON_Y);

    const groundStart = p.color(40, 70, 50);
const groundEnd = p.color(200, 190, 140);
p.noStroke();
p.fill(p.lerpColor(groundStart, groundEnd, t));
p.rect(0, HORIZON_Y, p.width, p.height - HORIZON_Y);

    // 25-minute smooth progress left -> right
    const x = p.lerp(MARGIN, p.width - MARGIN, t);

    p.push();
    p.noStroke();
    const pulse = 0.5 + 0.5 * p.sin((p.millis() / 1000) * p.TWO_PI); // 0..1
    p.fill(255, 200, 0, 80); // semi-transparent glow
    p.circle(x, SUN_Y, 40 + 18 * pulse);
    p.pop();

    // sun
    p.noStroke();
    p.fill(255, 200, 0);
    p.circle(x, SUN_Y, 40);
  };
  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
