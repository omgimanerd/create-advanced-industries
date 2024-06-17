// priority: 500
// Recipe registrations for metal casting and melting

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

  // TODO Implement metallurgy flow with Create Molten metals for Chapter 6a
})
