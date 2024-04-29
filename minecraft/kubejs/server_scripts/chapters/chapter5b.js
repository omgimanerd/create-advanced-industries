// priority: 100
// Recipe overhauls for Chapter 5B progression.

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
 * Computes the loot and feeding cooldown from feeding food to an amethyst
 * golem for the amethyst farming mechanic.
 * @param {Internal.FoodProperties} foodProperties
 */
const computeAmethystGolemFeedResults = (
  /** @type {Internal.FoodProperties} */ foodProperties,
  /** @type {number} */ repeatedFoodPenalty
) => {
  const { nutrition, saturationModifier, effects } = foodProperties
  const saturation = nutrition * saturationModifier
  let hasHarmfulEffect = false
  let maximumNonBeneficialCooldown = 0
  let nutritionMultiplier = repeatedFoodPenalty
  let saturationMultiplier = repeatedFoodPenalty
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
      nutritionMultiplier *= 1.05
      saturationMultiplier *= 1.05
    }
  }

  // Loot tiers will go from 0-4, with values from 0-1 yielding small amethyst
  // clusters, values from 1-2 yielding medium + small amethyst clusters, etc.
  // Higher loot tiers will always yield the crystal clusters below them.
  //
  // As a benchmark, a food with 4 nutrition should correspond to loot tier
  // 1, and a food with 14 nutrition (max) should correspond to loot tier
  // 3.2. Solving for a system of equations y=ab^(x+d)+c gets us the solution
  // a = 1
  // b = (3.2/1) ^ (1/10) ~ 1.123349
  // c = 0
  // d = -4
  //
  // Only beneficial effects can raise the lootTier above 3.2
  const lootExponential = exponential(1, 1.123349, 0, -4)
  let lootTier = lootExponential(nutrition) * nutritionMultiplier

  // The quantity of output for each tier is also correlated with the
  // saturation of the food, but is also divided by (tier + 1), meaning higher
  // tiers give less. A saturation 1 food corresponds to 1 output, and a
  // saturation 11 food should be roughly 5 outputs.
  // a = 1
  // b = (5/1) ^ (1/10) ~ 1.174618
  // c = 0
  // d = -1
  const quantityExponential = exponential(1, 1.174618, 0, -1)
  const outputItems = [
    'minecraft:small_amethyst_bud',
    'minecraft:medium_amethyst_bud',
    'minecraft:large_amethyst_bud',
    'minecraft:amethyst_cluster',
  ]
  let results = []
  for (let tier = 0; tier < 4; ++tier) {
    if (lootTier <= tier) break
    let probability = Math.min(lootTier - tier, 1)
    if (probability < 1 && Math.random() > probability) break
    let quantity = Math.round(
      (quantityExponential(saturation) * saturationMultiplier) / (tier + 1)
    )
    results.push(Item.of(outputItems[tier], quantity))
  }

  // The feed cooldown is another exponential that goes down the better the
  // food. The argument is the average of the saturation and nutrition, with
  // both multiplers applied.
  // a = 8
  // b = 0.8
  // c = 0
  // d = -4
  const cooldownExponential = exponential(8, 0.8, 0, -4)
  const avg =
    (saturation + nutrition) * 0.5 * nutritionMultiplier * saturationModifier
  // Feed cooldown in ticks
  let feedCooldown = cooldownExponential(avg) * 20 // prettier-ignore
  // If a harmful effect was applied, no feeding until it wears off.
  if (hasHarmfulEffect) {
    feedCooldown = maximumNonBeneficialCooldown
  }
  return {
    results: results,
    hasHarmfulEffect: hasHarmfulEffect,
    feedCooldown: feedCooldown,
  }
}

