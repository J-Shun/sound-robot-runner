import { useState, useEffect, useRef } from 'react';
import { Application } from '@pixi/react';
import { RollingBotSprite } from '../sprites/RollingBotSprite';
import { PatrolBotSprite } from '../sprites/PatrolBotSprite';
import { DesertTile } from '../sprites/DesertTile';
import { RuinBackground } from '../sprites/RuinBackground';
import { SunsetBackground } from '../sprites/SunsetBackground';
import {
  GRAVITY,
  PLAYER_ORIGINAL_X,
  MAX_JUMP_FORCE,
  OBSTACLE_SPEED,
  GAME_WIDTH,
  PLAYER_ORIGINAL_Y,
  PATROL_BOT_Y,
} from '../constants';

const GameCanvas = () => {
  // 狀態管理
  const [playerY, setPlayerY] = useState(PLAYER_ORIGINAL_Y); // 玩家的 Y 軸位置
  const [patrolBotX, setPatrolBotX] = useState(GAME_WIDTH); // 敵人的 X 軸位置
  const [score, setScore] = useState(0); // 分數

  const startTimeRef = useRef<number | null>(null); // 遊戲開始時間
  const lastScoreUpdateRef = useRef<number>(0); // 上次更新時間

  const velocityRef = useRef(0); // 用於追蹤角色的垂直速度

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只有站在地上才能使用空白鍵跳躍
      if (event.code !== 'Space' || playerY !== PLAYER_ORIGINAL_Y) return;
      const jumpForce = Math.min(MAX_JUMP_FORCE);
      velocityRef.current = -jumpForce;
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [playerY]);

  // 監聽音量變化，更新角色與障礙物位置
  useEffect(() => {
    let animationFrameId: number;

    const update = () => {
      const now = Date.now();

      if (startTimeRef.current === null) {
        startTimeRef.current = now;
      }

      // 每 0.1 秒加一分
      if (now - lastScoreUpdateRef.current > 100) {
        const elapsed = now - startTimeRef.current;
        setScore(Math.floor(elapsed / 100));
        lastScoreUpdateRef.current = now;
      }

      // 更新垂直速度與位置
      velocityRef.current += GRAVITY;
      setPlayerY((prevY) => {
        let newY = prevY + velocityRef.current;
        if (newY < PLAYER_ORIGINAL_Y - 300) {
          newY = PLAYER_ORIGINAL_Y - 300;
          velocityRef.current = 0;
        }
        if (newY > PLAYER_ORIGINAL_Y) {
          newY = PLAYER_ORIGINAL_Y;
          velocityRef.current = 0;
        }
        if (velocityRef.current === 0) {
          newY = PLAYER_ORIGINAL_Y;
        }
        return newY;
      });

      // 障礙物向左移動，如果超出畫面則重置位置
      setPatrolBotX((prevX) => {
        const nextX = prevX - OBSTACLE_SPEED;
        return nextX < -patrolBotX ? GAME_WIDTH : nextX;
      });

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId); // 清除動畫幀
  }, [playerY, patrolBotX]);

  return (
    <Application
      resizeTo={window}
      autoDensity
      antialias
      backgroundColor={'#ccc'}
    >
      {/* 日落背景 */}
      <pixiContainer>
        <SunsetBackground />
      </pixiContainer>

      {/* 廢墟背景 */}
      <pixiContainer>
        <RuinBackground />
      </pixiContainer>

      {/* 沙漠地面 */}
      <pixiContainer>
        <DesertTile />
      </pixiContainer>

      {/* 玩家角色 */}
      <pixiContainer x={PLAYER_ORIGINAL_X} y={playerY}>
        <RollingBotSprite />
      </pixiContainer>

      {/* 敵人 */}
      <pixiContainer x={patrolBotX} y={PATROL_BOT_Y}>
        <PatrolBotSprite />
      </pixiContainer>

      {/* 計分器 */}
      <pixiContainer x={20} y={20}>
        <pixiText
          text={`score: ${score}`}
          style={{
            fontSize: 16,
            fill: '#000000',
          }}
        />
      </pixiContainer>
    </Application>
  );
};

export default GameCanvas;
