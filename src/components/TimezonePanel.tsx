import type { CSSProperties } from 'react';
import { getDayPeriod } from '../config/dayPeriods';
import { getSceneKey } from '../config/scenes';
import { timezoneCountry } from '../config/timezoneCountry';
import { useDraggableSign } from '../hooks/useDraggableSign';
import type { Side } from '../hooks/useTimezones';
import { getLocalTime } from '../utils/getLocalTime';
import { Clock } from './Clock';
import { SignboardDecor } from './SignboardDecor';
import { SceneImage } from './SceneImage';
import { TimezoneSelector } from './TimezoneSelector';
import styles from './TimezonePanel.module.css';

type Props = {
  now: Date;
  side: Side;
  /** Fraction (0–1) of the split space this panel takes */
  share: number;
  timeZone: string;
  onTimezoneChange: (timeZone: string) => void;
};

export function TimezonePanel({ now, side, share, timeZone, onTimezoneChange }: Props) {
  const time = getLocalTime(now, timeZone);
  const period = getDayPeriod(time.hours);

  const { position, dragging, handlers } = useDraggableSign(side);

  return (
    <section className={styles.panel} data-period={period} style={{ flex: `${share} 1 0` }}>
      <SceneImage side={side} country={timezoneCountry[timeZone]} scene={getSceneKey(time.hours)} />
      <div
        className={`${styles.card} ${period === 'night' ? styles.night : ''} ${dragging ? styles.dragging : ''}`}
        style={{ '--x': position } as CSSProperties}
        {...handlers}
      >
        <SignboardDecor />
        <div className={styles.content}>
          <Clock time={time} />
          <TimezoneSelector
            value={timeZone}
            onChange={onTimezoneChange}
            // Open the dropdown towards the middle of the panel
            align={position > 0.5 ? 'end' : 'start'}
          />
        </div>
      </div>
    </section>
  );
}
