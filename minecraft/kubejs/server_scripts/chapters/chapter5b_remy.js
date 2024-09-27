// priority: 100
// Chapter 5B: Spawning Remy the Epicure and feeding him to get amethyst.

const REMY_THE_EPICURE = 'Remy the Epicure'

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
  golem.setCustomName(REMY_THE_EPICURE)
  golem.setCustomNameVisible(true)
  golem.persistentData.legitimatelySpawned = true
  golem.setItemSlot('mainhand', 'farmersdelight:cooking_pot')
  golem.spawn()
  item.shrink(1)
})

/**
 * Amethyst golems have their charm drop when killed. This is hardcoded into the
 * source code of Ars Nouveau. If a custom golem is killed, it should drop its
 * crafting ingredients.
 */
LootJS.modifiers((e) => {
  e.addEntityLootModifier('ars_nouveau:amethyst_golem')
    .entityPredicate((entity) => {
      return (
        !!entity.persistentData.legitimatelySpawned &&
        entity.name.getString() === REMY_THE_EPICURE
      )
    })
    .addLoot(LootEntry.of('farmersdelight:fried_rice').withChance(0.8))
    .addLoot(LootEntry.of('farmersdelight:squid_ink_pasta').withChance(0.8))
    .addLoot(LootEntry.of('farmersdelight:apple_pie_slice').withChance(0.8))
    .addLoot(LootEntry.of('farmersdelight:melon_juice').withChance(0.8))
    .addLoot(LootEntry.of('farmersdelight:hamburger').withChance(0.8))
    .addLoot(LootEntry.of('farmersdelight:roast_chicken').withChance(0.8))
    .addLoot(LootEntry.of('farmersdelight:stuffed_potato').withChance(0.8))
    .playerAction((player) => {
      player.tell('Mamma mia!')
    })
})

/**
 * Computes the loot and feeding cooldown from feeding food to Remy the Epicure
 * for the amethyst farming mechanic.
 * @param {Internal.FoodProperties_} foodProperties
 * @param {number} repeatedFoodPenalty
 */
const computeAmethystGolemFeedResults = (
  foodProperties,
  repeatedFoodPenalty
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
  if (target.name.getString() !== REMY_THE_EPICURE) return
  if (!item.isEdible()) return
  const { x, y, z } = target
  // A manually named amethyst golem will be smited
  if (!target.persistentData.legitimatelySpawned) {
    level.getBlock(x, y, z).createEntity('minecraft:lightning_bolt').spawn()
    target.kill()
    server.tell(
      Text.of(player.name).append(' was smited for worshipping a false idol!')
    )
    item.shrink(1)
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
  item.shrink(1)
  target.persistentData.nextFeedableTime = currentTime + feedCooldown
  target.playSound('entity.item.pickup', /*volume=*/ 2, /*pitch=*/ 1)
  target.playSound(item.getEatingSound(), /*volume=*/ 2, /*pitch=*/ 1)
  for (const result of results) {
    target.block.popItemFromFace(result, 'up')
  }

  // If the fed item returns a bowl or other item, return it to the player
  player.addItem(item.getCraftingRemainingItem())
  player.swing()

  // Spawn the relevant particle effects
  if (hasHarmfulEffect) {
    repeat(server, feedCooldown, 10, () => {
      spawnEffectParticles(level, target, 15, 0.4, [0.1, 0.5, 0, 1])
    })
  } else {
    spawnParticles(level, 'minecraft:heart', target, 0.4, 10, 0.1)
  }
})

ServerEvents.recipes((e) => {
  // Remy spawner charm
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'farmersdelight:cooking_pot',
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
})
