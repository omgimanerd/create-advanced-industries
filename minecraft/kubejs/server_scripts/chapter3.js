// priority: 100
// Recipe overhauls for Chapter 3B progression.

ServerEvents.compostableRecipes((e) => {
  // Add compostable magical stuff
  e.remove('ars_nouveau:sourceberry_bush')
  e.add('ars_nouveau:sourceberry_bush', 1)
})

ServerEvents.recipes((e) => {
  const nuggetFluid = global.MeltableItem.DEFAULT_NUGGET_FLUID
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  // Blaze burner crafting
  e.recipes.ars_nouveau.enchanting_apparatus(
    Array(8).fill('ars_nouveau:fire_essence'),
    'create:empty_blaze_burner',
    'create:blaze_burner'
  )

  // Automated dirt reward
  e.recipes.create.mixing('4x minecraft:dirt', [
    'thermal:compost',
    'thermal:slag',
    '#forge:sand',
  ])

  // Sand is millable from both gravel and sandstone
  e.remove({ id: 'create:milling/sandstone' })
  e.recipes.create.milling('minecraft:sand', 'minecraft:gravel')
  e.recipes.create.milling('4x minecraft:sand', 'minecraft:sandstone')

  // Clay block automation, dirt comes from thermal recipe
  e.recipes.create.mixing('2x minecraft:clay', [
    'minecraft:dirt',
    'minecraft:sand',
    Fluid.of('minecraft:water', 1000),
  ])

  // Clay block processing
  e.remove({ id: 'create:milling/clay' })
  e.recipes.create.milling('4x minecraft:clay_ball', 'minecraft:clay')
  e.recipes.create.cutting('4x minecraft:clay_ball', 'minecraft:clay')

  // Clay block cutting into cast
  e.stonecutting('kubejs:clay_ingot_cast', 'minecraft:clay')
  e.stonecutting('kubejs:clay_gem_cast', 'minecraft:clay')
  e.stonecutting('kubejs:clay_block_cast', 'minecraft:clay')

  // Tuff recipe overhaul
  e.remove({ id: 'ars_nouveau:manipulation_essence_to_tuff' })
  e.recipes.ars_nouveau.imbuement(
    'minecraft:cobblestone',
    'minecraft:tuff',
    10,
    Array(4).fill('ars_nouveau:manipulation_essence')
  )

  // Zinc overhaul
  e.remove({ id: 'create:crushing/tuff' })
  e.remove({ id: 'create:crushing/tuff_recycling' })
  e.recipes.create
    .compacting(
      [
        Fluid.of('kubejs:molten_zinc', 3 * nuggetFluid),
        Fluid.of('kubejs:molten_lead', 3 * nuggetFluid),
      ],
      'minecraft:tuff'
    )
    .heated()

  // Brass mixing
  e.recipes.create
    .mixing(Fluid.of('kubejs:molten_brass', 2 * ingotFluid), [
      Fluid.of('kubejs:molten_copper', ingotFluid),
      Fluid.of('kubejs:molten_zinc', ingotFluid),
    ])
    .heated()

  // Remove ars soul sand recipes
  e.remove({ id: 'ars_nouveau:conjuration_essence_to_soul_sand' })

  // Nether quartz automation from soul sand, can be washed or melted for
  // different yields.
  e.recipes.create.splashing(
    [
      Item.of('minecraft:quartz').withChance(0.75),
      Item.of('minecraft:clay_ball').withChance(0.25),
    ],
    'minecraft:soul_sand'
  )
  e.recipes.create
    .mixing(
      [
        Fluid.of('kubejs:molten_quartz', 2 * ingotFluid),
        Fluid.of('kubejs:molten_glass', 2 * ingotFluid),
      ],
      ['minecraft:soul_sand']
    )
    .heated()

  // Renewable redstone automation
  e.recipes.create
    .mixing('8x minecraft:redstone', [
      '8x minecraft:cobblestone',
      'minecraft:red_dye',
      Fluid.of('starbunclemania:source_fluid', 800),
    ])
    .heated()

  // Rose quartz overhaul
  e.recipes.create.filling('create:rose_quartz', [
    'minecraft:quartz',
    Fluid.of('kubejs:molten_redstone', ingotFluid * 4),
  ])

  // Polished rose quartz overhaul
  e.recipes.create.mixing(
    ['create:polished_rose_quartz', Item.of('minecraft:sand').withChance(0.9)],
    ['create:rose_quartz', 'minecraft:sand']
  )

  // Electron tube overhaul
  e.remove({ id: 'create:crafting/materials/electron_tube' })
  e.recipes.create.deploying('create:electron_tube', [
    'create:iron_sheet',
    'create:polished_rose_quartz',
  ])

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
