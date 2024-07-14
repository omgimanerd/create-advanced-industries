// priority: 100
// Recipe overhauls for Chapter 3B progression.

ServerEvents.compostableRecipes((e) => {
  // Remove quark compressed recipe crates from composting
  e.remove('quark:apple_crate')
  e.remove('quark:beetroot_crate')
  e.remove('quark:carrot_crate')
  e.remove('quark:potato_crate')
  e.remove('quark:cactus_block')
  e.remove('quark:cocoa_beans_sack')
  e.remove('quark:nether_wart_sack')
  e.remove('quark:berry_sack')
  e.remove('quark:glowberry_sack')

  // Add compostable magical stuff
  e.remove('ars_nouveau:sourceberry_bush')
  e.add('ars_nouveau:sourceberry_bush', 1)
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const nuggetFluid = global.MeltableItem.DEFAULT_NUGGET_FLUID
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  // Blaze burner crafting
  e.recipes.ars_nouveau
    .enchanting_apparatus(
      Array(8).fill('ars_nouveau:fire_essence'),
      'create:empty_blaze_burner',
      'create:blaze_burner'
    )
    .id('kubejs:custom_ars_nouveau_enchanting_blaze_burner')

  // Automated dirt crafting
  e.remove({ id: 'thermal:dirt_crafting' })
  e.shapeless('minecraft:dirt', [
    'thermal:compost',
    'thermal:slag',
    '#forge:sand',
  ]).id('kubejs:dirt_crafting_manual_only')
  create.mixing('4x minecraft:dirt', [
    'thermal:compost',
    'thermal:slag',
    '#forge:sand',
  ])

  // Sand is millable from both gravel and sandstone
  e.remove({ id: 'create:milling/sandstone' })
  create.milling('minecraft:sand', 'minecraft:gravel')
  create.milling('4x minecraft:sand', 'minecraft:sandstone')

  // Clay block automation, dirt comes from thermal recipe
  create.mixing('4x minecraft:clay', [
    'minecraft:dirt',
    'minecraft:sand',
    Fluid.water(1000),
  ])

  // Clay block processing
  e.remove({ id: 'create:milling/clay' })
  create.milling('4x minecraft:clay_ball', 'minecraft:clay')
  create.cutting('4x minecraft:clay_ball', 'minecraft:clay')

  // Unfired clay casts
  e.shaped(
    'kubejs:unfired_ingot_cast',
    [
      'C C', //
      'CCC', //
    ],
    { C: 'minecraft:clay_ball' }
  )
  create
    .deploying('kubejs:unfired_ingot_cast', ['minecraft:clay', '#forge:ingots'])
    .keepHeldItem()
  create
    .curving('kubejs:unfired_ingot_cast', 'minecraft:clay')
    .mode(V_SHAPED_CURVING_HEAD)
  e.blasting('kubejs:ceramic_ingot_cast', 'kubejs:unfired_ingot_cast')

  // Tuff recipe overhaul
  e.recipes.ars_nouveau
    .imbuement(
      'minecraft:cobblestone',
      'minecraft:tuff',
      10,
      Array(4).fill('ars_nouveau:manipulation_essence')
    )
    .id('kubejs:custom_ars_nouveau_imbuement_tuff')

  // Zinc overhaul
  e.remove({ id: 'create:crushing/tuff' })
  e.remove({ id: 'create:crushing/tuff_recycling' })
  create
    .compacting(
      [
        Fluid.of('kubejs:molten_zinc', 3 * nuggetFluid),
        Fluid.of('kubejs:molten_lead', 3 * nuggetFluid),
      ],
      'minecraft:tuff'
    )
    .heated()

  // Brass mixing
  e.remove({ id: 'create:mixing/brass_ingot' })
  // Overhauled in server_scripts/overhauls/metallurgy.js

  // Remove ars soul sand recipes
  e.remove({ id: 'ars_nouveau:conjuration_essence_to_soul_sand' })

  // Nether quartz automation from soul sand, can be washed or melted for
  // different yields.
  e.remove({ id: /^create:crushing\/diorite.*/ })
  create.splashing(
    [
      Item.of('minecraft:quartz').withChance(0.75),
      Item.of('minecraft:clay_ball').withChance(0.25),
    ],
    'minecraft:soul_sand'
  )
  create
    .mixing(
      [
        Fluid.of('kubejs:molten_quartz', 2 * ingotFluid),
        Fluid.of('kubejs:molten_glass', 2 * ingotFluid),
      ],
      ['minecraft:soul_sand']
    )
    .heated()

  // Renewable redstone automation
  create
    .mixing('8x minecraft:redstone', [
      '8x minecraft:cobblestone',
      'minecraft:red_dye',
      Fluid.of('starbunclemania:source_fluid', 800),
    ])
    .heated()

  // Pressurizing recipe for redstone gated by steel
  create
    .pressurizing(['8x minecraft:cobblestone', 'minecraft:red_dye'])
    .secondaryFluidInput(Fluid.of('starbunclemania:source_fluid', 400))
    .heated()
    .outputs('8x minecraft:redstone', 8)

  // Rose quartz overhaul
  create.filling('create:rose_quartz', [
    'minecraft:quartz',
    Fluid.of('kubejs:molten_redstone', ingotFluid * 4),
  ])

  // Pressurizing recipes gated by steel and Chapter 5
  create
    .pressurizing('minecraft:quartz')
    .secondaryFluidInput(Fluid.of('kubejs:molten_redstone', ingotFluid * 2))
    .heated()
    .outputs('create:rose_quartz')
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.of('kubejs:molten_redstone', ingotFluid * 2))
    .item_input('minecraft:quartz')
    .item_output('create:rose_quartz')
    .pressure(2)
    .temperature({ min_temp: 273 + 300 })

  // Polished rose quartz can be made with a grinder.

  // Electron tube overhaul
  e.remove({ id: 'create:crafting/materials/electron_tube' })
  create.deploying('create:electron_tube', [
    'create:iron_sheet',
    'create:polished_rose_quartz',
  ])

  // Precision mechanism
  e.remove({ output: PRECISION_MECHANISM })
  create
    .SequencedAssembly(KINETIC_MECHANISM, INCOMPLETE_PRECISION_MECHANISM)
    .deploy('create:electron_tube')
    .press()
    .deploy('create:brass_sheet')
    .press()
    .outputs(PRECISION_MECHANISM)
})
