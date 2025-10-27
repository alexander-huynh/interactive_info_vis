// Example 9
registerSketch('sk13', function (p) {
  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight);
  };

  p.draw = function () {
    p.background(250);

    // Corner time display
    const h = p.hour();
    const m = p.minute();
    const s = p.second();
    // const label = p.nf(h, 2) + ':' + p.nf(m, 2) + ':' + p.nf(s, 2);

    //Line Width
    var begin = p.width / 20;
    var end = (p.width / 20) * 19;

    // Hour Line
    var hX = begin + (p.hour() / 23 * (end - begin));
    var hY = p.height / 4;

    p.noStroke();
    p.fill(1);
    p.textSize(50);
    p.text(p.nf(h, 2), hX - 30, hY - 40);

    p.strokeWeight(20)
    p.stroke('#413a49ff');
    p.line(end, hY, begin, hY);

    p.stroke('#bf9fe1ff');
    p.ellipse(hX, hY, 30, 30);

    p.strokeWeight(10)
    p.fill('white');
    p.ellipse(hX, hY, 20, 20);

    // Minute Line
    var mX = begin + (p.minute() / 59 * (end - begin));
    var mY = p.height / 4 * 2;

    p.noStroke();
    p.fill(1);
    p.textSize(50);
    p.text(p.nf(m, 2), mX - 30, mY - 40);

    p.strokeWeight(20)
    p.stroke('#413a49ff');
    p.line(end, mY, begin, mY);

    p.stroke('#bf9fe1ff');
    p.ellipse(mX, mY, 30, 30);

    p.strokeWeight(10)
    p.fill('white');
    p.ellipse(mX, mY, 20, 20);

    // Second Line
    var sX = begin + (p.second() / 59 * (end - begin));
    var sY = p.height / 4 * 3;

    p.noStroke();
    p.fill(1);
    p.textSize(50);
    p.text(p.nf(s, 2), sX - 30, sY - 40);

    p.strokeWeight(20)
    p.stroke('#413a49ff');
    p.line(end, sY, begin, sY);

    p.stroke('#bf9fe1ff');
    p.ellipse(sX, sY, 30, 30);

    p.strokeWeight(10)
    p.fill('white');
    p.ellipse(sX, sY, 20, 20);

  }

  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
