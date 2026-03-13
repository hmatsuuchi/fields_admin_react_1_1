export function generateWaterSky(scene, config) {
  const {
    viewportHeight,
    viewportWidth,
    tileSize = 16,
    foreGroundWaterHeight = tileSize * 6,
    backgroundWaterHeight = tileSize * 2,
  } = config;

  const foregroundWater = scene.add
    .rectangle(
      0,
      viewportHeight - foreGroundWaterHeight,
      viewportWidth,
      foreGroundWaterHeight,
      0x143464,
    )
    .setOrigin(0, 0);

  const backgroundWater = scene.add
    .rectangle(
      0,
      viewportHeight - backgroundWaterHeight - foreGroundWaterHeight,
      viewportWidth,
      backgroundWaterHeight,
      0x285cc4,
    )
    .setOrigin(0, 0);

  const sky = scene.add
    .rectangle(
      0,
      0,
      viewportWidth,
      viewportHeight - backgroundWaterHeight - foreGroundWaterHeight,
      0x249fde,
    )
    .setOrigin(0, 0);

  const container = scene.add.container(0, 0, [
    sky,
    backgroundWater,
    foregroundWater,
  ]);
  container.setDepth(-1);

  return {
    container,
    sky,
    backgroundWater,
    foregroundWater,
  };
}
