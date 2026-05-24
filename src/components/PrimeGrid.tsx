type PrimeGridProps = {
  primes: number[];
  highlightedPrime: number | null;
  onHighlight: (prime: number) => void;
};

export function PrimeGrid({ primes, highlightedPrime, onHighlight }: PrimeGridProps) {
  if (primes.length === 0) {
    return <p className="empty-state">No primes match this filter.</p>;
  }

  return (
    <section className="prime-grid" aria-label="Prime numbers">
      {primes.map((prime) => (
        <button
          className={`prime-cell ${highlightedPrime === prime ? 'prime-cell--active' : ''}`}
          key={prime}
          type="button"
          onClick={() => onHighlight(prime)}
        >
          {prime}
        </button>
      ))}
    </section>
  );
}
