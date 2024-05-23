// priority: 100
// Recipe overhauls for Chapter 5B progression.

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
 * Callback handler for feeding and milking a blaze.
 */
ItemEvents.entityInteracted((e) => {
  const { hand, item, player, target } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'minecraft:blaze') return
  if (item.id !== 'minecraft:bucket' && item.id !== 'minecraft:lava_bucket') {
    return
  }
  let remainingMilks = target.persistentData.getInt('remaining_milks')
  // Feeding lava to the blaze.
  if (item.id === 'minecraft:lava_bucket') {
    item.count--
    player.addItem(item.getCraftingRemainingItem())
    remainingMilks = 3
  }

  if (item.id === 'minecraft:bucket') {
    if (remainingMilks === 0) {
      target.playSound('entity.villager.ambient', 2, 2)
      return
    }
    item.count--
    player.addItem('kubejs:blaze_milk_bucket')
    remainingMilks--
  }
  target.persistentData.putInt('remaining_milks', remainingMilks)
})

/**
 * Event handler for mushroom growth from moss blocks.
 */
BlockEvents.rightClicked('minecraft:moss_block', (e) => {
  const { item, hand, block, level, server } = e
  if (hand !== 'main_hand') return
  if (
    item.id !== 'minecraft:brown_mushroom' &&
    item.id !== 'minecraft:red_mushroom'
  ) {
    return
  }
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
    spawnParticles(
      level,
      'minecraft:composter',
      block.pos.center.add(0, 0.5, 0),
      0.3,
      20,
      0.3
    )
    block.set(newBlock)
    server.scheduleInTicks(delay, (c) => {
      const newProbability = probability * decayFactor
      const newDelay = delay + global.randRange(10)
      decayedSpread(block.north, newProbability, decayFactor, newDelay)
      decayedSpread(block.south, newProbability, decayFactor, newDelay)
      decayedSpread(block.east, newProbability, decayFactor, newDelay)
      decayedSpread(block.west, newProbability, decayFactor, newDelay)
      c.reschedule()
    })
  }
  decayedSpread(block, 1, 0.5, global.randRange(10))
})

/**
 * Event handler to handle spawning spiders with Anima Essence.
 */
BlockEvents.rightClicked('minecraft:cobweb', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'ars_elemental:anima_essence') return
  const spider = block.createEntity('minecraft:spider')
  // Center the spider on the block
  spider.setPos(block.pos.center)
  spider.spawn()
  level.destroyBlock(block, false)
  item.count--
})

/**
 * Event handler to handle spawning Remy the Epicure
 */
