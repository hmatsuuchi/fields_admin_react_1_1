export function generateWalkableSurface(scene, config) {
  const {
    // sprite configuration
    xStartPosition,
    yStartPosition,
    length,
    tileset,
    tileSize = 16,
    leftTileIndex = [1],
    centerTileIndex = [2],
    rightTileIndex = [3],
    // collision box configuration
    xStartPositionCollisionOffset = 0,
    yStartPositionCollisionOffset = 0,
    collisionBoxHeightOffset = 0,
  } = config;

  /* ------------------ Walkable Surface Generator ------------------ */

  // error: missing scene
  if (!scene) {
    throw new Error("generateWalkableSurface: 'scene' is required.");
  }

  // error: missing tileset
  if (!tileset) {
    throw new Error("generateWalkableSurface: 'tileset' is required.");
  }

  // error: invalid length
  if (!Number.isInteger(length) || length < 2) {
    throw new Error(
      "generateWalkableSurface: 'length' must be an integer >= 2.",
    );
  }

  // tile randomizer function
  const pickRandomTile = (arr) => arr[Math.floor(Math.random() * arr.length)];

  // creates array of tile indices
  const placementRow = [
    pickRandomTile(leftTileIndex),
    ...Array(Math.max(0, length - 2))
      .fill()
      .map(() => pickRandomTile(centerTileIndex)),
    pickRandomTile(rightTileIndex),
  ];

  // creates tilemap and layer
  const tilemap = scene.make.tilemap({
    data: [placementRow],
    tileWidth: tileSize,
    tileHeight: tileSize,
  });

  // add tileset image to tilemap and create layer
  const tiles = tilemap.addTilesetImage(tileset);
  const layer = tilemap.createLayer(0, tiles, xStartPosition, yStartPosition);
  layer.setOrigin(0, 0);

  /* ------------------ Collision Box Generator ------------------ */
  const pixelWidth = tileSize * length;
  const pixelHeight = tileSize - collisionBoxHeightOffset;

  const collisionBox = scene.add
    .rectangle(
      xStartPosition + xStartPositionCollisionOffset,
      yStartPosition + yStartPositionCollisionOffset,
      pixelWidth,
      pixelHeight,
      0xffc0cb,
      0,
    )
    .setOrigin(0, 0);
  scene.physics.add.existing(collisionBox, true); // true for static body

  return {
    layer,
    collisionBox,
  };
}

/* ------------------ One Way Platform Collider ------------------ */
export function generateOneWayPlatformCollider(
  scene,
  player,
  platformCollisionBox,
) {
  return scene.physics.add.collider(
    player,
    platformCollisionBox,
    null,
    (playerObj, platformObj) => {
      const playerBody = playerObj.body;
      const platformBody = platformObj.body;

      const isFalling = playerBody.velocity.y >= 0;

      // Use previous frame position to avoid underside sticking
      const playerBottomPrev = playerBody.prev.y + playerBody.height;
      const platformTop = platformBody.top;

      return isFalling && playerBottomPrev <= platformTop + 3; // 3px tolerance
    },
    scene,
  );
}
