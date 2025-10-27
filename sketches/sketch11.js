// Example 7

// Simple p5.js Clock Template
// Adapted from Golan Levin, 2016-2018

registerSketch('sk11', function (p) {

  let prevSec;
  let milliRollovertime;

  p.setup = function () {
    p.createCanvas(300, 300);
    milliRollovertime = 0;
  };

  p.draw = function () {
    p.background(255, 200, 200);
    p.clock();
  }

  p.clock = function () {
    let h = p.hour();
    let m = p.minute();
    let s = p.second();

    // Reckon the current millisecond, 
    // particularly if the second has rolled over.
    // Note that this is more correct than using millis()%1000;
    if (prevSec != s) {
      p.millisRolloverTime = p.millis();
    }
    prevSec = s;
    var mils = p.floor(p.millis() - p.millisRolloverTime);

    p.noStroke();
    p.fill('black');
    var currTimeString = "Time: " + (h % 12) + ":" + p.nf(m, 2) + ":" + p.nf(s, 2) + ((h > 12) ? "pm" : "am");
    p.text(currTimeString, 10, 25);
    p.text("Hour: " + h, 10, 40);
    p.text("Minute: " + m, 10, 55);
    p.text("Second: " + s, 10, 70);
    p.text("Millis: " + mils, 10, 85);

    var hourBarWidth = p.map(h, 0, 23, 0, p.width);
    var minuteBarWidth = p.map(m, 0, 59, 0, p.width);
    var secondBarWidth = p.map(s, 0, 59, 0, p.width);

    // Make a bar which *smoothly* interpolates across 1 minute.
    // We calculate a version that goes from 0...60, 
    // but with a fractional remainder:
    var secondsWithFraction = s + (mils / 1000.0);
    var secondsWithNoFraction = s;
    var secondBarWidthChunky = p.map(secondsWithNoFraction, 0, 60, 0, p.width);
    var secondBarWidthSmooth = p.map(secondsWithFraction, 0, 60, 0, p.width);

    p.fill(40);
    p.rect(0, 100, hourBarWidth, 50);
    p.fill(80);
    p.rect(0, 150, minuteBarWidth, 50);
    p.fill(120);
    p.rect(0, 200, secondBarWidthChunky, 50);
    p.fill(160);
    p.rect(0, 250, secondBarWidthSmooth, 50);


  }


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
