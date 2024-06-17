// priority: 100
// Define the logic for spawning and killing wandering traders for Chapter 5b.

/**
 * Called within EntityEvents.spawned to handle the spawning of a wandering
 * trader when lightning strikes and emerald block.
 * @param {Internal.EntitySpawnedEventJS} e
 */
EntityEvents.spawned('ars_nouveau:an_lightning', (e) => {
  let { entity, level } = e
  for (const vec of global.getOffsetList(AABB.of(-1, -1, -1, 1, 1, 1))) {
    let block = entity.block.offset(vec.x, vec.y, vec.z)
    if (block == 'minecraft:emerald_block') {
      let pos = block.getPos()
      let trader = level.createEntity('minecraft:wandering_trader')
      // Center the wandering trader on the block
      trader.setPos(pos.offset(0.5, 0, 0.5))
      trader.spawn()
      level.destroyBlock(pos, false)
      // If this lightning entity spawned a trader, it should not do damage to
      // it. Set its persistentData so we can cancel the lightning event.
      entity.persistentData.spawnedTrader = true
    }
  }
})

/**
 * The event itself is registered in startup_scripts/forgeEventRegistration.js
 * The handler is defined here to allow server side reload.
 *
 * We cannot use EntityEvents.hurt() to cancel the damage event because the
 * source entity is not set to the actual lightning bolt.
 *
 * @param {Internal.EntityStruckByLightningEvent} e
 */
global.EntityStruckByLightningEventCallback = (e) => {
  const { entity, lightning } = e
  // If lightning struck an emerald block and spawned a wandering trader, it
  // should not damage the newly spawned trader.
  if (
    entity.type === 'minecraft:wandering_trader' &&
    lightning.persistentData.spawnedTrader
  ) {
    e.setCanceled(true)
  }
}

EntityEvents.hurt('minecraft:wandering_trader', (e) => {
  // Mark wandering traders that were hurt by barbed wire as ineligible for
  // loot to avoid it conflicting with the Tesla coil damage type.
  if (e.entity.block.id === 'createaddition:barbed_wire') {
    e.entity.persistentData.hurtByBarbedWire = true
  }
})

LootJS.modifiers((e) => {
  // Kill wandering trader in 5 ways to get essences
  const wanderingTraderMapping = [
    {
      essence: 'kubejs:suffering_essence',
      easy: [{ damageSource: 'lightningBolt' }],
      // Tesla coil has the same damage type
      hard: [{ damageSource: 'createaddition.barbed_wire' }],
    },
    {
      essence: 'kubejs:torment_essence',
      easy: [{ damageSource: 'create.crush' }],
      hard: [{ damageSource: 'inWall' }],
    },
    {
      essence: 'kubejs:mutilation_essence',
      easy: [{ damageSource: 'create.mechanical_saw' }],
      hard: [
        { damageSource: 'pnc_minigun' },
        { directKiller: 'createarmory:projectile_nine_debug' },
      ],
    },
    {
      essence: 'kubejs:debilitation_essence',
      easy: [{ damageSource: 'indirectMagic' }],
      hard: [{ damageSource: 'wither' }],
    },
    {
      essence: 'kubejs:agony_essence',
      easy: [{ damageSource: 'drown' }],
      hard: [{ damageSource: 'onFire' }],
    },
  ]

  /**
   * @param {{ damageSource:string, customPredicate:function }} predicate
   * @returns {Internal.LootActionsBuilderJS}
   */
  const buildWanderingTraderPredicate = (predicate) => {
    const { damageSource, directKiller } = predicate
    let builder = e.addEntityLootModifier('minecraft:wandering_trader')
    if (damageSource !== undefined) {
      builder = builder.matchDamageSource((c) => {
        return c.anyType(damageSource)
      })
    }
    if (directKiller !== undefined) {
      builder = builder.matchDirectKiller((c) => {
        return c.anyType(directKiller)
      })
    }
    return builder
  }

  // Go through each of the loot mappings for the essence types and set the
  // loot conditions.
  for (const { essence, easy, hard } of wanderingTraderMapping) {
    for (const predicate of easy) {
      let builder = buildWanderingTraderPredicate(predicate)
      builder
        .addWeightedLoot([0, 2], Item.of(essence))
        .addWeightedLoot([1, 3], Item.of('create:experience_nugget'))
    }
    for (const predicate of hard) {
      buildWanderingTraderPredicate(predicate)
        .addWeightedLoot([4, 6], Item.of(essence))
        .addWeightedLoot([4, 6], [Item.of('create:experience_nugget')])
    }
  }

  // Remove loot if the wandering trader was hurt by barbed wire.
  e.addEntityLootModifier('minecraft:wandering_trader').apply((context) => {
    if (context.getEntity().persistentData.hurtByBarbedWire) {
      context.removeLoot('create:experience_nugget')
      context.removeLoot('kubejs:suffering_essence')
    }
  })
})
