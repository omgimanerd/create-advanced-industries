// priority: 100
// Recipe overhauls for Chapter 5B progression.

/**
 * Computes the loot and feeding cooldown from feeding food to an amethyst
 * golem for the amethyst farming mechanic.
 * @param {Internal.FoodProperties} foodProperties
 */
const computeAmethystGolemFeedResults = (
  /** @type {Internal.FoodProperties} */ foodProperties
) => {
  const { nutrition, saturationModifier, effects } = foodProperties
  const saturation = nutrition * saturationModifier
  let hasHarmfulEffect = false
  let maximumNonBeneficialCooldown = 0
  let quantityMultiplier = 1
  // Check the food for applied effects. Negative effects set the feeding
  // cooldown to the duration of the negative effect.
  for (const effect of effects) {
    let mobEffectInstance = effect.getFirst()
    let mobEffect = mobEffectInstance.getEffect()
    let effectApplied = randRange(0, 1) < effect.getSecond()
    if (!effectApplied) {
      continue
    }
    if (!mobEffect.isBeneficial()) {
      hasHarmfulEffect = true
      maximumNonBeneficialCooldown = Math.max(
        mobEffectInstance.getDuration(),
        maximumNonBeneficialCooldown
      )
    } else {
      quantityMultiplier *= 1.25
    }
  }

  // Uses a scaled exponential to compute the loot tier, where each tier
  // represents a returned amethyst bud.
  //
  // DO NOT REMOVE THE PARENTHESES. RHINO JS EVALUATES THIS DIFFERENTLY
  const tier = 4 * (JavaMath.E ** (nutrition / 4)) - 4 // prettier-ignore
  // TODO tier has a chance to output lower tier buds
  const outputItem = [
    'minecraft:small_amethyst_bud',
    'minecraft:medium_amethyst_bud',
    'minecraft:large_amethyst_bud',
    'minecraft:amethyst_cluster',
  ][clamp(Math.round(tier / 25), 0, 3)]
  let quantity = JavaMath.E ** (saturation / 8)
  quantity = clamp(quantity * quantityMultiplier + randRange(-1, 2), 0, 20)
  const avg = (saturation + nutrition) / 2
  // Feed cooldown in ticks
  let feedCooldown = (7 - (JavaMath.E ** (avg / 8))) * 20 // prettier-ignore
  // If a harmful effect was applied, no feeding until it wears off.
  if (hasHarmfulEffect) {
    feedCooldown = maximumNonBeneficialCooldown
  }
  return {
    result: Item.of(outputItem, quantity),
    hasHarmfulEffect: hasHarmfulEffect,
    feedCooldown: feedCooldown,
  }
}

/**
 * Called within ItemEvents.entityInteracted handler to set the behavior when
 * an amethyst golem is fed.
 * @param {Internal.ItemEntityInteractedEventJS} e
 */
const handleAmethystFeedingMechanic = (
  /** @type {Internal.ItemEntityInteractedEventJS} */ e
) => {
  const { item, hand, target, level, player, server } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'ars_nouveau:amethyst_golem') return
  if (target.name.getString() !== 'Remy the Epicure') return
  if (!item.isEdible()) return
  const { x, y, z } = target
  // A manually named amethyst golem will be smited
  if (!target.persistentData.legitimatelySpawned) {
    let lightning = level
      .getBlock(x, y, z)
      .createEntity('minecraft:lightning_bolt')
    lightning.spawn()
    target.kill()
    player.tell('Thou shalt not worship false idols!')
    item.count--
    return
  }
  const currentTime = level.getTime()
  const nextFeedableTime = target.persistentData.nextFeedableTime ?? 0
  if (nextFeedableTime >= currentTime) return

  // Compute the results and effects from feeding the specific food
  const { result, hasHarmfulEffect, feedCooldown } =
    computeAmethystGolemFeedResults(item.getFoodProperties(null), target)
  item.count--
  target.persistentData.nextFeedableTime = currentTime + feedCooldown
  target.playSound('entity.item.pickup', /*volume=*/ 2, /*pitch=*/ 1)
  target.playSound(item.getEatingSound(), /*volume=*/ 2, /*pitch=*/ 1)
  target.block.popItemFromFace(result, 'up')
  // If the fed item returns a bowl or other item, return it to the player
  player.addItem(item.getCraftingRemainingItem())
  // Spawn the relevant particle effects
  if (hasHarmfulEffect) {
    repeat(server, feedCooldown, 10, () => {
      spawnEffectParticles(level, target, 15, 0.4, [0.1, 0.5, 0, 1])
    })
  } else {
    level.spawnParticles(
      'minecraft:heart',
      true,
      x,
      y,
      z,
      0.4,
      0.4,
      0.4,
      10,
      0.01
    )
  }
}

ServerEvents.tags('item', (e) => {
  // Tag all enchantable foods for each reference later.
  for (const food of Utils.getRegistryIds('item')) {
    if (food === 'artifacts:eternal_steak') continue
    if (Item.of(food).isEdible()) {
      e.add('kubejs:enchantable_foods', food)
    }
  }
})

