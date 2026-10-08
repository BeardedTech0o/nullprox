import { useEffect, useState } from 'react';

type Choice = 'system' | 'light' | 'dark';
const KEY = 'nullprox-theme';
const OPTIONS: { value: Choice; label: string }[] = [
  { value: 'system', label: 'System' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
];

function apply(choice: Choice) {
  const dark =
    choice === 'dark' ||
    (choice === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  document
    .querySelector('meta[name=theme-color]')
    ?.setAttribute('content', dark ? '#0a0a0a' : '#ffffff');
}

// Segmented light / dark / system picker. The choice is stored in
// localStorage; pages/_document.tsx applies it before first paint.
export default function ThemeSelect() {
  const [choice, setChoice] = useState<Choice>('system');

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === 'light' || saved === 'dark') setChoice(saved);
    } catch {
      /* storage unavailable: stay on system */
    }
  }, []);

  useEffect(() => {
    if (choice !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => apply('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [choice]);

  function pick(next: Choice) {
    setChoice(next);
    try {
      if (next === 'system') localStorage.removeItem(KEY);
      else localStorage.setItem(KEY, next);
    } catch {
      /* ignore */
    }
    apply(next);
  }

  return (
    <div
      role="radiogroup"
      aria-label="Theme"
      className="inline-flex gap-1 p-1 rounded-full bg-elevated border border-border w-fit"
    >
      {OPTIONS.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={choice === o.value}
          onClick={() => pick(o.value)}
          className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
            choice === o.value
              ? 'bg-accent text-on-accent'
              : 'text-secondary hover:text-primary'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
