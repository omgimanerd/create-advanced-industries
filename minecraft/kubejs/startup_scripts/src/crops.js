// priority: 0

// Register a custom crop for the warden tendril
StartupEvents.registry('block', (e) => {
  e.create('kubejs:warden_tendril_vine', 'crop')
    .displayName('Warden Tendril Vine')
    .tagBlock('forge:crops')
    .age(3, (builder) => {
      // Should match the maximum height textures of the textures
      builder.shape(0, 0, 0, 0, 16, 2, 16)
      builder.shape(1, 0, 0, 0, 16, 3, 16)
      builder.shape(2, 0, 0, 0, 16, 11, 16)
      builder.shape(3, 0, 0, 0, 16, 13, 16)
    })
    .survive((_, /** @type {$Level_} */ level, pos) => {
      const brightness = level.getMaxLocalRawBrightness(pos)
      const below = level.getBlockState(pos.below())
      return below.block.id === 'minecraft:sculk' && brightness < 1
    })
    .growTick(() => 0) // Does not grow naturally
    .bonemeal((randomTickCallback) => {
      if (randomTickCallback.random.nextIntBetweenInclusive(0, 100) < 10) {
        return 1
      }
      return 0
    }) // Bonemealing only has a 10% chance to grow the vine.
    .crop('apotheosis:warden_tendril')
    .crop('apotheosis:warden_tendril', 0.25)
    .texture(0, 'kubejs:block/warden_tendril_vine_0')
    .texture(1, 'kubejs:block/warden_tendril_vine_1')
    .texture(2, 'kubejs:block/warden_tendril_vine_2')
    .texture(3, 'kubejs:block/warden_tendril_vine_3')
    .item((/** @type {$BlockItemBuilder_} */ item) => {
      item.displayName('Warden Tendril Seed')
    })
})
