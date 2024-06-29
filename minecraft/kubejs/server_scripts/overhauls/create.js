// priority: 500
// Recipe overhauls for all Create and Create addons

ServerEvents.tags('item', (e) => {
  /**
   * @param {string} material
   * @param {string} mod
   */
  const tagMaterialPlate = (material, mod) => {
    e.add('forge:plates', `${mod}:${material}_sheet`)
    e.add(`forge:plates/${material}`, `${mod}:${material}_sheet`)
  }
  // Untagged Create Deco sheets
  tagMaterialPlate('andesite', 'createdeco')
  tagMaterialPlate('zinc', 'createdeco')
  tagMaterialPlate('netherite', 'createdeco')
  tagMaterialPlate('industrial_iron', 'createdeco')

  // Heavy plate is missing generic plates tag
  e.add('forge:plates', 'tfmg:heavy_plate')

  // Overcharged material sheets
  tagMaterialPlate('overcharged_iron', 'create_new_age')
  tagMaterialPlate('overcharged_gold', 'create_new_age')

  // Misc and things sheets
  tagMaterialPlate('rose_quartz', 'create_things_and_misc')
  tagMaterialPlate('experience', 'create_things_and_misc')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)
  const redefineMechanismRecipe = redefineMechanismRecipe_(e)

  ///////////////////////////////////////////////////
  // Custom KubeJS items/recipes related to Create //
  ///////////////////////////////////////////////////
  e.shaped(
    'kubejs:wooden_hand',
    [
      ' A ', //
      'SSS', //
      ' S ', //
    ],
    {
      A: 'create:andesite_alloy',
      S: '#minecraft:planks',
    }
  )

  //////////////////
  // CreateArmory //
  //////////////////
  e.remove({ id: 'createarmory:strengthened_brass_recipe' })

  // TODO check mods create misc and things
  // create armory

  ////////////
  // Create //
  ////////////
  redefineRecipe(
    'create:copper_backtank',
    [
      'ASA', //
      'CMC', //
      ' C ', //
    ],
    {
      A: 'create:andesite_alloy',
      S: 'create:shaft',
      C: 'minecraft:copper_ingot',
      M: 'kubejs:copper_mechanism',
    }
  )
  redefineRecipe('create:belt_connector', ['RRR'], {
    R: 'thermal:cured_rubber',
  })
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:encased_fan',
    'create:shaft',
    'create:andesite_casing',
    'create:propeller'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:millstone',
    'create:cogwheel',
    'create:andesite_casing',
    '#forge:stone'
  )
  e.recipes.remove({ id: 'create:mechanical_crafting/crushing_wheel' })
  create.mechanical_crafting(
    '2x create:crushing_wheel',
    [
      ' SSS ', //
      'SSPSS', //
      'SPAPS', //
      'SSPSS', //
      ' SSS ', //
    ],
    {
      S: 'minecraft:stone',
      P: '#minecraft:planks',
      A: 'create:andesite_alloy',
    }
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_press',
    'create:shaft',
    'create:andesite_casing',
    'minecraft:iron_block'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_mixer',
    'create:cogwheel',
    'create:andesite_casing',
    'create:whisk'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:weighted_ejector',
    'create:golden_sheet',
    'create:depot',
    'create:cogwheel'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    '4x create:chute',
    'create:iron_sheet',
    'minecraft:iron_ingot',
    'create:iron_sheet'
  )
  redefineMechanismRecipe('kubejs:precision_mechanism')(
    '4x create:smart_chute',
    'create:brass_sheet',
    'create:chute',
    'create:electron_tube'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:speedometer',
    'minecraft:compass',
    'create:andesite_casing',
    'minecraft:air'
  )
  redefineRecipe('create:mechanical_pump', [
    'kubejs:copper_mechanism',
    'create:cogwheel',
    'create:fluid_pipe',
  ])
  redefineMechanismRecipe('kubejs:copper_mechanism')(
    '2x create:smart_fluid_pipe',
    'create:filter',
    'create:fluid_pipe',
    'minecraft:redstone_torch'
  )
  redefineRecipe('create:fluid_valve', [
    'kubejs:copper_mechanism',
    'create:fluid_pipe',
    'create:iron_sheet',
  ])
  redefineMechanismRecipe('kubejs:copper_mechanism')(
    '2x create:fluid_tank',
    'create:copper_sheet',
    'minecraft:barrel',
    'create:copper_sheet'
  )
  redefineRecipe('create:hose_pulley', ['C', 'M', 'P'], {
    C: 'create:copper_casing',
    M: 'kubejs:copper_mechanism',
    P: 'create:rope_pulley',
  })
  redefineMechanismRecipe('kubejs:copper_mechanism')(
    '2x create:item_drain',
    'minecraft:iron_bars',
    'create:copper_casing',
    'minecraft:air'
  )
  redefineMechanismRecipe('kubejs:copper_mechanism')(
    '2x create:spout',
    'minecraft:air',
    'create:copper_casing',
    'thermal:cured_rubber'
  )
  redefineMechanismRecipe('kubejs:copper_mechanism')(
    '2x create:portable_fluid_interface',
    'create:chute',
    'create:copper_casing',
    'minecraft:air'
  )
  redefineMechanismRecipe('kubejs:precision_mechanism')(
    'create:steam_engine',
    'create:shaft',
    'kubejs:copper_mechanism',
    'minecraft:copper_block'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_piston',
    '#minecraft:wooden_slabs',
    'create:andesite_casing',
    'create:piston_extension_pole'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:gantry_carriage',
    '#minecraft:wooden_slabs',
    'create:andesite_casing',
    'create:cogwheel'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:windmill_bearing',
    '#minecraft:wooden_slabs',
    '#forge:stone',
    'create:shaft'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:clockwork_bearing',
    '#minecraft:wooden_slabs',
    'create:brass_casing',
    'create:electron_tube'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_bearing',
    '#minecraft:wooden_slabs',
    'create:andesite_casing',
    'create:shaft'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:rope_pulley',
    'create:andesite_casing',
    '#minecraft:wool',
    'create:iron_sheet'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:elevator_pulley',
    'create:brass_casing',
    'create:rope_pulley',
    'create_iron_sheet'
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
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:contraption_controls',
    '#minecraft:buttons',
    'create:andesite_casing',
    'create:electron_tube'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_drill',
    'thermal:drill_head',
    'minecraft:iron_ingot',
    'create:andesite_casing'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_saw',
    'thermal:saw_blade',
    'minecraft:iron_ingot',
    'create:andesite_casing'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:deployer',
    'create:shaft',
    'create:andesite_casing',
    'kubejs:wooden_hand'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    '2x create:portable_storage_interface',
    'create:chute',
    'create:andesite_casing',
    'minecraft:air'
  )
  redefineRecipe(
    '2x create:mechanical_harvester',
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
    '2x create:mechanical_plough',
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
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_roller',
    'create:electron_tube',
    'create:andesite_casing',
    'create:crushing_wheel'
  )
  redefineMechanismRecipe('create:precision_mechanism')(
    '2x create:mechanical_crafter',
    'create:electron_tube',
    'create:brass_casing',
    'minecraft:crafting_table'
  )
  redefineRecipe('create:sequenced_gearshift', [
    'create:brass_casing',
    'create:cogwheel',
    'create:electron_tube',
    'create:precision_mechanism',
  ])
  redefineMechanismRecipe('create:precision_mechanism')(
    'create:rotation_speed_controller',
    'create:cogwheel',
    'create:shaft',
    'create:brass_casing'
  )
  // Andesite and brass tunnels and funnels
  e.replaceInput(
    { output: /^create:[a-z_]+unnel/ },
    'minecraft:dried_kelp',
    'thermal:cured_rubber'
  )
  // Tree Fertilizer
  e.remove({ id: 'create:crafting/appliances/tree_fertilizer' })
  create.filling('create:tree_fertilizer', [
    'minecraft:bone_meal',
    Fluid.of('sliceanddice:fertilizer', 250),
  ])

  ///////////////////
  // Create Armory //
  ///////////////////
  e.replaceInput(
    { id: 'createarmory:barrel_part_recipe' },
    'create:andesite_alloy',
    'tfmg:steel_ingot'
  )
  e.remove({ id: 'createarmory:nine_mm_recipe' })
  create
    .SequencedAssembly(
      'createarmory:nine_mm_casing',
      'createarmory:unfinished_nine_mm'
    )
    .deploy('minecraft:gunpowder')
    .deploy('create:copper_nugget')
    .press()
    .outputs('createarmory:nine_mm')
  e.remove({ id: 'createarmory:fifty_cal_recipe' })
  create
    .SequencedAssembly(
      'createarmory:fifty_cal_casing',
      'createarmory:unfinished_fifty_cal_casing'
    )
    .deploy('minecraft:gunpowder')
    .deploy('create:copper_nugget')
    .press()
    .outputs('createarmory:fifty_cal')
  e.remove({ id: 'createarmory:five_five_six_recipe' })
  create
    .SequencedAssembly(
      'createarmory:five_five_six_casing',
      'createarmory:unfinished_five_five_six_casing'
    )
    .deploy('minecraft:gunpowder')
    .deploy('create:copper_nugget')
    .press()
    .outputs('createarmory:five_five_six')

  ///////////////////////////////
  // Create Crafts & Additions //
  ///////////////////////////////
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
  e.remove({ output: 'createaddition:tesla_coil' })
  create.mechanical_crafting(
    'createaddition:tesla_coil',
    [
      'SSS', //
      ' I ', //
      'PMP', //
      'BXB', //
    ],
    {
      S: 'create_new_age:copper_wire',
      I: 'tfmg:steel_ingot',
      P: 'pneumaticcraft:capacitor',
      M: 'create:precision_mechanism',
      B: 'create:brass_sheet',
      X: 'create:brass_casing',
    }
  )
  e.remove({ output: 'createaddition:modular_accumulator' })
  create.mechanical_crafting(
    'createaddition:modular_accumulator',
    [
      'SSSSS', //
      'SCCCS', //
      'SPBPS', //
      'SCCCS', //
      'SSSSS', //
    ],
    {
      S: 'create:brass_sheet',
      C: 'create_new_age:copper_wire',
      P: 'pneumaticcraft:capacitor',
      B: 'create:brass_casing',
    }
  )
  redefineMechanismRecipe('create:precision_mechanism')(
    'createaddition:portable_energy_interface',
    'create_new_age:copper_wire',
    'create:brass_casing',
    'minecraft:air'
  )

  ////////////////////
  // Create Jetpack //
  ////////////////////
  e.remove({ id: 'create_jetpack:jetpack' })
  create.mechanical_crafting(
    'create_jetpack:jetpack',
    [
      ' BHB ', //
      'BPTPB', //
      'BCSCB', //
      ' C C ', //
    ],
    {
      H: 'create:shaft',
      B: 'create:brass_sheet',
      P: 'create:precision_mechanism',
      T: 'create:copper_backtank',
      C: 'create:chute',
      S: 'tfmg:steel_mechanism',
    }
  )
  e.remove({ id: 'create_jetpack:netherite_jetpack' })
  create.mechanical_crafting(
    'create_jetpack:netherite_jetpack',
    [
      ' SHS ', //
      'SMPMS', //
      'SCJCS', //
      ' C C ', //
    ],
    {
      H: 'create:shaft',
      S: '#forge:plates/netherite',
      M: 'tfmg:steel_mechanism',
      P: 'create:netherite_backtank',
      C: 'create:smart_chute',
      J: 'create_jetpack:jetpack',
    }
  )

  ////////////////////////////
  // Create: Slice and Dice //
  ////////////////////////////
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'sliceanddice:slicer',
    'create:cogwheel',
    'create:andesite_casing',
    'create:turntable'
  )

  ////////////////////////
  // Create Teleporters //
  ////////////////////////

  /////////////////////////////
  // Create: Balanced Flight //
  /////////////////////////////
  e.remove({ id: 'balancedflight:sequenced_assembly/flight_anchor' })
  create
    .SequencedAssembly('minecraft:beacon')
    .deploy('create_things_and_misc:vibration_mechanism')
    .deploy('create_connected:brass_gearbox')
    .fill(potionFluid('apotheosis:extra_long_flying', 1000))
    .energize(10000000)
    .outputs('balancedflight:flight_anchor')

  e.remove({ id: 'create:mechanical_crafting/ascended_flight_ring' })
  create
    .SequencedAssembly('ars_nouveau:jump_ring')
    .deploy('create_things_and_misc:vibration_mechanism')
    .fill(potionFluid('apotheosis:extra_long_flying', 1000))
    .fill(Fluid.of('kubejs:molten_gold', 1000))
    .energize(1000000)
    .loops(4)
    .outputs('balancedflight:ascended_flight_ring')

  ///////////////////////
  // Create: Connected //
  ///////////////////////

  // TODO do something with control chip?

  /////////////////////
  // Create: New Age //
  /////////////////////
  const createNewAgeKeys = {
    S: 'create:shaft',
    E: 'create_new_age:electrical_connector',
    L: 'minecraft:lightning_rod',
    H: 'tfmg:heavy_plate',
    C: 'tfmg:heavy_machinery_casing',
    I: 'tfmg:steel_ingot',
    M: 'tfmg:steel_mechanism',
  }
  redefineRecipe(
    'create_new_age:energiser_t1',
    [
      'SES', //
      'HCH', //
      ' L ', //
    ],
    createNewAgeKeys
  )
  redefineRecipe(
    'create_new_age:energiser_t2',
    [
      'STS', //
      'HLH', //
      ' L ', //
    ],
    Object.assign({}, createNewAgeKeys, {
      S: 'create_new_age:overcharged_golden_sheet',
      T: 'create_new_age:energiser_t1',
    })
  )
  redefineRecipe(
    'create_new_age:energiser_t3',
    [
      'OTO', //
      'HBH', //
      ' L ', //
    ],
    Object.assign({}, createNewAgeKeys, {
      O: 'create_new_age:overcharged_diamond',
      T: 'create_new_age:energiser_t2',
      B: 'minecraft:copper_block',
    })
  )
  e.remove({ output: 'create_new_age:electrical_connector' })
  create
    .SequencedAssembly('tfmg:heavy_plate')
    .deploy('create:andesite_alloy')
    .deploy('create_new_age:copper_wire')
    .press()
    .outputs('create_new_age:electrical_connector')
  redefineRecipe(
    'create_new_age:basic_motor',
    [
      'HBH', //
      'MGS', //
      'HBH', //
    ],
    Object.assign({}, createNewAgeKeys, {
      B: 'create_new_age:magnetite_block',
      G: 'create_new_age:generator_coil',
    })
  )
  redefineRecipe(
    'create_new_age:advanced_motor',
    [
      'HBH', //
      'OMS', //
      'HBH', //
    ],
    Object.assign({}, createNewAgeKeys, {
      B: 'create_new_age:layered_magnet',
      O: 'create_new_age:overcharged_iron',
      M: 'create_new_age:basic_motor',
    })
  )
  redefineRecipe(
    'create_new_age:reinforced_motor',
    [
      'HBH', //
      'OMS', //
      'HBH', //
    ],
    Object.assign({}, createNewAgeKeys, {
      B: 'create_new_age:netherite_magnet',
      O: 'create_new_age:overcharged_diamond',
      M: 'create_new_age:advanced_motor',
    })
  )
  redefineRecipe(
    'create_new_age:basic_motor_extension',
    [
      'HHH', //
      'BGO', //
      'HHH', //
    ],
    {
      H: 'tfmg:heavy_plate',
      B: 'create_new_age:basic_motor',
      G: 'create_new_age:generator_coil',
      O: 'create_new_age:overcharged_iron_sheet',
    }
  )
  e.remove({ id: 'create_new_age:advanced_motor_extension' })
  create.mechanical_crafting(
    'create_new_age:advanced_motor_extension',
    [
      'HHHHH', //
      'BGGDD', //
      'HHHHH', //
    ],
    {
      H: 'tfmg:heavy_plate',
      B: 'create_new_age:basic_motor_extension',
      G: 'create_new_age:generator_coil',
      D: 'create_new_age:overcharged_diamond',
    }
  )
  // The copper circuit unlocked in chapter 5a can be stonecut into every logic
  // gate or redstone component.
  const logicComponents = [
    'minecraft:comparator',
    'minecraft:repeater',
    'quark:redstone_randomizer',
    'create:pulse_extender',
    'create:pulse_repeater',
    'create:powered_toggle_latch',
    'create:powered_latch',
    'createaddition:redstone_relay',
    'create_connected:sequenced_pulse_generator',
    'morered:latch',
    'morered:pulse_gate',
    'morered:redwire_post_plate',
    'morered:redwire_post_relay_plate',
    'morered:hexidecrubrometer',
    'morered:bundled_cable_relay_plate',
    'morered:diode',
    'morered:not_gate',
    'morered:nor_gate',
    'morered:nand_gate',
    'morered:or_gate',
    'morered:and_gate',
    'morered:xor_gate',
    'morered:xnor_gate',
    'morered:multiplexer',
    'morered:and_2_gate',
    'morered:nand_2_gate',
    'morered:bitwise_diode',
    'morered:bitwise_not_gate',
    'morered:bitwise_or_gate',
    'morered:bitwise_and_gate',
    'morered:bitwise_xor_gate',
    'morered:bitwise_xnor_gate',
  ]
  for (const component of logicComponents) {
    if (component.startsWith('morered')) e.remove({ output: component })
    e.stonecutting(component, 'create_new_age:copper_circuit')
  }

  ///////////////////////////////////
  // Create: The Factory Must Grow //
  ///////////////////////////////////

  // Replace concrete stonecutting recipes with vanilla concrete
  e.forEachRecipe(
    {
      mod: 'tfmg',
      type: 'minecraft:stonecutting',
      input: /tfmg:[a-z_]+_concrete$/,
    },
    (r) => {
      const recipe = JSON.parse(r.json)
      const item = recipe.ingredient.item
      if (item.search(/^tfmg:[a-z_]+_concrete/) >= 0) {
        r.replaceInput(item, item.replace('tfmg:', 'minecraft:'))
      }
    }
  )
  redefineRecipe(
    'tfmg:surface_scanner',
    [
      'HOH', //
      'SCP', //
      'HMH', //
    ],
    {
      H: 'tfmg:heavy_plate',
      O: 'minecraft:compass',
      S: 'create:shaft',
      C: 'tfmg:steel_casing',
      P: 'create:copper_sheet',
      M: 'tfmg:steel_mechanism',
    }
  )

  // TODO: fix recipes that use aluminum as an input

  // TODO: add efficient liquid concrete overhaul
  // Make pipes require a sheet
  const redefinePipeRecipe = (output, ingot, sheet) => {
    e.remove({ output: output })
    const keys = {
      I: ingot,
      S: sheet,
    }
    e.shaped(output, ['SIS'], keys)
    e.shaped(output, ['I', 'S', 'I'], keys)
  }
  const aestheticPipeReplacements = [
    {
      material: 'steel',
      ingot: 'tfmg:steel_ingot',
      sheet: 'tfmg:heavy_plate',
    },
    {
      material: 'brass',
      ingot: 'create:brass_ingot',
      sheet: 'create:brass_sheet',
    },
    {
      material: 'plastic',
      ingot: 'tfmg:plastic_sheet',
      sheet: 'pneumaticcraft:plastic',
    },
  ]
  aestheticPipeReplacements.forEach((r) => {
    redefinePipeRecipe(`tfmg:${r.material}_pipe`, r.ingot, r.sheet)
    redefineRecipe(`tfmg:${r.material}_smart_fluid_pipe`, [
      'create:smart_fluid_pipe',
      r.sheet,
    ])
    redefineRecipe(`tfmg:${r.material}_fluid_valve`, [
      'create:fluid_valve',
      r.sheet,
    ])
    redefineRecipe(`tfmg:${r.material}_mechanical_pump`, [
      'create:mechanical_pump',
      r.sheet,
    ])
  })
  e.replaceInput(
    'tfmg:steel_fluid_tank',
    'tfmg:steel_ingot',
    'tfmg:heavy_plate'
  )

  //////////////////////////////////
  // Create: Enchantment Industry //
  //////////////////////////////////
  redefineRecipe('create_enchantment_industry:disenchanter', ['S', 'D'], {
    S: '#create:sandpaper',
    D: 'create:item_drain',
  })
  redefineRecipe('create_enchantment_industry:printer', ['C', 'M', 'P'], {
    C: 'create:copper_casing',
    M: 'kubejs:copper_mechanism',
    P: 'create:mechanical_press',
  })

  ////////////////////////////////
  // Create Mechanical Extruder //
  ////////////////////////////////
  redefineMechanismRecipe('tfmg:steel_mechanism')(
    'create_mechanical_extruder:mechanical_extruder',
    'create:shaft',
    'create:mechanical_press',
    'create:andesite_casing'
  )
  e.remove({ mod: 'create_mechanical_extruder', output: 'minecraft:stone' })
  // Cannot use tags here, recipe ends up not working, so we are manually
  // creating all the recipe combinations for cobblegen.
  const equivalentWaterBlocks = [
    Fluid.water(1000),
    'minecraft:packed_ice',
    'create_connected:fan_splashing_catalyst',
  ]
  const equivalentLavaBlocks = [
    Fluid.lava(1000),
    'create_connected:fan_blasting_catalyst',
  ]
  const cobblegens = {
    'minecraft:polished_andesite': 'minecraft:andesite',
    'minecraft:polished_diorite': 'minecraft:diorite',
    'minecraft:polished_granite': 'minecraft:granite',
    'create:polished_cut_scoria': 'create:scoria',
    'create:polished_cut_scorchia': 'create:scorchia',
  }
  for (const lava of equivalentLavaBlocks) {
    for (const water of equivalentWaterBlocks) {
      for (const [catalyst, output] of Object.entries(cobblegens)) {
        create.extruding(output, [water, lava], catalyst)
      }
    }
    create.extruding('create:limestone', [Fluid.of('create:honey', 1000), lava])
  }

  //////////////////////////////////
  // Create: Vintage Improvements //
  //////////////////////////////////
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'vintageimprovements:belt_grinder',
    'vintageimprovements:grinder_belt',
    'create:andesite_casing',
    'create:shaft'
  )
  redefineRecipe(
    'vintageimprovements:spring_coiling_machine',
    [
      'S  ', //
      'WCH', //
      'SMS', //
    ],
    {
      S: 'tfmg:steel_ingot',
      W: 'vintageimprovements:spring_coiling_machine_wheel',
      C: 'create:andesite_casing',
      H: 'create:shaft',
      M: 'tfmg:steel_mechanism',
    }
  )
  redefineRecipe(
    'vintageimprovements:vacuum_chamber',
    [
      'SOS', //
      'MCM', //
      'HPH', //
    ],
    {
      S: 'vintageimprovements:steel_spring',
      O: 'create:fluid_pipe',
      M: 'tfmg:steel_mechanism',
      C: 'create:andesite_casing',
      H: 'tfmg:heavy_plate',
      P: 'create:mechanical_pump',
    }
  )
  e.replaceInput(
    { id: 'vintageimprovements:craft/vibrating_table' },
    'vintageimprovements:iron_spring',
    'vintageimprovements:steel_spring'
  )
  e.replaceInput(
    { id: 'vintageimprovements:craft/centrifuge' },
    'create:andesite_casing',
    'create:mechanical_bearing'
  )
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'vintageimprovements:curving_press',
    'create:shaft',
    'create:andesite_casing',
    'minecraft:air'
  )
  e.remove({ id: 'vintageimprovements:mechanical_crafting/helve_hammer' })
  create.mechanical_crafting(
    'vintageimprovements:helve_hammer',
    [
      ' B SS', //
      'BLLLC', //
      'BB  H', //
    ],
    {
      B: 'tfmg:steel_block',
      S: 'vintageimprovements:steel_spring',
      L: '#minecraft:logs',
      C: 'tfmg:steel_casing',
      H: 'create:shaft',
    }
  )
  e.remove({ id: 'vintageimprovements:mechanical_crafting/lathe' })
  create.mechanical_crafting(
    'vintageimprovements:lathe',
    [
      'CSPPC', //
      'S DMS', //
      'CSPPC', //
    ],
    {
      C: 'create:andesite_casing',
      S: 'create:shaft',
      D: 'thermal:drill_head',
      M: 'create:precision_mechanism',
      P: 'create:iron_sheet',
    }
  )
  redefineRecipe(
    'vintageimprovements:grinder_belt',
    [
      'SSS', //
      'SBS', //
      'SSS', //
    ],
    {
      S: '#create:sandpaper',
      B: 'create:mechanical_belt',
    }
  )

  // Consolidate recipe categories
  e.remove({ id: 'vintageimprovements:curving/diamond' })
  create.polishing(
    'createutilities:polished_amethyst',
    'minecraft:amethyst_shard',
    POLISHING_HIGH_SPEED
  )

  // Manually add curving recipes that are desired
  create.curving(
    'minecraft:glass_bottle',
    'minecraft:glass',
    'vintageimprovements:convex_curving_head'
  )
  create.curving(
    'minecraft:bucket',
    'create:iron_sheet',
    'vintageimprovements:convex_curving_head'
  )
  create.curving(
    'minecraft:bowl',
    '#minecraft:planks',
    'vintageimprovements:convex_curving_head'
  )
  create.curving(
    'minecraft:flower_pot',
    'minecraft:brick',
    'vintageimprovements:convex_curving_head'
  )

  // TODO redstone module

  //////////////////////
  // Create Utilities //
  //////////////////////
})
