// priority: 100
// Defines the overhauled logic for budding amethyst and its custom spout
// handler callback, used in Chapter 5b.

LootJS.modifiers((e) => {
  // Make budding amethyst mineable with silk touch.
  e.addBlockLootModifier('minecraft:budding_amethyst')
    .matchMainHand(ItemFilter.hasEnchantment('minecraft:silk_touch'))
    .addLoot(LootEntry.of('minecraft:budding_amethyst'))
})

/**
 * Handler defined in startup_scripts/spoutHandlerRegistration.js
 * Defined here to allow for server side reload
 * @type {Internal.SpecialSpoutHandlerEvent$SpoutHandler_}
 * @param {Internal.BlockContainerJS_} block
 * @param {Internal.FluidStackJS_} fluid
 * @param {boolean} simulate
 * @returns {number} The amount of fluid used by the spout
 */
global.BuddingAmethystSpoutHandlerCallback = (block, fluid, simulate) => {
  const fluidConsumption = 500
  if (fluid.id !== 'kubejs:crystal_growth_accelerator') return 0
  if (fluid.amount < fluidConsumption) return 0
  const growthStates = {
    'minecraft:small_amethyst_bud': 'minecraft:medium_amethyst_bud',
    'minecraft:medium_amethyst_bud': 'minecraft:large_amethyst_bud',
    'minecraft:large_amethyst_bud': 'minecraft:amethyst_cluster',
  }
  let growCandidates = []
  for (const dir of Direction.ALL.values()) {
    let surroundingBlock = block.offset(dir)
    if (surroundingBlock.id in growthStates) {
      growCandidates.push(surroundingBlock)
    }
  }
  /** @type {Internal.BlockContainerJS_} */
  const candidate = global.choice(growCandidates)
  if (candidate === null) return 0
  // All possible short circuit conditions need to be evaluated before here.
  // The simulate check should only perform actual updates if necessary, but
  // should not short circuit with a different result.
  if (!simulate) {
    candidate.set(growthStates[candidate.id], {
      facing: candidate.properties.facing,
    })
  }
  return fluidConsumption
}
