import Phaser from "phaser";

export function createPlayer(scene, config = {}) {
  const {
    x = 100,
    y = 100,
    width = 16,
    height = 32,
    moveSpeed = 150,
    jumpSpeed = 200,
    gravityY = 300,
  } = config;

  const player = scene.add
    .rectangle(x, y, width, height, 0x000000)
    .setOrigin(0, 1)
    .setDepth(11);

  scene.physics.add.existing(player);
  player.body.setCollideWorldBounds(true);
  player.body.setGravityY(gravityY);

  const keys = scene.input.keyboard.addKeys({
    jump: Phaser.Input.Keyboard.KeyCodes.SPACE,
    left: Phaser.Input.Keyboard.KeyCodes.A,
    right: Phaser.Input.Keyboard.KeyCodes.D,
  });

  return { player, keys, moveSpeed, jumpSpeed };
}

export function updatePlayer({ player, keys, moveSpeed, jumpSpeed }) {
  if (!player?.body) return;

  const body = player.body;

  body.setVelocityX(0);
  if (keys.left.isDown) {
    body.setVelocityX(-moveSpeed);
  } else if (keys.right.isDown) {
    body.setVelocityX(moveSpeed);
  }

  if (keys.jump.isDown && body.onFloor()) {
    body.setVelocityY(-jumpSpeed);
  }
}
