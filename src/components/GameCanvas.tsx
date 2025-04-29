import { useState, useEffect, useRef } from 'react';
import { Application } from '@pixi/react';
import { Container } from 'pixi.js';
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
  const [score, setScore] = useState(0); // 分數

  const playerRef = useRef<Container>(null);
  const patrolBotRef = useRef<Container>(null);

  const startTimeRef = useRef<number | null>(null); // 遊戲開始時間
  const lastScoreUpdateRef = useRef<number>(0); // 上次更新時間
  const velocityRef = useRef<number>(0); // 用於追蹤角色的垂直速度

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // 只有站在地上才能使用空白鍵跳躍
      if (event.code !== 'Space' || !playerRef.current) return;
      if (playerRef.current.y !== PLAYER_ORIGINAL_Y) return;
      const jumpForce = Math.min(MAX_JUMP_FORCE);
      velocityRef.current = -jumpForce;
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

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

      const player = playerRef.current;
      const patrolBot = patrolBotRef.current;

      if (player) {
        // 更新角色位置（跳躍）
        velocityRef.current += GRAVITY;
        player.y += velocityRef.current;

        if (player.y < PLAYER_ORIGINAL_Y - 300) {
          player.y = PLAYER_ORIGINAL_Y - 300;
          velocityRef.current = 0;
        }

        if (player.y > PLAYER_ORIGINAL_Y) {
          player.y = PLAYER_ORIGINAL_Y;
          velocityRef.current = 0;
        }
      }

      // 障礙物向左移動，如果超出畫面則重置位置
      if (patrolBot) {
        // 更新敵人位置（巡邏）
        patrolBot.x -= OBSTACLE_SPEED;
        if (patrolBot.x < -patrolBot.width) {
          patrolBot.x = GAME_WIDTH;
        }
      }

      animationFrameId = requestAnimationFrame(update);
    };

    animationFrameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(animationFrameId); // 清除動畫幀
  }, []);

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
      <pixiContainer
        ref={playerRef}
        x={PLAYER_ORIGINAL_X}
        y={PLAYER_ORIGINAL_Y}
      >
        <RollingBotSprite />
      </pixiContainer>

      {/* 敵人 */}
      <pixiContainer ref={patrolBotRef} x={GAME_WIDTH} y={PATROL_BOT_Y}>
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
