// priority: 0
// Defines the logic for spewing dragon's breath from a dragon head and
// collecting it with a glass bottle.

BlockEvents.rightClicked('minecraft:dragon_head', (e) => {
  const { item, hand, player, block, level } = e
  if (level.isClientSide()) return
  const requiredPotion = Item.of('minecraft:potion').withNBT({
    Potion: 'minecraft:strong_regeneration',
  })
  if (hand !== 'main_hand') return
  if (!item.equalsIgnoringCount(requiredPotion)) return
  item.shrink(1)
  player.give('minecraft:glass_bottle')
  player.swing()

  // Dragon head has a rotation property from 0-16 with 0 being North increasing
  // clockwise.
  const angle = JavaMath.toRadians(
    block.properties.getOrDefault('rotation', 0) * (360 / 16)
  )
  const xOffset = Math.sin(angle) * 2
  const zOffset = Math.cos(angle) * -2

  // Create the dragon's breath entity.
  const dragonsBreath = block.createEntity('minecraft:area_effect_cloud')
  dragonsBreath.mergeNbt({
    Particle: 'dragon_breath',
    Radius: 2,
    Duration: 40,
    Potion: 'minecraft:harming',
    ReapplicationDelay: 1,
    // Will not shrink or disappear after harming a player.
    DurationOnUse: 0,
    RadiusOnUse: 0,
  })
  dragonsBreath.persistentData.fromDragonHead = true
  const { x, y, z } = block.pos
  dragonsBreath.setPosition(x + xOffset, y, z + zOffset)
  dragonsBreath.spawn()
  dragonsBreath.playSound(
    'entity.wandering_trader.drink_potion',
    /*volume=*/ 3,
    /*pitch=*/ 0
  )
})

/**
 * Handler for bottling dragon's breath, invoked on both a generic block event
 * right click (in order for deployers to work) and the glass bottle right
 * click event.
 *
 * @param {Internal.ItemStack_} item
 * @param {Internal.Player_} player
 * @param {Internal.RayTraceResultJS_|{type:string, hit:$BlockPos_}} target
 * @param {Internal.Level_} level
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
      entity.discard()
      break
    }
  }
}

BlockEvents.rightClicked((e) => {
  const { item, player, block, level } = e
  if (level.isClientSide()) return
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
  if (level.isClientSide()) return
  customDragonsBreathBottling(item, player, target, level)
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Filling and emptying for infused dragon's breath, which makes Create
  // support the fluid in filters and right click actions on drains and buckets.
  // Create mod I love you.
  create.filling('apotheosis:infused_breath', [
    'minecraft:glass_bottle',
    Fluid.of('kubejs:infused_dragon_breath', 250),
  ])
  create.emptying(
    ['minecraft:glass_bottle', Fluid.of('kubejs:infused_dragon_breath', 250)],
    'apotheosis:infused_breath'
  )
})
