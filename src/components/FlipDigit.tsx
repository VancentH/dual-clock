import { useState } from 'react';
import styles from './FlipDigit.module.css';

type Props = {
  value: string;
};

/** A split-flap tile: the old top half folds down to reveal the new digit. */
export function FlipDigit({ value }: Props) {
  const [current, setCurrent] = useState(value);
  const [previous, setPrevious] = useState(value);

  if (value !== current) {
    setPrevious(current);
    setCurrent(value);
  }

  const flipping = previous !== current;

  return (
    <span className={styles.tile}>
      <span className={`${styles.half} ${styles.top}`}>
        <span className={styles.glyph}>{current}</span>
      </span>
      <span className={`${styles.half} ${styles.bottom}`}>
        <span className={styles.glyph}>{flipping ? previous : current}</span>
      </span>
      {flipping && (
        <>
          <span key={`top-${current}`} className={`${styles.half} ${styles.top} ${styles.flapTop}`}>
            <span className={styles.glyph}>{previous}</span>
          </span>
          <span
            key={`bottom-${current}`}
            className={`${styles.half} ${styles.bottom} ${styles.flapBottom}`}
            onAnimationEnd={() => setPrevious(current)}
          >
            <span className={styles.glyph}>{current}</span>
          </span>
        </>
      )}
    </span>
  );
}
