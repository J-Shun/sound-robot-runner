import { useState, useEffect, useRef, useCallback } from "react";
import { useMicrophoneVolume } from "../hooks/useMicrophoneVolume";
import { Application } from "@pixi/react";
import { Graphics } from "pixi.js";
import { RollingBotSprite } from "../sprites/RollingBotSprite";
import {
  GROUND_Y,
  GRAVITY,
  JUMP_MULTIPLIER,
  MAX_JUMP_FORCE,
  VOLUME_THRESHOLD,
  OBSTACLE_WIDTH,
  OBSTACLE_HEIGHT,
  OBSTACLE_SPEED,
  OBSTACLE_Y,
  GAME_WIDTH,
} from "../constants";

const GameCanvas = () => {
  // 麥克風音量
  const volume = useMicrophoneVolume();

  // 狀態管理
  const [y, setY] = useState(GROUND_Y); // 玩家角色的 Y 軸位置
  const [obstacleX, setObstacleX] = useState(GAME_WIDTH); // 障礙物的 X 軸位置
  const [isGameOver, setIsGameOver] = useState(false); // 遊戲是否結束

  const velocityRef = useRef(0); // 用於追蹤角色的垂直速度

  // 繪製障礙物
  const drawObstacle = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.fill(0x3399ff);
    graphics.rect(0, 0, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    graphics.fill();
  }, []);

  // 重置遊戲狀態
  const resetGame = () => {
    setY(GROUND_Y);
    setObstacleX(GAME_WIDTH);
    velocityRef.current = 0;
    setIsGameOver(false);
  };

  // 監聽點擊或鍵盤事件來重啟遊戲
  useEffect(() => {
    const handleRestart = () => {
      if (isGameOver) {
        resetGame(); // 如果遊戲結束，重置遊戲
      }
    };
    window.addEventListener("click", handleRestart); // 點擊事件
    window.addEventListener("keydown", handleRestart); // 鍵盤事件
    return () => {
      window.removeEventListener("click", handleRestart);
      window.removeEventListener("keydown", handleRestart);
    };
  }, [isGameOver]);

  // 監聽音量變化，更新角色與障礙物位置
  useEffect(() => {
    if (isGameOver) return;

    let animationFrameId: number;

    const update = () => {
      // 處理跳躍邏輯
      if (volume > VOLUME_THRESHOLD) {
        const jumpForce = Math.min(
          (volume - VOLUME_THRESHOLD) * JUMP_MULTIPLIER, // 計算跳躍力道
          MAX_JUMP_FORCE // 限制最大跳躍力道
        );
        velocityRef.current = -jumpForce; // 設定向上的速度
      }

      // 處理重力邏輯
      velocityRef.current += GRAVITY;
      setY((prevY) => {
        let newY = prevY + velocityRef.current;
        // 限制角色不會掉到地面以下，抵達地面時速度歸零
        if (newY > GROUND_Y) {
          newY = GROUND_Y;
          velocityRef.current = 0;
        }
        return newY;
      });

      // 障礙物向左移動，如果超出畫面則重置位置
      setObstacleX((prevX) => {
        const nextX = prevX - OBSTACLE_SPEED;
        return nextX < -OBSTACLE_WIDTH ? GAME_WIDTH : nextX;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId); // 清除動畫幀
  }, [volume, y, obstacleX, isGameOver]);

  return (
    <Application
      resizeTo={window}
      autoDensity
      antialias
      backgroundColor={"#ccc"}
    >
      {/* 地板 */}
      <pixiContainer>
        <pixiGraphics
          draw={(graphics) => {
            graphics.clear();
            graphics.moveTo(0, GROUND_Y);
            graphics.lineTo(GAME_WIDTH, GROUND_Y);
            graphics.stroke({ color: "#000000", pixelLine: true });
          }}
        />
      </pixiContainer>

      {/* 玩家角色 */}
      <pixiContainer x={100} y={y}>
        <RollingBotSprite />
      </pixiContainer>

      {/* 讓它站在地面 */}
      <pixiContainer x={obstacleX} y={OBSTACLE_Y}>
        <pixiGraphics draw={drawObstacle} />
      </pixiContainer>
    </Application>
  );
};

export default GameCanvas;
