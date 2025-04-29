import { Assets, Texture, Graphics, AnimatedSprite } from 'pixi.js';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useMicrophoneVolume } from '../hooks/useMicrophoneVolume';
import { PLAYER_WIDTH, PLAYER_HEIGHT } from '../constants/config';

import rollingBot1 from '../assets/robot/rolling-bot-body-1.png?url';
import rollingBot2 from '../assets/robot/rolling-bot-body-2.png?url';
import robotBuster from '../assets/robot/robot-buster.png?url';
import robotBusterBlue1 from '../assets/robot/robot-buster-blue-1.png?url';
import robotBusterBlue2 from '../assets/robot/robot-buster-blue-2.png?url';
import robotBusterBlue3 from '../assets/robot/robot-buster-blue-3.png?url';
import robotBusterBlue4 from '../assets/robot/robot-buster-blue-4.png?url';
import robotBusterBlue5 from '../assets/robot/robot-buster-blue-5.png?url';
import robotBusterBlue6 from '../assets/robot/robot-buster-blue-6.png?url';
import robotBusterBlueFull from '../assets/robot/robot-buster-blue-full.png?url';

const allAssetUrls = [
  rollingBot1,
  rollingBot2,
  robotBuster,
  robotBusterBlue1,
  robotBusterBlue2,
  robotBusterBlue3,
  robotBusterBlue4,
  robotBusterBlue5,
  robotBusterBlue6,
  robotBusterBlueFull,
];

export function RollingBotSprite() {
  const robotRef = useRef<AnimatedSprite | null>(null);
  const busterRef = useRef<AnimatedSprite | null>(null);
  const [robotTextures, setRobotTextures] = useState<Texture[]>([]);
  const [busterDefaultTextures, setBusterDefaultTextures] = useState<Texture[]>(
    []
  );
  const [busterBlueTextures, setBusterBlueTextures] = useState<Texture[]>([]);
  const [busterBlueFullTexture, setBusterBlueFullTexture] =
    useState<Texture | null>(null);

  const chargeTimeRef = useRef(0);
  // 判斷進入哪個集氣的哪個階段
  const phaseRef = useRef(0);

  const volume = useMicrophoneVolume();

  const isLoaded =
    robotTextures.length > 0 &&
    busterBlueTextures.length > 0 &&
    busterBlueFullTexture !== null;

  // 透過 volume 為手砲累積能量
  useEffect(() => {
    if (!isLoaded || !busterRef.current) return;

    let animationFrameId: number;

    const update = () => {
      const sprite = busterRef.current;
      if (!sprite) return;

      if (chargeTimeRef.current > 105 && phaseRef.current === 0) {
        sprite.textures = [busterBlueTextures[0], busterBlueTextures[1]];
        sprite.animationSpeed = 0.2;
        sprite.play();
        phaseRef.current = 1;
      } else if (chargeTimeRef.current > 210 && phaseRef.current === 1) {
        sprite.textures = [busterBlueTextures[2], busterBlueTextures[3]];
        sprite.animationSpeed = 0.2;
        sprite.play();
        phaseRef.current = 2;
      } else if (chargeTimeRef.current > 315 && phaseRef.current === 2) {
        sprite.textures = [busterBlueTextures[4], busterBlueTextures[5]];
        sprite.animationSpeed = 0.2;
        sprite.play();
        phaseRef.current = 3;
      }
      // 聲音大於 2 時，才算是開始充能，才能開始累積補充時間
      // 大於 4 時，速度加快
      if (volume > 2) {
        chargeTimeRef.current += 1; // 每 1/60 秒增加 1
      } else if (volume > 4) {
        chargeTimeRef.current += 1.1;
      }
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [volume, isLoaded, busterBlueTextures, busterBlueFullTexture]);

  // 在圖片載入後決定 hitBox 尺寸
  const drawHitBox = useCallback((graphics: Graphics) => {
    const width = PLAYER_WIDTH;
    const height = PLAYER_HEIGHT;

    graphics.clear(); // 確保重繪時不會堆疊
    graphics.rect(-width / 2, -height / 2, width, height);
    graphics.stroke({ color: '#ff0000', width: 1 });
  }, []);

  // 預載圖片
  useEffect(() => {
    Promise.all(allAssetUrls.map((url) => Assets.load(url))).then(
      (textures) => {
        const robot = [textures[0], textures[1]];
        const busterDefault = [textures[2]];
        const busterBlue = [
          textures[3],
          textures[4],
          textures[5],
          textures[6],
          textures[7],
          textures[8],
        ];
        const busterBlueFull = textures[9];

        setRobotTextures(robot);
        setBusterDefaultTextures(busterDefault);
        setBusterBlueTextures(busterBlue);
        setBusterBlueFullTexture(busterBlueFull);
      }
    );
  }, []);

  // 機器人 & 手砲動畫循環
  useEffect(() => {
    if (robotTextures.length === 0 || !robotRef.current) return;
    if (busterDefaultTextures.length === 0 || !busterRef.current) return;

    const robotSprite = robotRef.current;
    robotSprite.textures = robotTextures;
    robotSprite.animationSpeed = 0.1; // 動畫速度
    robotSprite.play(); // 開始播放動畫

    const busterSprite = busterRef.current;
    busterSprite.textures = [busterDefaultTextures[0]];

    // 停止動畫
    return () => {
      robotSprite.stop();
      busterSprite.stop();
    };
  }, [robotTextures, busterDefaultTextures]);

  return (
    // 因為 anchor 設置在中心 0.5，圖片往左上角位移，所以要將 x, y 加上角色寬度和高度的一半
    <pixiContainer x={PLAYER_WIDTH / 2} y={PLAYER_HEIGHT / 2}>
      {isLoaded && (
        <>
          {/* Hitbox 與 Sprite 為同一個 container 的子項 */}
          <pixiGraphics draw={drawHitBox} />
          <pixiAnimatedSprite
            ref={robotRef}
            anchor={0.5}
            eventMode={'static'}
            textures={robotTextures}
          />
          <pixiAnimatedSprite
            ref={busterRef}
            anchor={0.5}
            x={4}
            y={6}
            eventMode={'static'}
            textures={busterBlueTextures}
          />
        </>
      )}
    </pixiContainer>
  );
}
