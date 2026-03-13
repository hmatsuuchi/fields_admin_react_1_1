import Phaser from "phaser";
// import EventBus from "./EventBus";
// GENERATORS
import { generateWaterSky } from "./generators/WaterSkyGenerator";
import {
  generateWalkableSurface,
  generateOneWayPlatformCollider,
} from "./generators/WalkableSurfaceGenerator";
// ENTITIES
import { createPlayer, updatePlayer } from "./entities/Player";

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
    /* ------------------ General ------------------ */
    // Game Viewport Height and Width
    this.gameViewportHeight = this.sys.game.config.height;
    this.gameViewportWidth = this.sys.game.config.width;

    /* ------------------ Platform 01 - Grass ------------------ */
    const platform01 = generateWalkableSurface(this, {
      // sprite configuration
      xStartPosition: 16 * 13,
      yStartPosition: this.gameViewportHeight - 16 * 10,
      length: 16,
      tileset: "grass_02",
      centerTileIndex: [2, 3],
      rightTileIndex: [4],
      // collision box configuration
      xStartPositionCollisionOffset: 0,
      yStartPositionCollisionOffset: 7,
      collisionBoxHeightOffset: 12,
    });

    this.platform01 = platform01;

    /* ------------------ Platform 02 - Dock ------------------ */
    const platform02 = generateWalkableSurface(this, {
      // sprite configuration
      xStartPosition: 16 * 10,
      yStartPosition: this.gameViewportHeight - 16 * 7,
      length: 21,
      tileset: "grass_02",
      centerTileIndex: [2, 3],
      rightTileIndex: [4],
      // collision box configuration
      xStartPositionCollisionOffset: 0,
      yStartPositionCollisionOffset: 7,
      collisionBoxHeightOffset: 12,
    });

    this.platform02 = platform02;

    /* ------------------ Platform 03 - Cliff ------------------ */
    const platform03 = generateWalkableSurface(this, {
      // sprite configuration
      xStartPosition: 16 * 25,
      yStartPosition: this.gameViewportHeight - 16 * 8.5,
      length: 2,
      tileset: "grass_02",
      centerTileIndex: [2, 3],
      rightTileIndex: [4],
      // collision box configuration
      xStartPositionCollisionOffset: 0,
      yStartPositionCollisionOffset: 7,
      collisionBoxHeightOffset: 12,
    });

    this.platform03 = platform03;

    /* ------------------ Water/Sky ------------------ */

    this.environment = generateWaterSky(this, {
      // configuration
      viewportHeight: this.gameViewportHeight,
      viewportWidth: this.gameViewportWidth,
      tileSize: 16,
      // foreground & backgroud water heights
      foreGroundWaterHeight: 16 * 6,
      backgroundWaterHeight: 16 * 2,
    });

    /* ------------------ Player ------------------ */
    this.player = createPlayer(this, {
      x: 16 * 14,
      y: this.gameViewportHeight - 16 * 11,
    });

    Object.assign(this, this.player);

    /* ------------------ Collisions ------------------ */
    // Platform 01
    generateOneWayPlatformCollider(
      this,
      this.player,
      this.platform01.collisionBox,
    );

    // Platform 02
    generateOneWayPlatformCollider(
      this,
      this.player,
      this.platform02.collisionBox,
    );

    // Platform 03
    generateOneWayPlatformCollider(
      this,
      this.player,
      this.platform03.collisionBox,
    );
  }

  update() {
    /* ------------------ Player Movement ------------------ */
    updatePlayer(this, this.player);
  }
}
