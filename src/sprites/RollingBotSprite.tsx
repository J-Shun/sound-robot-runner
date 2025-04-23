import { Assets, Texture, Graphics, AnimatedSprite } from "pixi.js";
import { useEffect, useRef, useState, useCallback } from "react";
import { PLAYER_X, PLAYER_Y } from "../constants/config";

import rollingBot1 from "../assets/rolling-bot.png?url";
import rollingBot2 from "../assets/rolling-bot2.png?url";

export function RollingBotSprite() {
  const spriteRef = useRef<AnimatedSprite | null>(null);
  const [textures, setTextures] = useState<Texture[]>([]);

  // 在圖片載入後決定 hitBox 尺寸
  const drawHitBox = useCallback((graphics: Graphics) => {
    const width = 96 - 16;
    const height = 96 - 9;

    graphics.clear(); // 確保重繪時不會堆疊
    graphics.rect(-width / 2 + 3, -height / 2, width, height); // 因為 anchor = 0.5
    graphics.stroke({ color: "#ff0000", width: 1 });
  }, []);

  // 預載圖片
  useEffect(() => {
    if (textures.length === 0) {
      Promise.all([Assets.load(rollingBot1), Assets.load(rollingBot2)]).then(
        (loadedTextures) => {
          setTextures(loadedTextures);
        }
      );
    }
  }, [textures]);

  // 動畫循環
  useEffect(() => {
    if (textures.length === 0 || !spriteRef.current) return;

    const sprite = spriteRef.current;
    sprite.textures = textures;
    sprite.animationSpeed = 0.1; // 動畫速度
    sprite.play(); // 開始播放動畫

    return () => {
      sprite.stop(); // 停止動畫
    };
  }, [textures]);

  return (
    <pixiContainer x={PLAYER_X} y={PLAYER_Y}>
      {textures.length !== 0 && (
        <>
          {/* Hitbox 與 Sprite 為同一個 container 的子項 */}
          <pixiGraphics draw={drawHitBox} />
          <pixiAnimatedSprite
            ref={spriteRef}
            anchor={0.5}
            eventMode={"static"}
            textures={textures}
          />
        </>
      )}
    </pixiContainer>
  );
}
