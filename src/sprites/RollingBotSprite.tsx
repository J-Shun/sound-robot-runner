import { Assets, Texture } from 'pixi.js';
import { useEffect, useRef, useState } from 'react';
import rollingBot from '../assets/rolling-bot.png?url';

export function RollingBotSprite() {
  const spriteRef = useRef(null);

  const [texture, setTexture] = useState(Texture.EMPTY);

  // Preload the sprite if it hasn't been loaded yet
  useEffect(() => {
    if (texture === Texture.EMPTY) {
      Assets.load(rollingBot).then((result) => {
        setTexture(result);
      });
    }
  }, [texture]);

  return (
    <pixiSprite
      ref={spriteRef}
      anchor={0.5}
      eventMode={'static'}
      texture={texture}
      x={100}
      y={100}
    />
  );
}