/**
 * Defines the behavior when Remy the Epicure is fed.
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
  let nextFeedableTime = target.persistentData.nextFeedableTime
  nextFeedableTime = nextFeedableTime === undefined ? 0 : nextFeedableTime
  if (nextFeedableTime >= currentTime) return

  // Record the item that was fed, Remy remembers the last 4 things he was fed.
  const itemString = item.id.toString()
  let lastFedItems = target.persistentData.lastFedItems
  if (lastFedItems === undefined) {
    lastFedItems = [itemString]
  } else {
    lastFedItems.push(itemString)
    if (lastFedItems.size() > 4) {
      lastFedItems.shift()
    }
  }
  target.persistentData.lastFedItems = lastFedItems
  let eatenBefore = {}
  for (const /** @type {net.minecraft.nbt.StringTag} */ food of lastFedItems) {
    // The nbt StringTag includes the enclosing double quotes.
    let foodString = food.toString().replace('"', '')
    eatenBefore[foodString] =
      eatenBefore[foodString] === undefined ? 1 : eatenBefore[foodString] + 1
  }
  const penaltyExponent = eatenBefore[itemString] - 1

  // Compute the results and effects from feeding the specific food
  let { results, hasHarmfulEffect, feedCooldown } =
    computeAmethystGolemFeedResults(
      item.getFoodProperties(null),
      0.95 ** penaltyExponent
    )
  item.count--
  target.persistentData.nextFeedableTime = currentTime + feedCooldown
  target.playSound('entity.item.pickup', /*volume=*/ 2, /*pitch=*/ 1)
  target.playSound(item.getEatingSound(), /*volume=*/ 2, /*pitch=*/ 1)
  for (const result of results) {
    target.block.popItemFromFace(result, 'up')
  }

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

/**
 * Defines the behavior when a blaze is fed or milked.
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

  let remainingMilks = target.persistentData.remainingMilks
  remainingMilks = remainingMilks === undefined ? 0 : remainingMilks

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
 * Handles spawning Remy the Epicure.
 * @param {Internal.BlockRightClickedEventJS} e
 */
const handleRemySpawning = (
  /** @type {Internal.BlockRightClickedEventJS} */ e
) => {
  const { item, hand, block } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'kubejs:remy_spawner') return

  const { x, y, z } = block
  const golem = block.createEntity('ars_nouveau:amethyst_golem')
  // Center Remy on the top of the block
  golem.setPos(x + 0.5, y + 1, z + 0.5)
  golem.setCustomName('Remy the Epicure')
  golem.setCustomNameVisible(true)
  golem.persistentData.legitimatelySpawned = true
  golem.spawn()
  item.count--
}

/**
 * Called within BlockEvents.rightClicked to handle mushroom growth from moss
 * blocks.
 * @param {Internal.BlockRightClickedEventJS} e
 */
const handleMushroomMossSeeding = (
  /** @type {Internal.BlockRightClickedEventJS} */ e
) => {
  const { item, hand, block, level, server } = e
  if (hand !== 'main_hand') return
  if (
    item.id !== 'minecraft:brown_mushroom' &&
    item.id !== 'minecraft:red_mushroom'
  ) {
    return
  }
  if (block.id !== 'minecraft:moss_block') return
  const newBlock = `${item.id}_block`

  /**
   * Recursive function to spread mushroom blocks to nearby moss blocks with
   * a configurable decay and increasing delay.
   * @param {Special.Block} block
   * @param {number} probability
   * @param {number} decayFactor
   * @param {number} delay
   */
  const decayedSpread = (
    /** @type {Internal.BlockContainerJS} */ block,
    probability,
    decayFactor,
    delay
  ) => {
    if (block.id !== 'minecraft:moss_block') return
    if (Math.random() > probability) return
    const { x, y, z } = block
    level.spawnParticles(
      'minecraft:composter',
      true,
      x + 0.5,
      y + 1,
      z + 0.5,
      0.3,
      0.3,
      0.3,
      20,
      0.3
    )
    block.set(newBlock)
    server.scheduleInTicks(delay, (c) => {
      const newProbability = probability * decayFactor
      const newDelay = delay + randRange(10)
      decayedSpread(block.north, newProbability, decayFactor, newDelay)
      decayedSpread(block.south, newProbability, decayFactor, newDelay)
      decayedSpread(block.east, newProbability, decayFactor, newDelay)
      decayedSpread(block.west, newProbability, decayFactor, newDelay)
      c.reschedule()
    })
  }
  decayedSpread(block, 1, 0.5, randRange(10))
}

