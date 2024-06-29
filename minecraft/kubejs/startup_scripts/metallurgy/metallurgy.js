// priority: 800
/**
 * This file holds all the mappings for items that can be melted into a fluid
 * and handles the necessary item and fluid registrations for all the item
 * mappings. It is stored in global in order to be accessed on the server side
 * so the relevant recipes can be registered as well.
 */

global.metallurgy = {}

/**
 * Create MeltableItem instances for every entry in the materials map.
 * @type {MeltableItem[]}
 */
global.metallurgy.meltable_items = global.materials.map((v) => {
  return new MeltableItem(v)
})

// Register the fluids for all the meltable materials
StartupEvents.registry('fluid', (e) => {
  global.metallurgy.meltable_items.forEach((/** @type {MeltableItem} */ i) => {
    i.registerFluid(e)
  })
})

StartupEvents.registry('block', (e) => {
  // Unfilled casts that molten metals will be poured into.
  registerBaseIngotCast(e, 'kubejs:unfired_ingot_cast', 'minecraft:block/clay')
  registerBaseIngotCast(
    e,
    MeltableItem.CERAMIC_INGOT_CAST,
    'minecraft:block/terracotta'
  )
  registerBaseIngotCast(e, MeltableItem.STEEL_INGOT_CAST, 'kubejs:block/steel')

  // Register casting recipes for the meltable items into both the clay and
  // steel casts.
  global.metallurgy.meltable_items.forEach((i) => {
    i.registerCastedItems(e)
  })
})

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  // Dirty dusts for ore processing.
  global.getBaseMetals().forEach((v) => {
    registerItem(v.dirty).tag('kubejs:dirty_metal_dust').tag('forge:dusts')
  })

  // Zinc does not have a regular dust form
  registerItem('kubejs:zinc_dust').tag('forge:dusts').tag('forge:dusts/zinc')

  // Crushed forms of Create stones as item intermediates
  registerItem('kubejs:crushed_crimsite')
  registerItem('kubejs:crushed_veridium')
  registerItem('kubejs:crushed_ochrum')
  registerItem('kubejs:crushed_asurine')
})
