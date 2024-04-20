// priority: 200

ServerEvents.tags('item', (e) => {
  // Allow Create wheat flour to be used in PneumaticCraft sourdough.
  e.add('forge:dusts/flour', 'create:wheat_flour')
})

// Contains all recipes from all mods that are overhauled, but not directly
// related to the progression content.
ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)
  const redefineMechanismRecipe = redefineMechanismRecipe_(e)
  const redefineEnchantingRecipe = redefineEnchantingRecipe_(e)

  /////////////////////////
  // Custom KubeJS items //
  /////////////////////////
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

  ////////////////
  // Apotheosis //
  ////////////////

  //////////////
  // Ars Creo //
  //////////////
  redefineRecipe('ars_creo:starbuncle_wheel', [
    'ars_nouveau:starbuncle_charm',
    'create:water_wheel',
    'create:precision_mechanism',
  ])

  /////////////////
  // Ars Nouveau //
  /////////////////
  redefineRecipe(
    'ars_nouveau:novice_spell_book',
    [
      ' M ', //
      'MBM', //
      ' M ', //
    ],
    {
      B: 'minecraft:book',
      M: 'kubejs:source_mechanism',
    }
  )
  // Gate warp scrolls behind quantum

  e.replaceInput(
    'ars_nouveau:enchanting_apparatus',
    'minecraft:gold_ingot',
    'kubejs:source_mechanism'
  )
  redefineRecipe(
    'ars_nouveau:source_jar',
    [
      'SSS', //
      'G G', //
      'SMS', //
    ],
    {
      S: 'ars_nouveau:archwood_slab',
      G: '#forge:glass',
      M: 'kubejs:source_mechanism',
    }
  )
  e.replaceInput(
    'ars_nouveau:relay',
    'ars_nouveau:source_gem_block',
    'kubejs:source_mechanism'
  )
  redefineRecipe(
    'ars_nouveau:scribes_table',
    [
      'PPP', //
      'NMN', //
      'L L', //
    ],
    {
      P: 'ars_nouveau:archwood_slab',
      N: 'minecraft:gold_nugget',
      M: 'kubejs:source_mechanism',
      L: '#forge:logs/archwood',
    }
  )
  redefineRecipe(
    'ars_nouveau:imbuement_chamber',
    [
      'PGP', //
      'P P',
      'PMP', //
    ],
    {
      P: 'ars_nouveau:archwood_planks',
      G: 'minecraft:gold_ingot',
      M: 'kubejs:source_mechanism',
    }
  )
  redefineEnchantingRecipe(
    'ars_nouveau:relay_splitter',
    [
      'minecraft:quartz',
      'minecraft:lapis_lazuli',
      'kubejs:source_mechanism',
      'minecraft:lapis_lazuli',
      'minecraft:quartz',
      'minecraft:lapis_lazuli',
      'kubejs:source_mechanism',
      'minecraft:lapis_lazuli',
    ],
    'ars_nouveau:relay'
  )
  e.replaceInput(
    'ars_nouveau:arcane_core',
    'ars_nouveau:source_gem',
    'kubejs:source_mechanism'
  )
  e.remove({ id: 'ars_nouveau:basic_spell_turret' })
  e.shaped(
    'ars_nouveau:basic_spell_turret',
    [
      ' S ', //
      'GMG', //
      ' S ', //
    ],
    {
      S: 'ars_nouveau:source_gem',
      G: 'minecraft:gold_ingot',
      M: 'kubejs:source_mechanism',
    }
  )
  redefineEnchantingRecipe(
    'ars_nouveau:storage_lectern',
    [
      'kubejs:source_mechanism',
      '#forge:chests',
      'create:precision_mechanism',
      '#forge:chests',
      'kubejs:source_mechanism',
      '#forge:chests',
      'create:precision_mechanism',
      '#forge:chests',
    ],
    'minecraft:lectern',
    1000
  )

  ///////////////////////////
  // Compressed Creativity //
  ///////////////////////////
  e.replaceInput(
    { mod: 'compressedcreativity' },
    'pneumaticcraft:ingot_iron_compressed',
    'tfmg:steel_ingot'
  )
  const compressedCreativityKeys = {
    P: 'create:copper_sheet',
    S: 'create:shaft',
    H: 'tfmg:heavy_plate',
    B: 'tfmg:steel_bars',
    I: 'tfmg:steel_ingot',
    M: 'tfmg:steel_mechanism',
    T: 'pneumaticcraft:pressure_tube',
  }
  redefineRecipe(
    'compressedcreativity:rotational_compressor',
    [
      'HTH', //
      'SCP', //
      'IMI', //
    ],
    Object.assign({}, compressedCreativityKeys, {
      C: 'create:brass_casing',
      P: 'create:propeller',
    })
  )
  redefineRecipe(
    'compressedcreativity:compressed_air_engine',
    [
      'PTP', //
      'SCR', //
      'IMI', //
    ],
    Object.assign({}, compressedCreativityKeys, {
      C: 'create:copper_casing',
      R: 'compressedcreativity:engine_rotor',
    })
  )
  redefineRecipe(
    'compressedcreativity:air_blower',
    [
      'PTP', //
      'PCP', //
      'IBI', //
    ],
    Object.assign({}, compressedCreativityKeys, {
      C: 'create:copper_casing',
      I: 'minecraft:copper_ingot',
    })
  )
  redefineRecipe(
    'compressedcreativity:industrial_air_blower',
    [
      'HRH', //
      'HCH', //
      'HBH', //
    ],
    Object.assign({}, compressedCreativityKeys, {
      R: 'pneumaticcraft:reinforced_pressure_tube',
      C: 'tfmg:steel_casing',
    })
  )

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
      S: 'createdeco:netherite_sheet',
      M: 'tfmg:steel_mechanism',
      P: 'kubejs:plastic_mechanism',
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

  ///////////////////////
  // Create: Connected //
  ///////////////////////

  // do something with control chip?

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
    '1000mb minecraft:water',
    'minecraft:packed_ice',
    'create_connected:fan_splashing_catalyst',
  ]
  const equivalentLavaBlocks = [
    '1000mb minecraft:lava',
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
    create.extruding('create:limestone', ['1000mb create:honey', lava])
  }

  ///////////////////////////////////
  // Pneumaticcraft: Repressurized //
  ///////////////////////////////////
  const pneumaticcraftMapping = {
    '#forge:ingots/compressed_iron': 'tfmg:steel_ingot',
    'pneumaticcraft:compressed_iron_block': 'tfmg:steel_block',
    'pneumaticcraft:ingot_iron_compressed': 'tfmg:steel_ingot',
    'pneumaticcraft:reinforced_brick_wall': 'tfmg:heavy_plate',
    'pneumaticcraft:reinforced_brick_slab': 'tfmg:steel_ingot',
    'pneumaticcraft:reinforced_stone_slab': 'tfmg:heavy_plate',
    'pneumaticcraft:compressed_iron_gear': 'thermal:iron_gear',
    'pneumaticcraft:logistics_core': 'kubejs:logistics_mechanism',
  }
  // Replace all recipes that used reinforced bricks or stone and make them
  // use steel and heavy plates. Replace all recipes with logistics cores with
  // logistics mechanisms.
  for (const [from, to] of Object.entries(pneumaticcraftMapping)) {
    e.replaceInput(
      {
        mod: 'pneumaticcraft',
        not: [
          { output: 'pneumaticcraft:compressed_iron_block' },
          { output: 'pneumaticcraft:ingot_iron_compressed' },
          { output: 'pneumaticcraft:compressed_iron_gear' },
        ],
      },
      from,
      to
    )
  }
  // Pneumaticcraft registers its own recipe types to preserve the pressure in
  // input ingredients.
  e.forEachRecipe(
    {
      mod: 'pneumaticcraft',
      type: 'pneumaticcraft:crafting_shaped_pressurizable',
    },
    (r) => {
      let hasMatch = false
      const parsedRecipe = JSON.parse(r.json)
      for (const [key, item_json] of Object.entries(parsedRecipe.key)) {
        if (item_json.tag === 'forge:ingots/compressed_iron') {
          parsedRecipe.key[key] = { item: 'tfmg:steel_ingot' }
          hasMatch = true
        }
      }
      if (hasMatch) {
        r.remove()
        e.custom(parsedRecipe)
      }
    }
  )
  // Pneumaticraft manual
  e.remove({ id: 'pneumaticcraft:patchouli_book_crafting' })
  e.shapeless(
    Item.of('patchouli:guide_book').withNBT({
      'patchouli:book': 'pneumaticcraft:book',
    }),
    ['minecraft:book', 'pneumaticcraft:pressure_tube']
  )
  // Common ingredients in Pneumaticcraft's shaped recipe overhauls
  const pneumaticcraftKeys = {
    D: 'tfmg:heavy_machinery_casing',
    H: 'tfmg:heavy_plate',
    C: 'tfmg:steel_casing',
    S: 'tfmg:steel_ingot',
    M: 'tfmg:steel_mechanism',
    A: 'pneumaticcraft:advanced_pressure_tube',
    L: 'pneumaticcraft:plastic',
    N: 'pneumaticcraft:pneumatic_cylinder',
    T: 'pneumaticcraft:pressure_tube',
    P: 'pneumaticcraft:printed_circuit_board',
  }
  // The advanced compressors require custom registration in order to preserve
  // the nbt data in the ingredient compressor.
  e.remove({ output: 'pneumaticcraft:advanced_air_compressor' })
  pneumaticcraft.shapedSpecial(
    'pneumaticcraft:compressor_upgrade_crafting',
    'pneumaticcraft:advanced_air_compressor',
    [
      'HHH', //
      'HCA', //
      'SDS', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      C: 'pneumaticcraft:air_compressor',
    })
  )
  e.remove({ output: 'pneumaticcraft:advanced_liquid_compressor' })
  pneumaticcraft.shapedSpecial(
    'pneumaticcraft:compressor_upgrade_crafting',
    'pneumaticcraft:advanced_liquid_compressor',
    [
      'HHH', //
      'HCA', //
      'SDS', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      C: 'pneumaticcraft:liquid_compressor',
    })
  )
  e.remove({ id: 'pneumaticcraft:assembly/advanced_pressure_tube' })
  pneumaticcraft
    .ThermoPlant([
      'pneumaticcraft:reinforced_pressure_tube',
      '90mb tfmg:molten_steel',
    ])
    .minTemp(900) // Requires 10bar pressure to reach or a superheated blaze
    .pressure(9.5)
    .outputs('pneumaticcraft:advanced_pressure_tube')
  redefineRecipe(
    'pneumaticcraft:air_cannon',
    [
      ' B ', //
      ' MT', //
      'SXS', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      B: 'pneumaticcraft:cannon_barrel',
      X: 'pneumaticcraft:stone_base',
    })
  )
  redefineRecipe(
    'pneumaticcraft:air_compressor',
    [
      'HHH', //
      'HCT', //
      'SMS', //
    ],
    pneumaticcraftKeys
  )
  redefineRecipe(
    'pneumaticcraft:assembly_controller',
    [
      ' P ', //
      'TPP', //
      'HMH', //
    ],
    pneumaticcraftKeys
  )
  redefineRecipe(
    'pneumaticcraft:assembly_drill',
    [
      'DNN', //
      '  N', //
      'HPH', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      D: 'thermal:drill_head',
    })
  )
  e.remove({ id: /^pneumaticcraft:assembly_io_unit_(im|ex)port$/ })
  pneumaticcraft.shapedSpecial(
    'pneumaticcraft:crafting_shaped_no_mirror',
    'pneumaticcraft:assembly_io_unit_export',
    [
      'NNO', //
      'N  ', //
      'HPH', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      O: 'minecraft:hopper',
    })
  )
  pneumaticcraft.shapedSpecial(
    'pneumaticcraft:crafting_shaped_no_mirror',
    'pneumaticcraft:assembly_io_unit_import',
    [
      'ONN', //
      '  N', //
      'HPH', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      O: 'minecraft:hopper',
    })
  )
  redefineRecipe(
    'pneumaticcraft:assembly_laser',
    [
      'QNN', //
      '  N', //
      'HPH',
    ],
    Object.assign({}, pneumaticcraftKeys, {
      Q: 'create:polished_rose_quartz',
    })
  )
  redefineRecipe(
    'pneumaticcraft:assembly_platform',
    [
      'NDN', //
      'LLL', //
      'HPH', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      D: 'create:depot',
    })
  )
  redefineRecipe(
    'pneumaticcraft:charging_station',
    [
      '   ', //
      'TDT', //
      'HPH', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      D: 'create:depot',
    })
  )
  redefineRecipe(
    '6x pneumaticcraft:heat_pipe',
    [
      'LLL', //
      'CCC', //
      'LLL',
    ],
    {
      L: 'pneumaticcraft:thermal_lagging',
      C: 'minecraft:copper_ingot',
    }
  )
  redefineRecipe(
    'pneumaticcraft:liquid_compressor',
    [
      ' A ', //
      'TFT', //
      'SMS', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      A: 'pneumaticcraft:air_compressor',
      F: {
        item: 'pneumaticcraft:small_tank',
        count: 1,
        type: 'forge:nbt',
      },
    })
  )
  redefineRecipe(
    'pneumaticcraft:manual_compressor',
    [
      ' C ', //
      ' T ', //
      'SBS',
    ],
    Object.assign({}, pneumaticcraftKeys, {
      C: 'create:hand_crank',
      B: 'pneumaticcraft:stone_base',
    })
  )
  redefineRecipe(
    'pneumaticcraft:omnidirectional_hopper',
    [
      'HMH', //
      'HCH', //
      ' H ', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      M: 'kubejs:logistics_mechanism',
      C: '#forge:chests/wooden',
    })
  )
  redefineRecipe(
    '8x pneumaticcraft:pressure_chamber_glass',
    [
      'HHH', //
      'HGH', //
      'HHH', //
    ],
    Object.assign({}, pneumaticcraftKeys, { G: '#forge:glass' })
  )
  e.remove({ id: 'pneumaticcraft:pressure_chamber_valve' })
  e.remove({ id: 'pneumaticcraft:assembly/pressure_chamber_valve' })
  redefineRecipe(
    '8x pneumaticcraft:pressure_chamber_wall',
    [
      'HHH', //
      'H H', //
      'HHH', //
    ],
    pneumaticcraftKeys
  )
  redefineRecipe(
    '8x pneumaticcraft:pressure_tube',
    ['HGH'],
    Object.assign({}, pneumaticcraftKeys, { G: '#forge:glass' })
  )
  // Refinery overhauls defined in Chapter 5a
  e.remove({ id: 'pneumaticcraft:reinforced_stone_from_slab' })
  redefineRecipe(
    '4x pneumaticcraft:reinforced_stone',
    [
      'RSR', //
      'SRS', //
      'RSR', //
    ],
    { R: 'tfmg:rebar', S: '#forge:stone' }
  )
  // More expensive filling recipe compared to Thermopneumatic Processing Plant
  // recipe defined by base Pneumaticcraft
  create.filling('pneumaticcraft:reinforced_pressure_tube', [
    'pneumaticcraft:pressure_tube',
    Fluid.of('pneumaticcraft:plastic', 250),
  ])
  redefineRecipe(
    'pneumaticcraft:solar_compressor',
    [
      'OOO', //
      'PMP', //
      'ADA', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      O: 'pneumaticcraft:solar_cell',
    })
  )
  redefineRecipe(
    'pneumaticcraft:universal_sensor',
    [
      ' S ', //
      'LPL', //
      'LTL', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      S: 'pneumaticcraft:seismic_sensor',
    })
  )
  redefineRecipe(
    'pneumaticcraft:air_canister',
    [
      ' T ', //
      'H H', //
      'HSH', //
    ],
    pneumaticcraftKeys
  )
  // Overhaul pneumatic armor to derive from netherite armor
  e.forEachRecipe(
    {
      mod: 'pneumaticcraft',
      id: /pneumaticcraft:pneumatic_((boots)|(chestplate)|(helmet)|(leggings))/,
    },
    (r) => {
      let hasMatch = false
      const parsedRecipe = JSON.parse(r.json)
      for (const [key, item_json] of Object.entries(parsedRecipe.key)) {
        let { item } = item_json
        // Attempt to remap any items in the pre-existing mapping
        let replaced = pneumaticcraftMapping[item]
        if (replaced !== null) {
          parsedRecipe.key[key].item = replaced
          continue
        }
        // Remap the compressed iron armor to netherite
        replaced = item.replace(
          'pneumaticcraft:compressed_iron_',
          'minecraft:netherite_'
        )
        if (item !== replaced) {
          parsedRecipe.key[key].item = replaced
          continue
        }
      }
      if (hasMatch) {
        r.remove()
        e.custom(parsedRecipe)
      }
    }
  )
  redefineRecipe('pneumaticcraft:transfer_gadget', [
    'kubejs:logistics_mechanism',
    'minecraft:hopper',
  ])
  // Bullet manufacturing might go in chapter 5b
  e.remove({ id: 'pneumaticcraft:gun_ammo' })
  create
    .SequencedAssembly('tfmg:heavy_plate')
    .press()
    .deploy('minecraft:gunpowder')
    .deploy('thermal:lead_nugget')
    .deploy('create:copper_nugget')
    .press()
    .outputs('pneumaticcraft:gun_ammo')
  // Generate potion filling recipes for pneumaticcraft's minigun ammo.
  e.remove({ id: 'pneumaticcraft:gun_ammo_potion_crafting' })
  const registeredPotions = new Set()
  for (const id of Utils.getRegistryIds('potion')) {
    let idString = new String(id.toString())
    if (registeredPotions.has(idString)) continue
    registeredPotions.add(idString)
    let nbt = {
      Potion: idString,
    }
    create
      .filling(
        Item.of('pneumaticcraft:gun_ammo').withNBT({
          Damage: 0,
          potion: {
            id: 'minecraft:potion',
            Count: 1,
            tag: nbt,
          },
        }),
        [Fluid.of('create:potion', 100).withNBT(nbt), 'pneumaticcraft:gun_ammo']
      )
      .id(`kubejs:gun_ammo_filling_${idString.replace(/[^a-z_]/g, '_')}`)
  }
  redefineRecipe(
    'pneumaticcraft:gps_tool',
    [
      ' R ', //
      'LGL', //
      'LPL', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      R: 'minecraft:redstone_torch',
      G: '#forge:glass_panes',
    })
  )
  redefineRecipe(
    'pneumaticcraft:pressure_gauge',
    [
      ' H ', //
      'HZH', //
      ' H ', //
    ],
    Object.assign({}, pneumaticcraftKeys, { Z: 'create:stressometer' })
  )
  e.remove({ id: 'pneumaticcraft:pressure_chamber/turbine_blade' })
  create
    .SequencedAssembly('create:copper_sheet')
    .deploy('tfmg:heavy_plate')
    .deploy('tfmg:heavy_plate')
    .cut(2000)
    .outputs('2x pneumaticcraft:turbine_blade')

  /////////////////////
  // Refined Storage //
  /////////////////////
  e.remove({ output: 'refinedstorage:machine_casing' })
  create.item_application('refinedstorage:machine_casing', [
    'tfmg:steel_casing',
    'refinedstorage:quartz_enriched_iron',
  ])

  /////////////////////
  // Starbunclemania //
  /////////////////////
  redefineRecipe(
    'starbunclemania:fluid_sourcelink',
    [
      ' G ', //
      'GBG', //
      ' M ',
    ],
    {
      G: 'minecraft:gold_ingot',
      B: 'minecraft:bucket',
      M: 'kubejs:source_mechanism',
    }
  )

  ////////////////////
  // Thermal Series //
  ////////////////////
  const thermalMachineKeys = {
    C: 'tfmg:heavy_machinery_casing',
    P: 'pneumaticcraft:printed_circuit_board',
    R: 'thermal:rf_coil',
  }
  redefineRecipe(
    'thermal:saw_blade',
    [
      ' S ', //
      'S S', //
      ' S ', //
    ],
    {
      S: 'create:iron_sheet',
    }
  )
  redefineRecipe(
    'thermal:drill_head',
    [
      ' I ', //
      'ISI', //
      'ISI', //
    ],
    { I: 'minecraft:iron_ingot', S: 'create:shaft' }
  )
  redefineRecipe(
    'thermal:machine_pyrolyzer',
    [
      ' K ', //
      'OCO', //
      'PRP', //
    ],
    Object.assign({}, thermalMachineKeys, {
      K: 'tfmg:coal_coke',
      O: 'tfmg:coke_oven',
    })
  )
  redefineRecipe(
    'thermal:machine_crystallizer',
    [
      ' D ', //
      'GCG', //
      'PRP', //
    ],
    Object.assign({}, thermalMachineKeys, {
      G: '#forge:glass',
      D: 'minecraft:diamond',
    })
  )
  const thermalDeviceKeys = {
    P: '#minecraft:planks',
    G: 'thermal:iron_gear',
    M: 'kubejs:andesite_mechanism',
    C: 'create:andesite_casing',
    S: 'tfmg:steel_casing',
    H: 'tfmg:heavy_plate',
    N: 'tfmg:steel_mechanism',
  }
  // TODO wtf is the thermal:device_hive_extractor
  redefineRecipe(
    'thermal:device_tree_extractor',
    [
      'PGP', //
      'MBM', //
      'PCP', //
    ],
    Object.assign({}, thermalDeviceKeys, {
      B: 'minecraft:bucket',
    })
  )
  redefineRecipe(
    'thermal:device_fisher',
    [
      'PGP', //
      'MFM', //
      'PCP', //
    ],
    Object.assign({}, thermalDeviceKeys, {
      G: 'thermal:copper_gear',
      M: 'kubejs:copper_mechanism',
      F: 'minecraft:fishing_rod',
    })
  )
  redefineRecipe(
    'thermal:device_composter',
    [
      'PGP', //
      'MOM', //
      'PCP', //
    ],
    Object.assign({}, thermalDeviceKeys, {
      O: 'minecraft:composter',
    })
  )
  redefineRecipe(
    'thermal:device_water_gen',
    [
      'SBS', //
      'WMW', //
      'SCS', //
    ],
    Object.assign({}, thermalDeviceKeys, {
      B: 'minecraft:iron_bars',
      S: 'create:iron_sheet',
      W: 'minecraft:water_bucket',
    })
  )
  redefineRecipe(
    'thermal:device_collector',
    [
      'HEH', //
      'NON', //
      'HSH', //
    ],
    Object.assign({}, thermalDeviceKeys, {
      E: 'minecraft:ender_pearl',
      O: 'minecraft:hopper',
    })
  )
  redefineRecipe(
    'thermal:device_nullifier',
    [
      'HDH', //
      'NLN', //
      'HSH', //
    ],
    Object.assign({}, thermalDeviceKeys, {
      D: 'create:chute',
      L: 'minecraft:lava_bucket',
    })
  )
  redefineRecipe(
    'thermal:device_potion_diffuser',
    [
      'HFH', //
      'NBN', //
      'HSH', //
    ],
    Object.assign({}, thermalDeviceKeys, {
      F: 'create:encased_fan',
      B: 'minecraft:glass_bottle',
    })
  )
  redefineRecipe(
    'thermal:upgrade_augment_1',
    [
      'SAS', //
      'GMG', //
      'SAS', //
    ],
    {
      S: 'createdeco:zinc_sheet',
      A: 'create:andesite_alloy',
      G: '#forge:glass',
      M: 'kubejs:andesite_mechanism',
    }
  )
  redefineRecipe(
    'thermal:upgrade_augment_2',
    [
      'SQS', //
      'TMT', //
      'SQS', //
    ],
    {
      S: 'create:brass_sheet',
      Q: 'minecraft:quartz',
      T: 'create:electron_tube',
      M: 'create:precision_mechanism',
    }
  )
  redefineRecipe(
    'thermal:upgrade_augment_3',
    [
      'DSD', //
      'PMP', //
      'DSD', //
    ],
    {
      D: 'create_new_age:overcharged_diamond',
      S: 'pneumaticcraft:plastic',
      P: 'pneumaticcraft:printed_circuit_board',
      M: 'tfmg:steel_mechanism',
    }
  )

  // TODO add quests and overhauls for toms simple storage and storage drawers

  /////////////////////
  // Refined Storage //
  /////////////////////
  // TODO add refined storage overhauls
})
