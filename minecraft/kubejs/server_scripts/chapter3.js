// priority: 100
// Recipe overhauls for Chapter 3B progression.

ServerEvents.recipes((e) => {
  // Blaze burner crafting
  e.recipes.ars_nouveau.enchanting_apparatus(
    Array(8).fill('ars_nouveau:fire_essence'),
    'create:empty_blaze_burner',
    'create:blaze_burner'
  )

  // Nether quartz automation from soul sand
  e.recipes.create.splashing(
    ['minecraft:quartz', Item.of('minecraft:clay_ball').withChance(0.25)],
    'minecraft:soul_sand'
  )

  // Precision mechanism
  e.remove({ output: 'create:precision_mechanism' })
  new SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('create:incomplete_precision_mechanism')
    .deploy('create:electron_tube')
    .press()
    .deploy('create:brass_sheet')
    .press()
    .outputs(e, 'create:precision_mechanism')
})
