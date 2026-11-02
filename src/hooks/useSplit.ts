import { useCallback, useEffect, useRef, useState, type PointerEvent, type RefObject } from 'react';
import { SCENE_ASPECT } from '../config/scenes';

const STORAGE_KEY = 'dual-clock.split';

// Keeps room for the hanging sign (its widest size plus the edge gaps)
const MIN_PANEL = 300;

function readStored(): number {
  try {
    const value = Number(localStorage.getItem(STORAGE_KEY));
    return value > 0 && value < 1 ? value : 0.5;
  } catch {
    return 0.5;
  }
}

function writeStored(value: number) {
  try {
    localStorage.setItem(STORAGE_KEY, String(value));
  } catch {
    // Storage may be unavailable (private mode, blocked site data)
  }
}

type Layout = { start: number; total: number; vertical: boolean; min: number; max: number };

/**
 * Measures the container and works out how far the divider may travel:
 * a panel never grows past the full width of its scene image (image height-filled),
 * and never shrinks below MIN_PANEL. Returns null when there is no room to move.
 */
function measure(container: HTMLElement, divider: HTMLElement | null): Layout | null {
  const rect = container.getBoundingClientRect();
  const vertical = getComputedStyle(container).flexDirection === 'column';
  const dividerSize = divider ? (vertical ? divider.offsetHeight : divider.offsetWidth) : 0;
  const total = (vertical ? rect.height : rect.width) - dividerSize;
  const cross = vertical ? rect.width : rect.height;

  // Largest panel along the split axis that still shows the image's full width (or height)
  const maxPanel = Math.min(vertical ? cross / SCENE_ASPECT : cross * SCENE_ASPECT, total - MIN_PANEL);
  const minPanel = Math.max(total - maxPanel, MIN_PANEL);
  if (total <= 0 || minPanel >= maxPanel) return null;

  return { start: vertical ? rect.top : rect.left, total, vertical, min: minPanel / total, max: maxPanel / total };
}

const clamp = (value: number, layout: Layout | null) =>
  layout ? Math.min(layout.max, Math.max(layout.min, value)) : 0.5;

/** Share of the space given to the left (top on mobile) panel, adjusted by dragging the divider. */
export function useSplit(containerRef: RefObject<HTMLElement | null>) {
  const [split, setSplit] = useState(readStored);
  const dividerRef = useRef<HTMLDivElement>(null);
  const drag = useRef<Layout | null>(null);

  const reclamp = useCallback(() => {
    if (!containerRef.current) return;
    const layout = measure(containerRef.current, dividerRef.current);
    setSplit((s) => clamp(s, layout));
  }, [containerRef]);

  // Re-apply the limits on mount and whenever the window changes shape
  useEffect(() => {
    reclamp();
    window.addEventListener('resize', reclamp);
    return () => window.removeEventListener('resize', reclamp);
  }, [reclamp]);

  const onPointerDown = (e: PointerEvent<HTMLElement>) => {
    // Buttons inside the divider (e.g. swap) keep their own click behaviour
    if (e.button !== 0 || !containerRef.current || (e.target as HTMLElement).closest('button')) return;
    const layout = measure(containerRef.current, dividerRef.current);
    if (!layout) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = layout;
  };

  const onPointerMove = (e: PointerEvent<HTMLElement>) => {
    const layout = drag.current;
    if (!layout) return;
    const pointer = layout.vertical ? e.clientY : e.clientX;
    setSplit(clamp((pointer - layout.start) / layout.total, layout));
  };

  const endDrag = () => {
    if (!drag.current) return;
    drag.current = null;
    writeStored(split);
  };

  return {
    split,
    dividerRef,
    handlers: { onPointerDown, onPointerMove, onPointerUp: endDrag, onPointerCancel: endDrag },
  };
}
