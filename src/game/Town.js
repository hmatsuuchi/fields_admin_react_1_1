import Phaser from "phaser";
// import EventBus from "./EventBus";
// GENERATORS
import {
  generateWalkableSurface,
  addOneWayPlatformCollider,
} from "./generators/WalkableSurfaceGenerator";

export default class Town extends Phaser.Scene {
  constructor() {
    super("Town");
  }

  /* --------------------------------------------- */
  /* ------------------ PRELOAD ------------------ */
  /* --------------------------------------------- */

  preload() {
    /* ------------------ Fonts ------------------ */
    // Ari W9500 Display Font - 11px
    this.load.bitmapFont(
      "ari_w9500_display_11px",
      "/game_assets/fonts/ari_w9500_display_11px.png",
      "/game_assets/fonts/ari_w9500_display_11px.xml",
    );

    /* ------------------ Walkable Surfaces ------------------ */
    // Grass 01 Tileset
    this.load.spritesheet("grass_01", "/game_assets/tilesets/grass_01.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    // Grass 02 Tileset
    this.load.spritesheet("grass_02", "/game_assets/tilesets/grass_02.png", {
      frameWidth: 16,
      frameHeight: 16,
    });
  }

  /* -------------------------------------------- */
  /* ------------------ CREATE ------------------ */
  /* -------------------------------------------- */

  create() {
    /* ------------------ Player ------------------ */
    // create rectangle
    this.player = this.add
      .rectangle(100, 100, 16, 32, 0x000000)
      .setOrigin(0, 1);

    // add physics to rectangle
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setGravityY(300);

    // 'AD' + Space
    this.keys = this.input.keyboard.addKeys({
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    /* ------------------ General ------------------ */
    // Game Viewport Height and Width
    this.gameViewportHeight = this.sys.game.config.height;
    this.gameViewportWidth = this.sys.game.config.width;

    /* ------------------ Platform 01 ------------------ */
    const platform01 = generateWalkableSurface(this, {
      // sprite configuration
      xStartPosition: 16 * 1,
      yStartPosition: this.gameViewportHeight - 16 * 4,
      length: 38,
      tileset: "grass_02",
      centerTileIndex: [2, 3],
      rightTileIndex: [4],
      // collision box configuration
      xStartPositionCollisionOffset: 0,
      yStartPositionCollisionOffset: 6,
      collisionBoxHeightOffset: 11,
    });

    this.platform01 = platform01;

    /* ------------------ Platform 02 ------------------ */
    const platform02 = generateWalkableSurface(this, {
      // sprite configuration
      xStartPosition: 16 * 15,
      yStartPosition: this.gameViewportHeight - 16 * 7,
      length: 15,
      tileset: "grass_02",
      centerTileIndex: [2, 3],
      rightTileIndex: [4],
      // collision box configuration
      xStartPositionCollisionOffset: 0,
      yStartPositionCollisionOffset: 6,
      collisionBoxHeightOffset: 11,
    });

    this.platform02 = platform02;

    /* ------------------ Platform 03 ------------------ */
    const platform03 = generateWalkableSurface(this, {
      // sprite configuration
      xStartPosition: 16 * 12,
      yStartPosition: this.gameViewportHeight - 16 * 10,
      length: 22,
      tileset: "grass_02",
      centerTileIndex: [2, 3],
      rightTileIndex: [4],
      // collision box configuration
      xStartPositionCollisionOffset: 0,
      yStartPositionCollisionOffset: 6,
      collisionBoxHeightOffset: 11,
    });

    this.platform03 = platform03;

    /* ------------------ Collisions ------------------ */
    addOneWayPlatformCollider(this, this.player, this.platform01.collisionBox); // platform 01
    addOneWayPlatformCollider(this, this.player, this.platform02.collisionBox); // platform 02
    addOneWayPlatformCollider(this, this.player, this.platform03.collisionBox); // platform 03
  }

  update() {
    /* ------------------ Player Movement ------------------ */
    if (!this.player?.body) return; // safety check

    const body = this.player.body;

    const moveSpeed = 150;
    const jumpSpeed = 275;

    // horizontal movement
    body.setVelocityX(0); // reset horizontal velocity each frame
    if (this.keys.left.isDown) {
      body.setVelocityX(-moveSpeed);
    } else if (this.keys.right.isDown) {
      body.setVelocityX(moveSpeed);
    }

    // jump
    if (this.keys.jump.isDown && body.onFloor()) {
      body.setVelocityY(-jumpSpeed);
    }
  }
}
