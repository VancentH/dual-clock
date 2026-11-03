export const allTimezones: string[] = Intl.supportedValuesOf('timeZone');

// Lower-cased name → the list's canonical spelling, for case-insensitive lookups
const byLowerCase = new Map(allTimezones.map((tz) => [tz.toLowerCase(), tz]));

/**
 * Returns the canonical spelling of a time zone ("europe/berlin" → "Europe/Berlin"),
 * or undefined if it isn't a time zone. Intl accepts any casing, but the rest of the
 * app (country mapping, selector) compares names exactly, so input must be normalized.
 */
export function normalizeTimezone(value: unknown): string | undefined {
  if (typeof value !== 'string' || !value) return undefined;
  const listed = byLowerCase.get(value.toLowerCase());
  if (listed) return listed;
  // Aliases such as "UTC" may be missing from the list but still work with Intl
  try {
    return new Intl.DateTimeFormat('en-US', { timeZone: value }).resolvedOptions().timeZone;
  } catch {
    return undefined;
  }
}

/** "America/Argentina/Buenos_Aires" → "America / Argentina / Buenos Aires" */
export function formatTimezoneName(timeZone: string): string {
  return timeZone.replace(/_/g, ' ').replace(/\//g, ' / ');
}
