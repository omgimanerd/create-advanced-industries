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
      15,
      0.2,
      true
    )
    entity.discard()
  }

  repeat(
    level.server,
    100,
    5,
    (/** @type {Internal.ScheduledEvents$ScheduledEvent} */ c) => {
      const block = entity.block
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

ItemEvents.dropped('kubejs:antimatter', (e) => {
  const { itemEntity, level } = e

  // Spawn particles when the item entity is discarded.
  const discard = () => {
    spawnParticles(
      level,
      'minecraft:poof',
      itemEntity.position(),
      [0.2, 0.2, 0.2],
      15,
      0.2,
      true
    )
    itemEntity.discard()
  }

  repeat(
    level.server,
    100,
    5,
    (/** @type {Internal.ScheduledEvents$ScheduledEvent} */ c) => {
      const block = itemEntity.block
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

ServerEvents.recipes((e) => {})
