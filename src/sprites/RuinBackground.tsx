import { Assets, Texture, Sprite } from 'pixi.js';
import { useEffect, useState, useRef } from 'react';
import { GAME_WIDTH, GROUND_Y } from '../constants';

import ruin from '../assets/ruins.png?url';

export function RuinBackground() {
  const [ruinTexture, setSunsetTexture] = useState<Texture | null>(null);
  const spriteRef = useRef<Sprite | null>(null);

  useEffect(() => {
    Assets.load(ruin).then((loadedTexture) => {
      setSunsetTexture(loadedTexture);
    });
  }, [ruinTexture]);

  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      // 更新圖片位置
      if (spriteRef.current) {
        spriteRef.current.x -= 0.15; // 每幀向左移動 0.5 像素
        if (spriteRef.current.x <= -GAME_WIDTH) {
          spriteRef.current.x = GAME_WIDTH; // 當圖片完全移出畫面時，將其重置到右側
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId); // 清除動畫幀
  }, []);

  return (
    <pixiContainer x={GAME_WIDTH / 1.2} y={GROUND_Y}>
      {ruinTexture && (
        <pixiSprite
          ref={spriteRef}
          texture={ruinTexture}
          // anchor X 設置在一半，y 設置在底部
          anchor={{ x: 0.5, y: 1 }}
        />
      )}
    </pixiContainer>
  );
}
