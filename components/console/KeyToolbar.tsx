import Icon from '@/components/Icon';
import type { ConsoleKey } from '@/lib/client/termKeys';

const BUTTONS: { key: ConsoleKey; icon: string; label: string }[] = [
  { key: 'Tab', icon: 'keyboard_tab', label: 'Tab' },
  { key: 'ArrowLeft', icon: 'arrow_back', label: 'Left arrow' },
  { key: 'ArrowUp', icon: 'arrow_upward', label: 'Up arrow' },
  { key: 'ArrowDown', icon: 'arrow_downward', label: 'Down arrow' },
  { key: 'ArrowRight', icon: 'arrow_forward', label: 'Right arrow' },
];

// Mobile on-screen keyboards have no Tab key and no arrow keys at all, so
// shell history/completion is otherwise unreachable from a phone. bottomRem
// clears whatever else is anchored at the bottom of the given console page
// (the "show keyboard" button on the guest console; nothing on the node
// shell, which has no such button).
export default function KeyToolbar({
  onPress,
  bottomRem = 4.75,
}: {
  onPress: (key: ConsoleKey) => void;
  bottomRem?: number;
}) {
  return (
    <div
      className="absolute left-1/2 -translate-x-1/2 flex gap-2 z-10"
      style={{ bottom: `calc(env(safe-area-inset-bottom) + ${bottomRem}rem)` }}
    >
      {BUTTONS.map((b) => (
        <button
          key={b.key}
          type="button"
          onClick={() => onPress(b.key)}
          aria-label={b.label}
          className="h-11 w-11 rounded-full bg-black/60 text-white grid place-items-center backdrop-blur-sm active:scale-95 transition-transform"
        >
          <Icon name={b.icon} size={20} />
        </button>
      ))}
    </div>
  );
}
