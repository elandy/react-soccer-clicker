import {useEffect, useRef, useState} from 'react';
import ballSprite from '../assets/Soccer_ball.svg';

import {
  CANVAS_WIDTH,
  CANVAS_HEIGHT,
  GOAL_X,
  GOAL_Y,
  GOAL_WIDTH,
  GOAL_HEIGHT
} from '../game/constants';

export default function GameCanvas({
  ballPos,
  keeperPos,
  ballRadius,
  keeperRadius,
  ballRotation,
  aimWidth,
  aimHeight
}) {

  const canvasRef = useRef(null);

  const ballImageRef = useRef(null);
  const [spriteLoaded, setSpriteLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();

    img.onload = () => {
      ballImageRef.current = img;
      setSpriteLoaded(true);
    };

    img.src = ballSprite;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.clearRect(
      0,
      0,
      canvas.width,
      canvas.height
    );

    // Grass stripes
    for (let i = 0; i < 10; i++) {
      ctx.fillStyle =
        i % 2 === 0
          ? '#2e8b57'
          : '#3aa364';

      ctx.fillRect(
        0,
        i * (CANVAS_HEIGHT / 10),
        CANVAS_WIDTH,
        CANVAS_HEIGHT / 10
      );
    }

    // Field markings
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;

    // Goal line
    ctx.beginPath();
    ctx.moveTo(GOAL_X + GOAL_WIDTH, 0);
    ctx.lineTo(GOAL_X + GOAL_WIDTH, CANVAS_HEIGHT);
    ctx.stroke();

    // Large penalty area boundary
    const penaltyAreaX = GOAL_X + GOAL_WIDTH + 280;

    ctx.beginPath();
    ctx.moveTo(penaltyAreaX, 0);
    ctx.lineTo(penaltyAreaX, CANVAS_HEIGHT);
    ctx.stroke();

    // Goal area boundary
    const goalAreaX = GOAL_X + GOAL_WIDTH + 100;

    ctx.beginPath();
    ctx.moveTo(goalAreaX, 0);
    ctx.lineTo(goalAreaX, CANVAS_HEIGHT);
    ctx.stroke();

    // Penalty spot
    const penaltySpotX = penaltyAreaX - 80;
    const penaltySpotY = CANVAS_HEIGHT / 2;

    ctx.beginPath();
    ctx.arc(
      penaltySpotX,
      penaltySpotY,
      3,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = 'white';
    ctx.fill();

    // Penalty arc
    ctx.beginPath();
    ctx.arc(
      penaltySpotX + 80,
      penaltySpotY,
      100,
      -Math.PI / 2,
      Math.PI / 2
    );
    ctx.stroke();

    // Goal frame
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'white';

    ctx.strokeRect(
      GOAL_X,
      GOAL_Y,
      GOAL_WIDTH,
      GOAL_HEIGHT
    );

    // AIM AREA (dashed rectangle)
    ctx.save();

    ctx.strokeStyle = 'rgba(255, 100, 100, 0.6)';
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);

    const aimX = GOAL_X + GOAL_WIDTH / 2 - aimWidth / 2;
    const aimY = GOAL_Y + GOAL_HEIGHT / 2 - aimHeight / 2;

    ctx.strokeRect(
      aimX,
      aimY,
      aimWidth,
      aimHeight
    );

    ctx.restore();


    // Goalkeeper
    ctx.beginPath();
    ctx.arc(
      keeperPos.x,
      keeperPos.y,
      keeperRadius,
      0,
      Math.PI * 2
    );
    ctx.fillStyle = '#0066ff';
    ctx.fill();

    // Ball sprite
    if (spriteLoaded) {
      ctx.save();

      ctx.translate(
        ballPos.x,
        ballPos.y
      );

      ctx.rotate(ballRotation);

      ctx.drawImage(
        ballImageRef.current,
        -ballRadius,
        -ballRadius,
        ballRadius * 2,
        ballRadius * 2
      );

      ctx.restore();
    }

  }, [ballPos, keeperPos, ballRadius, keeperRadius, ballRotation, spriteLoaded, aimWidth, aimHeight ]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      className="field-canvas"
    />
  );
}