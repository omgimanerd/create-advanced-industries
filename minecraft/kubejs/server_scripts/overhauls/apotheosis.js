// priority: 500
// Recipe overhauls for Apotheosis and Apotheotic Additions

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  e.replaceInput(
    { id: 'apotheosis:library' },
    'minecraft:ender_chest',
    CRYSTALLINE_MECHANISM
  )

  // TODO: this is a confusing recipe in JEI.
  // create
  //   .SequencedAssembly('minecraft:egg')
  //   .custom('Next: Haunt with Soul Fire', (pre, post) => {
  //     return create.haunting(post, pre)
  //   })
  //   .deploy('minecraft:skeleton_skull')
  //   .fill(Fluid.of('create_enchantment_industry:experience', 1000))
  //   .loops(5)
  //   .outputs('apotheosis:boss_summoner')

  // Apotheotic Additions
  e.replaceInput(
    { output: /^apotheotic_additions:[a-z]+_shelf$/ },
    'apotheosis:ancient_material',
    VIBRATION_MECHANISM
  )
})
