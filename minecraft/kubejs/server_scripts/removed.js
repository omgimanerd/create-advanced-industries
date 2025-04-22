// priority: 500

ServerEvents.tags('item', (e) => {
  e.removeAllTagsFrom(global.REMOVED_ITEMS)
  e.add('kubejs:removed', global.REMOVED_ITEMS)
})

// Recipes that are removed for duplication reasons.
ServerEvents.recipes((e) => {
  // Remove all items from recipe inputs and outputs.
  global.REMOVED_ITEMS.forEach((r) => {
    e.remove({ output: r })
    e.remove({ input: r })
  })

  ////////////
  // Create //
  ////////////
  e.remove({ output: '#forge:nuggets', type: 'create:splashing' })

  /////////////////
  // Create Deco //
  /////////////////
  e.remove({ id: 'createdeco:netherite_ingot' })

  ////////////////////////////
  // Create Misc and Things //
  ////////////////////////////

  // Can't suppress other recipe warnings.
  e.remove({ id: 'create:filling/chocolate_bagutte' })

  ///////////////////////////////////
  // Create: The Factory Must Grow //
  ///////////////////////////////////

  // Can't remove pumpjack hammer holder recipe warning?
  // e.remove(/tfmg:mechanical_crafting\/pumpjack_hammer_holder.*/)

  // Suppresses colored concrete warnings in KubeJS logs.
  e.remove(/^tfmg:colored_concrete\/full_block\/[a-z_]+concrete/)
  e.remove({ id: 'tfmg:fractional_distillation/crude_oil' })

  ///////////////////////////////////
  // PneumaticCraft: Repressurized //
  ///////////////////////////////////
  e.remove({ type: 'pneumaticcraft:explosion_crafting' })
  e.remove({ id: 'pneumaticcraft:thermo_plant/compressed_iron_drill_bit' })
  e.remove({ id: 'pneumaticcraft:copper_ingot_from_nugget' })

  ////////////////////
  // Thermal Series //
  ////////////////////
  // Remove all recipes for disabled machines.
  e.remove({ type: 'thermal:press' })
  e.remove({ type: 'thermal:sawmill' })
  e.remove({ type: 'thermal:pulverizer' })
  e.remove({ type: 'thermal:smelter' })
  e.remove({ type: 'thermal:insolator' })
  e.remove({ type: 'thermal:centrifuge' })
  e.remove({ type: 'thermal:press' })
  e.remove({ type: 'thermal:crucible' })
  e.remove({ type: 'thermal:bottler' })
  e.remove({ type: 'thermal:brewer' })

  e.remove({ id: /^thermal:earth_charge\/[a-z_]+/ })
  e.remove({ id: 'thermal:storage/copper_ingot_from_nuggets' })
  // Remove all fire charge alloying
  e.remove({ id: /^thermal:fire_charge.*$/ })
})

LootJS.modifiers((e) => {
  global.REMOVED_ITEMS.forEach((item) => {
    e.addLootTypeModifier(
      LootType.ADVANCEMENT_ENTITY,
      LootType.ADVANCEMENT_REWARD,
      LootType.BLOCK,
      LootType.CHEST,
      LootType.ENTITY,
      LootType.FISHING,
      LootType.GIFT,
      LootType.PIGLIN_BARTER,
      LootType.UNKNOWN
    ).removeLoot(Item.of(item))
  })
})

// Remove disabled items from all villager trade outputs.
;(() => {
  const PROFESSIONS = [
    'minecraft:armorer',
    'minecraft:farmer',
    'minecraft:fisherman',
    'minecraft:shepherd',
    'minecraft:fletcher',
    'minecraft:librarian',
    'minecraft:cartographer',
    'minecraft:cleric',
    'minecraft:weaponsmith',
    'minecraft:toolsmith',
    'minecraft:butcher',
    'minecraft:leatherworker',
    'minecraft:mason',
  ]

  /**
   * Helper method that checks if a given trade's output is in the list of
   * disabled items.
   * @param {Internal.VillagerTradesEvent_} e
   * @param {Internal.VillagerTrades$ItemListing_} trade
   * @param {{ string: boolean }} removedItems
   */
  const checkTradeForRemoval = (e, trade, removedItems) => {
    let costA, costB, result
    try {
      let offer = trade.getOffer(null, null)
      costA = offer.getCostA()
      costB = offer.getCostB()
      result = offer.getResult()
    } catch (e) {
      // Skip this trade if we could not fetch the costs and result.
      return
    }
    if (result.id in removedItems) {
      e.removeTrades({
        firstItem: costA.id,
        secondItem: costB.id,
        outputItem: result.id,
      })
    }
  }

  MoreJSEvents.wandererTrades((e) => {
    const removed = {}
    Ingredient.of(global.REMOVED_ITEMS).itemIds.forEach((id) => {
      removed[id] = true
    })
    e.getTrades(1)
      .concat(e.getTrades(2))
      .forEach((trade) => checkTradeForRemoval(e, trade, removed))
  })

  MoreJSEvents.villagerTrades((e) => {
    const removed = {}
    Ingredient.of(global.REMOVED_ITEMS).itemIds.forEach((id) => {
      removed[id] = true
    })
    for (const profession of PROFESSIONS) {
      e.getTrades(profession, 1)
        .concat(e.getTrades(profession, 2))
        .forEach((trade) => checkTradeForRemoval(e, trade, removed))
    }
  })
})()
