import { getDifficulty } from './difficulty';
import { isPrime, PRIME_LIST } from './prime';

export type Question = {
  id: string;
  stage: number;
  answer: number;
  choices: number[];
  range: {
    min: number;
    max: number;
  };
};

const TRICKY_COMPOSITES = [
  21, 27, 33, 39, 49, 51, 57, 77, 91, 119, 121, 143, 169, 187, 209, 217, 221,
  247, 253, 287, 299, 301, 319, 323, 341, 361, 377, 391, 403, 407, 437, 451,
  469, 481, 493, 511, 527, 529, 533, 551, 559, 589, 611, 629, 667, 689, 697,
  703, 713, 731, 779, 781, 799, 817, 841, 851, 869, 899, 901, 913, 923, 943,
  961, 979, 989, 1001, 1027, 1073, 1081, 1105, 1139, 1147, 1189, 1247, 1271,
  1333, 1363, 1387, 1411, 1463, 1517, 1537, 1591, 1681, 1711, 1763, 1829, 1849,
  1927, 1961, 2021, 2047, 2183, 2209, 2279, 2419, 2491, 2537, 2623, 2809, 2881,
  3127, 3233, 3277, 3367, 3481, 3599, 3721, 3869, 4033, 4189, 4371, 4489, 4757,
  5041, 5183, 5329, 5461, 5767, 6241, 6557, 6887, 7081, 7387, 7663, 7921, 8051,
  8281, 8633, 8999, 9409, 9797,
];

function randomChoice<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)];
}

function getSmallestFactor(n: number): number {
  if (n % 2 === 0) {
    return 2;
  }

  for (let factor = 3; factor * factor <= n; factor += 2) {
    if (n % factor === 0) {
      return factor;
    }
  }

  return n;
}

function getPrimeCandidates(stage: number): number[] {
  const difficulty = getDifficulty(stage);
  return PRIME_LIST.filter((prime) => {
    if (prime < difficulty.min || prime > difficulty.max) {
      return false;
    }

    if (!difficulty.allowTrivialPrimes && (prime === 2 || prime === 5)) {
      return false;
    }

    return true;
  });
}

function getCompositePool(stage: number): number[] {
  const difficulty = getDifficulty(stage);
  const pool: number[] = [];

  for (let n = difficulty.min; n <= difficulty.max; n += 1) {
    if (isPrime(n)) {
      continue;
    }

    if (stage > 1 && n === 1) {
      continue;
    }

    if (!difficulty.allowEvenComposites && n % 2 === 0) {
      continue;
    }

    if (!difficulty.allowMultiplesOfFive && n % 5 === 0) {
      continue;
    }

    pool.push(n);
  }

  if (stage < 5) {
    return pool;
  }

  const curated = TRICKY_COMPOSITES.filter(
    (n) =>
      n >= difficulty.min &&
      n <= difficulty.max &&
      !isPrime(n) &&
      n % 2 !== 0 &&
      n % 5 !== 0,
  );
  const generated = pool.filter((n) => n > 100 && getSmallestFactor(n) >= 7);

  return [...new Set([...curated, ...generated, ...pool])];
}

export function generateCompositeChoices(stage: number): number[] {
  const pool = getCompositePool(stage);
  const choices = new Set<number>();
  let attempts = 0;

  while (choices.size < 3 && attempts < 5000) {
    attempts += 1;
    const candidate = randomChoice(pool);
    choices.add(candidate);
  }

  if (choices.size < 3) {
    throw new Error(`Could not generate composite choices for stage ${stage}`);
  }

  return [...choices];
}

export function shuffleChoices(numbers: number[]): number[] {
  const shuffled = [...numbers];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[index]];
  }

  return shuffled;
}

export function generateQuestion(stage: number): Question {
  const difficulty = getDifficulty(stage);
  const answer = randomChoice(getPrimeCandidates(stage));
  const composites = generateCompositeChoices(stage);
  const choices = shuffleChoices([answer, ...composites]);

  return {
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    stage: difficulty.stage,
    answer,
    choices,
    range: {
      min: difficulty.min,
      max: difficulty.max,
    },
  };
}
