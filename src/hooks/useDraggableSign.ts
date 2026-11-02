import { useRef, useState, type PointerEvent } from 'react';
import type { Side } from './useTimezones';

const STORAGE_KEY = 'dual-clock.signPosition';

// 0 = far left of the panel, 1 = far right; signs start next to the divider
const DEFAULTS: Record<Side, number> = { left: 1, right: 0 };

// Elements inside the sign that keep their own click behaviour
const INTERACTIVE = 'button, input, [role="listbox"], [data-no-drag]';

function readStored(): Partial<Record<Side, number>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function readPosition(side: Side): number {
  const value = readStored()[side];
  return typeof value === 'number' && value >= 0 && value <= 1 ? value : DEFAULTS[side];
}

function writePosition(side: Side, value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), [side]: value }));
  } catch {
    // Storage may be unavailable (private mode, blocked site data)
  }
}

const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

/**
 * Lets the user drag a sign horizontally inside its panel.
 * Returns the position as a 0–1 ratio of the free horizontal space, plus pointer handlers.
 */
export function useDraggableSign(side: Side) {
  const [position, setPosition] = useState(() => readPosition(side));
  const [dragging, setDragging] = useState(false);
  const drag = useRef<{ startX: number; startPosition: number; travel: number } | null>(null);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    if (e.button !== 0 || (e.target as HTMLElement).closest(INTERACTIVE)) return;
    const sign = e.currentTarget;
    const panel = sign.offsetParent as HTMLElement | null;
    if (!panel) return;

    // Free space the sign can travel across: panel width minus the sign and both edge gaps
    const edge = parseFloat(getComputedStyle(sign).getPropertyValue('--edge')) || 0;
    const travel = panel.clientWidth - sign.offsetWidth - edge * 2;
    if (travel <= 0) return;

    sign.setPointerCapture(e.pointerId);
    drag.current = { startX: e.clientX, startPosition: position, travel };
    setDragging(true);
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    if (!drag.current) return;
    const { startX, startPosition, travel } = drag.current;
    setPosition(clamp01(startPosition + (e.clientX - startX) / travel));
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    setDragging(false);
    writePosition(side, position);
  };

  return {
    position,
    dragging,
    handlers: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag },
  };
}
