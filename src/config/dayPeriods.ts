export type DayPeriod = 'dawn' | 'day' | 'dusk' | 'night';

/** Start hour (inclusive) of each period, in local time; each runs until the next one starts. */
export const dayPeriodStarts: { period: DayPeriod; start: number }[] = [
  { period: 'night', start: 0 },
  { period: 'dawn', start: 5 },
  { period: 'day', start: 8 },
  { period: 'dusk', start: 17 },
  { period: 'night', start: 20 },
];

export function getDayPeriod(hours: number): DayPeriod {
  let current = dayPeriodStarts[0].period;
  for (const { period, start } of dayPeriodStarts) {
    if (hours >= start) current = period;
  }
  return current;
}
