import type { PrimeRange } from '../lib/primeTable';

type PrimeFilterProps = {
  ranges: PrimeRange[];
  selectedRangeId: string;
  search: string;
  onRangeChange: (rangeId: string) => void;
  onSearchChange: (search: string) => void;
};

export function PrimeFilter({
  ranges,
  selectedRangeId,
  search,
  onRangeChange,
  onSearchChange,
}: PrimeFilterProps) {
  return (
    <section className="prime-filter" aria-label="Prime table filters">
      <label>
        <span>Range</span>
        <select value={selectedRangeId} onChange={(event) => onRangeChange(event.target.value)}>
          {ranges.map((range) => (
            <option key={range.id} value={range.id}>
              {range.label}
            </option>
          ))}
        </select>
      </label>

      <label>
        <span>Search</span>
        <input
          inputMode="numeric"
          placeholder="Try 9973"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      </label>
    </section>
  );
}
