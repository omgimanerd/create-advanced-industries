// priority: 100
// Chapter 8: Spawning Pembi the Artist and giving them paintings to paint.

/**
 * Event handler to handle spawning Pembi the Artist
 */
BlockEvents.rightClicked((e) => {
  const { block, item, hand } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'kubejs:pembi_spawner') return

  const golem = block.createEntity('ars_nouveau:amethyst_golem')
  // Center Pembi on the top of the block
  golem.setPos(block.pos.center.add(0, 1, 0))
  golem.setCustomName('Pembi the Artist')
  golem.setCustomNameVisible(true)
  golem.persistentData.legitimatelySpawned = true
  golem.spawn()
  item.shrink(1)
})

/**
 * Event handler for interacting with Pembi the Artist
 */
ItemEvents.entityInteracted((e) => {
  const { item, hand, level, player, server, target } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'ars_nouveau:amethyst_golem') return
  if (target.name.getString() !== 'Pembi the Artist') return
  const { x, y, z } = target
  // A manually named amethyst golem will be smited
  if (!target.persistentData.legitimatelySpawned) {
    level.getBlock(x, y, z).createEntity('minecraft:lightning_bolt').spawn()
    target.kill()
    server.tell(
      Text.of(player.name).append(' was smited for worshipping a false idol!')
    )
    return
  }

  if (item.id === 'farmersdelight:canvas') {
    // TODO add conditions
    // Pembi requires a filled canvas

    item.shrink(1)
    target.block.popItemFromFace('kubejs:unframed_canvas', 'up')
    repeat(server, 5, 1, () => {
      spawnParticles(
        level,
        'minecraft:electric_spark',
        target.position().add(0, 0.4, 0),
        0.4,
        10,
        0.1
      )
    })
    player.swing()
  }
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Crafting a Palette to give to Pembi
  create
    .SequencedAssembly('#minecraft:wooden_slabs')
    .cut(1, 40)
    .fill(Fluid.of('create_enchantment_industry:ink', 100))
    .deploy('#forge:dyes/red')
    .deploy('#forge:dyes/blue')
    .deploy('#forge:dyes/green')
    .outputs('kubejs:palette')

  // Alternative sources of Straw
  e.recipes.farmersdelight.cutting(
    'minecraft:grass',
    ['farmersdelight:straw', Item.of('farmersdelight:straw').withChance(0.5)],
    '#farmersdelight:tools/knives'
  )
  e.recipes.farmersdelight.cutting(
    'minecraft:tall_grass',
    ['farmersdelight:straw', Item.of('farmersdelight:straw').withChance(0.5)],
    '#farmersdelight:tools/knives'
  )

  // Paintings can only be made through Unframed Canvas and Pembi
  e.remove({ output: 'minecraft:painting' })
  e.shaped(
    'minecraft:painting',
    [
      'SSS', //
      'SUS', //
      'SSS', //
    ],
    { S: 'minecraft:stick', U: 'kubejs:unframed_canvas' }
  )

  // Crafting the Pembi Spawner
  create
    .SequencedAssembly('ars_nouveau:amethyst_golem_charm')
    .fill(Fluid.of('create_enchantment_industry:ink', 1000))
    .deploy('#forge:dyes/red')
    .deploy('#forge:dyes/green')
    .deploy('#forge:dyes/blue')
    .outputs('kubejs:pembi_spawner')
})
