// priority: 500
// Chapter 6: Custom behavior when right clicking a beehive with a Sigil of
// Extraction.

/**
 * Event handler for extracting honeycombs and saturated honeycombs from
 * beehives.
 */
BlockEvents.rightClicked('minecraft:beehive', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'apotheosis:sigil_of_extraction') return
  const honeyLevel = block.properties.getOrDefault('honey_level', 0)
  // Each usage will reset the honey level and create an explosion.
  block.set('minecraft:beehive', {
    facing: block.properties.facing,
    honey_level: '0',
  })
  const pos = block.pos.getCenter()
  for (let i = 0; i < 5; ++i) {
    level
      .createExplosion(
        pos.x() + randRange(-1.5, 1.5),
        pos.y() + randRange(0, 1.5),
        pos.z() + randRange(-1.5, 1.5)
      )
      .strength(1)
      .explode()
  }
  // Only if the honey level is 5 will there be loot returned. Using this has
  // a chance to double or triple the amount of honeycombs returned.
  if (honeyLevel < 5) return
  const honeyCombs = Math.floor(honeyLevel * randRange(2, 3))
  block.popItemFromFace(Item.of('minecraft:honeycomb', honeyCombs), 'up')
  // There is a 50% chance to return a saturated honeycomb.
  if (Math.random() < 0.5) {
    block.popItemFromFace(
      Item.of('kubejs:saturated_honeycomb', randRangeInt(3)),
      'up'
    )
  }
  // There is a 5% chance to consume the sigil.
  if (Math.random() < 0.05) {
    item.count--
  }
})
