// priority: 0

/**
 * TODO: needs a custom ponder
 * @param {Internal.Item} item
 * @param {Internal.Player} player
 * @param {*} target
 * @param {*} level
 */
const customDragonsBreathBottling = (item, player, target, level) => {
  let clickLocation
  switch (target.type) {
    case 'MISS':
      let eyePosition = player.getEyePosition().toVector3f()
      let viewScale = player
        .getViewVector(0)
        .scale(player.getReachDistance())
        .toVector3f()
      clickLocation = eyePosition.add(viewScale)
      break
    case 'BLOCK':
    case 'ENTITY':
      clickLocation = target.hit
      break
    default:
      throw new Error(`Unknown type: ${target.type}`)
  }
  const searchBoxSize = 1
  const clickSearchArea = AABB.of(
    clickLocation.x() - searchBoxSize,
    clickLocation.y() - 0.8,
    clickLocation.z() - searchBoxSize,
    clickLocation.x() + searchBoxSize,
    clickLocation.y() + 1,
    clickLocation.z() + searchBoxSize
  )
  for (const entity of level.getEntitiesWithin(clickSearchArea)) {
    if (entity.persistentData.fromDragonHead) {
      item.count--
      player.give('minecraft:dragon_breath')
      entity.kill()
      break
    }
  }
}

BlockEvents.rightClicked((e) => {
  const { item, player, block, level } = e
  if (item.id !== 'minecraft:glass_bottle') return
  customDragonsBreathBottling(
    item,
    player,
    {
      type: 'BLOCK',
      hit: block.pos.getCenter(),
    },
    level
  )
})

ItemEvents.rightClicked('minecraft:glass_bottle', (e) => {
  const { item, player, target, level } = e
  customDragonsBreathBottling(item, player, target, level)
})
