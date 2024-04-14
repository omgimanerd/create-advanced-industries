// priority: 100
// Recipe overhauls for Chapter 2A progression.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Granite automation overhaul
  e.remove({ id: 'minecraft:granite' })
  e.remove({ id: 'create:compacting/granite_from_flint' })
  create.mixing('8x minecraft:granite', [
    '8x minecraft:cobblestone',
    'minecraft:red_dye',
  ])

  // Red sand washing for copper
  create.splashing(
    ['create:copper_nugget', Item.of('minecraft:clay_ball').withChance(0.25)],
    'minecraft:red_sand'
  )

  // Rubber automation
  e.remove({ output: 'thermal:rubber' })
  e.shaped('thermal:rubber', ['FFF', 'FWF', 'FFF'], {
    F: '#minecraft:flowers',
    W: 'minecraft:water_bucket',
  })
  create.compacting('thermal:rubber', [Fluid.of('thermal:latex', 50)])

  // Rubber smelting as block
  e.smelting('thermal:cured_rubber_block', 'thermal:rubber_block')

  // Cutting rubber block for higher rubber yield
  e.remove({ id: 'thermal:storage/cured_rubber_from_block' })
  create.cutting('8x thermal:cured_rubber', 'thermal:cured_rubber_block')

  // Copper mechanism
  e.shaped(
    'kubejs:copper_mechanism',
    [
      'CRC', //
      'RMR', //
      'CRC', //
    ],
    {
      C: 'create:copper_sheet',
      R: 'thermal:cured_rubber',
      M: 'kubejs:andesite_mechanism',
    }
  ).id('kubejs:copper_mechanism_manual_only')
  create
    .SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('kubejs:incomplete_copper_mechanism')
    .deploy('create:copper_sheet')
    .deploy('thermal:cured_rubber')
    .press()
    .outputs('kubejs:copper_mechanism')
})
