import styles from './SignboardDecor.module.css';

type LeafProps = {
  x: number;
  y: number;
  angle: number;
  size: number;
  tone: 1 | 2 | 3;
};

/** A single leaf pointing along `angle`, with its base at (x, y). */
function Leaf({ x, y, angle, size, tone }: LeafProps) {
  const w = size * 0.38;
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`}>
      <path className={styles[`leaf${tone}`]} d={`M0 0 Q${size / 2} ${-w} ${size} 0 Q${size / 2} ${w} 0 0 Z`} />
      <path className={styles.vein} d={`M1 0 L${size * 0.85} 0`} />
    </g>
  );
}

// Leaves along the vine's stem: alternating sides, shrinking towards the tip
const vineLeaves: LeafProps[] = [
  { x: 18, y: 50, angle: -95, size: 20, tone: 1 },
  { x: 26, y: 44, angle: 10, size: 19, tone: 2 },
  { x: 40, y: 34, angle: -85, size: 18, tone: 3 },
  { x: 52, y: 28, angle: 15, size: 17, tone: 1 },
  { x: 68, y: 20, angle: -70, size: 15, tone: 2 },
  { x: 82, y: 15, angle: 20, size: 14, tone: 3 },
  { x: 98, y: 11, angle: -55, size: 12, tone: 1 },
  { x: 112, y: 9, angle: 18, size: 11, tone: 2 },
  { x: 124, y: 8, angle: -20, size: 10, tone: 3 },
];

function Vine({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 140 64" aria-hidden="true">
      <path className={styles.stem} d="M2 62 C24 44 52 24 136 8" />
      {vineLeaves.map((leaf, i) => (
        <Leaf key={i} {...leaf} />
      ))}
    </svg>
  );
}

/** Ropes, nails and vines that turn the card into a hanging wooden sign. */
export function SignboardDecor() {
  return (
    <>
      <span className={`${styles.rope} ${styles.ropeLeft}`} aria-hidden="true" />
      <span className={`${styles.rope} ${styles.ropeRight}`} aria-hidden="true" />
      {(['tl', 'tr', 'bl', 'br'] as const).map((corner) => (
        <span key={corner} className={`${styles.nail} ${styles[corner]}`} aria-hidden="true" />
      ))}
      <Vine className={`${styles.vine} ${styles.vineTopLeft}`} />
      <Vine className={`${styles.vine} ${styles.vineBottomRight}`} />
    </>
  );
}
