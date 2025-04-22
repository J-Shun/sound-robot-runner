import { useState, useEffect, useRef, useCallback } from "react";
import { useMicrophoneVolume } from "../hooks/useMicrophoneVolume";
import { Application, extend } from "@pixi/react";
import { Container, Graphics } from "pixi.js";

extend({
  Container,
  Graphics,
});

const BASE_Y = 300; // 基準 Y 軸位置
const GROUND_Y = BASE_Y; // 地面 Y 軸位置
const GRAVITY = 1.2; // 重力加速度
const JUMP_MULTIPLIER = 0.6; // 跳躍力道乘數
const MAX_JUMP_FORCE = 20; // 最大跳躍力道
const VOLUME_THRESHOLD = 5; // 音量閾值

const OBSTACLE_WIDTH = 40;
const OBSTACLE_HEIGHT = 80;
const OBSTACLE_SPEED = 5;
const GAME_WIDTH = 800; // 可依實際畫面大小調整

const GameCanvas = () => {
  const volume = useMicrophoneVolume();

  const [y, setY] = useState(BASE_Y);
  const [obstacleX, setObstacleX] = useState(GAME_WIDTH);
  const [isGameOver, setIsGameOver] = useState(false);

  const velocityRef = useRef(0);

  const drawPlayer = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.fill(0xfa0);
    graphics.rect(0, 0, 100, 100);
    graphics.fill();
  }, []);

  const drawObstacle = useCallback((graphics: Graphics) => {
    graphics.clear();
    graphics.fill(0x3399ff); // 藍色障礙物
    graphics.rect(0, 0, OBSTACLE_WIDTH, OBSTACLE_HEIGHT);
    graphics.fill();
  }, []);

  // 重置遊戲狀態
  const resetGame = () => {
    setY(BASE_Y);
    setObstacleX(GAME_WIDTH);
    velocityRef.current = 0;
    setIsGameOver(false);
  };

  // 監聽點擊或鍵盤事件來重啟遊戲
  useEffect(() => {
    const handleRestart = () => {
      if (isGameOver) {
        resetGame();
      }
    };
    window.addEventListener("click", handleRestart);
    window.addEventListener("keydown", handleRestart);
    return () => {
      window.removeEventListener("click", handleRestart);
      window.removeEventListener("keydown", handleRestart);
    };
  }, [isGameOver]);

  // 監聽音量變化，更新正方形位置
  useEffect(() => {
    if (isGameOver) return;

    let animationFrameId: number;

    const update = () => {
      // 處理跳躍
      if (volume > VOLUME_THRESHOLD) {
        const jumpForce = Math.min(
          (volume - VOLUME_THRESHOLD) * JUMP_MULTIPLIER,
          MAX_JUMP_FORCE
        );
        velocityRef.current = -jumpForce;
      }

      // 處理重力
      velocityRef.current += GRAVITY;
      setY((prevY) => {
        let newY = prevY + velocityRef.current;
        if (newY > GROUND_Y) {
          newY = GROUND_Y;
          velocityRef.current = 0;
        }
        return newY;
      });

      // 移動障礙物
      setObstacleX((prevX) => {
        const nextX = prevX - OBSTACLE_SPEED;
        return nextX < -OBSTACLE_WIDTH ? GAME_WIDTH : nextX;
      });

      // 碰撞偵測
      const player = {
        x: 100,
        y: y,
        width: 100,
        height: 100,
      };
      const obstacle = {
        x: obstacleX,
        y: GROUND_Y + 20,
        width: OBSTACLE_WIDTH,
        height: OBSTACLE_HEIGHT,
      };

      const isColliding =
        player.x < obstacle.x + obstacle.width &&
        player.x + player.width > obstacle.x &&
        player.y < obstacle.y + obstacle.height &&
        player.y + player.height > obstacle.y;

      if (isColliding) {
        setIsGameOver(true);
        return;
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId);
  }, [volume, y, obstacleX, isGameOver]);

  return (
    <Application width={GAME_WIDTH} height={600} backgroundColor={"#ccc"}>
      {/* 玩家角色 */}
      <pixiContainer x={100} y={y}>
        <pixiGraphics draw={drawPlayer} />
      </pixiContainer>

      {/* 障礙物 */}
      <pixiContainer x={obstacleX} y={GROUND_Y + 20}>
        {/* +20 讓它站在地面 */}
        <pixiGraphics draw={drawObstacle} />
      </pixiContainer>
    </Application>
  );
};

export default GameCanvas;
