import { Assets, Texture, TilingSprite } from 'pixi.js';
import { useEffect, useState, useRef } from 'react';
import { GAME_WIDTH, GROUND_Y, OBSTACLE_SPEED } from '../constants/config';

import desertTile from '../assets/desert-tile-3x.png?url';

export function DesertTile() {
  const [groundTexture, setGroundTexture] = useState<Texture | null>(null);
  const tileRef = useRef<TilingSprite | null>(null);
  const rafIdRef = useRef<number | null>(null);

  // 預載圖片
  useEffect(() => {
    Assets.load(desertTile).then((loadedTextures) => {
      setGroundTexture(loadedTextures);
    });
  }, [groundTexture]);

  useEffect(() => {
    if (!groundTexture) return;

    const tick = () => {
      if (tileRef.current) {
        tileRef.current.tilePosition.x -= OBSTACLE_SPEED; // 向左移
      }
      rafIdRef.current = requestAnimationFrame(tick);
    };

    rafIdRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafIdRef.current!);
  }, [groundTexture]);

  return (
    <>
      {groundTexture && (
        <pixiTilingSprite
          ref={tileRef}
          texture={groundTexture}
          width={GAME_WIDTH}
          height={94}
          x={0}
          y={GROUND_Y + 1}
        />
      )}
    </>
  );
}
