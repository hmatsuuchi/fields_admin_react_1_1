import Phaser from "phaser";

export default class FirstIsland extends Phaser.Scene {
  constructor() {
    super("FirstIsland");
  }

  /* --------------------------------------------- */
  /* ------------------ PRELOAD ------------------ */
  /* --------------------------------------------- */

  preload() {
    /* ------------------ 0002 -  Background ------------------ */
    // 640px x 360px image
    this.load.image("background", "/game_assets/first_island/background.png");
  }

  /* -------------------------------------------- */
  /* ------------------ CREATE ------------------ */
  /* -------------------------------------------- */

  create() {
    /* ------------------ 0001 - General ------------------ */
    // Game Viewport Height and Width
    this.gameViewportHeight = this.sys.game.config.height;
    this.gameViewportWidth = this.sys.game.config.width;

    /* ------------------ 0002 - Background ------------------ */
    this.add.image(
      this.gameViewportWidth / 2,
      this.gameViewportHeight / 2,
      "background",
    );

    /* ------------------ 0003 - Underwater Background & Overlay ------------------ */
    this.underwaterBackgroundAndOverlayHeight = 85;

    this.underwaterBackground = this.add
      .rectangle(
        0,
        this.gameViewportHeight - this.underwaterBackgroundAndOverlayHeight,
        this.gameViewportWidth,
        this.underwaterBackgroundAndOverlayHeight,
        0x1367a3,
      )
      .setOrigin(0, 0)
      .setDepth(-1);

    this.underwaterOverlay = this.add
      .rectangle(
        0,
        this.gameViewportHeight - this.underwaterBackgroundAndOverlayHeight,
        this.gameViewportWidth,
        this.underwaterBackgroundAndOverlayHeight,
        0x1367a3,
        0.4,
      )
      .setOrigin(0, 0); // set origin to top-left corner

    /* ------------------ 0004 - Surface Water Background ------------------ */
    this.surfaceWaterBackgroundHeight = 35;

    this.surfaceWaterBackground = this.add
      .rectangle(
        0,
        this.gameViewportHeight -
          this.surfaceWaterBackgroundHeight -
          this.underwaterBackgroundAndOverlayHeight,
        this.gameViewportWidth,
        this.surfaceWaterBackgroundHeight,
        0x1d94cc,
      )
      .setOrigin(0, 0)
      .setDepth(-1);

    /* ------------------ 0005 - Sky Background ------------------ */

    this.add
      .rectangle(
        0,
        0,
        this.gameViewportWidth,
        this.gameViewportHeight -
          this.surfaceWaterBackgroundHeight -
          this.underwaterBackgroundAndOverlayHeight,
        0x76d1fe,
      )
      .setOrigin(0, 0)
      .setDepth(-1);
  }

  update() {
    /* ------------------ 0003 - Underwater Background & Overlay Animation ------------------ */
    /* ------------------ 0004 - Surface Water Background Animation ------------------ */
    const amplitude = 5;
    const speed = 0.001;
    const waveOffset = Math.sin(this.time.now * speed) * amplitude;

    // Underwater: bottom is fixed, top moves up/down
    const newUnderwaterHeight =
      this.underwaterBackgroundAndOverlayHeight + waveOffset;
    const newUnderwaterY = this.gameViewportHeight - newUnderwaterHeight;

    this.underwaterBackground.setPosition(0, newUnderwaterY);
    this.underwaterBackground.height = newUnderwaterHeight;

    this.underwaterOverlay.setPosition(0, newUnderwaterY);
    this.underwaterOverlay.height = newUnderwaterHeight;

    // Surface water: top is fixed, bottom follows the underwater top edge
    this.surfaceWaterBackground.height =
      this.surfaceWaterBackgroundHeight - waveOffset;
  }
}
