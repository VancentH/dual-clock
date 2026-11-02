import { useRef } from 'react';
import { Divider } from './components/Divider';
import { TimezonePanel } from './components/TimezonePanel';
import { useNow } from './hooks/useNow';
import { useSplit } from './hooks/useSplit';
import { useTimezones } from './hooks/useTimezones';

export default function App() {
  const now = useNow();
  const { zones, setZone, swap } = useTimezones();
  const mainRef = useRef<HTMLElement>(null);
  const { split, dividerRef, handlers } = useSplit(mainRef);

  return (
    <main className="app" ref={mainRef}>
      <TimezonePanel
        now={now}
        side="left"
        share={split}
        timeZone={zones.left}
        onTimezoneChange={(tz) => setZone('left', tz)}
      />
      <Divider
        ref={dividerRef}
        now={now}
        leftZone={zones.left}
        rightZone={zones.right}
        onSwap={swap}
        {...handlers}
      />
      <TimezonePanel
        now={now}
        side="right"
        share={1 - split}
        timeZone={zones.right}
        onTimezoneChange={(tz) => setZone('right', tz)}
      />
    </main>
  );
}
