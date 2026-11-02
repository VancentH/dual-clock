import type { HTMLAttributes, Ref } from 'react';
import { getUtcOffsetMinutes } from '../utils/getUtcOffset';
import styles from './Divider.module.css';

type Props = HTMLAttributes<HTMLDivElement> & {
  ref?: Ref<HTMLDivElement>;
  now: Date;
  leftZone: string;
  rightZone: string;
  onSwap: () => void;
};

/** Right side relative to left side, e.g. "+7h", "−6h", "+5.5h". */
function formatDifference(minutes: number): string {
  if (minutes === 0) return '0h';
  const sign = minutes > 0 ? '+' : '−';
  const hours = Math.abs(minutes) / 60;
  return `${sign}${Number.isInteger(hours) ? hours : hours.toFixed(2).replace(/0$/, '')}h`;
}

export function Divider({ now, leftZone, rightZone, onSwap, ...rest }: Props) {
  const diff = getUtcOffsetMinutes(now, rightZone) - getUtcOffsetMinutes(now, leftZone);

  return (
    <div className={styles.divider} role="separator" {...rest}>
      <div className={styles.center}>
        <span className={styles.badge} title="Time difference of the right side relative to the left">
          {formatDifference(diff)}
        </span>
        <button
          type="button"
          className={styles.swap}
          onClick={onSwap}
          aria-label="Swap time zones"
          title="Swap time zones"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M4 8h14M14 4l4 4-4 4" />
            <path d="M20 16H6M10 12l-4 4 4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
}
