export function generateWaterSky(scene, config) {
  const {
    viewportHeight,
    viewportWidth,
    tileSize = 16,
    foreGroundWaterHeight = tileSize * 6,
    backgroundWaterHeight = tileSize * 2,
  } = config;

  // Foreground Water
  const foregroundWater = scene.add
    .rectangle(
      0,
      viewportHeight - foreGroundWaterHeight,
      viewportWidth,
      foreGroundWaterHeight,
      0x1367a3,
    )
    .setOrigin(0, 0)
    .setDepth(-1);

  const foregroundWaterOverlay = scene.add
    .rectangle(
      0,
      viewportHeight - foreGroundWaterHeight,
      viewportWidth,
      foreGroundWaterHeight,
      0x1367a3,
    )
    .setOrigin(0, 0)
    .setAlpha(0.2)
    .setDepth(20);

  const foregroundWaterOverlayTopLine = scene.add
    .rectangle(
      0,
      viewportHeight - foreGroundWaterHeight, // same y as overlay top
      viewportWidth,
      2,
      0x44b1dc,
    )
    .setOrigin(0, 0)
    .setAlpha(0.8)
    .setDepth(21);

  // Background Water
  const backgroundWater = scene.add
    .rectangle(
      0,
      viewportHeight - backgroundWaterHeight - foreGroundWaterHeight,
      viewportWidth,
      backgroundWaterHeight,
      0x1d94cc,
    )
    .setOrigin(0, 0)
    .setDepth(-2);

  const backgroundWaterTopLine = scene.add
    .rectangle(
      0,
      viewportHeight - backgroundWaterHeight - foreGroundWaterHeight,
      viewportWidth,
      2,
      0x3ab0d8,
    )
    .setOrigin(0, 0)
    .setDepth(-1);

  // Sky
  const sky = scene.add
    .rectangle(
      0,
      0,
      viewportWidth,
      viewportHeight - backgroundWaterHeight - foreGroundWaterHeight,
      0x76d1fe,
    )
    .setOrigin(0, 0)
    .setDepth(-2);

  return {
    sky,
    backgroundWater,
    backgroundWaterTopLine,
    foregroundWater,
    foregroundWaterOverlay,
    foregroundWaterOverlayTopLine,
  };
}
