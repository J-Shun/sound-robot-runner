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
  SPEED,
  GAME_WIDTH,
  PLAYER_ORIGINAL_Y,
  PATROL_BOT_Y,
  PLAYER_SPEED,
  FLAME_ORIGINAL_X,
  FLAME_ORIGINAL_Y,
} from '../constants';

const GameCanvas = () => {
  // 狀態管理
  const [score, setScore] = useState(0); // 分數

  const playerRef = useRef<Container>(null);
  const flameRef = useRef<Container>(null);
  const patrolBotRef = useRef<Container>(null);

  const isLeftKeyDown = useRef(false);
  const isRightKeyDown = useRef(false);

  const startTimeRef = useRef<number | null>(null); // 遊戲開始時間
  const lastScoreUpdateRef = useRef<number>(0); // 上次更新時間
  const velocityRef = useRef<number>(0); // 用於追蹤角色的垂直速度

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') {
        isLeftKeyDown.current = true;
      } else if (event.code === 'ArrowRight') {
        isRightKeyDown.current = true;
      } else if (
        event.code === 'Space' &&
        playerRef.current?.y === PLAYER_ORIGINAL_Y
      ) {
        velocityRef.current = -MAX_JUMP_FORCE;
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') {
        isLeftKeyDown.current = false;
      } else if (event.code === 'ArrowRight') {
        isRightKeyDown.current = false;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
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
      const flame = flameRef.current;
      const patrolBot = patrolBotRef.current;

      if (player && flame) {
        // 左右移動
        if (isLeftKeyDown.current && player.x > 0) {
          player.x -= PLAYER_SPEED;
          flame.x -= PLAYER_SPEED;
        }
        if (isRightKeyDown.current && player.x < GAME_WIDTH - player.width) {
          player.x += PLAYER_SPEED;
          flame.x += PLAYER_SPEED;
        }

        // 跳躍
        velocityRef.current += GRAVITY;
        player.y += velocityRef.current;
        flame.y += velocityRef.current;

        // 當角色位置比地面低時，則將角色重置
        if (player.y > PLAYER_ORIGINAL_Y) {
          player.y = PLAYER_ORIGINAL_Y;
          flame.y = FLAME_ORIGINAL_Y;
          velocityRef.current = 0;
        }
      }

      // 巡邏機器人向左移動，如果超出畫面則重置位置
      if (patrolBot) {
        // 更新敵人位置（巡邏）
        patrolBot.x -= SPEED;
        if (patrolBot.x < -patrolBot.width) {
          patrolBot.x = GAME_WIDTH;
        }
      }

      // 碰撞判斷
      if (player && patrolBot) {
        const playerBounds = player.getBounds();
        const patrolBotBounds = patrolBot.getBounds();

        const isHit =
          playerBounds.x + playerBounds.width > patrolBotBounds.x &&
          playerBounds.x < patrolBotBounds.x + patrolBotBounds.width &&
          playerBounds.y + playerBounds.height > patrolBotBounds.y &&
          playerBounds.y < patrolBotBounds.y + patrolBotBounds.height;

        if (isHit) {
          console.log('hit');
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
      {/* 火焰效果 */}
      <pixiContainer ref={flameRef} x={FLAME_ORIGINAL_X} y={FLAME_ORIGINAL_Y}>
        <pixiGraphics
          draw={(graphics) => {
            graphics.clear(); // 確保重繪時不會堆疊
            graphics.rect(0, 0, 80, 15);
            graphics.stroke({ color: '#ff0000', width: 1 });
          }}
        />
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
