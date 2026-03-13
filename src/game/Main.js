import { useEffect, useRef } from "react";
import Phaser from "phaser";
import Town from "./Town";
// AXIOS
import instance from "../axios/axios_authenticated";
// EVENT BUS
import EventBus from "./EventBus";

function Main() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  const gameRef = useRef(null);
  const containerRef = useRef(null);
  const initializedRef = useRef(false);

  /* ----------------------------------------------- */
  /* ------------------ FUNCTIONS ------------------ */
  /* ----------------------------------------------- */

  useEffect(() => {
    /* ------------------ Game Initialization ------------------ */
    // prevents multiple initializations
    if (initializedRef.current) return;
    initializedRef.current = true;

    const canvasBaseWidth = 640;
    const canvasBaseHeight = 360;

    // game configuration
    const phaserConfig = {
      type: Phaser.AUTO,
      backgroundColor: "#ffffff",
      scene: [Town],
      width: canvasBaseWidth,
      height: canvasBaseHeight,
      pixelArt: true,
      scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH, // centers in the container
      },
      physics: {
        default: "arcade",
        arcade: {
          gravity: { y: 300 },
          debug: false, // set to true to see collision bounds
        },
      },
    };

    gameRef.current = new Phaser.Game({
      ...phaserConfig,
      width: phaserConfig.width,
      height: phaserConfig.height,
      parent: containerRef.current,
    });

    /* ------------------ Set Canvas Size ------------------ */
    const resizeCanvas = () => {
      // calculate scale factor to fit canvas within window while maintaining aspect ratio
      const scaleX = Math.floor(window.innerWidth / canvasBaseWidth);
      const scaleY = Math.floor(window.innerHeight / canvasBaseHeight);
      const scale = Math.max(1, Math.min(scaleX, scaleY)); // ensure at least 1x scaling

      // calculate resized canvas dimensions
      const width = canvasBaseWidth * scale;
      const height = canvasBaseHeight * scale;

      // apply resize to canvas
      gameRef.current.canvas.style.width = width + "px";
      gameRef.current.canvas.style.height = height + "px";
    };

    // initial canvas resize
    resizeCanvas();

    // attach even listener to resize canvas on window resize
    window.addEventListener("resize", resizeCanvas);

    /* ------------------ UUID Lookup ------------------ */
    const handleUuidSubmitted = async (input) => {
      try {
        await instance
          .get("api/game/display/02/get_student_data/", {
            params: { card_uuid: input },
          })
          .then((response) => {
            if (response) {
              EventBus.emit("uuidSubmittedResponse", response.data);
            }
          });
      } catch (e) {
        EventBus.emit("uuidSubmittedResponse", e);
      }
    };

    EventBus.on("uuidSubmitted", handleUuidSubmitted);

    /* ------------------ Cleanup ------------------ */
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      EventBus.off("uuidSubmitted", handleUuidSubmitted);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
        initializedRef.current = false;
      }
    };
  }, []);

  return <div ref={containerRef} className="game-container" />;
}

export default Main;
