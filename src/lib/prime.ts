import primes from '../data/primes.json';

export const PRIME_LIST = Object.freeze([...(primes as number[])]);
export const PRIME_SET = new Set<number>(PRIME_LIST);
export const PRIME_TABLE_MAX = PRIME_LIST[PRIME_LIST.length - 1] ?? 0;

export function isPrimeByTable(n: number): boolean {
  return Number.isInteger(n) && PRIME_SET.has(n);
}

export function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) {
    return false;
  }

  if (n <= PRIME_TABLE_MAX) {
    return isPrimeByTable(n);
  }

  if (n % 2 === 0) {
    return n === 2;
  }

  for (const prime of PRIME_LIST) {
    if (prime * prime > n) {
      return true;
    }

    if (n % prime === 0) {
      return false;
    }
  }

  for (
    let divisor = PRIME_TABLE_MAX + (PRIME_TABLE_MAX % 2 === 0 ? 1 : 2);
    divisor * divisor <= n;
    divisor += 2
  ) {
    if (n % divisor === 0) {
      return false;
    }
  }

  return true;
}
