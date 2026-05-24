export type NumberCardState = 'idle' | 'correct' | 'wrong' | 'dim';

type NumberCardProps = {
  value: number;
  state: NumberCardState;
  disabled: boolean;
  onChoose: (value: number) => void;
};

export function NumberCard({ value, state, disabled, onChoose }: NumberCardProps) {
  return (
    <button
      className={`number-card number-card--${state}`}
      disabled={disabled}
      type="button"
      onClick={() => onChoose(value)}
      aria-label={`Choose ${value}`}
    >
      <span>{value}</span>
    </button>
  );
}
