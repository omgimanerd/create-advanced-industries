// priority: 100
// Chapter 8: Spawning Pembi the Artist and giving them paintings to paint.

const PEMBI_THE_ARTIST = 'Pembi the Artist'

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
  golem.setCustomName(PEMBI_THE_ARTIST)
  golem.setCustomNameVisible(true)
  golem.persistentData.legitimatelySpawned = true
  golem.persistentData.paintLevel = -1
  golem.setItemSlot('mainhand', 'toms_storage:ts.paint_kit')
  golem.spawn()
  item.shrink(1)
})

/**
 * Amethyst golems have their charm drop when killed. This is hardcoded into the
 * source code of Ars Nouveau. If a custom golem is killed, it should drop its
 * crafting ingredients.
 */
LootJS.modifiers((e) => {
  e.addEntityLootModifier('ars_nouveau:amethyst_golem')
    .entityPredicate((entity) => {
      return (
        !!entity.persistentData.legitimatelySpawned &&
        entity.name.getString() === PEMBI_THE_ARTIST
      )
    })
    .addWeightedLoot([2, 4], [Item.of('kubejs:suffering_essence')])
    .addWeightedLoot([2, 4], [Item.of('toms_storage:ts.paint_kit')])
    .playerAction((player) => {
      player.tell('Oh, the horror!')
    })
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

  const paintLevel = target.persistentData.getInt('paintLevel')
  // Refilling Pembi's paints
  if (item.id === 'toms_storage:ts.paint_kit') {
    if (paintLevel !== -1) {
      target.block.popItemFromFace('minecraft:bucket', 'up')
    }
    target.persistentData.putInt('paintLevel', 4)
    item.shrink(1)
    player.swing()
  } else if (item.id === 'farmersdelight:canvas') {
    // Giving Pembi a blank canvas
    if (paintLevel <= 0) {
      return
    } else {
      target.persistentData.putInt('paintLevel', paintLevel - 1)
    }
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

ServerEvents.tags('item', (e) => {
  // Bales that can be smoked into straw
  e.add('kubejs:bales_to_straw', 'minecraft:hay_block')
  e.add('kubejs:bales_to_straw', 'farmersdelight:rice_bale')
  e.add('kubejs:bales_to_straw', 'supplementaries:flax_block')

  // Valid ingredients for brush tips
  e.add('kubejs:brush_heads', 'minecraft:feather')
  e.add('kubejs:brush_heads', 'farmersdelight:straw')
  e.add('kubejs:brush_heads', 'minecraft:white_wool')
})

ServerEvents.recipes((e) => {
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
  e.smoking('farmersdelight:straw_bale', '#kubejs:bales_to_straw')

  // Manual recipes for Unframed Canvases
  e.shapeless('kubejs:unframed_canvas', [
    'farmersdelight:canvas',
    'toms_storage:ts.paint_kit',
  ])
    .replaceIngredient('toms_storage:ts.paint_kit', 'minecraft:bucket')
    .id('kubejs:unframed_canvas_manual_only')

  // Paintings can only be made through Unframed Canvas
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
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'toms_storage:ts.paint_kit',
      'kubejs:suffering_essence',
      'toms_storage:ts.paint_kit',
      'kubejs:suffering_essence',
      'toms_storage:ts.paint_kit',
      'kubejs:suffering_essence',
      'toms_storage:ts.paint_kit',
      'kubejs:suffering_essence',
    ],
    'ars_nouveau:amethyst_golem_charm',
    'kubejs:pembi_spawner'
  )
})
