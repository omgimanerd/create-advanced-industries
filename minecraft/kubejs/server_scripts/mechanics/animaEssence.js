// priority: 500
// Right click actions with the Anima Essence.

;(() => {
  /**
   * Helper method to register blocks that can spawn a mob when right clicked
   * with an anima essence.
   * @param {Block} block
   * @param {EntityType} entityType
   * @param {Internal.CompoundTag_=} nbt
   */
  const registerAnimaEssenceSpawn = (block, entityType, nbt) => {
    BlockEvents.rightClicked(block, (e) => {
      const { item, hand, block, level } = e
      if (hand !== 'main_hand') return
      if (item.id !== 'ars_elemental:anima_essence') return
      const entity = block.createEntity(entityType)
      // Center the entity on the block
      entity.setPos(block.pos.center)
      if (nbt !== undefined) {
        entity.mergeNbt(nbt)
      }
      entity.spawn()
      level.destroyBlock(block, false)
      spawnParticles(level, 'gag:magic', block.pos.center, 0.4, 50, 0.2, true)
      item.shrink(1)
    })
  }

  registerAnimaEssenceSpawn('minecraft:cobweb', 'minecraft:spider')
  // The relevant wool color can spawn a sheep.
  global.CHROMATIC_BOP_STICK_COLORS.map((color, index) => {
    registerAnimaEssenceSpawn(`minecraft:${color}_wool`, 'minecraft:sheep', {
      Color: index,
    })
  })
  registerAnimaEssenceSpawn('minecraft:magma_block', 'minecraft:magma_cube', {
    Size: 2,
  })
  registerAnimaEssenceSpawn('minecraft:shulker_box', 'minecraft:shulker')
  registerAnimaEssenceSpawn('minecraft:bone_block', 'minecraft:skeleton')
  registerAnimaEssenceSpawn('minecraft:slime_block', 'minecraft:slime', {
    Size: 2,
  })

  registerAnimaEssenceSpawn('minecraft:blue_ice', 'thermal:blizz')
})()
