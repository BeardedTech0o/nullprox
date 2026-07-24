// Byte sequences for the on-screen Tab/arrow toolbar in terminal (xterm)
// console mode. Mobile virtual keyboards have no Tab or arrow keys at all,
// so these are sent directly over the console WebSocket using the same
// "0:<len>:<data>" input framing xterm's own onData handler uses — standard
// VT100/ANSI cursor-key sequences, which readline (bash, etc.) already
// understands for history/line navigation.
export const TERM_KEY_SEQUENCES = {
  Tab: '\t',
  ArrowLeft: '\x1b[D',
  ArrowUp: '\x1b[A',
  ArrowDown: '\x1b[B',
  ArrowRight: '\x1b[C',
} as const;

export type ConsoleKey = keyof typeof TERM_KEY_SEQUENCES;
