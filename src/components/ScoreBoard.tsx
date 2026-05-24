import type { GameMode, GameStats } from '../types/game';

type ScoreBoardProps = {
  mode: GameMode;
  stats: GameStats;
  timeLeft: number;
  questionLimit: number;
};

export function ScoreBoard({ mode, stats, timeLeft, questionLimit }: ScoreBoardProps) {
  const progress =
    mode === 'timed' ? `${timeLeft}s` : `${Math.min(stats.answered + 1, questionLimit)}/${questionLimit}`;

  return (
    <section className="score-board" aria-label="Score">
      <div className="score-item">
        <span>Score</span>
        <strong>{stats.score}</strong>
      </div>
      <div className="score-item">
        <span>Correct</span>
        <strong>
          {stats.correct}/{stats.answered}
        </strong>
      </div>
      <div className="score-item">
        <span>Streak</span>
        <strong>{stats.streak}</strong>
      </div>
      <div className="score-item">
        <span>{mode === 'timed' ? 'Time' : 'Step'}</span>
        <strong>{progress}</strong>
      </div>
    </section>
  );
}
