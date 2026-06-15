export default function StatsPanel({
  money,
  kicks,
  goals,
  accuracy,
  rollingAccuracy
}) {
  return (
    <>
      <h2>Player</h2>
      <div className="stats-grid">

        <div className="stat-card">
          <strong>💰 Money</strong>
          <div>${money}</div>
        </div>

        <div className="stat-card">
          <strong>⚽ Kicks</strong>
          <div>{kicks}</div>
        </div>

        <div className="stat-card">
          <strong>🎯 Goals</strong>
          <div>{goals}</div>
        </div>

        <div className="stat-card">
          <strong>📊 Accuracy</strong>
          <div>{accuracy}%</div>
        </div>

        <div className="stat-card">
          <strong>🔥 Last 20</strong>
          <div>{rollingAccuracy}%</div>
        </div>

      </div>
    </>
  );
}