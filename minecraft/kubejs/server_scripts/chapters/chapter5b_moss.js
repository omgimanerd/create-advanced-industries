// priority: 100
// Defines the logic for right clicking a moss block with a mushroom and causing
// delayed mushroom spreading.

/**
 * Event handler for mushroom growth from moss blocks.
 */
BlockEvents.rightClicked('minecraft:moss_block', (e) => {
  const { item, hand, block, level, server } = e
  if (hand !== 'main_hand') return
  if (
    item.id !== 'minecraft:brown_mushroom' &&
    item.id !== 'minecraft:red_mushroom'
  ) {
    return
  }
  const newBlock = `${item.id}_block`

  /**
   * Recursive function to spread mushroom blocks to nearby moss blocks with
   * a configurable decay and increasing delay.
   * @param {Internal.BlockContainerJS_} block
   * @param {number} probability
   * @param {number} decayFactor
   * @param {number} delay
   */
  const decayedSpread = (block, probability, decayFactor, delay) => {
    if (block.id !== 'minecraft:moss_block') return
    if (Math.random() > probability) return
    spawnParticles(
      level,
      'minecraft:composter',
      block.pos.center.add(0, 0.5, 0),
      0.3,
      20,
      0.3
    )
    block.set(newBlock)
    server.scheduleInTicks(delay, (c) => {
      const newProbability = probability * decayFactor
      const newDelay = delay + randRange(10)
      decayedSpread(block.north, newProbability, decayFactor, newDelay)
      decayedSpread(block.south, newProbability, decayFactor, newDelay)
      decayedSpread(block.east, newProbability, decayFactor, newDelay)
      decayedSpread(block.west, newProbability, decayFactor, newDelay)
      c.reschedule()
    })
  }
  decayedSpread(block, 1, 0.5, randRange(10))
})
