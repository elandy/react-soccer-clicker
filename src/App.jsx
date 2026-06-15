import { useState } from 'react';
import './App.css';
import {
  GOAL_X,
  GOAL_Y,
  GOAL_WIDTH,
  GOAL_HEIGHT,
  BALL_START_RADIUS,
  KEEPER_START_RADIUS,
  BALL_START
} from './game/constants';

import GameCanvas from './components/GameCanvas';
import StatsPanel from './components/StatsPanel';
import UpgradePanel from './components/UpgradePanel';
import {isInsideGoal, isSaved, hitsPost} from './game/collision';
import {
  animateShot,
  animateRebound
} from './game/animations';
import { sounds } from './game/sounds';

export default function App() {
  // Stats
  const [kicks, setKicks] = useState(0);
  const [goals, setGoals] = useState(0);
  const [money, setMoney] = useState(0);
  const [recentShots, setRecentShots] = useState([]);

  // Upgrade levels
  const [trainingLevel, setTrainingLevel] = useState(0);

  const [ballUpgradeLevel, setBallUpgradeLevel] = useState(0);
  const ballRadius = Math.max(8, BALL_START_RADIUS - ballUpgradeLevel);

  const [goalieUpgradeLevel, setGoalieUpgradeLevel] = useState(0);
  const keeperRadius = Math.max(26, KEEPER_START_RADIUS - goalieUpgradeLevel * 2);

  const [prizeUpgradeLevel, setPrizeUpgradeLevel] = useState(0);
  const rewardMultiplier = Math.pow(2, prizeUpgradeLevel + 1);

  const [aimLevel, setAimLevel] = useState(0);

  // Game state
  const [isGoal, setIsGoal] = useState(null);

  const [animating, setAnimating] = useState(false);
  const [ballRotation, setBallRotation] = useState(0);

  const [ballPos, setBallPos] = useState(BALL_START);

  const [keeperPos, setKeeperPos] = useState({
    x: GOAL_X + GOAL_WIDTH / 2,
    y: GOAL_Y + GOAL_HEIGHT / 2
  });
  const [outcome, setOutcome] = useState(null);
  // outcome = { type: "GOAL", reward: 3 }
  const outcomeUI = {
    GOAL: { text: "GOAL", icon: "🥅", color: "green" },
    SAVED: { text: "SAVED", icon: "🧤", color: "blue" },
    POST: { text: "POST", icon: "📐", color: "orange" },
    OUTSIDE: { text: "OUT", icon: "❌", color: "red" }
  };

  // Aim area
  const AIM_PADDING_X = GOAL_WIDTH * 0.15;
  const AIM_PADDING_Y = GOAL_HEIGHT * 0.15;
  const BASE_WIDTH = GOAL_WIDTH + AIM_PADDING_X * 2;
  const BASE_HEIGHT = GOAL_HEIGHT + AIM_PADDING_Y * 2;
  const MIN_WIDTH = GOAL_WIDTH;
  const MIN_HEIGHT = GOAL_HEIGHT;

  const shrinkPerLevel = 0.97;
  const aimWidth = Math.max(MIN_WIDTH * 0.9, BASE_WIDTH * Math.pow(shrinkPerLevel, aimLevel));
  const aimHeight = Math.max(MIN_HEIGHT * 0.9, BASE_HEIGHT * Math.pow(shrinkPerLevel, aimLevel));

  const UPGRADES = {
    training: { base: 20, max: 12, multiplier: 1.5 },
    ball: { base: 30, max: 12, multiplier: 1.5  },
    goalie: { base: 50, max: 12, multiplier: 1.5  },
    prize: { base: 5, max: 12, multiplier: 2  },
    aim: { base: 50, max: 12, multiplier: 1.5  }
  };

  function shoot() {
      if (animating) return;
      sounds.kick.currentTime = 0;
      sounds.kick.play();

      setAnimating(true);
      const aimX = GOAL_X + GOAL_WIDTH / 2 - aimWidth / 2;
      const aimY = GOAL_Y + GOAL_HEIGHT / 2 - aimHeight / 2;

      const targetBall = {
        x: aimX + Math.random() * aimWidth,
        y: aimY + Math.random() * aimHeight
      };

      const targetKeeper = {
        x:
          GOAL_X +
          keeperRadius +
          Math.random() * (GOAL_WIDTH - 2 * keeperRadius),

        y:
          GOAL_Y +
          keeperRadius +
          Math.random() * (GOAL_HEIGHT - 2 * keeperRadius)
      };

      const shotDuration =
        Math.max(
          200,
          800 - trainingLevel * 50
        );

      animateShot({
        startBall: BALL_START,
        targetBall,
        startKeeper: keeperPos,
        targetKeeper,
        duration: shotDuration,
        setBallPos,
        setKeeperPos,
        setBallRotation,
        onComplete: () => {
          const saved = isSaved(
            targetBall,
            targetKeeper,
            ballRadius,
            keeperRadius
          );

          const insideGoal = isInsideGoal(targetBall, ballRadius);

          const goal = insideGoal && !saved;

          setKicks(prev => prev + 1);

          if (goal) {
            sounds.cheer.currentTime = 0;
            sounds.cheer.play();
            setGoals(prev => prev + 1);
            setMoney(prev => prev + rewardMultiplier);
          }

          setIsGoal(goal);

          // ---- outcome system (correct 3-state logic)
          let newOutcome;

          if (hitsPost(targetBall, ballRadius)) {
            sounds.post.currentTime = 0;
            sounds.post.play();
            newOutcome = { type: "POST", reward: 0 };
          } else if (!insideGoal) {
            sounds.boo.currentTime = 0;
            sounds.boo.play();
            newOutcome = { type: "OUTSIDE", reward: 0 };
          } else if (saved) {
            sounds.boo.currentTime = 0;
            sounds.boo.play();
            newOutcome = { type: "SAVED", reward: 0 };
          } else {
            sounds.cheer.currentTime = 0;
            sounds.cheer.play();
            const reward = rewardMultiplier;
            newOutcome = { type: "GOAL", reward };
          }
          setOutcome(newOutcome);

          // rolling accuracy (should include goal result, not boolean ambiguity)
          setRecentShots(prev => {
            const updated = [...prev, goal];
            if (updated.length > 20) updated.shift();
            return updated;
          });

          // rebound only if saved
          if (saved) {
            const dx = targetBall.x - targetKeeper.x;
            const dy = targetBall.y - targetKeeper.y;
            const length = Math.sqrt(dx * dx + dy * dy);

            const reboundDistance = GOAL_HEIGHT * 1.1;

            const nx = length === 0 ? 0 : dx / length;
            const ny = length === 0 ? 1 : dy / length;

            const reboundX = targetBall.x + nx * reboundDistance;
            const reboundY = targetBall.y + Math.abs(ny) * reboundDistance;

            animateRebound({
              startPos: targetBall,
              endPos: { x: reboundX, y: reboundY },
              duration: shotDuration / 2,
              setBallPos,
              setBallRotation,
              onComplete: () => setAnimating(false)
            });
          } else {
            setAnimating(false);
          }
        }
      });
    }

  function getUpgradeCost(type, level) {
    const baseCost = UPGRADES[type].base;
    return Math.floor(baseCost * Math.pow(UPGRADES[type].multiplier, level));
  }

  function buyUpgrade(type, level, setLevel) {
    if (level >= UPGRADES[type].max) return;

    const cost = getUpgradeCost(type, level);

    if (money < cost) return;

    setMoney(m => m - cost);
    setLevel(l => l + 1);
  }



  const accuracy =
    kicks === 0
      ? 0
      : ((goals / kicks) * 100).toFixed(1);
  const recentGoals =
  recentShots.filter(Boolean).length;

  const rollingAccuracy =
    recentShots.length === 0
      ? 0
      : (
          (recentGoals / recentShots.length) *
          100
        ).toFixed(1);

  const buyTraining = () => buyUpgrade("training", trainingLevel, setTrainingLevel);
  const buyBallUpgrade = () => buyUpgrade("ball", ballUpgradeLevel, setBallUpgradeLevel);
  const buyGoalieUpgrade = () => buyUpgrade("goalie", goalieUpgradeLevel, setGoalieUpgradeLevel);
  const buyPrizeUpgrade = () => buyUpgrade("prize", prizeUpgradeLevel, setPrizeUpgradeLevel);
  const buyAimUpgrade = () => buyUpgrade("aim", aimLevel, setAimLevel);

  const trainingCost = getUpgradeCost("training", trainingLevel);
  const ballCost = getUpgradeCost("ball", ballUpgradeLevel);
  const goalieCost = getUpgradeCost("goalie", goalieUpgradeLevel);
  const prizeCost = getUpgradeCost("prize", prizeUpgradeLevel);
  const aimCost = getUpgradeCost("aim", aimLevel);

  return (
      <div className="app">
        <div className="field-panel">
            <h1>Soccer Clicker</h1>

            <GameCanvas
              ballPos={ballPos}
              keeperPos={keeperPos}
              ballRadius={ballRadius}
              keeperRadius={keeperRadius}
              ballRotation={ballRotation}
              aimWidth={aimWidth}
              aimHeight={aimHeight}
            />

            <button onClick={shoot} disabled={animating}>
              {animating ? 'Shooting...' : 'Take the shot!'}
            </button>
            {isGoal !== null && (
              <h2 style={{ color: outcomeUI[outcome.type].color }}>
                {outcomeUI[outcome.type].icon} {outcomeUI[outcome.type].text}
                {outcome.type === "GOAL" && (<span> — +${outcome.reward}</span>)}
              </h2>
            )}

        </div>

        <div className="control-panel">


          <StatsPanel
            money={money}
            kicks={kicks}
            goals={goals}
            accuracy={accuracy}
            rollingAccuracy={rollingAccuracy}
          />

          <hr />

        <UpgradePanel
          money={money}

          trainingLevel={trainingLevel}
          ballUpgradeLevel={ballUpgradeLevel}
          goalieUpgradeLevel={goalieUpgradeLevel}
          prizeUpgradeLevel={prizeUpgradeLevel}
          aimLevel={aimLevel}

          trainingCost={trainingCost}
          ballCost={ballCost}
          goalieCost={goalieCost}
          prizeCost={prizeCost}
          aimCost={aimCost}
          rewardMultiplier={rewardMultiplier}

          buyTraining={buyTraining}
          buyBallUpgrade={buyBallUpgrade}
          buyGoalieUpgrade={buyGoalieUpgrade}
          buyPrizeUpgrade={buyPrizeUpgrade}
          buyAimUpgrade={buyAimUpgrade}
        />
        </div>
      </div>
    );
}
