// priority: 500

// Untag all removed items and label them with kubejs:removed
ServerEvents.tags('item', (e) => {
  e.removeAllTagsFrom(global.REMOVED_ITEMS)
  e.add('kubejs:removed', global.REMOVED_ITEMS)
})

// Untag all removed fluids and label them with kubejs:removed
ServerEvents.tags('fluid', (e) => {
  e.removeAllTagsFrom(global.REMOVED_FLUIDS)
  e.add('kubejs:removed', global.REMOVED_FLUIDS)
})

// Recipes that are removed for duplication reasons.
ServerEvents.recipes((e) => {
  // Remove all recipes that contain removed items as an input or output.
  global.REMOVED_ITEMS.forEach((item) => {
    e.remove({ output: item })
    e.remove({ input: item })
  })

  // Remove all recipes that contain removed fluids as an input or output.
  global.REMOVED_FLUIDS.forEach((fluid) => {
    e.remove({ output: fluid })
    e.remove({ input: fluid })
  })
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