ItemEvents.foodEaten('#kubejs:enchantable_foods', (e) => {
  const { item, player } = e
  if (!item.enchanted) return
  for (const [enchant, level] of Object.entries(item.enchantments)) {
    // TODO add more boost if enchanted?
    console.log(enchant, level)
  }
})

/**
 * Called within ItemEvents.entityInteracted handler to set the behavior when
 * a blaze is right clicked.
 * @param {Internal.ItemEntityInteractedEventJS} e
 */
const handleBlazeMilkingMechanic = (
  /** @type {Internal.ItemEntityInteractedEventJS} */ e
) => {
  const {
    /** @type {Internal.InteractionHand} */ hand,
    /** @type {Internal.ItemStack} */ item,
    /** @type {Internal.Player} */ player,
    /** @type {Internal.Entity} */ target,
  } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'minecraft:blaze') return
  if (item.id !== 'minecraft:bucket' && item.id !== 'minecraft:lava_bucket') {
    return
  }

  const remainingMilks = target.persistentData.remainingMilks ?? 0

  // Feeding lava to the blaze.
  // TODO enchantable lava?
  if (item.id === 'minecraft:lava_bucket') {
    item.count--
    player.addItem(item.getCraftingRemainingItem())
    target.persistentData.remainingMilks = 3
  }

  if (item.id === 'minecraft:bucket') {
    if (remainingMilks === 0) {
      target.playSound('entity.villager.ambient', 2, 2)
      return
    }
    item.count--
    player.addItem('kubejs:blaze_milk_bucket')
    target.persistentData.remainingMilks--
  }
}

ItemEvents.entityInteracted((e) => {
  // Feed an amethyst golem named Remy good food and it will drop amethyst
  // buds/clusters.
  handleAmethystFeedingMechanic(e)

  // Feed a blaze buckets of lava and it can be milked.
  handleBlazeMilkingMechanic(e)
})

/**
 * Called within ItemEvents.rightClicked to handle spawning Remy the Epicure.
 * @param {Internal.ItemEntityInteractedEventJS} e
 */
const handleRemySpawning = (
  /** @type {Internal.ItemEntityInteractedEventJS} */ e
) => {
  const { item, hand, target } = e
  if (hand !== 'main_hand') return
  if (item !== 'kubejs:remy_spawner') return
  if (target.block === null) return

  const { x, y, z } = target.block
  const golem = target.block.createEntity('ars_nouveau:amethyst_golem')
  // Center Remy on the block or he will fall through the block
  golem.setPos(x + 0.5, y + 1, z + 0.5)
  golem.setCustomName('Remy the Epicure')
  golem.setCustomNameVisible(true)
  golem.persistentData.legitimatelySpawned = true
  golem.spawn()
  item.count--
}

ItemEvents.rightClicked((e) => {
  // Remy the Epicure can only be spawned from a special amethyst charm.
  handleRemySpawning(e)
})

// list features
// https://discord.com/channels/303440391124942858/1229784826559729756

// Kill wandering trader in 4 ways to get essences
LootJS.modifiers((e) => {
  // e.enableLogging()

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('lightningBolt')
    })
    .addLoot(
      'kubejs:suffering_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('create.crush')
    })
    .addLoot(
      'kubejs:torment_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('create.mechanical_saw')
    })
    .addLoot(
      'kubejs:mutilation_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('pnc_minigun')
    })
    .addLoot(
      'kubejs:debilitation_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  // Suffocation damage source 'inWall'
})

const handleLightningSpawnEvent = (
  /** @type {Internal.EntitySpawnedEventJS} */ e
) => {
  let { entity, level } = e
  if (entity.type !== 'ars_nouveau:an_lightning') return
  for (const [offsetX, offsetY, offsetZ] of getOffsetList({
    minX: -1,
    maxX: 1,
    minY: -1,
    maxX: 1,
    minZ: -1,
    maxZ: 1,
  })) {
    let block = entity.block.offset(offsetX, offsetY, offsetZ)
    if (block == 'minecraft:emerald_block') {
      let pos = block.getPos()
      let trader = level.createEntity('minecraft:wandering_trader')
      // Center the wandering trader on the block
      trader.setPos(pos.x + 0.5, pos.y, pos.z + 0.5)
      trader.spawn()
      level.destroyBlock(pos, false)
      // If this lightning entity spawned a trader, it should not do damage to
      // it. Set its persistentData so we can cancel the damage event.
      entity.persistentData.spawnedTrader = true
    }
  }
}

EntityEvents.spawned((e) => {
  // Strike emerald block with lightning to spawn a wandering trader
  handleLightningSpawnEvent(e)
})

/**
 * The event itself is registered in startup_scripts/forgeEventRegistration.js
 * The handler is defined here to allow server side reload.
 * @param {Internal.EntityStruckByLightningEvent} e
 */
global.EntityStruckByLightningEventCallback = (e) => {
  const { entity, lightning } = e
  if (
    entity.type === 'minecraft:wandering_trader' &&
    lightning.persistentData.spawnedTrader
  ) {
    e.setCanceled(true)
  }
}

