// priority: 100
// Recipe overhauls for Chapter 2B progression.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Source fluid automation
  create.compacting(
    Fluid.of('starbunclemania:source_fluid', 100),
    'ars_nouveau:sourceberry_bush'
  )

  // Source fluid to source conversion should be 1:1
  e.remove({ type: 'starbunclemania:fluid_sourcelink' })
  e.custom({
    type: 'starbunclemania:fluid_sourcelink',
    fluid: 'starbunclemania:source_fluid',
    mb_to_source_ratio: 1,
  })

  // Gold nugget washing automation
  e.remove({ id: 'create:splashing/sand' })
  create.splashing(
    ['minecraft:gold_nugget', Item.of('minecraft:clay_ball').withChance(0.25)],
    'minecraft:sand'
  )

  // Source gem crafting
  e.remove({ id: 'ars_nouveau:imbuement_amethyst' })
  e.remove({ id: 'ars_nouveau:imbuement_lapis' })
  create.filling('ars_nouveau:source_gem', [
    Fluid.of('starbunclemania:source_fluid', 250),
    'minecraft:gold_nugget',
  ])

  // Source mechanism
  create
    .SequencedAssembly(
      'kubejs:andesite_mechanism',
      'kubejs:incomplete_source_mechanism'
    )
    .deploy('ars_nouveau:source_gem')
    .press()
    .fill('starbunclemania:source_fluid', 100)
    .press()
    .outputs('kubejs:source_mechanism')
})
