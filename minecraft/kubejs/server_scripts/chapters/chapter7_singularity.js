// priority: 500

// Disable unstable singularities from being picked up.
ItemEvents.canPickUp('kubejs:unstable_singularity', (e) => {
  e.cancel()
})

// Stable singularities can be used to remove any block from existence.
BlockEvents.rightClicked((e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'kubejs:singularity') return

  item.shrink(1)
  block.set('minecraft:air')
  spawnParticles(
    level, // level
    'minecraft:cloud', // particle
    block.pos.center, // pos
    [0.5, 0.5, 0.5], // v
    35, // count
    0.01 // speed
  )
  level.playSound(
    null, //player
    block.x,
    block.y,
    block.z,
    'gag:generic.teleport',
    'players',
    3, //volume
    0 //pitch
  )
  e.cancel()
})

EntityEvents.spawned('minecraft:item', (e) => {
  const { entity, level } = e
  if (!entity.item || entity.item.id !== 'kubejs:unstable_singularity') return

  // Spawn particles when the item entity is discarded.
  const discard = () => {
    spawnParticles(
      level,
      'minecraft:poof',
      entity.position(),
      [0.2, 0.2, 0.2],
      25,
      0.2,
      true
    )
    entity.discard()
  }

  repeat(
    level.server,
    /*duration*/ 100,
    /*interval*/ 2,
    /*cb*/ (/** @type {Internal.ScheduledEvents$ScheduledEvent} */ c) => {
      const block = entity.block
      // Check the block space
      if (block.id !== 'minecraft:air') {
        discard()
        c.clear()
        return
      }
      for (const dir of Direction.ALL.values()) {
        if (block.offset(dir).id !== 'minecraft:air') {
          discard()
          c.clear()
          return
        }
      }

      // If we are not ready to be discarded, perform the check for a stability
      // potion.
      const matching = level
        .getEntitiesWithin(AABB.ofBlock(block.pos))
        .filter((nearbyEntity) => {
          const item = nearbyEntity.item
          if (item === null) return false
          return item.equalsIgnoringCount(Item.of('kubejs:redstone_pearl'))
        })

      // If we find a match, discard the entities and pop the results.
      if (matching.isEmpty()) return
      matching.get(0).item.shrink(1)
      discard()
      block.popItem('kubejs:singularity')
      c.clear()
    },
    /*done*/ discard
  )
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Magnetic confinement units and singularities
  create.mechanical_crafting(
    'kubejs:magnetic_confinement_unit',
    [
      'PAAAAAP', //
      'LMB BML', //
      'PAAAAAP', //
    ],
    {
      P: 'pneumaticcraft:printed_circuit_board',
      A: 'vintageimprovements:aluminum_sheet',
      L: 'kubejs:logistics_mechanism',
      M: 'create_new_age:netherite_magnet',
      B: 'minecraft:beacon',
    }
  )
  create
    .SequencedAssembly('kubejs:magnetic_confinement_unit')
    .deploy('kubejs:tesseract')
    .fill(Fluid.of('kubejs:teleportation_juice', 250))
    .fill(potionFluid('ars_elemental:enderference_potion_long', 250))
    .energize(500000)
    .outputs('kubejs:magnetic_confinement_unit_filled')
})
