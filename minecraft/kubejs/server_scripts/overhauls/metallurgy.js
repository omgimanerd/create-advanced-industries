// priority: 500
// Recipe registrations for metal casting and melting for all the registrations
// in startup_scripts/metallurgy.js

ServerEvents.tags('item', (e) => {
  const tagMaterialIngot = (material, mod) => {
    e.add('forge:ingots', `${mod}:${material}_ingot`)
    e.add(`forge:ingots/${material}`, `${mod}:${material}_ingot`)
  }

  // Untagged ingots
  tagMaterialIngot('industrial_iron', 'createdeco')
  tagMaterialIngot('red_alloy', 'morered')
  tagMaterialIngot('void_steel', 'createutilities')
  tagMaterialIngot('andesite', 'create')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  global.metallurgy.meltable_items.forEach((i) => {
    i.registerMeltingRecipes(e)
      .registerCastingRecipes(e)
      .registerWashedCastRecipes(e)
  })

  // Manually register melting recipes for all glass types
  e.recipes.create
    .mixing(Fluid.of('kubejs:molten_glass', 360), '#forge:glass')
    .heated()

  // Better melting recipe for sand into glass
  e.recipes.create
    .mixing(Fluid.of('kubejs:molten_glass', 450), '#minecraft:smelts_to_glass')
    .heated()

  // A full block is casted from molten glass instead of a glass shard.
  // Register this manually so we don't need to add edge cases to MeltableItem.
  const ceramicCastedMoltenGlass = 'kubejs:ceramic_ingot_cast_molten_glass'
  const steelCastedMoltenGlass = 'kubejs:steel_ingot_cast_molten_glass'
  const MeltableItem = global.MeltableItem
  e.recipes.create.filling(ceramicCastedMoltenGlass, [
    Fluid.of('kubejs:molten_glass', MeltableItem.DEFAULT_INGOT_FLUID * 4),
    MeltableItem.CERAMIC_INGOT_CAST,
  ])
  e.recipes.create.filling(steelCastedMoltenGlass, [
    Fluid.of('kubejs:molten_glass', MeltableItem.DEFAULT_INGOT_FLUID * 4),
    MeltableItem.STEEL_INGOT_CAST,
  ])
  e.recipes.create.splashing(
    [
      'minecraft:glass',
      Item.of(MeltableItem.CERAMIC_INGOT_CAST).withChance(
        MeltableItem.CERAMIC_CAST_RETURN_CHANCE
      ),
    ],
    ceramicCastedMoltenGlass
  )
  e.recipes.create.splashing(
    ['minecraft:glass', MeltableItem.STEEL_INGOT_CAST],
    steelCastedMoltenGlass
  )

  // Add crushing recipes for every gem/ingot into dust.
  const ingotDustMap = {
    'thermal:tin_ingot': 'thermal:tin_dust',
    'thermal:lead_ingot': 'thermal:lead_dust',
    'thermal:silver_ingot': 'thermal:silver_dust',
    'thermal:nickel_ingot': 'thermal:nickel_dust',
    'thermal:ruby': 'thermal:ruby_dust',
    'thermal:sapphire': 'thermal:sapphire_dust',
    'thermal:apatite': 'thermal:apatite_dust',
    'thermal:cinnabar': 'thermal:cinnabar_dust',
    'thermal:niter': 'thermal:niter_dust',
    // Sulfur dust overhauled in chapter 5a
    'minecraft:iron_ingot': 'thermal:iron_dust',
    'minecraft:gold_ingot': 'thermal:gold_dust',
    'minecraft:copper_ingot': 'thermal:copper_dust',
    'minecraft:netherite_ingot': 'thermal:netherite_dust',
    'minecraft:lapis_lazuli': 'thermal:lapis_dust',
    'minecraft:diamond': 'thermal:diamond_dust',
    'minecraft:emerald': 'thermal:emerald_dust',
    'minecraft:quartz': 'thermal:quartz_dust',
  }
  for (const [ingot, dust] of Object.entries(ingotDustMap)) {
    create.milling(dust, ingot)
  }
})
