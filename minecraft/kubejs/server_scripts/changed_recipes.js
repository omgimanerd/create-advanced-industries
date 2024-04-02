// priority: 100

ServerEvents.recipes(e => {

  // Overrides shaped/shapeless recipes for a given output
  const redefineRecipe = (output, shape, keys) => {
    e.remove({ output : output })
    // 3-argument shaped recipe
    if (keys !== undefined) {
      e.shaped(output, shape, keys)
    } else {
      e.shapeless(output, shape)
    }
  }
  // Redefines the 'output' recipe as
  // A TOP A
  // M MID M
  // A BOT A
  // where A = air, M = andesite mechanism, and
  // TOP, MID, BOT are the respective arguments
  const redefineMechanismRecipe = (mechanism, output, top, middle, bottom) => {
    e.remove({ output: output })
    e.shaped(output, [
      ' T ',
      'ZMZ',
      ' B ',
    ], {
      T: top,
      M: middle,
      B: bottom,
      Z: mechanism
    })
  }

  // Andesite alloy crafting
  e.remove({ id: 'create:crafting/materials/andesite_alloy_from_zinc'})
  e.remove({ type: 'create:mixing', output: 'create:andesite_alloy'})
  e.recipes.create.mixing(Item.of('create:andesite_alloy', 4),
                          ['minecraft:andesite', 'minecraft:iron_nugget'])

  // Cogwheel crafting
  e.remove({ type: 'create:deploying', output: 'create:cogwheel' })
  e.recipes.create.deploying(Item.of('create:cogwheel', 6),
                             ['create:shaft', '#forge:stripped_logs'])

  // Andesite mechanism dependent recipes, in order of JEI search.
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:encased_fan',
    'create:shaft', 'create:andesite_casing', 'create:propeller')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:millstone',
    'create:cogwheel', 'create:andesite_casing', '#forge:stone')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:mechanical_press',
    'create:shaft', 'create:andesite_casing', 'minecraft:iron_block')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:mechanical_mixer',
    'create:cogwheel', 'create:andesite_casing', 'create:whisk')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:weighted_ejector',
    'create:golden_sheet', 'create:depot', 'create:cogwheel')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:speedometer',
    'minecraft:compass', 'create:andesite_casing', 'minecraft:air')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:mechanical_piston',
    '#minecraft:wooden_slabs', 'create:andesite_casing',
    'create:piston_extension_pole')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:gantry_carriage',
    '#minecraft:wooden_slabs', 'create:andesite_casing', 'create:cogwheel')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:windmill_bearing',
    '#minecraft:wooden_slabs', '#forge:stone', 'create:shaft')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:clockwork_bearing',
    '#minecraft:wooden_slabs', 'create:brass_casing', 'create:electron_tube')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:mechanical_bearing',
    '#minecraft:wooden_slabs', 'create:andesite_casing', 'create:shaft')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:rope_pulley',
    'create:andesite_casing', '#minecraft:wool', 'create:iron_sheet')
  redefineRecipe('create:cart_assembler', [
    '   ',
    'ARA',
    'LML'
  ], {
    A: 'create:andesite_alloy',
    R: 'minecraft:redstone',
    L: '#minecraft:logs',
    M: 'kubejs:andesite_mechanism',
  })
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:mechanical_drill',
    'thermal:drill_head', 'minecraft:iron_ingot', 'create:andesite_casing')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:mechanical_saw',
    'thermal:saw_blade', 'minecraft:iron_ingot', 'create:andesite_casing')
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:deployer',
    'create:shaft', 'create:andesite_casing', 'kubejs:zinc_hand')
  redefineMechanismRecipe('kubejs:andesite_mechanism', Item.of('create:portable_storage_interface', 2),
    'create:chute', 'create:andesite_casing', 'minecraft:air')
  redefineRecipe(Item.of('create:mechanical_harvester', 2), [
    'AIA',
    'MIM',
    ' C ',
  ], {
    A: 'create:andesite_alloy',
    I: 'create:iron_sheet',
    M: 'kubejs:andesite_mechanism',
    C: 'create:andesite_casing',
  })
  redefineRecipe(Item.of('create:mechanical_plough', 2), [
    'III',
    'MAM',
    ' C ',
  ], {
    A: 'create:andesite_alloy',
    I: 'create:iron_sheet',
    M: 'kubejs:andesite_mechanism',
    C: 'create:andesite_casing',
  })
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'create:mechanical_roller',
    'create:electron_tube', 'create:andesite_casing', 'create:crushing_wheel')
  redefineRecipe(Item.of('create:andesite_funnel', 2), [
    'A  ',
    'R  ',
    'M  ',
  ], {
    A: 'create:andesite_alloy',
    R: 'thermal:cured_rubber',
    M: 'kubejs:andesite_mechanism',
  })
  redefineRecipe(Item.of('create:andesite_tunnel', 4), [
    'AA ',
    'RR ',
    'MM ',
  ], {
    A: 'create:andesite_alloy',
    R: 'thermal:cured_rubber',
    M: 'kubejs:andesite_mechanism',
  })
  redefineRecipe('createaddition:rolling_mill', [
    'ISI',
    'ASA',
    'MCM',
  ], {
    I: 'create:iron_sheet',
    S: 'create:shaft',
    A: 'create:andesite_alloy',
    M: 'kubejs:andesite_mechanism',
    C: 'create:andesite_casing',
  })
  redefineMechanismRecipe('kubejs:andesite_mechanism', 'sliceanddice:slicer',
    'create:cogwheel', 'create:andesite_casing', 'create:turntable')

  // Copper automation from granite
  e.remove({ id: 'minecraft:granite' })
  e.remove({ id: 'ars_nouveau:manipulation_essence_to_granite' })
  e.remove({ id: 'create:compacting/granite_from_flint' })
  e.recipes.create.mixing(
    Item.of('minecraft:granite', 8),
    [Item.of('minecraft:cobblestone', 8), 'minecraft:red_dye'])
  e.recipes.create.splashing(
    [Item.of('create:copper_nugget', 12),
     Item.of('minecraft:clay_ball').withChance(0.1)],
    'minecraft:red_sand'
  )

  // Rubber automation
  e.remove({ output: 'thermal:rubber' })
  e.shaped('thermal:rubber', [
    'FFF',
    'FWF',
    'FFF',
  ], {
    F: '#minecraft:flowers',
    B: 'minecraft:water_bucket',
  })
  e.recipes.create.compacting('thermal:rubber',
    [Fluid.of('thermal:latex', 50)]).heated()
  e.smelting('thermal:cured_rubber_block', 'thermal:rubber_block')
  e.remove({ id: 'thermal:storage/cured_rubber_from_block' })
  e.recipes.create.cutting(
    Item.of('thermal:cured_rubber', 8), 'thermal:cured_rubber_block')

  // Copper mechanism dependent recipes, in order of JEI search
  redefineRecipe('create:copper_backtank', [
    'ASA',
    'CMC',
    ' C ',
  ], {
    A: 'create:andesite_alloy',
    S: 'create:shaft',
    C: 'minecraft:copper_ingot',
    M: 'kubejs:copper_mechanism',
  })
  redefineRecipe('create:mechanical_pump', [
    'kubejs:copper_mechanism',
    'create:cogwheel',
    'create:fluid_pipe',
  ])
  redefineMechanismRecipe(
    'kubejs:copper_mechanism', Item.of('create:smart_fluid_pipe', 2),
    'create:filter', 'create:fluid_pipe', 'minecraft:redstone_torch')
  redefineRecipe('create:fluid_valve', [
    'kubejs:copper_mechanism', 'create:fluid_pipe', 'create:iron_sheet'
  ])
  redefineMechanismRecipe(
    'kubejs:copper_mechanism', Item.of('create:fluid_tank', 2),
    'create:copper_sheet', 'minecraft:barrel', 'create:copper_sheet')
  redefineRecipe('create:hose_pulley', [
    ' C ',
    ' M ',
    ' P ',
  ], {
    C: 'create:copper_casing',
    M: 'kubejs:copper_mechanism',
    P: 'create:rope_pulley',
  })
  redefineMechanismRecipe(
    'kubejs:copper_mechanism', Item.of('create:item_drain', 2),
    'minecraft:iron_bars', 'create:copper_casing', 'minecraft:air')
  redefineMechanismRecipe(
    'kubejs:copper_mechanism', Item.of('create:spout', 2),
    'minecraft:air', 'create:copper_casing', 'thermal:cured_rubber')
  redefineMechanismRecipe(
    'kubejs:copper_mechanism', Item.of('create:portable_fluid_interface', 2),
    'create:chute', 'create:copper_casing', 'minecraft:air')
  redefineRecipe('create_enchantment_industry:disenchanter', [
    ' S ',
    ' D ',
    '   ',
  ], {
    S: '#create:sandpaper',
    D: 'create:item_drain',
  })
  redefineRecipe('create_enchantment_industry:printer', [
    ' C ',
    ' M ',
    ' P ',
  ], {
    C: 'create:copper_casing',
    M: 'kubejs:copper_mechanism',
    P: 'create:mechanical_press',
  })
})