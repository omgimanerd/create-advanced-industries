// priority: 950

CreateEvents.spoutHandler((e) => {
  // Registers a custom spout interaction for spouting on budding amethyst.
  e.add(
    'kubejs:budding_amethyst_crystal_growth',
    'minecraft:budding_amethyst',
    (block, fluid, simulate) => {
      // Callback defined in server scripts
      if (global.BuddingAmethystSpoutHandlerCallback) {
        return global.BuddingAmethystSpoutHandlerCallback(
          block,
          fluid,
          simulate
        )
      }
      return 0
    }
  )

  for (const [color, data] of Object.entries(global.CorundumClusterMapping)) {
    let { block } = data
    e.add(
      // color is the dye color, not the corundum color
      `kubejs:${color}_corundum_growth`,
      block,
      (block, fluid, simulate) => {
        // Callback defined in server scripts
        if (global.CorundumBlockSpoutHandlerCallback) {
          return global.CorundumBlockSpoutHandlerCallback(
            block,
            fluid,
            simulate
          )
        }
        return 0
      }
    )
  }
})
