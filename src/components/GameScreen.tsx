import type { GameMode, GameStats } from '../App';
import type { Question } from '../lib/question';
import { getDifficulty } from '../lib/difficulty';
import { NumberCard, type NumberCardState } from './NumberCard';
import { ScoreBoard } from './ScoreBoard';

type Feedback = {
  selected: number;
  isCorrect: boolean;
};

type GameScreenProps = {
  mode: GameMode;
  question: Question;
  stats: GameStats;
  feedback: Feedback | null;
  timeLeft: number;
  questionLimit: number;
  onChoose: (value: number) => void;
  onNext: () => void;
};

function getCardState(choice: number, question: Question, feedback: Feedback | null): NumberCardState {
  if (!feedback) {
    return 'idle';
  }

  if (choice === question.answer) {
    return 'correct';
  }

  if (choice === feedback.selected && !feedback.isCorrect) {
    return 'wrong';
  }

  return 'dim';
}

export function GameScreen({
  mode,
  question,
  stats,
  feedback,
  timeLeft,
  questionLimit,
  onChoose,
  onNext,
}: GameScreenProps) {
  const difficulty = getDifficulty(question.stage);
  const prompt = feedback
    ? feedback.isCorrect
      ? 'One step closer.'
      : `The prime was ${question.answer}. Keep your rhythm.`
    : 'Choose the only prime.';

  return (
    <main className="screen game-screen">
      <ScoreBoard mode={mode} stats={stats} timeLeft={timeLeft} questionLimit={questionLimit} />

      <section className="question-panel" aria-live="polite">
        <div className="stage-line">
          <span>Stage {question.stage}</span>
          <span>{difficulty.label}</span>
          <span>
            {question.range.min}-{question.range.max}
          </span>
        </div>
        <h2>{prompt}</h2>
        <p className="sequence-line">The sequence accelerates.</p>
      </section>

      <section className="choice-grid" aria-label="Number choices">
        {question.choices.map((choice) => (
          <NumberCard
            key={`${question.id}-${choice}`}
            value={choice}
            state={getCardState(choice, question, feedback)}
            disabled={Boolean(feedback)}
            onChoose={onChoose}
          />
        ))}
      </section>

      <div className="game-footer">
        <span>{mode === 'timed' ? 'Keep your rhythm.' : `Step ${stats.answered + 1}`}</span>
        {feedback ? (
          <button className="secondary-action compact" type="button" onClick={onNext}>
            Next Step
          </button>
        ) : null}
      </div>
    </main>
  );
}
