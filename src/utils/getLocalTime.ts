export type LocalTime = {
  hours: number;
  minutes: number;
  seconds: number;
};

const formatters = new Map<string, Intl.DateTimeFormat>();

function getFormatter(timeZone: string): Intl.DateTimeFormat {
  let f = formatters.get(timeZone);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone,
      hourCycle: 'h23',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formatters.set(timeZone, f);
  }
  return f;
}

/** Hours (0–23), minutes and seconds of `date` in the given IANA time zone. */
export function getLocalTime(date: Date, timeZone: string): LocalTime {
  const result = { hours: 0, minutes: 0, seconds: 0 };
  for (const part of getFormatter(timeZone).formatToParts(date)) {
    if (part.type === 'hour') result.hours = Number(part.value) % 24;
    else if (part.type === 'minute') result.minutes = Number(part.value);
    else if (part.type === 'second') result.seconds = Number(part.value);
  }
  return result;
}
