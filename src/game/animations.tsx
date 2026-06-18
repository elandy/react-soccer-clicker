// animations.ts

type Vec2 = {
  x: number;
  y: number;
};

type SetVec2 = React.Dispatch<React.SetStateAction<Vec2>>;
type SetRotation = React.Dispatch<React.SetStateAction<number>>;

type AnimateShotParams = {
  startBall: Vec2;
  targetBall: Vec2;
  startKeeper: Vec2;
  targetKeeper: Vec2;
  duration: number;
  setBallPos: SetVec2;
  setKeeperPos: SetVec2;
  setBallRotation: SetRotation;
  onComplete: () => void;
};

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
}: AnimateShotParams) {
  const startTime = performance.now();

  function frame(now: number) {
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

type AnimateReboundParams = {
  startPos: Vec2;
  endPos: Vec2;
  duration: number;
  setBallPos: SetVec2;
  setBallRotation: SetRotation;
  onComplete: () => void;
};

export function animateRebound({
  startPos,
  endPos,
  duration,
  setBallPos,
  setBallRotation,
  onComplete
}: AnimateReboundParams) {
  const startTime = performance.now();

  function frame(now: number) {
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

export function lerp(start: number, end: number, t: number): number {
  return start + (end - start) * t;
}