import { useEffect, useState } from 'react';

/** The only timer in the app: returns the current Date, refreshed once per second. */
export function useNow(): Date {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return now;
}
