import { useMemo, useState } from 'react';
import {
  filterPrimesBySearch,
  getPrimeCheckMessage,
  getPrimeRange,
  getPrimesInRange,
  PRIME_RANGES,
} from '../lib/primeTable';
import type { GameMode } from '../types/game';
import { PrimeFilter } from './PrimeFilter';
import { PrimeGrid } from './PrimeGrid';

type PrimeTablePageProps = {
  onStart: (mode: GameMode) => void;
  onTitle: () => void;
};

export function PrimeTablePage({ onStart, onTitle }: PrimeTablePageProps) {
  const [selectedRangeId, setSelectedRangeId] = useState(PRIME_RANGES[0].id);
  const [search, setSearch] = useState('');
  const [checkValue, setCheckValue] = useState('');
  const [highlightedPrime, setHighlightedPrime] = useState<number | null>(null);

  const selectedRange = getPrimeRange(selectedRangeId);
  const rangePrimes = useMemo(() => getPrimesInRange(selectedRange), [selectedRange]);
  const filteredPrimes = useMemo(
    () => filterPrimesBySearch(rangePrimes, search),
    [rangePrimes, search],
  );
  const checkMessage = getPrimeCheckMessage(checkValue);

  return (
    <main className="screen prime-table-screen">
      <section className="page-header">
        <p className="eyebrow">Prime Table</p>
        <h1>Prime Table</h1>
        <p className="lead">
          Study the source sequence used by the game, filter by range, and test a number before
          taking the next step.
        </p>
        <div className="title-actions">
          <button className="primary-action" type="button" onClick={() => onStart('ascent')}>
            Begin Ascent
          </button>
          <button className="secondary-action" type="button" onClick={onTitle}>
            Title
          </button>
        </div>
      </section>

      <PrimeFilter
        ranges={PRIME_RANGES}
        selectedRangeId={selectedRangeId}
        search={search}
        onRangeChange={(rangeId) => {
          setSelectedRangeId(rangeId);
          setHighlightedPrime(null);
        }}
        onSearchChange={(value) => {
          setSearch(value);
          setHighlightedPrime(null);
        }}
      />

      <section className="prime-table-meta" aria-label="Prime table summary">
        <div>
          <span>Showing</span>
          <strong>{filteredPrimes.length}</strong>
        </div>
        <div>
          <span>In range</span>
          <strong>{rangePrimes.length}</strong>
        </div>
        <div>
          <span>Interval</span>
          <strong>{selectedRange.label}</strong>
        </div>
      </section>

      <section className="prime-checker" aria-label="Prime checker">
        <label>
          <span>Check a number</span>
          <input
            inputMode="numeric"
            placeholder="Enter a whole number"
            type="text"
            value={checkValue}
            onChange={(event) => setCheckValue(event.target.value)}
          />
        </label>
        <p>{checkMessage}</p>
      </section>

      <PrimeGrid
        primes={filteredPrimes}
        highlightedPrime={highlightedPrime}
        onHighlight={setHighlightedPrime}
      />
    </main>
  );
}
