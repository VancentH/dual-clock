import { useId } from 'react';
import type { LocalTime } from '../utils/getLocalTime';
import styles from './Clock.module.css';
import { FlipDigit } from './FlipDigit';

type Props = {
  time: LocalTime;
};

const pad = (n: number) => String(n).padStart(2, '0');

// Station clocks traditionally use "IIII" instead of "IV"
const numerals = ['XII', 'I', 'II', 'III', 'IIII', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI'];
const minuteTicks = Array.from({ length: 60 }, (_, i) => i * 6);

export function Clock({ time }: Props) {
  const { hours, minutes, seconds } = time;
  const hourAngle = (hours % 12) * 30 + minutes * 0.5;
  const minuteAngle = minutes * 6 + seconds * 0.1;
  const secondAngle = seconds * 6;

  // SVG ids must be unique per clock and free of characters that break url(#…)
  const uid = useId().replace(/[^a-zA-Z0-9_-]/g, '');
  const paperId = `paper-${uid}`;
  const grainId = `grain-${uid}`;

  return (
    <div className={styles.clock}>
      <svg className={styles.face} viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <radialGradient id={paperId} cx="45%" cy="40%" r="65%">
            <stop offset="0%" className={styles.paperCenter} />
            <stop offset="100%" className={styles.paperEdge} />
          </radialGradient>
          <filter id={grainId} x="0" y="0" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" seed="7" />
            <feColorMatrix type="saturate" values="0" />
            {/* Keep the noise inside the dial's circle */}
            <feComposite in2="SourceGraphic" operator="in" />
          </filter>
        </defs>

        {/* Metal bezel */}
        <circle className={styles.bezel} cx="100" cy="100" r="98" />
        <circle className={styles.bezelHighlight} cx="100" cy="100" r="93.5" />

        {/* Aged paper dial */}
        <circle cx="100" cy="100" r="91" fill={`url(#${paperId})`} />
        <circle className={styles.grain} cx="100" cy="100" r="91" filter={`url(#${grainId})`} />

        {/* Minute track: two rings, 60 divisions, a triangle at each hour */}
        <g className={styles.ink}>
          <circle className={styles.ring} cx="100" cy="100" r="86" />
          <circle className={styles.ring} cx="100" cy="100" r="78" />
          {minuteTicks.map((angle) => (
            <line
              key={angle}
              className={styles.minuteTick}
              x1="100"
              y1="14"
              x2="100"
              y2="22"
              transform={`rotate(${angle} 100 100)`}
            />
          ))}
          {numerals.map((_, i) => (
            <polygon key={i} points="97,14.5 103,14.5 100,20.5" transform={`rotate(${i * 30} 100 100)`} />
          ))}

          {/* Roman numerals, oriented radially like the reference clock */}
          {numerals.map((numeral, i) => (
            <text
              key={numeral}
              className={styles.numeral}
              x="100"
              y="37"
              transform={`rotate(${i * 30} 100 100)`}
            >
              {numeral}
            </text>
          ))}
        </g>

        {/* Plain tapered needle hands */}
        <g className={styles.hands}>
          <path
            className={styles.ink}
            d="M97 112 L103 112 L101 56 L99 56 Z"
            transform={`rotate(${hourAngle} 100 100)`}
          />
          <path
            className={styles.ink}
            d="M98 116 L102 116 L100.6 28 L99.4 28 Z"
            transform={`rotate(${minuteAngle} 100 100)`}
          />
          <g className={styles.secondHand} transform={`rotate(${secondAngle} 100 100)`}>
            <line x1="100" y1="124" x2="100" y2="24" />
            <circle cx="100" cy="117" r="2.6" />
          </g>
          <circle className={styles.ink} cx="100" cy="100" r="4.5" />
          <circle className={styles.hubCap} cx="100" cy="100" r="1.8" />
        </g>
      </svg>
      <time className={styles.digital} aria-label={`${pad(hours)}:${pad(minutes)}:${pad(seconds)}`}>
        {[hours, minutes, seconds].map((n, i) => (
          <span key={i} className={styles.group}>
            {i > 0 && <span className={styles.colon}>:</span>}
            {pad(n)
              .split('')
              .map((d, j) => (
                <FlipDigit key={j} value={d} />
              ))}
          </span>
        ))}
      </time>
    </div>
  );
}
