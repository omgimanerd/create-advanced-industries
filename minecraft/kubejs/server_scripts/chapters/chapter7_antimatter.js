// priority: 5000

EntityEvents.spawned('minecraft:item', (e) => {
  const { entity, level } = e
  if (!entity.item || entity.item.id !== 'kubejs:antimatter') return

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
    (/** @type {Internal.ScheduledEvents$ScheduledEvent} */ c) => {
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
    },
    discard
  )
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Magnetic confinement units and antimatter
  create
    .SequencedAssembly('#forge:plates/aluminum')
    .laser(10000)
    .curve(CONVEX_CURVING_HEAD)
    .deploy('simplemagnets:advancedmagnet')
    .deploy('pneumaticcraft:printed_circuit_board')
    .outputs('kubejs:magnetic_confinement_unit')
  create
    .SequencedAssembly('kubejs:magnetic_confinement_unit')
    .fill(Fluid.of('kubejs:teleportation_juice', 250))
    .fill(potionFluid('ars_elemental:enderference_potion_long', 250))
    .energize(100000)
    .outputs('kubejs:magnetic_confinement_unit_filled')
})
