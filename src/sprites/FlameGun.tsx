import { Assets, Texture, AnimatedSprite } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import { useMicrophoneVolume } from '../hooks/useMicrophoneVolume';
import {
  FLAME_CHARGE_TIME_S,
  FLAME_CHARGE_TIME_M,
  FLAME_CHARGE_TIME_L,
  FLAME_CHARGE_TIME_L_MAX,
} from '../constants/config';

import flameGun1 from '../assets/robot/flame-gun1.png?url';
import flameGun2 from '../assets/robot/flame-gun2.png?url';
import flameGun3 from '../assets/robot/flame-gun3.png?url';
import flameGun4 from '../assets/robot/flame-gun4.png?url';
import flameGun5 from '../assets/robot/flame-gun5.png?url';
import flameGun6 from '../assets/robot/flame-gun6.png?url';
import flameGun7 from '../assets/robot/flame-gun7.png?url';

import flameEffecr1 from '../assets/robot/flame-effect-1.png?url';
import flameEffecr2 from '../assets/robot/flame-effect-2.png?url';
import flameEffecr3 from '../assets/robot/flame-effect-3.png?url';
import flameEffecr4 from '../assets/robot/flame-effect-4.png?url';
import flameEffecr5 from '../assets/robot/flame-effect-5.png?url';
import flameEffecr6 from '../assets/robot/flame-effect-6.png?url';

const gun = [
  flameGun1,
  flameGun2,
  flameGun3,
  flameGun4,
  flameGun5,
  flameGun6,
  flameGun7,
];

const effect = [
  flameEffecr1,
  flameEffecr2,
  flameEffecr3,
  flameEffecr4,
  flameEffecr5,
  flameEffecr6,
];

export function FlameGun() {
  const flameGunRef = useRef<AnimatedSprite | null>(null);
  const effctRef = useRef<AnimatedSprite | null>(null);
  const [flameGunChargeTextures, setFlameGunChargeTextures] = useState<
    Texture[]
  >([]);
  const [effectTextures, setEffectTextures] = useState<Texture[]>([]);

  const chargeTimeRef = useRef(0);
  // 判斷進入哪個集氣的哪個階段
  const phaseRef = useRef(0);

  const volume = useMicrophoneVolume();

  const isLoaded =
    flameGunChargeTextures.length > 0 && effectTextures.length > 0;

  // 透過 volume 為火焰發射器累積能量
  useEffect(() => {
    if (!isLoaded || !flameGunRef.current || !effctRef.current) return;

    let animationFrameId: number;

    const update = () => {
      const flameGunSprite = flameGunRef.current!;
      const effectSprite = effctRef.current!;

      // 充能邏輯
      if (volume > 2) {
        chargeTimeRef.current += volume > 5 ? 1.3 : 1;
        // 限制最大值 (避免超過最大階段)
        if (chargeTimeRef.current > FLAME_CHARGE_TIME_L_MAX) {
          chargeTimeRef.current = FLAME_CHARGE_TIME_L_MAX;
        }
      } else {
        // 當沒聲音時，逐漸回復
        chargeTimeRef.current -= 0.75;
        if (chargeTimeRef.current < 0) {
          chargeTimeRef.current = 0;
        }
      }

      // 根據 chargeTime 決定階段
      let phase = 0;
      if (
        chargeTimeRef.current > FLAME_CHARGE_TIME_S &&
        chargeTimeRef.current <= FLAME_CHARGE_TIME_M
      ) {
        phase = 1; // 小火
      } else if (
        chargeTimeRef.current > FLAME_CHARGE_TIME_M &&
        chargeTimeRef.current <= FLAME_CHARGE_TIME_L
      ) {
        phase = 2; // 中火
      } else if (chargeTimeRef.current > FLAME_CHARGE_TIME_L) {
        phase = 3; // 大火
      }

      // 如果階段改變，更新動畫
      if (phaseRef.current !== phase) {
        phaseRef.current = phase;

        if (phase === 0) {
          flameGunSprite.textures = [flameGunChargeTextures[0]];
          flameGunSprite.stop();
          effectSprite.alpha = 0; // 沒有攻擊時火焰效果隱藏
        } else if (phase === 1) {
          flameGunSprite.textures = [
            flameGunChargeTextures[1],
            flameGunChargeTextures[2],
          ];
          flameGunSprite.animationSpeed = 0.2;
          flameGunSprite.play();

          effectSprite.textures = [effectTextures[0], effectTextures[1]];
          effectSprite.animationSpeed = 0.2;
          effectSprite.play();
          effectSprite.alpha = 1;
        } else if (phase === 2) {
          flameGunSprite.textures = [
            flameGunChargeTextures[3],
            flameGunChargeTextures[4],
          ];
          flameGunSprite.animationSpeed = 0.2;
          flameGunSprite.play();

          effectSprite.textures = [effectTextures[2], effectTextures[3]];
          effectSprite.animationSpeed = 0.2;
          effectSprite.play();
          effectSprite.alpha = 1;
        } else if (phase === 3) {
          flameGunSprite.textures = [
            flameGunChargeTextures[5],
            flameGunChargeTextures[6],
          ];
          flameGunSprite.animationSpeed = 0.2;
          flameGunSprite.play();

          effectSprite.textures = [effectTextures[4], effectTextures[5]];
          effectSprite.animationSpeed = 0.2;
          effectSprite.play();
          effectSprite.alpha = 1;
        }
      }
      animationFrameId = requestAnimationFrame(update);
    };

    update();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [volume, isLoaded, flameGunChargeTextures, effectTextures]);

  // 預載圖片
  useEffect(() => {
    Promise.all(gun.map((url) => Assets.load(url))).then((textures) => {
      setFlameGunChargeTextures(textures);
    });
  }, []);

  // 預載圖片 effect
  useEffect(() => {
    Promise.all(effect.map((url) => Assets.load(url))).then((textures) => {
      setEffectTextures(textures);
    });
  }, []);

  // 火焰槍預設
  useEffect(() => {
    if (flameGunChargeTextures.length === 0 || !flameGunRef.current) return;
    if (effectTextures.length === 0 || !effctRef.current) return;

    const flameGunSprite = flameGunRef.current;
    flameGunSprite.textures = [flameGunChargeTextures[0]];

    const effectSprite = effctRef.current;
    effectSprite.alpha = 0;

    // 停止動畫
    return () => {
      flameGunSprite.stop();
      effectSprite.stop();
    };
  }, [flameGunChargeTextures, effectTextures]);

  return (
    // 因為 anchor 設置在中心 0.5，圖片往左上角位移，所以要將 x, y 加上角色寬度和高度的一半
    <pixiContainer>
      {isLoaded && (
        <>
          <pixiAnimatedSprite
            ref={flameGunRef}
            anchor={0.5}
            x={4}
            y={6}
            eventMode={'static'}
            textures={flameGunChargeTextures}
          />
          <pixiAnimatedSprite
            ref={effctRef}
            x={36}
            y={-8}
            eventMode={'static'}
            textures={effectTextures}
          />
        </>
      )}
    </pixiContainer>
  );
}
