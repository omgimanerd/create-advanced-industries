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
})
