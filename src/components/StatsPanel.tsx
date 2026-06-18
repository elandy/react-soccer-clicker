type StatsPanelProps = {
  money: number;
  kicks: number;
  goals: number;
  accuracy: string | number;
  rollingAccuracy: string | number;
};

export default function StatsPanel(props: StatsPanelProps) {
  return (
    <>
      <h2>Player</h2>
      <div className="stats-grid">

        <div className="stat-card">
          <strong>💰 Money</strong>
          <div>${props.money}</div>
        </div>

        <div className="stat-card">
          <strong>⚽ Kicks</strong>
          <div>{props.kicks}</div>
        </div>

        <div className="stat-card">
          <strong>🎯 Goals</strong>
          <div>{props.goals}</div>
        </div>

        <div className="stat-card">
          <strong>📊 Accuracy</strong>
          <div>{props.accuracy}%</div>
        </div>

        <div className="stat-card">
          <strong>🔥 Last 20</strong>
          <div>{props.rollingAccuracy}%</div>
        </div>

      </div>
    </>
  );
}