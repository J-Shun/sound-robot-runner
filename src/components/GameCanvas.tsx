import { useState, useEffect, useCallback } from "react";
import { useMicrophoneVolume } from "../hooks/useMicrophoneVolume";
import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";

extend({
  Container,
  Graphics,
});

const BASE_Y = 300; // 正常位置的 y
const JUMP_HEIGHT = 200; // 最大跳躍高度
const VOLUME_THRESHOLD = 5; // 小於這個音量就不動作
const LERP_FACTOR = 0.1; // 越小越平滑（0.1~0.2 比較自然）

const GameCanvas = () => {
  const volume = useMicrophoneVolume();
  const [squarePosition, setSquarePosition] = useState({ x: 100, y: BASE_Y });

  const drawCallback = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.fill(0xfa0);
    graphics.rect(0, 0, 100, 100);
    graphics.fill();
  }, []);

  // 監聽音量變化，更新正方形位置
  useEffect(() => {
    let targetY = BASE_Y;

    if (volume >= VOLUME_THRESHOLD) {
      const normalized = Math.min(
        (volume - VOLUME_THRESHOLD) / (50 - VOLUME_THRESHOLD),
        1
      );
      targetY = BASE_Y - normalized * JUMP_HEIGHT;
    }

    // 使用 requestAnimationFrame 來平滑過渡到 targetY
    let animationFrameId: number;

    const update = () => {
      setSquarePosition((prev) => {
        const newY = prev.y + (targetY - prev.y) * LERP_FACTOR;
        return { ...prev, y: newY };
      });
      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);

    return () => cancelAnimationFrame(animationFrameId);
  }, [volume]);

  return (
    // 背景顏色白色
    <Application width={800} height={600} backgroundColor={"#ccc"}>
      <pixiContainer x={squarePosition.x} y={squarePosition.y}>
        <pixiGraphics draw={drawCallback} />
      </pixiContainer>
    </Application>
  );
};

export default GameCanvas;
