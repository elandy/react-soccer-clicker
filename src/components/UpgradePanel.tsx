type UpgradePanelProps = {
  money: number;

  trainingLevel: number;
  ballUpgradeLevel: number;
  goalieUpgradeLevel: number;
  prizeUpgradeLevel: number;
  aimLevel: number;

  trainingCost: number;
  ballCost: number;
  goalieCost: number;
  prizeCost: number;
  aimCost: number;

  rewardMultiplier: number;

  buyTraining: () => void;
  buyBallUpgrade: () => void;
  buyGoalieUpgrade: () => void;
  buyPrizeUpgrade: () => void;
  buyAimUpgrade: () => void;
};

export default function UpgradePanel({
  money,

  trainingLevel,
  ballUpgradeLevel,
  goalieUpgradeLevel,
  prizeUpgradeLevel,
  aimLevel,

  trainingCost,
  ballCost,
  goalieCost,
  prizeCost,
  aimCost,

  rewardMultiplier,

  buyTraining,
  buyBallUpgrade,
  buyGoalieUpgrade,
  buyPrizeUpgrade,
  buyAimUpgrade
}: UpgradePanelProps) {
  return (
    <>
      <h2>Upgrades</h2>

      <div className="upgrade-grid">

        <div className="upgrade-card">
          <button
            onClick={buyTraining}
            disabled={money < trainingCost || trainingLevel >= 12}
          >
            💪 Strength (${trainingCost})
          </button>
          <p>Level {trainingLevel}/12</p>
        </div>

        <div className="upgrade-card">
          <button
            onClick={buyBallUpgrade}
            disabled={money < ballCost || ballUpgradeLevel >= 12}
          >
            ⚽ Smaller Ball (${ballCost})
          </button>
          <p>Level {ballUpgradeLevel}/12</p>
        </div>

        <div className="upgrade-card">
          <button
            onClick={buyGoalieUpgrade}
            disabled={money < goalieCost || goalieUpgradeLevel >= 12}
          >
            🧤 Cripple Goalie (${goalieCost})
          </button>
          <p>Level {goalieUpgradeLevel}/12</p>
        </div>

        <div className="upgrade-card">
          <button
            onClick={buyAimUpgrade}
            disabled={money < aimCost || aimLevel >= 12}
          >
            🎯 Aim (${aimCost})
          </button>
          <p>Level {aimLevel}/12</p>
        </div>

        <div className="upgrade-card">
          <button
            onClick={buyPrizeUpgrade}
            disabled={money < prizeCost || prizeUpgradeLevel >= 12}
          >
            💰 Bigger Prize (${prizeCost})
          </button>

          <p>Level {prizeUpgradeLevel}/12</p>
          <p>Current Prize: {rewardMultiplier}</p>
        </div>

      </div>
    </>
  );
}