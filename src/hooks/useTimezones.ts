import { useCallback, useEffect, useState } from 'react';
import { DEFAULT_LEFT_ZONE, DEFAULT_RIGHT_ZONE } from '../config/defaults';
import { normalizeTimezone } from '../utils/timezones';

export type Side = 'left' | 'right';

const STORAGE_KEY = 'dual-clock.timezones';
const DEFAULTS: Record<Side, string> = { left: DEFAULT_LEFT_ZONE, right: DEFAULT_RIGHT_ZONE };

function readStorage(): Partial<Record<Side, string>> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeStorage(zones: Record<Side, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(zones));
  } catch {
    // Storage may be unavailable (private mode, blocked site data)
  }
}

/** URL params first, then localStorage, then defaults. */
function readInitial(): Record<Side, string> {
  const params = new URLSearchParams(window.location.search);
  const stored = readStorage();
  const pick = (side: Side) =>
    normalizeTimezone(params.get(side)) ?? normalizeTimezone(stored[side]) ?? DEFAULTS[side];
  return { left: pick('left'), right: pick('right') };
}

function writeUrl(zones: Record<Side, string>) {
  const params = new URLSearchParams(window.location.search);
  params.set('left', zones.left);
  params.set('right', zones.right);
  // Keep "/" readable instead of "%2F"
  const query = params.toString().replace(/%2F/gi, '/');
  window.history.replaceState(null, '', `${window.location.pathname}?${query}${window.location.hash}`);
}

export function useTimezones() {
  const [zones, setZones] = useState(readInitial);

  useEffect(() => {
    writeUrl(zones);
    writeStorage(zones);
  }, [zones]);

  const setZone = useCallback((side: Side, timeZone: string) => {
    setZones((prev) => ({ ...prev, [side]: timeZone }));
  }, []);

  const swap = useCallback(() => {
    setZones((prev) => ({ left: prev.right, right: prev.left }));
  }, []);

  return { zones, setZone, swap };
}
