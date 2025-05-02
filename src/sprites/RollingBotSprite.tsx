import { Assets, Texture, AnimatedSprite } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants/config';

import rollingBot1 from '../assets/robot/rolling-bot-body-1.png?url';
import rollingBot2 from '../assets/robot/rolling-bot-body-2.png?url';

const allAssetUrls = [rollingBot1, rollingBot2];

export function RollingBotSprite({ isGameOver }: { isGameOver: boolean }) {
  const robotRef = useRef<AnimatedSprite | null>(null);
  const [robotTextures, setRobotTextures] = useState<Texture[]>([]);

  const isLoaded = robotTextures.length > 0;

  // 預載圖片
  useEffect(() => {
    Promise.all(allAssetUrls.map((url) => Assets.load(url))).then(
      (textures) => {
        const robot = [textures[0], textures[1]];
        setRobotTextures(robot);
      }
    );
  }, []);

  // 機器人 & 手砲動畫循環
  useEffect(() => {
    if (robotTextures.length === 0 || !robotRef.current) return;

    const robotSprite = robotRef.current;
    robotSprite.textures = robotTextures;
    robotSprite.animationSpeed = 0.1; // 動畫速度
    robotSprite.play(); // 開始播放動畫

    // 停止動畫
    return () => {
      robotSprite.stop();
    };
  }, [robotTextures]);

  useEffect(() => {
    if (robotTextures.length === 0 || !robotRef.current) return;
    if (isGameOver) {
      robotRef.current.stop(); // 停止動畫
    } else {
      robotRef.current.play(); // 開始播放動畫
    }
  }, [isGameOver, robotTextures]);

  return (
    // 因為 anchor 設置在中心 0.5，圖片往左上角位移，所以要將 x, y 加上角色寬度和高度的一半
    <pixiContainer
      x={PLAYER_WIDTH / 2}
      y={PLAYER_HEIGHT / 2}
    >
      {isLoaded && (
        <>
          <pixiAnimatedSprite
            ref={robotRef}
            anchor={0.5}
            eventMode={'static'}
            textures={robotTextures}
          />
        </>
      )}
    </pixiContainer>
  );
}
