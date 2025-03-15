// priority: 500
// Recipe overhauls for Apotheosis and Apotheotic Additions

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  e.replaceInput(
    { id: 'apotheosis:library' },
    'minecraft:ender_chest',
    CRYSTALLINE_MECHANISM
  )

  create
    .SequencedAssembly('minecraft:egg')
    .deploy('minecraft:skeleton_skull')
    .fill(Fluid.of('create_enchantment_industry:experience', 1000))
    .energize(24000)
    .loops(5)
    .outputs('apotheosis:boss_summoner')

  // Apotheotic Additions
  e.replaceInput(
    { output: /^apotheotic_additions:[a-z]+_shelf$/ },
    'apotheosis:ancient_material',
    VIBRATION_MECHANISM
  )

  // Add recipes for some of the shearing treasure enchantments
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'minecraft:shears',
      'toms_storage:ts.paint_kit',
      'minecraft:shears',
      'toms_storage:ts.paint_kit',
      'minecraft:shears',
      'toms_storage:ts.paint_kit',
      'minecraft:shears',
      'toms_storage:ts.paint_kit',
    ],
    'minecraft:book',
    Item.of('minecraft:enchanted_book').enchant('apotheosis:chromatic', 1)
  )
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'kubejs:suffering_essence',
      'kubejs:agony_essence',
      'kubejs:suffering_essence',
      'kubejs:agony_essence',
    ],
    Item.of('minecraft:enchanted_book')
      .enchant('minecraft:fortune', 2)
      .weakNBT(),
    Item.of('minecraft:enchanted_book').enchant('apotheosis:exploitation', 1)
  )
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'minecraft:grass_block',
      'minecraft:green_wool',
      'sliceanddice:fertilizer_bucket',
      'minecraft:green_wool',
      'minecraft:grass_block',
      'minecraft:green_wool',
      'sliceanddice:fertilizer_bucket',
      'minecraft:green_wool',
    ],
    'minecraft:book',
    Item.of('minecraft:enchanted_book').enchant('apotheosis:growth_serum', 1)
  )
})
