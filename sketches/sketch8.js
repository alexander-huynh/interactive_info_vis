// Example 4
registerSketch('sk8', function (p) {

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

    // Draw the clock background
    p.noStroke();
    p.fill(244, 122, 158);
    p.ellipse(0, 0, R * 2 + 25, R * 2 + 25);
    p.fill(237, 34, 93);
    p.ellipse(0, 0, R * 2, R * 2);

    // Calculate angle for each hand
    let secondAngle = p.map(s, 0, 60, 0, 360);
    let minuteAngle = p.map(m, 0, 60, 0, 360);
    let hourAngle = p.map(h, 0, 12, 0, 360);

    p.stroke(255);

    // Second hand
    p.push();
    p.rotate(secondAngle);
    p.strokeWeight(1);
    p.line(0, 0, 0, -R * 0.8);
    p.pop();

    // Minute hand
    p.push();
    p.strokeWeight(2);
    p.rotate(minuteAngle);
    p.line(0, 0, 0, -R * 0.6);
    p.pop();

    // Hour hand
    p.push();
    p.strokeWeight(4);
    p.rotate(hourAngle);
    p.line(0, 0, 0, -R * 0.4);
    p.pop();

    // Tick markers around perimeter of clock
    p.push();
    p.strokeWeight(2);
    for (let ticks = 0; ticks < 60; ticks += 1) {
      p.point(0, -R * 0.8);
      p.rotate(6);
    }
    p.pop();


  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