BlockEvents.rightClicked((e) => {
  // Remy the Epicure can only be spawned from a special amethyst charm.
  handleRemySpawning(e)

  // Handle when a moss block is right clicked with a mushroom to seed more.
  handleMushroomMossSeeding(e)
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
    .addLoot(
      LootEntry.of('create:experience_block').when((c) => {
        c.matchDamageSource((source) => {
          return source.anyType('pnc_minigun')
        })
      })
    )

  // Suffocation damage source 'inWall'

  // Make budding amethyst mineable with silk touch.
  e.addBlockLootModifier('minecraft:budding_amethyst')
    .matchMainHand(ItemFilter.hasEnchantment('minecraft:silk_touch'))
    .addLoot(LootEntry.of('minecraft:budding_amethyst'))
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
    maxY: 1,
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

  // If a lightning struck an emerald block and spawned a wandering trader, it
  // should not damage the newly spawned trader.
  if (
    entity.type === 'minecraft:wandering_trader' &&
    lightning.persistentData.spawnedTrader
  ) {
    e.setCanceled(true)
  }
}

/**
 * Handler defined in startup_scripts/spoutHandlerRegistration.js
 * Defined here to allow for server side reload.
 * @type {Internal.SpecialSpoutHandlerEvent$SpoutHandler}
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.FluidStackJS} fluid
 * @param {boolean} simulate
 * @returns {number} The amount of fluid used by the spout
 */
global.NetherWartSpoutHandlerCallback = (block, fluid, simulate) => {
  const fluidConsumption = 250
  const { properties } = block
  const age = parseInt(properties.getOrDefault('age', 3), 10)
  if (age == 3) return 0
  if (fluid.id !== 'sliceanddice:fertilizer') return 0
  if (fluid.amount < fluidConsumption) return 0
  if (!simulate) {
    block.set(block.id, { age: new String(age + 1) })
  }
  return fluidConsumption
}

/**
 * Handler defined in startup_scripts/spoutHandlerRegistration.js
 * Defined here to allow for server side reload
 * @type {Internal.SpecialSpoutHandlerEvent$SpoutHandler}
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.FluidStackJS} fluid
 * @param {boolean} simulate
 * @returns {number} The amount of fluid used by the spout
 */
global.BuddingAmethystSpoutHandlerCallback = (block, fluid, simulate) => {
  const fluidConsumption = 500
  if (fluid.id !== 'kubejs:crystal_growth_accelerator') return 0
  if (fluid.amount < fluidConsumption) return 0
  const growthStates = {
    'minecraft:small_amethyst_bud': 'minecraft:medium_amethyst_bud',
    'minecraft:medium_amethyst_bud': 'minecraft:large_amethyst_bud',
    'minecraft:large_amethyst_bud': 'minecraft:amethyst_cluster',
  }
  let growCandidates = []
  for (const surroundingBlock of getSurroundingBlocks(block)) {
    if (surroundingBlock.id in growthStates) {
      growCandidates.push(surroundingBlock)
    }
  }
  /** @type {Internal.BlockContainerJS} */
  const candidate = choice(growCandidates)
  if (candidate === null) return 0
  // All possible short circuit conditions need to be evaluated before here.
  // The simulate check should only perform actual updates if necessary, but
  // should not short circuit with a different result.
  if (!simulate) {
    candidate.set(growthStates[candidate.id], {
      facing: candidate.properties.facing,
    })
  }
  return fluidConsumption
}

/**
 * Handler defined in startup_scripts/blocks.js
 * Defined here to allow for server side reload
 * @type {Internal.BlockEntityCallback_}
 * @param {Internal.BlockEntityJS} e
 */
global.PortalBlockTickingCallback = (e) => {
  const { blockPos, level } = e
  const entities = level.getEntitiesWithin(
    AABB.ofBlocks(blockPos.offset(-1, -1, -1), blockPos.offset(1, 2, 1))
  )
  for (const entity of entities) {
    if (entity.item !== null) continue
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

  // Rotten flesh can be smoked into leather
  e.smoking('minecraft:leather', 'minecraft:rotten_flesh')

  // Name tag recipe
  e.shaped(
    'minecraft:name_tag',
    [
      ' LS', //
      'LPL', //
      ' L ', //
    ],
    {
      L: 'minecraft:leather',
      S: 'minecraft:string',
      P: 'minecraft:paper',
    }
  )

  // Drop named pickaxes into a portal?

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

  // Axes: Crystal refinement, enchanting, essence, potion, food, apotheosis,

  // TODO: better diamond cutting and diamond automation in chapter 5b

  // Liquid experience standardization, it must be melted into liquid form.
  e.remove({ id: 'compressedcreativity:thermo_plant/essence_to_nugget' })
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

  // Amethyst bud growth. The most expensive is sequenced filling, then
  // Thermal crystallization, then manual spouting.
  create
    .SequencedAssembly('minecraft:small_amethyst_bud')
    .fill('kubejs:crystal_growth_accelerator', 100)
    .loops(10)
    .outputs('minecraft:medium_amethyst_bud')
  create
    .SequencedAssembly('minecraft:medium_amethyst_bud')
    .fill('kubejs:crystal_growth_accelerator', 100)
    .loops(10)
    .outputs('minecraft:large_amethyst_bud')
  create
    .SequencedAssembly('minecraft:large_amethyst_bud')
    .fill('kubejs:crystal_growth_accelerator', 100)
    .loops(10)
    .outputs('minecraft:amethyst_cluster')
  e.recipes.thermal
    .crystallizer('minecraft:medium_amethyst_bud', [
      'minecraft:small_amethyst_bud',
      Fluid.of('kubejs:crystal_growth_accelerator', 500),
    ])
    .energy(8000) // 20 RF/t = 20s
  e.recipes.thermal
    .crystallizer('minecraft:large_amethyst_bud', [
      'minecraft:medium_amethyst_bud',
      Fluid.of('kubejs:crystal_growth_accelerator', 500),
    ])
    .energy(8000) // 20 RF/t = 20s
  e.recipes.thermal
    .crystallizer('minecraft:amethyst_cluster', [
      'minecraft:large_amethyst_bud',
      Fluid.of('kubejs:crystal_growth_accelerator', 500),
    ])
    .energy(8000) // 20 RF/t = 20s

  // Glowstone and redstone automation from potion brewing is encouraged
  // Gem dust automation
  create.filling('apotheosis:gem_dust', [
    'create:cinder_flour',
    Fluid.of('starbunclemania:source_fluid', 9),
  ])

  // Require flower azaleas for stuff here to incentivize moss farming

  // Remy spawner charm
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'pneumaticcraft:salmon_tempura',
      'farmersdelight:fried_rice',
      'farmersdelight:squid_ink_pasta',
      'farmersdelight:apple_pie_slice',
      'farmersdelight:melon_juice',
      'farmersdelight:hamburger',
      'farmersdelight:roast_chicken',
      'farmersdelight:stuffed_potato',
    ],
    'ars_nouveau:amethyst_golem_charm',
    'kubejs:remy_spawner'
  )

  // Archwood Tree Sap Extraction
  e.recipes.thermal.tree_extractor(
    Fluid.of('kubejs:flourishing_archwood_sap', 50),
    'ars_nouveau:green_archwood_log',
    'ars_nouveau:green_archwood_leaves'
  )
  e.recipes.thermal.tree_extractor(
    Fluid.of('kubejs:vexing_archwood_sap', 50),
    'ars_nouveau:purple_archwood_log',
    'ars_nouveau:purple_archwood_leaves'
  )
  e.recipes.thermal.tree_extractor(
    Fluid.of('kubejs:blazing_archwood_sap', 50),
    'ars_nouveau:red_archwood_log',
    'ars_nouveau:red_archwood_leaves'
  )
  e.recipes.thermal.tree_extractor(
    Fluid.of('kubejs:cascading_archwood_sap', 50),
    'ars_nouveau:blue_archwood_log',
    'ars_nouveau:blue_archwood_leaves'
  )
  e.recipes.thermal.tree_extractor(
    Fluid.of('kubejs:flashing_archwood_sap', 50),
    'ars_elemental:yellow_archwood_log',
    'ars_elemental:yellow_archwood_leaves'
  )

  // Archwood Tree Sap can be processed into essences
  // Create mixing recipes have slight loss compared to Pneumaticcraft
  create
    .mixing(
      [
        Fluid.of('kubejs:liquid_earth_essence', 20),
        Fluid.of('starbunclemania:source_fluid', 10),
        Fluid.of('create_enchantment_industry:experience', 5),
      ],
      Fluid.of('kubejs:flourishing_archwood_sap', 50)
    )
    .heated()
  pneumaticcraft
    .Refinery('50mb kubejs:flourishing_archwood_sap')
    .minTemp(100)
    .outputs([
      '25mb kubejs:liquid_earth_essence',
      '15mb starbunclemania:source_fluid',
      '10mb create_enchantment_industry:experience',
    ])
  create
    .mixing(
      [
        Fluid.of('starbunclemania:source_fluid', 25),
        Fluid.of('thermal:latex', 5),
        Fluid.of('kubejs:crystal_growth_accelerator', 5),
      ],
      Fluid.of('kubejs:vexing_archwood_sap', 50)
    )
    .heated()
  pneumaticcraft
    .Refinery('50mb kubejs:vexing_archwood_sap')
    .minTemp(100)
    .outputs([
      '30mb starbunclemania:source_fluid',
      '10mb thermal:latex',
      '10mb kubejs:crystal_growth_accelerator',
    ])
  create
    .mixing(
      [
        Fluid.of('kubejs:liquid_fire_essence', 20),
        Fluid.of('starbunclemania:source_fluid', 10),
        Fluid.of('tfmg:crude_oil_fluid', 5),
      ],
      Fluid.of('kubejs:blazing_archwood_sap', 50)
    )
    .superheated()
  pneumaticcraft
    .Refinery('50mb kubejs:blazing_archwood_sap')
    .minTemp(300)
    .outputs([
      '25mb kubejs:liquid_fire_essence',
      '15mb starbunclemania:source_fluid',
      '10mb tfmg:crude_oil_fluid',
    ])
  create
    .mixing(
      [
        Fluid.of('kubejs:liquid_water_essence', 25),
        Fluid.of('starbunclemania:source_fluid', 10),
        Fluid.of('thermal:latex', 5),
      ],
      Fluid.of('kubejs:cascading_archwood_sap', 50)
    )
    .heated()
  pneumaticcraft
    .Refinery('50mb kubejs:cascading_archwood_sap')
    .minTemp(100)
    .outputs([
      '25mb kubejs:liquid_water_essence',
      '15mb starbunclemania:source_fluid',
      '10mb thermal:latex',
    ])
  create
    .mixing(
      [
        Fluid.of('kubejs:liquid_air_essence', 20),
        Fluid.of('starbunclemania:source_fluid', 10),
        Fluid.of('createaddition:bioethanol', 5),
      ],
      Fluid.of('kubejs:flashing_archwood_sap', 50)
    )
    .heated()
  pneumaticcraft
    .Refinery('50mb kubejs:flashing_archwood_sap')
    .minTemp(100)
    .outputs([
      '25mb kubejs:liquid_air_essence',
      '15mb starbunclemania:source_fluid',
      '10mb createaddition:bioethanol',
    ])

  // Solidifying the liquid essence
  // Create recipes have a slight loss compared to Pneumaticcraft
  create.compacting(
    'ars_nouveau:earth_essence',
    Fluid.of('kubejs:liquid_earth_essence', 250)
  )
  pneumaticcraft
    .HeatFrame('1000mb kubejs:liquid_earth_essence')
    .maxTemp(0)
    .outputs('10x ars_nouveau:earth_essence')
  create.compacting(
    'ars_nouveau:fire_essence',
    Fluid.of('kubejs:liquid_fire_essence', 250)
  )
  pneumaticcraft
    .HeatFrame('1000mb kubejs:liquid_fire_essence')
    .maxTemp(100)
    .outputs('10x ars_nouveau:fire_essence')
  create.compacting(
    'ars_nouveau:water_essence',
    Fluid.of('kubejs:liquid_water_essence', 250)
  )
  pneumaticcraft
    .HeatFrame('1000mb kubejs:liquid_water_essence')
    .maxTemp(-50)
    .outputs('10x ars_nouveau:water_essence')
  create.compacting(
    'ars_nouveau:air_essence',
    Fluid.of('kubejs:liquid_air_essence', 250)
  )
  pneumaticcraft
    .HeatFrame('1000mb kubejs:liquid_air_essence')
    .maxTemp(50)
    .outputs('10x ars_nouveau:air_essence')

  // Custom fertilizers for boosting the Arboreal Extractor
  e.recipes.thermal.tree_extractor_boost(
    'farmersdelight:organic_compost',
    /*output=*/ 8,
    /*cycles=*/ 16
  )
  // make the fertilizers depend on each other?

  // Overhaul tree extractor boost to use ch5b advanced stuff
  // e.forEachRecipe({ type: 'thermal:tree_extractor_boost' }, (r) => {
  //   const json = JSON.parse(r.json)
  //   console.log(json)
  // })

  // TODO farmers delight seq assembly overhaul, remove cck
})
