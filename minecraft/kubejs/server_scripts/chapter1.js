// priority: 100
// Recipe overhauls for Chapter 1 progression.

ServerEvents.recipes((e) => {
  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)
  const redefineMechanismRecipe = redefineMechanismRecipe_(e)

  // Andesite and iron nugget overhaul
  e.remove({ id: 'minecraft:andesite' })
  e.remove({ id: 'create:compacting/andesite_from_flint' })
  e.shapeless('minecraft:andesite', [
    'minecraft:cobblestone',
    'minecraft:flint',
  ]).id('kubejs:andesite_manual_only')
  e.recipes.create.compacting(Item.of('minecraft:andesite', 2), [
    'minecraft:cobblestone',
    'minecraft:flint',
  ])
  e.recipes.create.splashing(
    ['minecraft:iron_nugget', Item.of('minecraft:flint').withChance(0.1)],
    'minecraft:gravel'
  )

  // Andesite alloy crafting
  e.remove({ id: 'create:crafting/materials/andesite_alloy_from_zinc' })
  e.remove({ type: 'create:mixing', output: 'create:andesite_alloy' })
  e.recipes.create.mixing(Item.of('create:andesite_alloy', 2), [
    'minecraft:andesite',
    'minecraft:iron_nugget',
  ])

  // Cogwheel crafting
  e.remove({ type: 'create:deploying', output: 'create:cogwheel' })
  e.recipes.create.deploying(Item.of('create:cogwheel', 8), [
    'create:shaft',
    '#forge:stripped_logs',
  ])

  // Andesite mechanism
  e.shaped('kubejs:andesite_mechanism', ['PSP', 'CAC', 'PSP'], {
    P: '#minecraft:planks',
    S: 'create:shaft',
    C: 'create:cogwheel',
    A: 'create:andesite_alloy',
  }).id('kubejs:andesite_mechanism_manual_only')
  new SequencedAssembly('create:andesite_alloy')
    .transitional('kubejs:incomplete_andesite_mechanism')
    .deploy('#minecraft:planks')
    .deploy('create:shaft')
    .deploy('create:cogwheel')
    .outputs(e, 'kubejs:andesite_mechanism')

  // Andesite mechanism dependent recipes, in order of JEI search.
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:encased_fan',
    'create:shaft',
    'create:andesite_casing',
    'create:propeller'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:millstone',
    'create:cogwheel',
    'create:andesite_casing',
    '#forge:stone'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:mechanical_press',
    'create:shaft',
    'create:andesite_casing',
    'minecraft:iron_block'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:mechanical_mixer',
    'create:cogwheel',
    'create:andesite_casing',
    'create:whisk'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:weighted_ejector',
    'create:golden_sheet',
    'create:depot',
    'create:cogwheel'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:speedometer',
    'minecraft:compass',
    'create:andesite_casing',
    'minecraft:air'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:mechanical_piston',
    '#minecraft:wooden_slabs',
    'create:andesite_casing',
    'create:piston_extension_pole'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:gantry_carriage',
    '#minecraft:wooden_slabs',
    'create:andesite_casing',
    'create:cogwheel'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:windmill_bearing',
    '#minecraft:wooden_slabs',
    '#forge:stone',
    'create:shaft'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:clockwork_bearing',
    '#minecraft:wooden_slabs',
    'create:brass_casing',
    'create:electron_tube'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:mechanical_bearing',
    '#minecraft:wooden_slabs',
    'create:andesite_casing',
    'create:shaft'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:rope_pulley',
    'create:andesite_casing',
    '#minecraft:wool',
    'create:iron_sheet'
  )
  redefineRecipe(
    'create:cart_assembler',
    [
      '   ', //
      'ARA', //
      'LML', //
    ],
    {
      A: 'create:andesite_alloy',
      R: 'minecraft:redstone',
      L: '#minecraft:logs',
      M: 'kubejs:andesite_mechanism',
    }
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:mechanical_drill',
    'thermal:drill_head',
    'minecraft:iron_ingot',
    'create:andesite_casing'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:mechanical_saw',
    'thermal:saw_blade',
    'minecraft:iron_ingot',
    'create:andesite_casing'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:deployer',
    'create:shaft',
    'create:andesite_casing',
    'kubejs:zinc_hand'
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    Item.of('create:portable_storage_interface', 2),
    'create:chute',
    'create:andesite_casing',
    'minecraft:air'
  )
  redefineRecipe(
    Item.of('create:mechanical_harvester', 2),
    [
      'AIA', //
      'MIM', //
      ' C ', //
    ],
    {
      A: 'create:andesite_alloy',
      I: 'create:iron_sheet',
      M: 'kubejs:andesite_mechanism',
      C: 'create:andesite_casing',
    }
  )
  redefineRecipe(
    Item.of('create:mechanical_plough', 2),
    [
      'III', //
      'MAM', //
      ' C ', //
    ],
    {
      A: 'create:andesite_alloy',
      I: 'create:iron_sheet',
      M: 'kubejs:andesite_mechanism',
      C: 'create:andesite_casing',
    }
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'create:mechanical_roller',
    'create:electron_tube',
    'create:andesite_casing',
    'create:crushing_wheel'
  )
  redefineRecipe(Item.of('create:andesite_funnel', 2), ['A', 'R', 'M'], {
    A: 'create:andesite_alloy',
    R: 'thermal:cured_rubber',
    M: 'kubejs:andesite_mechanism',
  })
  redefineRecipe(Item.of('create:andesite_tunnel', 4), ['AA', 'RR', 'MM'], {
    A: 'create:andesite_alloy',
    R: 'thermal:cured_rubber',
    M: 'kubejs:andesite_mechanism',
  })
  redefineRecipe(
    'createaddition:rolling_mill',
    [
      'ISI', //
      'ASA', //
      'MCM', //
    ],
    {
      I: 'create:iron_sheet',
      S: 'create:shaft',
      A: 'create:andesite_alloy',
      M: 'kubejs:andesite_mechanism',
      C: 'create:andesite_casing',
    }
  )
  redefineMechanismRecipe(
    'kubejs:andesite_mechanism',
    'sliceanddice:slicer',
    'create:cogwheel',
    'create:andesite_casing',
    'create:turntable'
  )
})
