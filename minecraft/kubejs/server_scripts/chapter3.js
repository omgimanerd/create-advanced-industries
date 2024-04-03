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

  // copper + zinc melted = brass (heated)
  // brass + cast = brass
  // clay press = cast

  // Clay block automation, dirt comes from thermal recipe
  e.recipes.create.mixing(Item.of('minecraft:clay', 2), [
    'minecraft:dirt',
    'minecraft:sand',
    Fluid.of('minecraft:water', 1000),
  ])

  // Clay block processing
  e.remove({ id: 'create:milling/clay' })
  e.recipes.create.milling(Item.of('minecraft:clay_ball', 4), 'minecraft:clay')
  e.recipes.create.cutting(Item.of('minecraft:clay_ball', 4), 'minecraft:clay')

  // Clay block pressing into cast
  e.stonecutting('kubejs:clay_ingot_cast', 'minecraft:clay')
  e.stonecutting('kubejs:clay_gem_cast', 'minecraft:clay')

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
