import {
  GOAL_HEIGHT,
  GOAL_WIDTH,
  GOAL_X,
  GOAL_Y
} from "./constants";

export type Vec2 = {
  x: number;
  y: number;
};

export function isInsideGoal(ball: Vec2, ballRadius: number): boolean {
  return (
    ball.x - ballRadius >= GOAL_X &&
    ball.x + ballRadius <= GOAL_X + GOAL_WIDTH &&
    ball.y - ballRadius >= GOAL_Y &&
    ball.y + ballRadius <= GOAL_Y + GOAL_HEIGHT
  );
}

export function isSaved(
  ball: Vec2,
  keeper: Vec2,
  ballRadius: number,
  keeperRadius: number
): boolean {
  const dx = ball.x - keeper.x;
  const dy = ball.y - keeper.y;

  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= ballRadius + keeperRadius;
}

export function hitsPost(p: Vec2, ballRadius: number): boolean {
  const left = GOAL_X;
  const right = GOAL_X + GOAL_WIDTH;
  const top = GOAL_Y;
  const bottom = GOAL_Y + GOAL_HEIGHT;

  const hitsLeftPost =
    Math.abs(p.x - left) <= ballRadius &&
    p.y >= top &&
    p.y <= bottom;

  const hitsRightPost =
    Math.abs(p.x - right) <= ballRadius &&
    p.y >= top &&
    p.y <= bottom;

  const hitsTopPost =
    Math.abs(p.y - top) <= ballRadius &&
    p.x >= left &&
    p.x <= right;

  const hitsBottomPost =
    Math.abs(p.y - bottom) <= ballRadius &&
    p.x >= left &&
    p.x <= right;

  return hitsLeftPost || hitsRightPost || hitsTopPost || hitsBottomPost;
}