import { Assets, Texture, Graphics, AnimatedSprite } from 'pixi.js';
import { useEffect, useRef, useState, useCallback } from 'react';
import { PATROL_BOT_WIDTH, PATROL_BOT_HEIGHT } from '../constants/config';

import patrolBot1 from '../assets/enemy/patrol-robot1.png?url';
import patrolBot2 from '../assets/enemy/patrol-robot2.png?url';

const allAssetUrls = [patrolBot1, patrolBot2];

export function PatrolBotSprite() {
  const patrolBotRef = useRef<AnimatedSprite | null>(null);
  const [patrolBotTextures, setPatrolBotTextures] = useState<Texture[]>([]);

  const isLoaded = patrolBotTextures.length > 0;

  // 在圖片載入後決定 hitBox 尺寸
  const drawHitBox = useCallback((graphics: Graphics) => {
    const width = PATROL_BOT_WIDTH;
    const height = PATROL_BOT_HEIGHT;

    graphics.clear(); // 確保重繪時不會堆疊
    graphics.rect(-width / 2, -height / 2, width, height);
    graphics.stroke({ color: '#ff0000', width: 1 });
  }, []);

  // 預載圖片
  useEffect(() => {
    Promise.all(allAssetUrls.map((url) => Assets.load(url))).then(
      (textures) => {
        const robot = [textures[0], textures[1]];

        setPatrolBotTextures(robot);
      }
    );
  }, []);

  // 機器人動畫循環
  useEffect(() => {
    if (patrolBotTextures.length === 0 || !patrolBotRef.current) return;

    const robotSprite = patrolBotRef.current;
    robotSprite.textures = patrolBotTextures;
    robotSprite.animationSpeed = 0.1; // 動畫速度
    robotSprite.play(); // 開始播放動畫

    // 停止動畫
    return () => {
      robotSprite.stop();
    };
  }, [patrolBotTextures]);

  return (
    // 因為 anchor 設置在中心 0.5，圖片往左上角位移，所以要將 x, y 加上角色寬度和高度的一半
    <pixiContainer x={PATROL_BOT_WIDTH / 2} y={PATROL_BOT_HEIGHT / 2}>
      {isLoaded && (
        <>
          {/* Hitbox 與 Sprite 為同一個 container 的子項 */}
          <pixiGraphics draw={drawHitBox} />
          <pixiAnimatedSprite
            ref={patrolBotRef}
            anchor={0.5}
            eventMode={'static'}
            textures={patrolBotTextures}
          />
        </>
      )}
    </pixiContainer>
  );
}
