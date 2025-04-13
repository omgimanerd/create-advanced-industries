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

ServerEvents.afterRecipes((e) => {
  global.REMOVED_ITEMS.forEach((item) => {
    console.log(Block.getId(item))
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

MoreJSEvents.wandererTrades((e) => {
  for (const entry of global.REMOVED_ITEMS) {
    e.removeTrades(TradeItem.of(Item.of(entry)))
  }
})

MoreJSEvents.villagerTrades((e) => {
  for (const entry of global.REMOVED_ITEMS) {
    e.removeTrades(TradeItem.of(Item.of(entry)))
  }
})
