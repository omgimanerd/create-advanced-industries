// priority: 100

ServerEvents.recipes(e => {

  // Andesite alloy crafting
  e.remove({ id: 'create:crafting/materials/andesite_alloy_from_zinc'})
  e.remove({ type: 'create:mixing', output: 'create:andesite_alloy'})
  e.recipes.create.mixing(Item.of('create:andesite_alloy', 4),
                          ['minecraft:andesite', 'minecraft:iron_nugget'])

  // Cogwheel crafting
  e.remove({ type: 'create:deploying', output: 'create:cogwheel' })
  e.recipes.create.deploying(Item.of('create:cogwheel', 6),
                             ['create:shaft', '#forge:stripped_logs'])

  // Overrides shaped recipes for a given output
  const redefineRecipe = (output, shape, keys) => {
    e.remove({ output : output })
    e.shaped(output, shape, keys)
  }
  // Redefines the 'output' recipe as
  // A TOP A
  // M MID M
  // A BOT A
  // where A = air, M = andesite mechanism, and
  // TOP, MID, BOT are the respective arguments
  const redefineAndesiteMachine = (output, top, middle, bottom) => {
    e.remove({ output: output })
    e.shaped(output, [
      ' T ',
      'ZMZ',
      ' B ',
    ], {
      T: top,
      M: middle,
      B: bottom,
      Z: 'kubejs:andesite_mechanism'
    })
  }

  // Create Andesite Mechanism dependent recipes, in order of JEI search.
  redefineAndesiteMachine('create:encased_fan',
    'create:shaft', 'create:andesite_casing', 'create:propeller')
  redefineAndesiteMachine('create:millstone',
    'create:cogwheel', 'create:andesite_casing', '#forge:stone')
  redefineAndesiteMachine('create:mechanical_press',
    'create:shaft', 'create:andesite_casing', 'minecraft:iron_block')
  redefineAndesiteMachine('create:mechanical_mixer',
    'create:cogwheel', 'create:andesite_casing', 'create:whisk')
  redefineAndesiteMachine('create:weighted_ejector',
    'create:golden_sheet', 'create:depot', 'create:cogwheel')
  redefineAndesiteMachine('create:speedometer',
    'minecraft:compass', 'create:andesite_casing', 'minecraft:air')
  redefineAndesiteMachine('create:mechanical_piston',
    '#minecraft:wooden_slabs', 'create:andesite_casing',
    'create:piston_extension_pole')
  redefineAndesiteMachine('create:gantry_carriage',
    '#minecraft:wooden_slabs', 'create:andesite_casing', 'create:cogwheel')
  redefineAndesiteMachine('create:windmill_bearing',
    '#minecraft:wooden_slabs', '#forge:stone', 'create:shaft')
  redefineAndesiteMachine('create:clockwork_bearing',
    '#minecraft:wooden_slabs', 'create:brass_casing', 'create:electron_tube')
  redefineAndesiteMachine('create:mechanical_bearing',
    '#minecraft:wooden_slabs', 'create:andesite_casing', 'create:shaft')
  redefineAndesiteMachine('create:rope_pulley',
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
  redefineAndesiteMachine('create:mechanical_drill',
    'thermal:drill_head', 'minecraft:iron_ingot', 'create:andesite_casing')
  redefineAndesiteMachine('create:mechanical_saw',
    'thermal:saw_blade', 'minecraft:iron_ingot', 'create:andesite_casing')
  redefineAndesiteMachine('create:deployer',
    'create:shaft', 'create:andesite_casing', 'kubejs:zinc_hand')
  redefineAndesiteMachine(Item.of('create:portable_storage_interface', 2),
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
  redefineAndesiteMachine('create:mechanical_roller',
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
  redefineAndesiteMachine('sliceanddice:slicer',
    'create:cogwheel', 'create:andesite_casing', 'create:turntable')
})