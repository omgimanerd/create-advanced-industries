// priority: 800
/**
 * This file holds all the mappings for items that can be melted into a fluid
 * and handles the necessary item and fluid registrations for all the item
 * mappings. It is stored in global in order to be accessed on the server side
 * so the relevant recipes can be registered as well.
 */

global.metallurgy = {}

// The colors must be kept synchronized with the list in
// generate_fluid_textures.py
global.metallurgy.meltable_items = [
  new MeltableItem({
    nugget: 'minecraft:iron_nugget',
    ingot: 'minecraft:iron_ingot',
    block: 'minecraft:iron_block',
    fluid: 'kubejs:molten_iron',
    bucketColor: 0x5a0303,
  }),
  new MeltableItem({
    nugget: 'create:copper_nugget',
    ingot: 'minecraft:copper_ingot',
    block: 'minecraft:copper_block',
    fluid: 'kubejs:molten_copper',
    bucketColor: 0xa33b1f,
  }),
  new MeltableItem({
    nugget: 'minecraft:gold_nugget',
    ingot: 'minecraft:gold_ingot',
    block: 'minecraft:gold_block',
    fluid: 'kubejs:molten_gold',
    bucketColor: 0xecd129,
  }),
  new MeltableItem({
    nugget: 'create:zinc_nugget',
    ingot: 'create:zinc_ingot',
    block: 'create:zinc_block',
    fluid: 'kubejs:molten_zinc',
    bucketColor: 0xaebda8,
  }),
  new MeltableItem({
    nugget: 'create:brass_nugget',
    ingot: 'create:brass_ingot',
    block: 'create:brass_block',
    fluid: 'kubejs:molten_brass',
    bucketColor: 0xd19c39,
  }),
  new MeltableItem({
    nugget: 'thermal:lead_nugget',
    ingot: 'thermal:lead_ingot',
    block: 'thermal:lead_block',
    fluid: 'kubejs:molten_lead',
    bucketColor: 0x262653,
  }),
  new MeltableItem({
    nugget: 'thermal:silver_nugget',
    ingot: 'thermal:silver_ingot',
    block: 'thermal:silver_block',
    fluid: 'kubejs:molten_silver',
    bucketColor: 0xa8b8bf,
  }),
  new MeltableItem({
    ingot: 'tfmg:steel_ingot',
    block: 'tfmg:steel_block',
    fluid: 'tfmg:molten_steel',
    noRegisterFluid: true,
    fluidTextureLocation: 'tfmg:fluid/molten_steel_still',
    requiresSuperheating: true,
  }),
  new MeltableItem({
    ingot: 'quark:clear_shard',
    block: 'minecraft:glass',
    blockRatio: 4,
    fluid: 'kubejs:molten_glass',
    bucketColor: 0xcee7e6,
    noIngotCastingRecipe: true,
  }),
  new MeltableItem({
    ingot: 'minecraft:quartz',
    block: 'minecraft:quartz_block',
    blockRatio: 4,
    fluid: 'kubejs:molten_quartz',
    bucketColor: 0x9e9999,
  }),
  new MeltableItem({
    ingot: 'minecraft:diamond',
    block: 'minecraft:diamond_block',
    fluid: 'kubejs:molten_diamond',
    requiresSuperheating: true,
    bucketColor: 0x1ec2c3,
  }),
  new MeltableItem({
    ingot: 'minecraft:emerald',
    block: 'minecraft:emerald_block',
    fluid: 'kubejs:molten_emerald',
    requiresSuperheating: true,
    bucketColor: 0x16bd6e,
  }),
  new MeltableItem({
    ingot: 'minecraft:lapis_lazuli',
    block: 'minecraft:lapis_block',
    fluid: 'kubejs:molten_lapis',
    bucketColor: 0x2c5cc8,
  }),
  new MeltableItem({
    ingot: 'minecraft:redstone',
    block: 'minecraft:redstone_block',
    fluid: 'kubejs:molten_redstone',
    bucketColor: 0x871515,
  }),
]

// Register the fluids for all the meltable items if necessary
StartupEvents.registry('fluid', (e) => {
  global.metallurgy.meltable_items.forEach((i) => {
    i.registerFluid(e)
  })

  // Molten Silicon cannot be casted
  e.create('kubejs:molten_silicon')
    .thickTexture(0x6e6074)
    .bucketColor(0x6e6074)
    .displayName('Molten Silicon')
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
