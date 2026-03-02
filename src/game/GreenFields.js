import { useEffect, useRef } from "react";
import Phaser from "phaser";

function GreenFields({ config, width = 800, height = 600 }) {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    gameRef.current = new Phaser.Game({
      ...config,
      width,
      height,
      parent: containerRef.current,
    });

    return () => {
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [config, width, height]);

  return <div ref={containerRef} />;
}

export default GreenFields;
