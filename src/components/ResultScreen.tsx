import type { GameMode, GameStats } from '../App';

type ResultScreenProps = {
  mode: GameMode;
  stats: GameStats;
  onRestart: (mode: GameMode) => void;
  onTitle: () => void;
};

export function ResultScreen({ mode, stats, onRestart, onTitle }: ResultScreenProps) {
  const accuracy = stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0;

  return (
    <main className="screen result-screen">
      <p className="eyebrow">Final cadence</p>
      <h1>{stats.score}</h1>
      <p className="lead">
        {stats.correct} primes found across {stats.answered} steps. Best streak: {stats.bestStreak}.
      </p>

      <section className="result-grid" aria-label="Result details">
        <div>
          <span>Accuracy</span>
          <strong>{accuracy}%</strong>
        </div>
        <div>
          <span>Mode</span>
          <strong>{mode === 'timed' ? '60s' : 'Ascent'}</strong>
        </div>
        <div>
          <span>Correct</span>
          <strong>{stats.correct}</strong>
        </div>
        <div>
          <span>Questions</span>
          <strong>{stats.answered}</strong>
        </div>
      </section>

      <div className="title-actions">
        <button className="primary-action" type="button" onClick={() => onRestart(mode)}>
          Play Again
        </button>
        <button className="secondary-action" type="button" onClick={onTitle}>
          Title
        </button>
      </div>
    </main>
  );
}
