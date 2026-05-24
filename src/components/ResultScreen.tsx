import type { AnswerHistory, GameMode, GameStats } from '../types/game';

type ResultScreenProps = {
  mode: GameMode;
  stats: GameStats;
  history: AnswerHistory[];
  onRestart: (mode: GameMode) => void;
  onTitle: () => void;
};

function formatElapsed(elapsedMs?: number): string {
  if (elapsedMs === undefined) {
    return '-';
  }

  return `${(elapsedMs / 1000).toFixed(1)}s`;
}

export function ResultScreen({ mode, stats, history, onRestart, onTitle }: ResultScreenProps) {
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

      <details className="answer-history-panel" open>
        <summary>Answer History</summary>
        <div className="answer-history-list">
          {history.map((item) => (
            <article
              className={`answer-history-card ${
                item.isCorrect ? 'answer-history-card--correct' : 'answer-history-card--wrong'
              }`}
              key={`${item.questionNumber}-${item.selectedAnswer}-${item.correctAnswer}`}
            >
              <div className="history-card-header">
                <strong>Q{item.questionNumber}</strong>
                <span>Stage {item.stage}</span>
                <span>{formatElapsed(item.elapsedMs)}</span>
              </div>
              <p>
                <span>Choices</span>
                {item.choices.join(' / ')}
              </p>
              <p>
                <span>Your answer</span>
                {item.selectedAnswer}
              </p>
              <p>
                <span>Result</span>
                <strong className={item.isCorrect ? 'result-correct' : 'result-wrong'}>
                  {item.isCorrect ? 'Correct' : 'Wrong'}
                </strong>
              </p>
              {!item.isCorrect ? (
                <p>
                  <span>Prime</span>
                  {item.correctAnswer}
                </p>
              ) : null}
            </article>
          ))}
        </div>
      </details>

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
