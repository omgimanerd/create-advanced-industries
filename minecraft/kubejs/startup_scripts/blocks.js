// priority: 1000

BlockEvents.modification((e) => {
  // Disable the random ticking on budding amethyst so it cannot grow amethyst
  // clusters by itself.
  e.modify('minecraft:budding_amethyst', (block) => {
    block.setIsRandomlyTicking(false)
  })
})

StartupEvents.registry('block', (e) => {
  // Register a portal block to be used in Chapter 5b
  e.create('kubejs:arcane_portal')
    .stoneSoundType()
    .lightLevel(5)
    .unbreakable()
    .noDrops()
    .blockEntity((c) => {
      c.serverTick(20, 0, (blockEntity) => {
        if (global.PortalBlockTickingCallback) {
          global.PortalBlockTickingCallback(blockEntity)
        }
      })
    })

  // Register a custom crop for the warden tendril, used in Chapter 6b
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
    .lightLevel(11)
    .survive((_, /** @type {Internal.Level_} */ level, pos) => {
      const brightness = level.getMaxLocalRawBrightness(pos)
      const below = level.getBlockState(pos.below())
      return below.block.id === 'minecraft:sculk' && brightness < 5
    })
    .growTick(() => 0) // Does not grow naturally
    .bonemeal((randomTickCallback) => {
      // Bonemealing only has a 10% chance to grow the vine.
      if (randomTickCallback.random.nextIntBetweenInclusive(0, 100) < 10) {
        return 1
      }
      return 0
    })
    .crop('apotheosis:warden_tendril')
    .crop('minecraft:ender_pearl')
    .crop('minecraft:ender_pearl', 0.5)
    .texture(0, 'kubejs:block/warden_tendril_vine_0')
    .texture(1, 'kubejs:block/warden_tendril_vine_1')
    .texture(2, 'kubejs:block/warden_tendril_vine_2')
    .texture(3, 'kubejs:block/warden_tendril_vine_3')
    .item((/** @type {Internal.BlockItemBuilder_} */ item) => {
      item.displayName('Warden Tendril Seed')
    })

  // Register a custom block for the ender inhibitor, used in Chapter 7.
  e.create('kubejs:ender_inhibitor')
    .displayName('Ender Inhibitor')
    .notSolid()
    .tagBlock('create:wrench_pickup')
    .tagBlock('minecraft:mineable/pickaxe')
    .requiresTool(true)
    .fullBlock(false)
})
