import { useCallback, useEffect, useRef, useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { TitleScreen } from './components/TitleScreen';
import { getStageForQuestion } from './lib/difficulty';
import { generateQuestion, type Question } from './lib/question';

export type GameMode = 'ascent' | 'timed';

export type GameStats = {
  correct: number;
  answered: number;
  streak: number;
  bestStreak: number;
  score: number;
};

type Screen = 'title' | 'game' | 'result';

type Feedback = {
  selected: number;
  isCorrect: boolean;
};

type ResultState = {
  mode: GameMode;
  stats: GameStats;
};

const NORMAL_QUESTION_LIMIT = 15;
const TIMED_SECONDS = 60;

const initialStats: GameStats = {
  correct: 0,
  answered: 0,
  streak: 0,
  bestStreak: 0,
  score: 0,
};

function getScoreForCorrectAnswer(stage: number, streak: number): number {
  return stage * 100 + streak * 15;
}

function createQuestion(answered: number): Question {
  return generateQuestion(getStageForQuestion(answered + 1));
}

function App() {
  const [screen, setScreen] = useState<Screen>('title');
  const [mode, setMode] = useState<GameMode>('ascent');
  const [stats, setStats] = useState<GameStats>(initialStats);
  const [question, setQuestion] = useState<Question>(() => createQuestion(0));
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [result, setResult] = useState<ResultState | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const timerStartedAt = useRef<number>(0);
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statsRef = useRef(stats);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  const finishGame = useCallback(
    (finalStats: GameStats = statsRef.current) => {
      clearAutoAdvance();
      setResult({ mode, stats: finalStats });
      setFeedback(null);
      setScreen('result');
    },
    [clearAutoAdvance, mode],
  );

  const moveToNextQuestion = useCallback(
    (latestStats: GameStats = statsRef.current) => {
      clearAutoAdvance();

      if (mode === 'ascent' && latestStats.answered >= NORMAL_QUESTION_LIMIT) {
        finishGame(latestStats);
        return;
      }

      setQuestion(createQuestion(latestStats.answered));
      setFeedback(null);
    },
    [clearAutoAdvance, finishGame, mode],
  );

  const startGame = useCallback(
    (nextMode: GameMode) => {
      clearAutoAdvance();
      const freshStats = { ...initialStats };
      setMode(nextMode);
      setStats(freshStats);
      setQuestion(createQuestion(0));
      setFeedback(null);
      setResult(null);
      setTimeLeft(TIMED_SECONDS);
      timerStartedAt.current = Date.now();
      setScreen('game');
    },
    [clearAutoAdvance],
  );

  const handleChoose = useCallback(
    (value: number) => {
      if (feedback) {
        return;
      }

      const isCorrect = value === question.answer;
      const nextStreak = isCorrect ? stats.streak + 1 : 0;
      const nextStats: GameStats = {
        correct: stats.correct + (isCorrect ? 1 : 0),
        answered: stats.answered + 1,
        streak: nextStreak,
        bestStreak: Math.max(stats.bestStreak, nextStreak),
        score: stats.score + (isCorrect ? getScoreForCorrectAnswer(question.stage, nextStreak) : 0),
      };

      setStats(nextStats);
      setFeedback({ selected: value, isCorrect });

      autoAdvanceTimer.current = setTimeout(() => {
        moveToNextQuestion(nextStats);
      }, 1000);
    },
    [feedback, moveToNextQuestion, question.answer, question.stage, stats],
  );

  useEffect(() => {
    if (screen !== 'game' || mode !== 'timed') {
      return;
    }

    const interval = window.setInterval(() => {
      const elapsed = Math.floor((Date.now() - timerStartedAt.current) / 1000);
      const remaining = Math.max(0, TIMED_SECONDS - elapsed);
      setTimeLeft(remaining);

      if (remaining <= 0) {
        finishGame();
      }
    }, 250);

    return () => window.clearInterval(interval);
  }, [finishGame, mode, screen]);

  useEffect(() => clearAutoAdvance, [clearAutoAdvance]);

  if (screen === 'title') {
    return (
      <div className="app-shell">
        <TitleScreen onStart={startGame} />
      </div>
    );
  }

  if (screen === 'result' && result) {
    return (
      <div className="app-shell">
        <ResultScreen
          mode={result.mode}
          stats={result.stats}
          onRestart={startGame}
          onTitle={() => setScreen('title')}
        />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <GameScreen
        mode={mode}
        question={question}
        stats={stats}
        feedback={feedback}
        timeLeft={timeLeft}
        questionLimit={NORMAL_QUESTION_LIMIT}
        onChoose={handleChoose}
        onNext={() => moveToNextQuestion()}
      />
    </div>
  );
}

export default App;
