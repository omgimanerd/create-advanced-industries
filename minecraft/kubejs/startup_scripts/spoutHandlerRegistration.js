// priority: 200

/**
 * Chapter 5b content. Defined externally so that it can be reloaded with
 * /kubejs reload startup_scripts
 *
 * @type {Internal.SpecialSpoutHandlerEvent$SpoutHandler}
 * @returns {number}
 */
global.NetherWartSpoutHandler = (block, fluid, simulate) => {
  if (fluid.id !== 'sliceanddice:fertilizer') return 0
  if (fluid.amount < 50) return 0
  if (!simulate) {
    const level = block.getLevel()
    block.blockState.randomTick(level, block.pos, level.random)
  }
  return 50
}

CreateEvents.spoutHandler((e) => {
  // Registers a custom spout interaction for nether wart.
  e.add(
    'kubejs:nether_wart_fertilizing',
    'minecraft:nether_wart',
    (block, fluid, simulate) => {
      return global.NetherWartSpoutHandler(block, fluid, simulate)
    }
  )
})
