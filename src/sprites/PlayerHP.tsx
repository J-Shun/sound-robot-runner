import { Assets, Texture, Sprite } from 'pixi.js';
import { useEffect, useState, useRef } from 'react';

import robotHead from '../assets/robot/robot-head.png?url';

export function PlayerHP() {
  const [robotHeadTexture, setRobotHeadTexture] = useState<Texture | null>(
    null
  );
  const spriteRef = useRef<Sprite | null>(null);

  useEffect(() => {
    Assets.load(robotHead).then((loadedTexture) => {
      setRobotHeadTexture(loadedTexture);
    });
  }, [robotHeadTexture]);

  return (
    <pixiContainer>
      {robotHeadTexture && (
        <pixiSprite
          ref={spriteRef}
          texture={robotHeadTexture}
          anchor={{ x: 0, y: 0.5 }}
        />
      )}
    </pixiContainer>
  );
}