BlockEvents.rightClicked((e) => {
  const { item, hand, block } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'kubejs:remy_spawner') return

  const golem = block.createEntity('ars_nouveau:amethyst_golem')
  // Center Remy on the top of the block
  golem.setPos(block.pos.center.add(0, 1, 0))
  golem.setCustomName('Remy the Epicure')
  golem.setCustomNameVisible(true)
  golem.persistentData.legitimatelySpawned = true
  golem.spawn()
  item.count--
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
    let effectApplied = global.randRange(0, 1) < effect.getSecond()
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
  if (hasHarmfulEffect) {
    return {
      results: [],
      hasHarmfulEffect: hasHarmfulEffect,
      feedCooldown: maximumNonBeneficialCooldown,
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
  const lootExponential = global.exponential(1, 1.123349, 0, -4)
  let lootTier = lootExponential(nutrition) * nutritionMultiplier

  // The quantity of output for each tier is also correlated with the
  // saturation of the food, but is also divided by (tier + 1), meaning higher
  // tiers give less. A saturation 1 food corresponds to 1 output, and a
  // saturation 11 food should be roughly 5 outputs.
  // a = 1
  // b = (5/1) ^ (1/10) ~ 1.174618
  // c = 0
  // d = -1
  const quantityExponential = global.exponential(1, 1.174618, 0, -1)
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
  const cooldownExponential = global.exponential(8, 0.8, 0, -4)
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
 * Event handler for feeding Remy the Epicure.
 */
ItemEvents.entityInteracted((e) => {
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
    spawnParticles(level, 'minecraft:heart', target, 0.4, 10, 0.1)
  }
})

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
  const candidate = global.choice(growCandidates)
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
 * Called within EntityEvents.spawned to handle the spawning of a wandering
 * trader when lightning strikes and emerald block.
 * @param {Internal.EntitySpawnedEventJS} e
 */
EntityEvents.spawned('ars_nouveau:an_lightning', (e) => {
  let { entity, level } = e
  for (const vec of getOffsetList(AABB.of(-1, -1, -1, 1, 1, 1))) {
    let block = entity.block.offset(vec.x, vec.y, vec.z)
    if (block == 'minecraft:emerald_block') {
      let pos = block.getPos()
      let trader = level.createEntity('minecraft:wandering_trader')
      // Center the wandering trader on the block
      trader.setPos(pos.offset(0.5, 0, 0.5))
      trader.spawn()
      level.destroyBlock(pos, false)
      // If this lightning entity spawned a trader, it should not do damage to
      // it. Set its persistentData so we can cancel the damage event.
      entity.persistentData.spawnedTrader = true
    }
  }
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

LootJS.modifiers((e) => {
  // Kill wandering trader in 5 ways to get essences
  const wanderingTraderMapping = [
    {
      essence: 'kubejs:suffering_essence',
      easyDamageSource: 'lightningBolt',
      hardDamageSource: 'createaddition.barbed_wire', // secretly the tesla coil
    },
    {
      essence: 'kubejs:torment_essence',
      easyDamageSource: 'create.crush',
      hardDamageSource: 'inWall',
    },
    {
      essence: 'kubejs:mutilation_essence',
      easyDamageSource: 'create.mechanical_saw',
      hardDamageSource: 'pnc_minigun',
    },
    {
      essence: 'kubejs:debilitation_essence',
      hardDamageSource: 'indirectMagic',
      easyDamageSource: 'wither',
    },
    {
      essence: 'kubejs:agony_essence',
      easyDamageSource: 'drown',
      hardDamageSource: 'onFire',
    },
  ]
  for (const {
    essence,
    easyDamageSource,
    hardDamageSource,
  } of wanderingTraderMapping) {
    e.addEntityLootModifier('minecraft:wandering_trader')
      .matchDamageSource((c) => {
        return c.anyType(easyDamageSource)
      })
      .addWeightedLoot([0, 2], Item.of(essence))
      .addWeightedLoot([1, 3], Item.of('create:experience_nugget'))
    e.addEntityLootModifier('minecraft:wandering_trader')
      .matchDamageSource((c) => {
        return c.anyType(hardDamageSource)
      })
      .addWeightedLoot([4, 6], Item.of(essence))
      .addWeightedLoot([4, 6], [Item.of('create:experience_nugget')])
  }

  // Make budding amethyst mineable with silk touch.
  e.addBlockLootModifier('minecraft:budding_amethyst')
    .matchMainHand(ItemFilter.hasEnchantment('minecraft:silk_touch'))
    .addLoot(LootEntry.of('minecraft:budding_amethyst'))
})

/**
 * Handles opening the Arcane Portal for hearthstone automation.
 * @param {Internal.BlockRightClickedEventJS} e
 */
BlockEvents.rightClicked('minecraft:crying_obsidian', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'ars_nouveau:source_gem') return
  block.spawnLightning(true)
  block.set('kubejs:portal_block')
  spawnParticles(level, 'minecraft:enchant', block.pos.center, 0.3, 100, 1)
})

/**
 *
 * @param {Internal.ItemStack} item
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
 * Handler defined in startup_scripts/blocks.js
 * Defined here to allow for server side reload
 * @type {Internal.BlockEntityCallback_}
 * @param {Internal.BlockEntityJS} e
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
  for (const /** @type {Internal.Entity} */ entity of entities) {
    if (entity.type === 'minecraft:wandering_trader') {
      entity.remove('killed')
      playSound('minecraft:entity.enderman.teleport', 2, 1)
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
        playSound('minecraft:entity.enderman.teleport', 2, 1)
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
    /** @type {Internal.BlockContainerJS} */
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

ItemEvents.foodEaten('#kubejs:enchantable_foods', (e) => {
  const { item, player } = e
  if (!item.enchanted) return
  for (const [enchant, level] of Object.entries(item.enchantments)) {
    // TODO add more boost if enchanted?
    console.log(enchant, level)
  }
})

ServerEvents.tags('item', (e) => {
  // Tag all enchantable foods for each reference later.
  for (const food of Utils.getRegistryIds('item')) {
    if (food === 'artifacts:eternal_steak') continue
    if (Item.of(food).isEdible()) {
      e.add('kubejs:enchantable_foods', food)
    }
  }
})

ServerEvents.compostableRecipes((e) => {
  // Edit compostable chances
  e.remove('minecraft:flowering_azalea')
  e.remove('minecraft:azalea')
  e.add('minecraft:flowering_azalea', 1)
  e.add('minecraft:azalea', 1)
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Blaze milk to blaze powder
  create
    .mixing('2x minecraft:blaze_powder', Fluid.of('kubejs:blaze_milk', 250))
    .heated()

  // Compost block from compost
  redefineRecipe(
    '8x farmersdelight:organic_compost',
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

  // Moss block automation
  create
    .item_application('minecraft:moss_block', [
      'minecraft:stone',
      'createaddition:biomass',
    ])
    .id('kubejs:moss_from_biomass_application')

  // Flowering Azaleas can be drained for a large amount of source.
  create.emptying(
    [Fluid.of('starbunclemania:source_fluid', 750), 'minecraft:azalea'],
    'minecraft:flowering_azalea'
  )

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

  // Cobweb crafting
  e.shaped(
    'minecraft:cobweb',
    [
      'SSS', //
      'SLS', //
      'SSS', //
    ],
    {
      S: 'minecraft:string',
      L: 'minecraft:slimeball',
    }
  )

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

  // Glowstone and redstone automation from potion brewing is encouraged
  // Gem dust automation
  create.filling('apotheosis:gem_dust', [
    'create:cinder_flour',
    Fluid.of('starbunclemania:source_fluid', 9),
  ])

  // The four alchemical powders can be crafted into sacred salt.
  e.remove({ id: 'gag:sacred_salt' })
  e.shapeless('4x gag:sacred_salt', [
    'apotheosis:gem_dust',
    'minecraft:glowstone_dust',
    'minecraft:redstone',
    'minecraft:gunpowder',
  ])

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

  // Dowsing rod
  redefineRecipe(
    'ars_nouveau:dowsing_rod',
    [
      ' G ', //
      'GMG', //
      'P P', //
    ],
    {
      G: 'minecraft:gold_ingot',
      M: 'kubejs:source_mechanism',
      P: 'ars_nouveau:archwood_planks',
    }
  )

  // Budding amethyst alternative recipe
  create
    .SequencedAssembly('minecraft:amethyst_block')
    .deploy('minecraft:small_amethyst_bud')
    .deploy('minecraft:medium_amethyst_bud')
    .deploy('minecraft:large_amethyst_bud')
    .deploy('minecraft:amethyst_cluster')
    .fill(Fluid.of('kubejs:crystal_growth_accelerator', 1000))
    .outputs('minecraft:budding_amethyst')

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

  const elementals = [
    {
      element: 'air',
      gem: 'kubejs:topaz',
      focus: 'ars_elemental:lesser_air_focus',
      essence: 'ars_nouveau:air_essence',
      essence_fluid: 'kubejs:liquid_air_essence',
      archwood: 'ars_nouveau:yellow_archwood', // not a complete id
      archwood_sap: 'kubejs:flashing_archwood_sap',
      archwood_fruit: 'ars_elemental:flashpine_pod',
      sap_byproduct: 'createaddition:bioethanol',
    },
    {
      element: 'water',
      gem: 'minecraft:lapis_lazuli',
      focus: 'ars_elemental:lesser_water_focus',
      essence: 'ars_nouveau:water_essence',
      essence_fluid: 'kubejs:liquid_water_essence',
      archwood: 'ars_nouveau:blue_archwood', // not a complete id
      archwood_sap: 'kubejs:cascading_archwood_sap',
      archwood_fruit: 'ars_nouveau:frostaya_pod',
      sap_byproduct: 'thermal:latex',
    },
    {
      element: 'fire',
      gem: 'thermal:ruby',
      focus: 'ars_elemental:lesser_fire_focus',
      essence: 'ars_nouveau:fire_essence',
      essence_fluid: 'kubejs:liquid_fire_essence',
      archwood: 'ars_nouveau:red_archwood', // not a complete id
      archwood_sap: 'kubejs:blazing_archwood_sap',
      archwood_fruit: 'ars_nouveau:bombegranate_pod',
      sap_byproduct: 'tfmg:crude_oil_fluid',
    },
    {
      element: 'earth',
      gem: 'minecraft:emerald',
      focus: 'ars_elemental:lesser_earth_focus',
      essence: 'ars_nouveau:earth_essence',
      essence_fluid: 'kubejs:liquid_earth_essence',
      archwood: 'ars_nouveau:green_archwood', // not a complete id
      archwood_sap: 'kubejs:flourishing_archwood_sap',
      archwood_fruit: 'ars_nouveau:mendosteen_pod',
      sap_byproduct: 'create_enchantment_industry:experience',
    },
  ]

  for (let { gem, focus, essence } of elementals) {
    // Amethyst to elemental gem infusion
    e.recipes.ars_nouveau.imbuement(
      'minecraft:amethyst_shard',
      gem,
      2500,
      Array(8).fill(essence)
    )

    // Elemental gem to elemental foci crafting.
    e.remove({ id: focus })
    e.recipes.ars_nouveau.enchanting_apparatus(
      [essence, 'minecraft:gold_ingot', essence, 'minecraft:gold_ingot'],
      gem,
      focus,
      2000
    )
  }

  // Custom fertilizers for boosting the Arboreal Extractor
  e.recipes.thermal.tree_extractor_boost(
    'farmersdelight:organic_compost',
    /*output=*/ 8,
    /*cycles=*/ 16
  )

  // Elemental essence from Archwood trees.
  for (let {
    element,
    essence,
    essence_fluid,
    archwood,
    archwood_sap,
    archwood_fruit,
    sap_byproduct,
  } of elementals) {
    // Archwood Tree Sap Extraction
    e.recipes.thermal.tree_extractor(
      Fluid.of(archwood_sap, 50),
      `${archwood}_log`,
      `${archwood}_leaves`
    )

    // Archwood tree sap can be processed into liquid essence
    // Create mixing recipes have slight loss compared to Pneumaticcraft
    let mixing = create.mixing(
      [
        Fluid.of(essence_fluid, 20),
        Fluid.of('starbunclemania:source_fluid', 10),
        Fluid.of(sap_byproduct, 5),
      ],
      Fluid.of(archwood_sap, 50)
    )
    if (element === 'fire') {
      mixing.superheated()
    } else {
      mixing.heated()
    }
    pneumaticcraft
      .Refinery(`50mb ${archwood_sap}`)
      .minTemp(300)
      .outputs([
        `25mb ${essence_fluid}`,
        `15mb starbunclemania:source_fluid`,
        `10mb ${sap_byproduct}`,
      ])

    // Solidifying the liquid essences
    // Create recipes have a slight loss compared to Pneumaticcraft
    create.compacting(essence, Fluid.of(essence_fluid, 250))
    pneumaticcraft
      .HeatFrame(`1000mb ${essence_fluid}`)
      .maxTemp(0)
      .outputs(`10x ${essence}`)

    // Archwood tree sap can be used to get the Ars fruits
    create.filling(archwood_fruit, [
      'minecraft:apple',
      Fluid.of(archwood_sap, 1000),
    ])
  }

  // Manual definitions for Vexing Archwood, which does not correspond to an
  // element.
  e.recipes.thermal.tree_extractor(
    Fluid.of('kubejs:vexing_archwood_sap', 50),
    'ars_nouveau:purple_archwood_log',
    'ars_nouveau:purple_archwood_leaves'
  )
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
  create.filling('ars_nouveau:bastion_pod', [
    'minecraft:apple',
    Fluid.of('kubejs:vexing_archwood_sap', 500),
  ])

  // TODO heart of the sea duping

  // Custom recipe for the Archmage Spell book without nether stars.
  e.remove({ id: 'ars_nouveau:archmage_spell_book_upgrade' })
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'ars_elemental:lesser_air_focus',
      'ars_elemental:lesser_earth_focus',
      'ars_elemental:lesser_fire_focus',
      'ars_elemental:lesser_water_focus',
      'ars_nouveau:wilden_tribute',
    ],
    'ars_nouveau:apprentice_spell_book',
    'ars_nouveau:archmage_spell_book',
    8000,
    true
  )

  // Wilden Tribute can be duped with Wandering Trader essences
  e.remove({ output: 'ars_elemental:mark_of_mastery' })
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'ars_nouveau:earth_essence',
      'ars_nouveau:fire_essence',
      'ars_nouveau:water_essence',
      'ars_nouveau:air_essence',
      'ars_nouveau:abjuration_essence',
      'ars_nouveau:conjuration_essence',
      'ars_nouveau:manipulation_essence',
      'ars_elemental:anima_essence',
    ],
    'ars_nouveau:wilden_tribute',
    'ars_elemental:mark_of_mastery'
  )
  create
    .SequencedAssembly('ars_elemental:mark_of_mastery')
    .deploy('kubejs:agony_essence')
    .deploy('kubejs:torment_essence')
    .deploy('kubejs:suffering_essence')
    .deploy('kubejs:mutilation_essence')
    .deploy('kubejs:debilitation_essence')
    .outputs([
      Item.of('ars_nouveau:wilden_tribute', 1).withChance(0.85),
      Item.of('ars_nouveau:wilden_tribute', 2).withChance(0.15),
    ])

  // Liquid experience standardization, it must be melted into liquid form.
  // Liquid experience is 1:1 with XP points
  e.remove({ id: 'compressedcreativity:thermo_plant/essence_to_nugget' })
  e.remove({ id: 'compressedcreativity:mixing/memory_essence' })
  e.remove({
    id: /^create_enchantment_industry:disenchanting\/experience_.*$/,
  })
  e.remove({
    id: /^create_enchantment_industry:compacting\/experience_block_.*$/,
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

  // Crying obsidian can be crafted with lots of source
  create
    .SequencedAssembly('minecraft:obsidian')
    .fill(Fluid.of('starbunclemania:source_fluid', 1000))
    .loops(25)
    .outputs('minecraft:crying_obsidian')

  // Remove the regular hearthstone crafting recipe.
  e.remove({ id: 'gag:hearthstone' })

  // Crafting the Crystalline Mechanism
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'ars_elemental:lesser_fire_focus',
      'gag:sacred_salt',
      'minecraft:amethyst_shard',
      'ars_elemental:lesser_air_focus',
      'minecraft:amethyst_shard',
      'gag:hearthstone',
      'ars_elemental:lesser_earth_focus',
      'gag:hearthstone',
      'minecraft:amethyst_shard',
      'ars_elemental:lesser_water_focus',
      'minecraft:amethyst_shard',
      'gag:sacred_salt',
    ],
    'kubejs:source_mechanism',
    'kubejs:incomplete_crystalline_mechanism',
    8000
  )
  create
    .SequencedAssembly('kubejs:incomplete_crystalline_mechanism')
    .deploy('ars_elemental:mark_of_mastery')
    .fill(potionFluid('ars_nouveau:spell_damage_potion_strong', 250))
    .fill(potionFluid('ars_nouveau:mana_regen_potion_long', 250))
    .fill(potionFluid('minecraft:strong_harming', 250))
    .fill(potionFluid('minecraft:strong_strength', 250))
    .fill(potionFluid('ars_elemental:shock_potion', 250))
    .outputs('kubejs:crystalline_mechanism')
})
