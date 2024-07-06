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
    [
      Item.of('create:copper_nugget').withChance(0.5),
      Item.of('minecraft:clay_ball').withChance(0.25),
    ],
    'minecraft:red_sand'
  )

  // Red sand vibrating gated by steel
  create.vibrating(
    ['create:copper_nugget', Item.of('minecraft:clay_ball').withChance(0.4)],
    'minecraft:red_sand'
  )

  // Latex automation, arboreal extractors gated by steel
  create.compacting(Fluid.of('thermal:latex', 50), [
    Fluid.water(500),
    '8x #minecraft:leaves',
  ])

  // Rubber recipes for automation and manual bootstrapping
  e.remove({ output: 'thermal:rubber' })
  create.compacting('thermal:rubber', [Fluid.of('thermal:latex', 50)])

  // Rubber smelting as block
  e.smelting('thermal:cured_rubber_block', 'thermal:rubber_block')

  // Cutting rubber block for higher rubber yield
  e.remove({ id: 'thermal:storage/cured_rubber_from_block' })
  create.cutting('8x thermal:cured_rubber', 'thermal:cured_rubber_block')
  // Remove default rubber packing recipe to avoid cyclical duping.
  e.remove({ id: 'thermal:storage/cured_rubber_block' })
  create.compacting('thermal:cured_rubber_block', '8x thermal:cured_rubber')

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
      M: KINETIC_MECHANISM,
    }
  ).id('kubejs:copper_mechanism_manual_only')
  create
    .SequencedAssembly(KINETIC_MECHANISM, 'kubejs:incomplete_copper_mechanism')
    .deploy('create:copper_sheet')
    .deploy('thermal:cured_rubber')
    .press()
    .outputs('kubejs:copper_mechanism')
})
