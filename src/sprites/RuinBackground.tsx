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
        spriteRef.current.x -= 5; // 每幀向左移動 0.5 像素
        console.log(spriteRef.current.width);

        if (spriteRef.current.x <= -spriteRef.current.width) {
          spriteRef.current.x = GAME_WIDTH; // 當圖片完全移出畫面時，將其重置到右側
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId); // 清除動畫幀
  }, []);

  return (
    <pixiContainer y={GROUND_Y}>
      {ruinTexture && (
        <pixiSprite
          ref={spriteRef}
          texture={ruinTexture}
          x={GAME_WIDTH + 100} // 初始位置在畫面右側
          // y 設置在底部
          anchor={{ x: 0, y: 1 }}
        />
      )}
    </pixiContainer>
  );
}
