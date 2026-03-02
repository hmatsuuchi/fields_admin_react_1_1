import React from "react";
// CSS
import "./DisplayTwo.scss";
// Phaser
import Phaser from "phaser";
import GreenFields from "../../game/GreenFields";
import Town from "../../game/Town";

function DisplayTwo() {
  /* ------------------------------------------- */
  /* ------------------ STATE ------------------ */
  /* ------------------------------------------- */

  /* ------------------------------------------- */
  /* ---------------- FUNCTIONS ---------------- */
  /* ------------------------------------------- */

  const phaserConfig = {
    type: Phaser.AUTO,
    backgroundColor: "#1a1a2e",
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 800 }, // global downward gravity
        debug: false, // set to true to see hitboxes
      },
    },
    scene: [Town],
  };

  /* ------------------------------------------- */
  /* ------------------- JSX ------------------- */
  /* ------------------------------------------- */

  return (
    <div id="display-two-primary-container">
      <GreenFields config={phaserConfig} width={800} height={600} />
    </div>
  );
}

export default DisplayTwo;
