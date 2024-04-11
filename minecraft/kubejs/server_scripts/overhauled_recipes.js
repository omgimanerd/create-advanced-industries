// priority: 200

ServerEvents.tags('item', (e) => {
  // Allow Create wheat flour to be used in PneumaticCraft sourdough.
  e.add('forge:dusts/flour', 'create:wheat_flour')
})

// Contains all recipes from all mods that are overhauled, but not directly
// related to the progression content.
ServerEvents.recipes((e) => {
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
  e.replaceInput(
    { mod: 'compressedcreativity' },
    'compressedcreativity:compressed_iron_casing',
    'tfmg:steel_casing'
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
  e.recipes.create.mechanical_crafting(
    Item.of('create:crushing_wheel', 2),
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
    Item.of('create:chute', 4),
    'create:iron_sheet',
    'minecraft:iron_ingot',
    'create:iron_sheet'
  )
  redefineMechanismRecipe('kubejs:precision_mechanism')(
    Item.of('create:smart_chute', 4),
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
    Item.of('create:smart_fluid_pipe', 2),
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
    Item.of('create:fluid_tank', 2),
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
    Item.of('create:item_drain', 2),
    'minecraft:iron_bars',
    'create:copper_casing',
    'minecraft:air'
  )
  redefineMechanismRecipe('kubejs:copper_mechanism')(
    Item.of('create:spout', 2),
    'minecraft:air',
    'create:copper_casing',
    'thermal:cured_rubber'
  )
  redefineMechanismRecipe('kubejs:copper_mechanism')(
    Item.of('create:portable_fluid_interface', 2),
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
  redefineMechanismRecipe('kubejs:andesite_mechanism')(
    'create:mechanical_roller',
    'create:electron_tube',
    'create:andesite_casing',
    'create:crushing_wheel'
  )
  redefineMechanismRecipe('create:precision_mechanism')(
    Item.of('create:mechanical_crafter', 2),
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
  // TODO: overhaul tesla coil and intermediate items

  ////////////////////
  // Create Jetpack //
  ////////////////////
  e.remove({ id: 'create_jetpack:jetpack' })
  e.recipes.create.mechanical_crafting(
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
  e.recipes.create.mechanical_crafting(
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

  ///////////////////////////////////
  // Create: The Factory Must Grow //
  ///////////////////////////////////
  e.replaceInput(
    {
      mod: 'tfmg',
    },
    'tfmg:aluminum_ingot',
    'tfmg:cast_iron_ingot'
  )
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
      material: 'cast_iron',
      ingot: 'createdeco:industrial_iron_ingot',
      sheet: 'createdeco:industrial_iron_sheet',
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

  ////////////////////////////////
  // Create Mechanical Extruder //
  ////////////////////////////////
  redefineMechanismRecipe('kubejs:steel_mechanism')(
    'create_mechanical_extruder:mechanical_extruder',
    'create:shaft',
    'create:mechanical_press',
    'create:andesite_casing'
  )
  e.remove({ mod: 'create_mechanical_extruder', output: 'minecraft:stone' })

  ///////////////////////////////////
  // Pneumaticcraft: Repressurized //
  ///////////////////////////////////
  const pneumaticcraftMapping = {
    '#forge:ingots/compressed_iron': 'tfmg:steel_ingot',
    'pneumaticcraft:compressed_iron_block': 'tfmg:steel_block',
    'pneumaticcraft:reinforced_brick_wall': 'tfmg:heavy_plate',
    'pneumaticcraft:reinforced_brick_slab': 'tfmg:steel_ingot',
    'pneumaticcraft:reinforced_stone_slab': 'tfmg:heavy_plate',
    'pneumaticcraft:compressed_iron_gear': 'thermal:iron_gear',
    'pneumaticcraft:logistics_core': 'kubejs:logistics_mechanism',
  }
  // Replace all recipes that used reinforced bricks or stone and make them
  // use steel and heavy plates. Replace all recipes with logistics cores with
  // logistics mechanisms.
  for (let [from, to] of Object.entries(pneumaticcraftMapping)) {
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
  const pneumaticcraftKeys = {
    S: 'tfmg:steel_ingot',
    H: 'tfmg:heavy_plate',
    M: 'tfmg:steel_mechanism',
    A: 'pneumaticcraft:advanced_pressure_tube',
    T: 'pneumaticcraft:pressure_tube',
  }
  redefineRecipe(
    'pneumaticcraft:advanced_air_compressor',
    [
      'HHH', //
      'HCA', //
      'SMS', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      C: 'pneumaticcraft:air_compressor',
    })
  )
  redefineRecipe(
    'pneumaticcraft:advanced_liquid_compressor',
    [
      'HHH', //
      'HCA', //
      'SMS', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      C: 'pneumaticcraft:liquid_compressor',
    })
  )
  // TODO (pneumaticcraft:advanced_pressure_tube)
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
      'HFT', //
      'SMS', //
    ],
    Object.assign({}, pneumaticcraftKeys, { F: 'minecraft:furnace' })
  )
  // TODO(pneumaticcraft:assembly_controller)
  // TODO(pneumaticcraft:assembly_drill)
  // TODO(pneumaticcraft:assembly_io_unit_export)
  // TODO(pneumaticcraft:assembly_io_unit_import)
  // TODO(pneumaticcraft:assembly_laser)
  // TODO(pneumaticcraft:assembly_platform)
  // TODO(pneumaticcraft:charging_station)
  redefineRecipe(
    Item.of('pneumaticcraft:heat_pipe', 6),
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
      ' C ', //
      'TFT', //
      'SMS', //
    ],
    Object.assign({}, pneumaticcraftKeys, {
      C: 'pneumaticcraft:air_compressor',
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
      C: '#forge:chests/wooden',
    })
  )
  // TODO(pneumaticcraft:capacitor)
  // TODO(pneumaticcraft:logistics_core)
  // TODO(pneumaticcraft:pneumatic_cylinder) requires lubricant
  redefineRecipe(
    'pneumaticcraft:pressure_gauge',
    [
      ' H ', //
      'HZH', //
      ' H ', //
    ],
    Object.assign({}, pneumaticcraftKeys, { Z: 'create:stressometer' })
  )
  redefineRecipe
  // TODO(pneumaticcraft:transistor)
  // TODO(pneumaticcraft:turbine_blade)

  // todo overhaul all recipes to require steel + steel mechs

  /////////////////////
  // Refined Storage //
  /////////////////////
  e.remove({ output: 'refinedstorage:machine_casing' })
  e.recipes.create.item_application('refinedstorage:machine_casing', [
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
})
