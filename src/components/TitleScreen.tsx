import stairwayArt from '../assets/celestial-stair.svg';
import type { GameMode } from '../types/game';

type TitleScreenProps = {
  onStart: (mode: GameMode) => void;
  onOpenPrimeTable: () => void;
};

export function TitleScreen({ onStart, onOpenPrimeTable }: TitleScreenProps) {
  return (
    <main className="screen title-screen">
      <div className="title-copy">
        <p className="eyebrow">Count the primes.</p>
        <h1>Prime Steps to Heaven</h1>
        <p className="lead">
          Choose the only prime and climb through a quiet sequence of dark intervals,
          glowing steps, and accelerating numbers.
        </p>
        <div className="title-actions">
          <button className="primary-action" type="button" onClick={() => onStart('ascent')}>
            Begin Ascent
          </button>
          <button className="secondary-action" type="button" onClick={() => onStart('timed')}>
            60 Second Challenge
          </button>
          <button className="secondary-action" type="button" onClick={onOpenPrimeTable}>
            Prime Table
          </button>
        </div>
      </div>
      <img className="title-art" src={stairwayArt} alt="" aria-hidden="true" />
    </main>
  );
}
