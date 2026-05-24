import { useCallback, useEffect, useRef, useState } from 'react';
import { GameScreen } from './components/GameScreen';
import { PrimeTablePage } from './components/PrimeTablePage';
import { ResultScreen } from './components/ResultScreen';
import { TitleScreen } from './components/TitleScreen';
import { getStageForQuestion } from './lib/difficulty';
import { generateQuestion, type Question } from './lib/question';
import type { AnswerHistory, GameMode, GameStats } from './types/game';

type Screen = 'title' | 'game' | 'result' | 'prime-table';

type Feedback = {
  selected: number;
  isCorrect: boolean;
};

type ResultState = {
  mode: GameMode;
  stats: GameStats;
  history: AnswerHistory[];
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
  const [history, setHistory] = useState<AnswerHistory[]>([]);
  const [result, setResult] = useState<ResultState | null>(null);
  const [timeLeft, setTimeLeft] = useState(TIMED_SECONDS);
  const timerStartedAt = useRef<number>(0);
  const questionStartedAt = useRef<number>(Date.now());
  const autoAdvanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const statsRef = useRef(stats);
  const historyRef = useRef(history);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  useEffect(() => {
    historyRef.current = history;
  }, [history]);

  const clearAutoAdvance = useCallback(() => {
    if (autoAdvanceTimer.current) {
      clearTimeout(autoAdvanceTimer.current);
      autoAdvanceTimer.current = null;
    }
  }, []);

  const finishGame = useCallback(
    (finalStats: GameStats = statsRef.current, finalHistory: AnswerHistory[] = historyRef.current) => {
      clearAutoAdvance();
      setResult({ mode, stats: finalStats, history: finalHistory });
      setFeedback(null);
      setScreen('result');
    },
    [clearAutoAdvance, mode],
  );

  const moveToNextQuestion = useCallback(
    (latestStats: GameStats = statsRef.current, latestHistory: AnswerHistory[] = historyRef.current) => {
      clearAutoAdvance();

      if (mode === 'ascent' && latestStats.answered >= NORMAL_QUESTION_LIMIT) {
        finishGame(latestStats, latestHistory);
        return;
      }

      setQuestion(createQuestion(latestStats.answered));
      questionStartedAt.current = Date.now();
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
      statsRef.current = freshStats;
      setHistory([]);
      historyRef.current = [];
      setQuestion(createQuestion(0));
      questionStartedAt.current = Date.now();
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
      const elapsedMs = Date.now() - questionStartedAt.current;
      const nextStreak = isCorrect ? stats.streak + 1 : 0;
      const nextStats: GameStats = {
        correct: stats.correct + (isCorrect ? 1 : 0),
        answered: stats.answered + 1,
        streak: nextStreak,
        bestStreak: Math.max(stats.bestStreak, nextStreak),
        score: stats.score + (isCorrect ? getScoreForCorrectAnswer(question.stage, nextStreak) : 0),
      };
      const historyItem: AnswerHistory = {
        questionNumber: stats.answered + 1,
        stage: question.stage,
        choices: [...question.choices],
        correctAnswer: question.answer,
        selectedAnswer: value,
        isCorrect,
        elapsedMs,
      };
      const nextHistory = [...historyRef.current, historyItem];

      setStats(nextStats);
      statsRef.current = nextStats;
      setHistory(nextHistory);
      historyRef.current = nextHistory;
      setFeedback({ selected: value, isCorrect });

      autoAdvanceTimer.current = setTimeout(() => {
        moveToNextQuestion(nextStats, nextHistory);
      }, 1000);
    },
    [feedback, moveToNextQuestion, question, stats],
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
        <TitleScreen onStart={startGame} onOpenPrimeTable={() => setScreen('prime-table')} />
      </div>
    );
  }

  if (screen === 'prime-table') {
    return (
      <div className="app-shell">
        <PrimeTablePage onStart={startGame} onTitle={() => setScreen('title')} />
      </div>
    );
  }

  if (screen === 'result' && result) {
    return (
      <div className="app-shell">
        <ResultScreen
          mode={result.mode}
          stats={result.stats}
          history={result.history}
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
