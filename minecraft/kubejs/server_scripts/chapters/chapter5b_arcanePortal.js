// priority: 100
// Defines the logic for opening and sacrificing items/traders to the Arcane
// Portal in Chapter 5b.

/**
 * Handles opening the Arcane Portal for hearthstone automation.
 */
BlockEvents.rightClicked('minecraft:crying_obsidian', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'ars_nouveau:source_gem') return
  block.spawnLightning(true)
  block.set('kubejs:arcane_portal')
  spawnParticles(level, 'minecraft:enchant', block.pos.center, 0.3, 100, 1)
})

/**
 * Helper method for the Arcane Portal's block entity callback.
 * @param {Internal.ItemStack_} item
 */
const checkPortalPickaxeSacrifice = (item) => {
  if (item.id !== 'minecraft:iron_pickaxe') return false
  if (item.isDamaged()) return false
  const displayElement = item.getTagElement('display')
  if (displayElement === null) return false
  if (displayElement.get('Name') !== '{"text":"Laborer\'s Pickaxe"}')
    return false
  if (!item.hasEnchantment('minecraft:efficiency', 3)) return false
  if (!item.hasEnchantment('minecraft:unbreaking', 3)) return false
  return true
}

/**
 * Block entity defined in startup_scripts/blocks.js
 * Callback defined here to allow for server side reload
 * @type {Internal.BlockEntityCallback_}
 * @param {Internal.BlockEntityJS_} e
 */
global.PortalBlockTickingCallback = (e) => {
  const { block, blockPos, level } = e
  /**
   * @param {Internal.SoundEvent_} sound
   * @param {number} volume
   * @param {number} pitch
   */
  const playSound = (sound, volume, pitch) => {
    block.getPlayersInRadius(3).forEach((p) => {
      Utils.server.runCommandSilent(
        `playsound ${sound} block ${p.displayName.string} ${block.x} ` +
          `${block.y} ${block.z} ${volume} ${pitch}`
      )
    })
  }
  const entities = level.getEntitiesWithin(
    AABB.ofBlocks(blockPos.offset(-1, -1, -1), blockPos.offset(1, 2, 1))
  )
  const pdata = block.entity.persistentData

  // Eat wandering traders and enchanted pickaxes, yielding hearthstones.
  let laborersEaten = pdata.getInt('laborers_eaten')
  let pickaxesEaten = pdata.getInt('pickaxes_eaten')
  for (const /** @type {Internal.Entity_} */ entity of entities) {
    if (entity.type === 'minecraft:wandering_trader') {
      entity.remove('killed')
      entity.playSound('minecraft:entity.enderman.teleport', 2, 1)
      laborersEaten = Math.min(5, laborersEaten + 1)
      spawnParticles(
        level,
        'minecraft:enchant',
        entity.position().add(0, 2, 0),
        0.15,
        75,
        0.1
      )
      continue
    }
    let item = /** @type {net.minecraft.world.item.ItemStack} */ entity.item
    if (item !== null) {
      if (checkPortalPickaxeSacrifice(item)) {
        entity.remove('discarded')
        entity.playSound('minecraft:entity.enderman.teleport', 2, 1)
        pickaxesEaten = Math.min(5, pickaxesEaten + 1)
        spawnParticles(level, 'minecraft:enchant', entity, 0.15, 75, 0.1)
      } else {
        spawnParticles(level, 'minecraft:poof', entity, 0.1, 3, 0.01)
      }
    }
  }
  // If the portal is satisfied, a hearthstone is spawned in 100 ticks
  if (laborersEaten > 0 && pickaxesEaten > 0) {
    laborersEaten--
    pickaxesEaten--
    level.server.scheduleInTicks(50, () => {
      playSound('minecraft:block.amethyst_block.step', 2, 1)
      block.popItemFromFace('gag:hearthstone', 'up')
    })
  }
  pdata.put('laborers_eaten', laborersEaten)
  pdata.put('pickaxes_eaten', pickaxesEaten)

  // Eat surrounding fluid source blocks to sustain the portal.
  let surrounding = []
  for (const b of [block.north, block.south, block.east, block.west]) {
    if (b.id === 'starbunclemania:source_fluid_block') {
      surrounding.push(b)
    }
  }
  let nextEatTime = pdata.getInt('next_eat_time') // stored as tick count
  const currentTime = level.server.getTickCount()
  if (nextEatTime === 0) {
    nextEatTime = currentTime + global.randRangeInt(200, 400)
  } else if (currentTime >= nextEatTime && surrounding.length > 0) {
    /** @type {Internal.BlockContainerJS_} */
    let eatLocation = global.choice(surrounding)
    spawnParticles(
      level,
      'minecraft:enchant',
      eatLocation.pos.center,
      0.15,
      75,
      0.1
    )
    eatLocation.set('minecraft:air')
    nextEatTime = currentTime + global.randRangeInt(200, 400)
  }
  pdata.put('next_eat_time', nextEatTime)

  // The portal becomes unstable if not surrounded by fluid source, and will
  // break if the instability gets too high.
  let instability = pdata.getInt('instability')
  if (surrounding.length !== 4) {
    instability += 4 - surrounding.length
    spawnParticles(
      level,
      'minecraft:campfire_cosy_smoke',
      blockPos.center.add(0, 1, 0),
      0,
      Math.ceil(instability / 4),
      0.01
    )
  } else {
    instability = 0
  }
  if (global.randRange(100) < instability) {
    level.destroyBlock(block, false)
    block.createExplosion().causesFire(false).strength(1).explode()
  } else {
    pdata.put('instability', instability)
  }
}
