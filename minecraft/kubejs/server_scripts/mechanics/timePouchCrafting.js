// priority: 10000

;(() => {
  /**
   * Registers the block right click event handlers for each of the crafts.
   */
  Object.entries(global.TimePouchCraftingRecipes).forEach((v) => {
    const [input, data] = v
    const [output, cost] = data
    BlockEvents.rightClicked(input, (e) => {
      const { item, hand, block, level } = e
      if (hand !== 'main_hand') return
      if (item.id !== 'gag:time_sand_pouch') return
      const time = item.nbt.getInt('grains')
      if (!time || time < cost) return

      // If there are enough grains of time, replace the block and deduct the
      // cost.
      block.set(output, block.properties)
      item.nbt.putInt('grains', time - cost)
      level.spawnParticles(
        'minecraft:enchant', // particle
        true, // overrideLimiter
        block.x + 0.5, // x
        block.y + 0.5, // y
        block.z + 0.5, // z
        0.02, // vx
        0.02, // vy
        0.02, // vz
        100, // count
        0.8 // speed
      )
    })
  })
  console.log('Successfully registered time pouch crafting recipes.')
})()
