export type DifficultyConfig = {
  stage: number;
  label: string;
  min: number;
  max: number;
  allowTrivialPrimes: boolean;
  allowEvenComposites: boolean;
  allowMultiplesOfFive: boolean;
};

const DIFFICULTIES: DifficultyConfig[] = [
  {
    stage: 1,
    label: 'Opening phrase',
    min: 1,
    max: 50,
    allowTrivialPrimes: true,
    allowEvenComposites: true,
    allowMultiplesOfFive: true,
  },
  {
    stage: 2,
    label: 'Blue interval',
    min: 1,
    max: 100,
    allowTrivialPrimes: false,
    allowEvenComposites: true,
    allowMultiplesOfFive: true,
  },
  {
    stage: 3,
    label: 'Silent ascent',
    min: 1,
    max: 300,
    allowTrivialPrimes: false,
    allowEvenComposites: false,
    allowMultiplesOfFive: true,
  },
  {
    stage: 4,
    label: 'High changes',
    min: 1,
    max: 1000,
    allowTrivialPrimes: false,
    allowEvenComposites: false,
    allowMultiplesOfFive: false,
  },
  {
    stage: 5,
    label: 'Thin air',
    min: 1,
    max: 10000,
    allowTrivialPrimes: false,
    allowEvenComposites: false,
    allowMultiplesOfFive: false,
  },
];

export function getDifficulty(stage: number): DifficultyConfig {
  const index = Math.min(Math.max(Math.floor(stage), 1), DIFFICULTIES.length) - 1;
  return DIFFICULTIES[index];
}

export function getStageForQuestion(questionNumber: number): number {
  if (questionNumber <= 3) {
    return 1;
  }

  if (questionNumber <= 6) {
    return 2;
  }

  if (questionNumber <= 10) {
    return 3;
  }

  if (questionNumber <= 14) {
    return 4;
  }

  return 5;
}
