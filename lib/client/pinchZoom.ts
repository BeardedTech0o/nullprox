// Pinch-to-zoom (+ double-tap to reset) for the console screens. The app's
// own viewport disables native pinch zoom everywhere (`user-scalable=no`,
// the fix for the iOS auto-zoom bug elsewhere in this app), so this recreates
// it manually, scoped to just the console content.
//
// Only reacts to two-finger touches, captured before they reach noVNC's own
// gesture recognizer (which uses two-finger gestures for its own scroll/
// right-click emulation) — one-finger touches are left completely alone, so
// normal remote-control input (or xterm's own touch scrolling) is unaffected.
// Panning while zoomed is deliberately out of scope for v1: double-tap to
// reset back to the base scale is the escape hatch instead of adding a
// second interpretation of a one-finger drag on top of remote mouse control.

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const DOUBLE_TAP_MS = 300;

function touchDistance(a: Touch, b: Touch): number {
  return Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
}

function touchMidpoint(a: Touch, b: Touch, rect: DOMRect) {
  return {
    x: (a.clientX + b.clientX) / 2 - rect.left,
    y: (a.clientY + b.clientY) / 2 - rect.top,
  };
}

/**
 * @param container The fixed-bounds, overflow-hidden element gestures are read from.
 * @param target The element to visually scale/translate (a child of container).
 */
export function attachPinchZoom(container: HTMLElement, target: HTMLElement): () => void {
  let scale = 1;
  let tx = 0;
  let ty = 0;
  let startDist = 0;
  let startScale = 1;
  let startMidX = 0;
  let startMidY = 0;
  let startTx = 0;
  let startTy = 0;
  let lastTapAt = 0;

  target.style.transformOrigin = '0 0';
  target.style.transition = 'transform 0.15s ease-out';

  function applyTransform() {
    target.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
  }

  function clampPan() {
    if (scale <= 1.02) {
      scale = 1;
      tx = 0;
      ty = 0;
      return;
    }
    const rect = container.getBoundingClientRect();
    const maxX = (rect.width * (scale - 1)) / 2;
    const maxY = (rect.height * (scale - 1)) / 2;
    tx = Math.min(maxX, Math.max(-maxX, tx));
    ty = Math.min(maxY, Math.max(-maxY, ty));
  }

  function reset() {
    scale = 1;
    tx = 0;
    ty = 0;
    target.style.transition = 'transform 0.15s ease-out';
    applyTransform();
  }

  function onTouchStart(e: TouchEvent) {
    if (e.touches.length === 2) {
      e.stopPropagation();
      target.style.transition = 'none';
      const rect = container.getBoundingClientRect();
      startDist = touchDistance(e.touches[0], e.touches[1]);
      startScale = scale;
      const mid = touchMidpoint(e.touches[0], e.touches[1], rect);
      startMidX = mid.x;
      startMidY = mid.y;
      startTx = tx;
      startTy = ty;
      return;
    }
    if (e.touches.length === 1) {
      const now = Date.now();
      if (now - lastTapAt < DOUBLE_TAP_MS && scale > 1) {
        e.stopPropagation();
        e.preventDefault();
        reset();
      }
      lastTapAt = now;
    }
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length !== 2 || startDist === 0) return;
    e.stopPropagation();
    e.preventDefault();
    const dist = touchDistance(e.touches[0], e.touches[1]);
    const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, startScale * (dist / startDist)));
    const rect = container.getBoundingClientRect();
    const mid = touchMidpoint(e.touches[0], e.touches[1], rect);
    const ratio = newScale / startScale;
    scale = newScale;
    tx = mid.x - ratio * (startMidX - startTx);
    ty = mid.y - ratio * (startMidY - startTy);
    clampPan();
    applyTransform();
  }

  function onTouchEnd(e: TouchEvent) {
    if (e.touches.length >= 2) return;
    startDist = 0;
    target.style.transition = 'transform 0.15s ease-out';
  }

  const opts: AddEventListenerOptions = { capture: true, passive: false };
  container.addEventListener('touchstart', onTouchStart, opts);
  container.addEventListener('touchmove', onTouchMove, opts);
  container.addEventListener('touchend', onTouchEnd, { capture: true });
  container.addEventListener('touchcancel', onTouchEnd, { capture: true });

  return () => {
    container.removeEventListener('touchstart', onTouchStart, opts);
    container.removeEventListener('touchmove', onTouchMove, opts);
    container.removeEventListener('touchend', onTouchEnd, { capture: true } as any);
    container.removeEventListener('touchcancel', onTouchEnd, { capture: true } as any);
    target.style.transform = '';
    target.style.transformOrigin = '';
    target.style.transition = '';
  };
}