ServerEvents.compostableRecipes((e) => {
  // Add compostable magical stuff
  e.remove('minecraft:flowering_azalea')
  e.add('minecraft:flowering_azalea', 1)
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Sawdust recipe
  create.crushing(
    ['9x thermal:sawdust', Item.of('thermal:sawdust', 3).withChance(0.5)],
    '#minecraft:logs'
  )
  create.milling('9x thermal:sawdust', '#minecraft:logs')
  e.recipes.ars_nouveau.crush('#minecraft:logs', [
    Item.of('thermal:sawdust', 9).withChance(1),
    Item.of('thermal:sawdust', 9).withChance(0.5),
  ])

  // Blasting recipe for sawdust to charcoal dust.
  e.remove({ id: 'create:milling/charcoal' })
  e.blasting('tfmg:charcoal_dust', 'thermal:sawdust')

  // Potash/potassium nitrate, or nitrate dust.
  create
    .mixing('2x thermal:niter_dust', [
      Fluid.water(1000),
      '2x tfmg:charcoal_dust',
    ])
    .heated()

  // Potion filling way to make sulfur
  create.filling('thermal:sulfur_dust', [
    'create:cinder_flour',
    potionFluid('minecraft:swiftness', 25),
  ])

  // Overhaul all gunpowder recipes to only use powders
  e.remove({ id: 'thermal:gunpowder_4' })
  e.remove({ id: 'tfmg:mixing/gun_powder' })
  e.shapeless('8x minecraft:gunpowder', [
    '6x thermal:niter_dust',
    'thermal:sulfur_dust',
    'tfmg:charcoal_dust',
  ])

  // Automate emeralds

  // Automate moss + growth => sprinkly bits
  // liquid fert can be augmented into crystal growth accelerator
  // tree extractor ars trees?
  //
  // Axes: Crystal refinement, enchanting, essence, potion, food, apotheosis,

  // TODO: better diamond cutting and diamond automation in chapter 5b

  // Liquid experience standardization, it must be melted into liquid form.
  e.remove({ id: 'compressedcreativity:mixing/memory_essence' })
  e.remove({
    id: 'create_enchantment_industry:disenchanting/experience_nugget',
  })
  e.remove({
    id: 'create_enchantment_industry:disenchanting/experience_block',
  })
  create
    .mixing(
      Fluid.of('create_enchantment_industry:experience', 3),
      'create:experience_nugget'
    )
    .superheated()
  create
    .mixing(
      Fluid.of('create_enchantment_industry:experience', 27),
      'create:experience_block'
    )
    .superheated()
  // Cognitium is a 1:40 conversion
  create.mixing(
    [
      Fluid.of('create_enchantment_industry:experience', 12),
      'create_enchantment_industry:experience_rotor',
    ],
    [
      Fluid.of('experienceobelisk:cognitium', 480),
      'create_enchantment_industry:experience_rotor',
    ]
  )
  create.mixing(
    [
      Fluid.of('experienceobelisk:cognitium', 480),
      'create_enchantment_industry:experience_rotor',
    ],
    [
      Fluid.of('create_enchantment_industry:experience', 12),
      'create_enchantment_industry:experience_rotor',
    ]
  )

  // Catalyst for first moss block
  create
    .item_application('minecraft:moss_block', [
      'minecraft:stone',
      'createaddition:biomass',
    ])
    .id('kubejs:moss_from_biomass_application')

  // Bonemeal cannot be reverse crafted from bone blocks.
  e.remove({ id: 'minecraft:bone_meal_from_bone_block' })
  create.milling(
    [
      '6x minecraft:bone_meal',
      Item.of('minecraft:bone_meal', 3).withChance(0.5),
    ],
    'minecraft:bone_block'
  )
  create.crushing('9x minecraft:bone_meal', 'minecraft:bone_block')

  // Compost block from compost
  redefineRecipe(
    'farmersdelight:organic_compost',
    [
      'CBC', //
      'NDN', //
      'CBC',
    ],
    {
      C: 'thermal:compost',
      B: 'minecraft:bone_meal',
      D: 'minecraft:dirt',
      N: 'thermal:niter_dust',
    }
  )

  // Liquid fertilizer
  e.remove({ id: /^sliceanddice:mixing\/fertilizer.*/ })
  create
    .mixing(Fluid.of('sliceanddice:fertilizer', 1000), [
      'farmersdelight:organic_compost',
      Fluid.water(1000),
    ])
    .heated()

  // Crystal growth accelerator
  create.mixing(Fluid.of('kubejs:crystal_growth_accelerator', 1000), [
    'apotheosis:gem_dust',
    'minecraft:redstone',
    'minecraft:glowstone_dust',
    'minecraft:gunpowder',
    Fluid.of('sliceanddice:fertilizer', 1000),
  ])

  // Glowstone and redstone automation from potion brewing is required

  // Gem dust automation
  create.filling('apotheosis:gem_dust', [
    'create:cinder_flour',
    Fluid.of('create_enchantment_industry:experience', 9),
  ])

  // Require flower azaleas for stuff here to incentivize moss farming

  // Liquid fertilizer requires some other stuff to become crystal growth
  // accelerator.
})
