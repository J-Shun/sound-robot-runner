import { Assets, Texture, Sprite } from 'pixi.js';
import { useEffect, useState, useRef } from 'react';
import { GAME_WIDTH, GROUND_Y } from '../constants';

import sunsetBackground from '../assets/sunset-background.png?url';

export function SunsetBackground() {
  const [sunsetTexture, setSunsetTexture] = useState<Texture | null>(null);
  const spriteRef = useRef<Sprite | null>(null);

  useEffect(() => {
    Assets.load(sunsetBackground).then((loadedTexture) => {
      setSunsetTexture(loadedTexture);

      // 設定 scale 維持比例
      const baseTexture = loadedTexture.source;
      const originalWidth = baseTexture.width;
      const originalHeight = baseTexture.height;

      const targetWidth = GAME_WIDTH;
      const targetHeight = GROUND_Y;

      // 計算縮放比例，保持圖片的寬高比
      const scale = Math.max(
        targetWidth / originalWidth,
        targetHeight / originalHeight
      );

      if (spriteRef.current) {
        spriteRef.current.scale.set(scale);
      }
    });
  }, [sunsetTexture]);

  return (
    <pixiContainer
      x={GAME_WIDTH / 2}
      y={GROUND_Y}
    >
      {sunsetTexture && (
        <pixiSprite
          ref={spriteRef}
          texture={sunsetTexture}
          // anchor X 設置在一半，y 設置在底部
          anchor={{ x: 0.5, y: 1 }}
        />
      )}
    </pixiContainer>
  );
}
