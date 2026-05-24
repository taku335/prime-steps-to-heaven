export type GameMode = 'ascent' | 'timed';

export type GameStats = {
  correct: number;
  answered: number;
  streak: number;
  bestStreak: number;
  score: number;
};

export type AnswerHistory = {
  questionNumber: number;
  stage: number;
  choices: number[];
  correctAnswer: number;
  selectedAnswer: number;
  isCorrect: boolean;
  elapsedMs?: number;
};
