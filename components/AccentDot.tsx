import { useEffect, useState } from 'react';

type Accent = 'ember' | 'ocean';
const KEY = 'nullprox-accent';

function apply(a: Accent) {
  document.documentElement.dataset.accent = a;
}

// Discreet faded dot that swaps the hero colourway (ember or ocean). The
// choice is remembered in localStorage; pages/_document.tsx restores it
// before first paint.
export default function AccentDot({ className = '' }: { className?: string }) {
  const [accent, setAccent] = useState<Accent>('ember');

  useEffect(() => {
    try {
      if (localStorage.getItem(KEY) === 'ocean') setAccent('ocean');
    } catch {
      /* storage unavailable: stay on ember */
    }
  }, []);

  function toggle() {
    const next: Accent = accent === 'ember' ? 'ocean' : 'ember';
    setAccent(next);
    apply(next);
    try {
      if (next === 'ember') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="Switch colour scheme"
      title="Switch colour scheme"
      className={`grid place-items-center h-8 w-8 rounded-full opacity-40 hover:opacity-80 transition-opacity ${className}`}
    >
      <span
        className="block h-2.5 w-2.5 rounded-full"
        style={{ background: 'var(--hero-gradient)' }}
      />
    </button>
  );
}
