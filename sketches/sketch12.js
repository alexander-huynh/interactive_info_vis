// Example 8

registerSketch('sk12', function (p) {
  
  // Config
  const WORK_MIN = 25;
  const SHORT_MIN = 5;
  const LONG_MIN = 15;
  const LONG_EVERY = 4;

  // State
  let phase = 'work';
  let running = false;
  let startMs = 0;
  let elapsedMs = 0;
  let completedWorks = 0;
  let totalWorks = 0;
  const buttons = [];

  p.setup = function () {
    p.createCanvas(650, 700);
    p.angleMode(p.DEGREES);
    p.textFont('Georgia');

    buttons.push(makeBtn('Start', 0, 0, toggleRun));
    buttons.push(makeBtn('Reset', 0, 0, resetPhase));
    buttons.push(makeBtn('Skip', 0, 0, skipPhase));
  };

  p.draw = function () {
    // Background gradient
    for (let y = 0; y < p.height; y++) {
      const inter = p.map(y, 0, p.height, 0, 1);
      const c = p.lerpColor(p.color('#f9e6f0'), p.color('#f3f0fa'), inter);
      p.stroke(c);
      p.line(0, y, p.width, y);
    }

    const cx = p.width / 2;
    const cy = p.height / 2;
    const R = p.min(p.width, p.height) * 0.36;

    const col = phaseColor(phase);

    const durMs = minutesToMs(currentPhaseMinutes());
    const tMs = p.constrain(getElapsedMs(), 0, durMs);
    const remainMs = p.max(0, durMs - tMs);
    const progress = durMs === 0 ? 0 : tMs / durMs;

    if (running && remainMs <= 0) onPhaseComplete();

    // Title
    p.fill(80, 50, 80);
    p.noStroke();
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(20);
    p.text(phaseTitle(), cx, cy - R - 36);

    // Soft shadow ring
    p.push();
    p.translate(cx, cy);
    p.rotate(-90);
    p.noFill();
    p.stroke(255, 200);
    p.strokeWeight(24);
    p.arc(0, 0, R * 2, R * 2, 0, 360);

    // progress ring
    p.stroke(col);
    p.strokeWeight(26);
    p.arc(0, 0, R * 2, R * 2, 0, 360 * progress);

    // glowing endpoint
    const a = 360 * progress;
    const ex = p.cos(a) * R;
    const ey = p.sin(a) * R;
    p.noStroke();
    p.fill(col);
    p.circle(ex, ey, 18);
    p.pop();

    // Gentle center glow
    p.noStroke();
    p.fill(p.red(col), p.green(col), p.blue(col), 40);
    p.circle(cx, cy, R * 1.35);

    // Digital timer
    const { mm, ss } = msToMMSS(remainMs);
    p.fill(60, 40, 70);
    p.textSize(44);
    p.text(`${mm}:${ss}`, cx, cy - 4);

    // Progress info
    p.textSize(13);
    p.fill(110, 80, 120);
    p.textAlign(p.CENTER, p.TOP);
    p.text(`Pomodoros: ${totalWorks}   •   Cycle: ${completedWorks % LONG_EVERY}/${LONG_EVERY}`, cx, cy + 18);

    // Buttons
    layoutButtons(cx, cy + R + 32);
    drawButtons();

    // Hint
    p.fill(130, 100, 140);
    p.textSize(11);
    p.textAlign(p.CENTER, p.TOP);
    p.text('Space: Start/Pause   •   R: Reset   •   N: Skip', cx, p.height - 26);
  };

  // Logic
  function toggleRun() {
    running = !running;
    labelButton('Start', running ? 'Pause' : 'Start');
    if (running) startMs = p.millis();
    else elapsedMs = getElapsedMs();
  }

  function resetPhase() {
    running = false;
    labelButton('Start', 'Start');
    startMs = p.millis();
    elapsedMs = 0;
  }

  function skipPhase() {
    running = false;
    labelButton('Start', 'Start');
    onPhaseComplete(true);
  }

  function onPhaseComplete(skipped = false) {
    if (phase === 'work' && !skipped) {
      completedWorks++;
      totalWorks++;
    }

    if (phase === 'work') {
      if (completedWorks > 0 && completedWorks % LONG_EVERY === 0) phase = 'long';
      else phase = 'short';
    } else phase = 'work';

    elapsedMs = 0;
    startMs = p.millis();
    running = true;
    labelButton('Start', 'Pause');
  }

  function currentPhaseMinutes() {
    if (phase === 'work') return WORK_MIN;
    if (phase === 'short') return SHORT_MIN;
    return LONG_MIN;
  }

  function phaseTitle() {
    if (phase === 'work') return 'Focus Time 🌸';
    if (phase === 'short') return 'Short Break ☕';
    return 'Long Break 💗';
  }

  function getElapsedMs() {
    return running ? (p.millis() - startMs) + elapsedMs : elapsedMs;
  }

  function minutesToMs(mins) {
    return mins * 60 * 1000;
  }

  function msToMMSS(ms) {
    const total = p.max(0, p.round(ms / 1000));
    const m = p.floor(total / 60);
    const s = total % 60;
    return { mm: p.nf(m, 2), ss: p.nf(s, 2) };
  }

  function phaseColor(phase) {
    if (phase === 'work') return p.color('#F6A5C0'); // rose
    if (phase === 'short') return p.color('#B5EAD7'); // mint
    return p.color('#C7CEEA'); // lavender
  }

  // Buttons
  function makeBtn(label, x, y, onClick) {
    return { label, x, y, w: 90, h: 34, onClick, hover: false };
  }

  function labelButton(oldText, newText) {
    const b = buttons.find(btn => btn.label === oldText || (oldText === 'Start' && (btn.label === 'Start' || btn.label === 'Pause')));
    if (b) b.label = newText;
  }

  function layoutButtons(cx, baselineY) {
    const gap = 12;
    const totalW = buttons.length * 90 + (buttons.length - 1) * gap;
    let x = cx - totalW / 2;
    for (let b of buttons) {
      b.x = x;
      b.y = baselineY;
      x += 90 + gap;
    }
  }

  function drawButtons() {
    p.textAlign(p.CENTER, p.CENTER);
    p.textSize(14);
    for (let b of buttons) {
      b.hover = p.mouseX >= b.x && p.mouseX <= b.x + b.w &&
                p.mouseY >= b.y && p.mouseY <= b.y + b.h;

      p.stroke(255, 150);
      p.strokeWeight(1);
      p.fill(b.hover ? '#f6d7eb' : '#f9e6f0');
      p.rect(b.x, b.y, b.w, b.h, 20);

      if (b.label === 'Start' || b.label === 'Pause') p.fill(phaseColor(phase));
      else p.fill(120, 90, 120);

      p.noStroke();
      p.text(b.label, b.x + b.w / 2, b.y + b.h / 2);
    }
  }

  p.mousePressed = function () {
    for (let b of buttons) {
      if (p.mouseX >= b.x && p.mouseX <= b.x + b.w &&
          p.mouseY >= b.y && p.mouseY <= b.y + b.h) {
        b.onClick();
        return;
      }
    }
  };

  p.keyPressed = function () {
    if (p.key === ' ') toggleRun();
    if (p.key === 'r' || p.key === 'R') resetPhase();
    if (p.key === 'n' || p.key === 'N') skipPhase();
  };


  p.windowResized = function () { p.resizeCanvas(p.windowWidth, p.windowHeight); };
});
