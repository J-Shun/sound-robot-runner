import { Assets, Texture, TilingSprite } from 'pixi.js';
import { useEffect, useState, useRef } from 'react';
import { GAME_WIDTH, GROUND_Y, SPEED } from '../constants/config';

import desertTile from '../assets/desert-tile-3x.png?url';
import desertColorTile from '../assets/desert-color-tile-3x.png?url';

export function DesertTile() {
  const [groundTexture, setGroundTexture] = useState<Texture | null>(null);
  const [groundColorTexture, setGroundColorTexture] = useState<Texture | null>(
    null
  );
  const tileRef = useRef<TilingSprite | null>(null);
  const tileColorRef = useRef<TilingSprite | null>(null);

  // 預載圖片
  useEffect(() => {
    Promise.all([Assets.load(desertTile), Assets.load(desertColorTile)]).then(
      (loadedTextures) => {
        setGroundTexture(loadedTextures[0]);
        setGroundColorTexture(loadedTextures[1]);
      }
    );
  }, [groundTexture]);

  useEffect(() => {
    if (!groundTexture) return;
    let animationFrameId: number;

    const updateFrame = () => {
      if (tileRef.current) {
        tileRef.current.tilePosition.x -= SPEED;
        tileColorRef.current!.tilePosition.x -= SPEED;
      }
      animationFrameId = requestAnimationFrame(updateFrame);
    };

    animationFrameId = requestAnimationFrame(updateFrame);
    return () => cancelAnimationFrame(animationFrameId);
  }, [groundTexture]);

  return (
    <pixiContainer>
      {groundTexture && groundColorTexture && (
        <>
          <pixiTilingSprite
            ref={tileRef}
            texture={groundTexture}
            width={GAME_WIDTH}
            height={96}
            x={0}
            y={GROUND_Y}
          />

          <pixiTilingSprite
            ref={tileColorRef}
            texture={groundColorTexture}
            width={GAME_WIDTH}
            height={GROUND_Y - 96}
            x={0}
            y={GROUND_Y + 95}
          />
        </>
      )}
    </pixiContainer>
  );
}
