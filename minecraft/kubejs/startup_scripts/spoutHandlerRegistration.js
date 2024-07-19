// priority: 1000

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
})
