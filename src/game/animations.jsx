export function animateShot({
  startBall,
  targetBall,
  startKeeper,
  targetKeeper,
  duration,
  setBallPos,
  setKeeperPos,
  setBallRotation,
  onComplete
}) {
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);

    setBallPos({
      x: lerp(startBall.x, targetBall.x, t),
      y: lerp(startBall.y, targetBall.y, t)
    });

    setBallRotation(t * Math.PI * 6);

    setKeeperPos({
      x: lerp(startKeeper.x, targetKeeper.x, t),
      y: lerp(startKeeper.y, targetKeeper.y, t)
    });

    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      onComplete();
    }
  }

  requestAnimationFrame(frame);
}

export function animateRebound({
  startPos,
  endPos,
  duration,
  setBallPos,
  setBallRotation,
  onComplete
}) {
  const startTime = performance.now();

  function frame(now) {
    const elapsed = now - startTime;
    const t = Math.min(elapsed / duration, 1);

    setBallPos({
      x: lerp(startPos.x, endPos.x, t),
      y: lerp(startPos.y, endPos.y, t)
    });
    setBallRotation(prev => prev + 0.15);
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      onComplete();
    }
  }

  requestAnimationFrame(frame);
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}