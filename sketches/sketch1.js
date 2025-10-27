// Instance-mode sketch registered as 'sk1'
registerSketch('sk1', function (p) {
  let horizon;

  p.setup = function () {
    // size to the full window so canvas always matches the viewport
    p.createCanvas(p.windowWidth, p.windowHeight);
    p.noStroke();
    horizon = p.height / 2;
  };

  p.draw = function () {
    const shapeHeight = p.mouseY;
    const currentWidth = p.mouseX;
    horizon = p.height / 2;

    if (shapeHeight < horizon) p.background('lightblue');
    else p.background('grey');

    p.fill('orange');
    p.ellipse(p.width / 2, shapeHeight, 100, 100);
    p.textSize(20);
    p.fill('black');
    p.text('Play with the sun!', currentWidth / 2, shapeHeight / 2);

    p.fill('sandybrown');
    p.rect(0, horizon, p.width, p.height);
  };

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    horizon = p.height / 2;
  };
});

