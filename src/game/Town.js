import Phaser from "phaser";

/* Town scene - defines the game logic and rendering for the town scene */
export default class Town extends Phaser.Scene {
  constructor() {
    super("Town"); // registers this scene with the key "Town" in the Phaser scene manager
    this.player = null; // reference to the player circle
    this.platforms = null; // reference to the platform group
    this.keys = null; // reference to the WASD + space key bindings
    this.speed = 200; // player horizontal movement speed in pixels per second
    this.jumpForce = -500; // upward velocity applied when jumping (negative = up)
  }

  /* called before create() - used to load assets (images, spritesheets, audio, etc.) */
  preload() {
    // load assets here
  }

  /* called once after preload() - used to set up game objects, physics, and initial state */
  create() {
    // create a static physics group for platforms (static = immovable, unaffected by gravity)
    this.platforms = this.physics.add.staticGroup();

    // ground platform spanning the full width of the screen
    const ground = this.add.rectangle(400, 590, 800, 20, 0x4a4a4a); // x, y, width, height, color (dark gray)
    this.platforms.add(ground);

    // floating platforms at various positions (spaced ~100px apart vertically)
    const platform1 = this.add.rectangle(550, 480, 100, 15, 0x4a4a4a);
    this.platforms.add(platform1);

    const platform2 = this.add.rectangle(400, 380, 100, 15, 0x4a4a4a);
    this.platforms.add(platform2);

    const platform3 = this.add.rectangle(250, 280, 100, 15, 0x4a4a4a);
    this.platforms.add(platform3);

    const platform4 = this.add.rectangle(100, 180, 100, 15, 0x4a4a4a);
    this.platforms.add(platform4);

    // refresh static bodies so Phaser recalculates their hitboxes after positioning
    this.platforms.refresh();

    // create a circle graphic and add it as a physics-enabled game object
    this.player = this.add.circle(400, 500, 20, 0x00ff00); // x, y, radius, color (green)
    this.physics.add.existing(this.player); // enable physics on the circle

    // prevent the player from leaving the screen
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setBounce(0.1); // slight bounce when landing

    // enable collision between the player and all platforms
    this.physics.add.collider(this.player, this.platforms);

    // bind WASD + space keys for movement and jump input
    this.keys = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
      jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
  }

  /* called every frame (~60 times per second) - used for continuous game logic like movement and collisions */
  update() {
    // reset horizontal velocity each frame
    this.player.body.setVelocityX(0);

    // horizontal movement
    if (this.keys.left.isDown) {
      this.player.body.setVelocityX(-this.speed);
    } else if (this.keys.right.isDown) {
      this.player.body.setVelocityX(this.speed);
    }

    // jump - only allow jumping when the player is touching the ground or a platform
    if (this.keys.jump.isDown && this.player.body.blocked.down) {
      this.player.body.setVelocityY(this.jumpForce);
    }
  }
}
