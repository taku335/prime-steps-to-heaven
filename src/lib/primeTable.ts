import { isPrime, PRIME_LIST, PRIME_TABLE_MAX } from './prime';

export type PrimeRange = {
  id: string;
  label: string;
  min: number;
  max: number;
};

export const PRIME_RANGES: PrimeRange[] = [
  { id: '1-100', label: '1-100', min: 1, max: 100 },
  { id: '101-500', label: '101-500', min: 101, max: 500 },
  { id: '501-1000', label: '501-1000', min: 501, max: 1000 },
  { id: '1001-10000', label: '1001-10000', min: 1001, max: 10000 },
];

export function getPrimeRange(rangeId: string): PrimeRange {
  return PRIME_RANGES.find((range) => range.id === rangeId) ?? PRIME_RANGES[0];
}

export function getPrimesInRange(range: PrimeRange): number[] {
  return PRIME_LIST.filter((prime) => prime >= range.min && prime <= range.max);
}

export function filterPrimesBySearch(primes: number[], query: string): number[] {
  const normalized = query.trim();

  if (!normalized) {
    return primes;
  }

  return primes.filter((prime) => String(prime).includes(normalized));
}

export function getPrimeCheckMessage(value: string): string {
  const trimmed = value.trim();

  if (!trimmed) {
    return `Table range: 2-${PRIME_TABLE_MAX}`;
  }

  const parsed = Number(trimmed);

  if (!Number.isInteger(parsed) || parsed < 0) {
    return 'Enter a whole number.';
  }

  if (isPrime(parsed)) {
    return `${parsed} is prime.`;
  }

  return `${parsed} is not prime.`;
}
