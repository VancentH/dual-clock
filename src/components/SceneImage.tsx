import { useState } from 'react';
import { getSceneAsset, SCENE_ASPECT, type SceneAsset, type SceneKey } from '../config/scenes';
import type { Country } from '../config/timezoneCountry';
import type { Side } from '../hooks/useTimezones';
import styles from './SceneImage.module.css';

type Props = {
  side: Side;
  country: Country | undefined;
  scene: SceneKey;
};

type Layer = { asset: SceneAsset; id: number };

export function SceneImage({ side, country, scene }: Props) {
  const asset = country ? getSceneAsset(country, scene) : undefined;

  // On a scene change the previous image stays underneath until the new one has faded in.
  // Each change gets a new id used as the <img> key, so the incoming image is always a
  // fresh element whose onLoad fires, even when switching straight back to an image
  // that is still fading out (React would otherwise reuse that already-loaded element).
  const [shown, setShown] = useState<Layer | undefined>(asset && { asset, id: 0 });
  const [leaving, setLeaving] = useState<Layer>();
  const [loadedId, setLoadedId] = useState<number>();
  if (asset?.src !== shown?.asset.src) {
    setLeaving(shown);
    setShown(asset && { asset, id: (shown?.id ?? 0) + 1 });
  }

  // Unmapped time zones keep the panel's plain background as a placeholder
  if (!shown) return null;

  // The image is pinned to the screen's outer edge, so dragging the divider
  // only reveals or covers it instead of shifting it
  const className = `${styles.image} ${side === 'left' ? styles.pinStart : styles.pinEnd}`;
  const fading = leaving !== undefined;

  return (
    <div className={styles.frame}>
      {leaving && (
        <img
          key={leaving.id}
          className={className}
          src={leaving.asset.src}
          alt=""
          style={{ objectPosition: leaving.asset.focus, aspectRatio: SCENE_ASPECT }}
        />
      )}
      <img
        key={shown.id}
        className={`${className} ${fading ? styles.entering : ''} ${fading && loadedId === shown.id ? styles.entered : ''}`}
        src={shown.asset.src}
        alt=""
        style={{ objectPosition: shown.asset.focus, aspectRatio: SCENE_ASPECT }}
        onLoad={(e) => {
          // Flush styles so the browser has seen opacity 0 and the fade-in transition runs,
          // even when a cached image loads before the first paint
          void e.currentTarget.offsetWidth;
          setLoadedId(shown.id);
        }}
        onTransitionEnd={() => setLeaving(undefined)}
      />
    </div>
  );
}
