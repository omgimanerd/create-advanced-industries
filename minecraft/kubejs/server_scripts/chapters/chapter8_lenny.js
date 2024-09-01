// priority: 100
// Chapter 8: Spawning Lenny the Rockstar and giving him blank discs to write.

/**
 * Event handler to handle spawning Lenny the Rockstar
 */
BlockEvents.rightClicked((e) => {
  const { item, hand, block } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'kubejs:lenny_spawner') return

  const golem = block.createEntity('ars_nouveau:amethyst_golem')
  // Center Lenny on the top of the block
  golem.setPos(block.pos.center.add(0, 1, 0))
  golem.setCustomName('Lenny the Rockstar')
  golem.setCustomNameVisible(true)
  golem.persistentData.legitimatelySpawned = true
  golem.spawn()
  item.shrink(1)
})

/**
 * Event handler for interacting with Lenny the Rockstar.
 */
ItemEvents.entityInteracted((e) => {
  const { item, hand, target, level, player, server } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'ars_nouveau:amethyst_golem') return
  if (target.name.getString() !== 'Lenny the Rockstar') return
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

  // Pop out a random music disc after being given an empty one
  const musicDiscs = Ingredient.of('#minecraft:music_discs').itemIds
  if (item.id === 'kubejs:empty_music_disc') {
    target.block.popItemFromFace(global.choice(musicDiscs), 'up')
    item.shrink(1)
    player.swing('main_hand')
  }

  // Spawn the relevant particle effects
  spawnParticles(level, 'minecraft:heart', target, 0.4, 10, 0.1)
})
