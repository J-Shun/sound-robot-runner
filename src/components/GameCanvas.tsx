import { useState, useEffect, useRef } from 'react';
import { Application } from '@pixi/react';
import { Container } from 'pixi.js';
import { RollingBotSprite } from '../sprites/RollingBotSprite';
import { FlameGun } from '../sprites/FlameGun';
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
  FLAME_GUN_ORIGINAL_X,
  FLAME_GUN_ORIGINAL_Y,
  FLAME_GUN_WIDTH,
} from '../constants';

const GameCanvas = () => {
  // 狀態管理
  const [score, setScore] = useState(0); // 分數

  const robotRef = useRef<Container>(null);
  const flameGunRef = useRef<Container>(null);
  const patrolBotRef = useRef<Container>(null);

  const isLeftKeyDown = useRef(false);
  const isRightKeyDown = useRef(false);

  const startTimeRef = useRef<number | null>(null); // 遊戲開始時間
  const lastScoreUpdateRef = useRef<number>(0); // 上次更新時間
  const velocityRef = useRef<number>(0); // 用於追蹤角色的垂直速度

  // 角色無敵幀相關
  const playerLastHitTimeRef = useRef<number>(0);
  const patrolBotLastHitTimeRef = useRef<number>(0);
  const playerInvincibleRef = useRef(false);
  const patrolBotInvincibleRef = useRef(false);

  // 無敵狀態處理
  const startInvincibility = (
    sprite: Container,
    invincibleRef: React.RefObject<boolean>
  ) => {
    invincibleRef.current = true;
    let elapsed = 0;
    const flickerInterval = 50; // 每50ms閃爍一次
    const totalDuration = 100; // 無敵持續時間 100ms

    const flicker = () => {
      if (sprite) {
        sprite.tint = sprite.tint === 0xffffff ? 0xff0000 : 0xffffff; // 紅色和白色之間切換
      }
    };

    const intervalId = setInterval(() => {
      flicker();
      elapsed += flickerInterval;
      if (elapsed >= totalDuration) {
        clearInterval(intervalId);
        sprite.tint = 0xffffff; // 恢復顏色
        invincibleRef.current = false;
      }
    }, flickerInterval);
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'ArrowLeft') {
        isLeftKeyDown.current = true;
      } else if (event.code === 'ArrowRight') {
        isRightKeyDown.current = true;
      } else if (
        event.code === 'Space' &&
        robotRef.current?.y === PLAYER_ORIGINAL_Y
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

      const player = robotRef.current;
      const flameGun = flameGunRef.current;
      const patrolBot = patrolBotRef.current;

      // 碰撞判斷
      if (player && patrolBot && flameGun) {
        // 玩家左右移動
        if (isLeftKeyDown.current && player.x > 0) {
          player.x -= PLAYER_SPEED;
          flameGun.x -= PLAYER_SPEED;
        }

        if (isRightKeyDown.current && player.x < GAME_WIDTH - player.width) {
          player.x += PLAYER_SPEED;
          flameGun.x += PLAYER_SPEED;
        }

        // 玩家跳躍
        velocityRef.current += GRAVITY;
        player.y += velocityRef.current;
        flameGun.y += velocityRef.current;

        // 當玩家位置比地面低時，則將玩家重置
        if (player.y > PLAYER_ORIGINAL_Y) {
          player.y = PLAYER_ORIGINAL_Y;
          flameGun.y = FLAME_GUN_ORIGINAL_Y;
          velocityRef.current = 0;
        }

        // 更新巡邏機器人位置
        patrolBot.x -= SPEED;
        if (patrolBot.x < -patrolBot.width) {
          patrolBot.x = GAME_WIDTH;
        }

        const playerBounds = player.getBounds();
        const patrolBotBounds = patrolBot.getBounds();
        const flameGunBounds = flameGun.getBounds();

        const isPlayerGetHit =
          playerBounds.x + playerBounds.width > patrolBotBounds.x &&
          playerBounds.x < patrolBotBounds.x + patrolBotBounds.width &&
          playerBounds.y + playerBounds.height > patrolBotBounds.y &&
          playerBounds.y < patrolBotBounds.y + patrolBotBounds.height;

        const isPatrolBotGetHit =
          flameGunBounds.x + flameGunBounds.width > patrolBotBounds.x &&
          flameGunBounds.x < patrolBotBounds.x + patrolBotBounds.width &&
          flameGunBounds.y + flameGunBounds.height > patrolBotBounds.y &&
          flameGunBounds.y < patrolBotBounds.y + patrolBotBounds.height &&
          flameGunBounds.width > FLAME_GUN_WIDTH;

        const currentTime = now;
        if (
          isPlayerGetHit &&
          currentTime - playerLastHitTimeRef.current > 100 &&
          !playerInvincibleRef.current
        ) {
          // 玩家後退
          player.x -= 16;
          flameGun.x -= 16;
          // 更新玩家最後被擊中的時間
          playerLastHitTimeRef.current = currentTime;
          startInvincibility(player, playerInvincibleRef);
          startInvincibility(flameGun, playerInvincibleRef);
        }

        if (
          isPatrolBotGetHit &&
          currentTime - patrolBotLastHitTimeRef.current > 100 &&
          !patrolBotInvincibleRef.current
        ) {
          // 敵人後退
          patrolBot.x += 16;
          // 更新敵人最後被擊中的時間
          patrolBotLastHitTimeRef.current = currentTime;
          startInvincibility(patrolBot, patrolBotInvincibleRef);
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
        ref={robotRef}
        x={PLAYER_ORIGINAL_X}
        y={PLAYER_ORIGINAL_Y}
      >
        <RollingBotSprite />
      </pixiContainer>
      {/* 火焰槍 */}
      <pixiContainer
        ref={flameGunRef}
        x={FLAME_GUN_ORIGINAL_X}
        y={FLAME_GUN_ORIGINAL_Y}
      >
        <FlameGun />
      </pixiContainer>

      {/* 敵人 */}
      <pixiContainer
        ref={patrolBotRef}
        x={GAME_WIDTH}
        y={PATROL_BOT_Y}
      >
        <PatrolBotSprite />
      </pixiContainer>

      {/* 計分器 */}
      <pixiContainer
        x={20}
        y={20}
      >
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
