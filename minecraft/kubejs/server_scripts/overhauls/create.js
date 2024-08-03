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

  /**
   * IMPORTANT NOTE: const is broken inside statement blocks because of a bug in
   * Rhino.
   */
  ////////////////////////////////
  // Create Advanced Industries //
  ////////////////////////////////
  {
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
    e.replaceInput({}, 'create:brass_hand', 'kubejs:wooden_hand')

    // Iron oxide dust.
    create.splashing('kubejs:iron_oxide_dust', 'thermal:iron_dust')
    create
      .mixing('thermal:iron_dust', [
        'kubejs:iron_oxide_dust',
        '#minecraft:coals',
      ])
      .heated()
  }

  ////////////
  // Create //
  ////////////
  {
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
        M: COPPER_MECHANISM,
      }
    )
    redefineRecipe('create:belt_connector', ['RRR'], {
      R: 'thermal:cured_rubber',
    })
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:encased_fan',
      'create:shaft',
      'create:andesite_casing',
      'create:propeller'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:millstone',
      'create:cogwheel',
      'create:andesite_casing',
      '#forge:stone'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:mechanical_press',
      'create:shaft',
      'create:andesite_casing',
      'minecraft:iron_block'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:mechanical_mixer',
      'create:cogwheel',
      'create:andesite_casing',
      'create:whisk'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:weighted_ejector',
      'create:golden_sheet',
      'create:depot',
      'create:cogwheel'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      '4x create:chute',
      'create:iron_sheet',
      'minecraft:iron_ingot',
      'create:iron_sheet'
    )
    redefineMechanismRecipe(PRECISION_MECHANISM)(
      '4x create:smart_chute',
      'create:brass_sheet',
      'create:chute',
      'create:electron_tube'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:speedometer',
      'minecraft:compass',
      'create:andesite_casing',
      'minecraft:air'
    )
    redefineRecipe('create:mechanical_pump', [
      COPPER_MECHANISM,
      'create:cogwheel',
      'create:fluid_pipe',
    ])
    redefineMechanismRecipe(COPPER_MECHANISM)(
      '2x create:smart_fluid_pipe',
      'create:filter',
      'create:fluid_pipe',
      'minecraft:redstone_torch'
    )
    redefineRecipe('create:fluid_valve', [
      COPPER_MECHANISM,
      'create:fluid_pipe',
      'create:iron_sheet',
    ])
    redefineMechanismRecipe(COPPER_MECHANISM)(
      '2x create:fluid_tank',
      'create:copper_sheet',
      'minecraft:barrel',
      'create:copper_sheet'
    )
    redefineRecipe('create:hose_pulley', ['C', 'M', 'P'], {
      C: 'create:copper_casing',
      M: COPPER_MECHANISM,
      P: 'create:rope_pulley',
    })
    redefineMechanismRecipe(COPPER_MECHANISM)(
      '2x create:item_drain',
      'minecraft:iron_bars',
      'create:copper_casing',
      'minecraft:air'
    )
    redefineMechanismRecipe(COPPER_MECHANISM)(
      '2x create:spout',
      'minecraft:air',
      'create:copper_casing',
      'thermal:cured_rubber'
    )
    redefineMechanismRecipe(COPPER_MECHANISM)(
      '2x create:portable_fluid_interface',
      'create:chute',
      'create:copper_casing',
      'minecraft:air'
    )
    redefineMechanismRecipe(PRECISION_MECHANISM)(
      'create:steam_engine',
      'create:shaft',
      COPPER_MECHANISM,
      'minecraft:copper_block'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:mechanical_piston',
      '#minecraft:wooden_slabs',
      'create:andesite_casing',
      'create:piston_extension_pole'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:gantry_carriage',
      '#minecraft:wooden_slabs',
      'create:andesite_casing',
      'create:cogwheel'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:windmill_bearing',
      '#minecraft:wooden_slabs',
      '#forge:stone',
      'create:shaft'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:clockwork_bearing',
      '#minecraft:wooden_slabs',
      'create:brass_casing',
      'create:electron_tube'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:mechanical_bearing',
      '#minecraft:wooden_slabs',
      'create:andesite_casing',
      'create:shaft'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:rope_pulley',
      'create:andesite_casing',
      '#minecraft:wool',
      'create:iron_sheet'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
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
        M: KINETIC_MECHANISM,
      }
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:contraption_controls',
      '#minecraft:buttons',
      'create:andesite_casing',
      'create:electron_tube'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:mechanical_drill',
      'thermal:drill_head',
      'minecraft:iron_ingot',
      'create:andesite_casing'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:mechanical_saw',
      'thermal:saw_blade',
      'minecraft:iron_ingot',
      'create:andesite_casing'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:deployer',
      'create:shaft',
      'create:andesite_casing',
      'kubejs:wooden_hand'
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
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
        M: KINETIC_MECHANISM,
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
        M: KINETIC_MECHANISM,
        C: 'create:andesite_casing',
      }
    )
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'create:mechanical_roller',
      'create:electron_tube',
      'create:andesite_casing',
      'create:crushing_wheel'
    )
    redefineMechanismRecipe(PRECISION_MECHANISM)(
      '2x create:mechanical_crafter',
      'create:electron_tube',
      'create:brass_casing',
      'minecraft:crafting_table'
    )
    redefineRecipe('create:sequenced_gearshift', [
      'create:brass_casing',
      'create:cogwheel',
      'create:electron_tube',
      PRECISION_MECHANISM,
    ])
    redefineMechanismRecipe(PRECISION_MECHANISM)(
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
  }

  ///////////////////
  // CreateArmory //
  ///////////////////
  {
    e.remove({ id: 'createarmory:strengthened_brass_recipe' })
    e.remove({ id: 'createarmory:rocket_recipe' })
    create
      .SequencedAssembly('createarmory:barrel_part')
      .deploy('minecraft:gunpowder')
      .deploy('createarmory:impact_nade')
      .outputs('2x createarmory:rpg_rocket')
    e.remove({ id: 'createarmory:shotgun_shell_recipe' })
    create
      .SequencedAssembly(
        'create:brass_sheet',
        'createarmory:unfinished_shotgun_shell'
      )
      .deploy('minecraft:gunpowder')
      .deploy('minecraft:iron_nugget')
      .deploy('minecraft:iron_nugget')
      .outputs('8x createarmory:shotgun_shell')
    create
      .SequencedAssembly('create:iron_sheet')
      .deploy('minecraft:gunpowder')
      .fill(potionFluid('ars_nouveau:blasting_potion', 250))
      .deploy('minecraft:tripwire_hook')
      .outputs('8x createarmory:impact_nade')
    create
      .SequencedAssembly('create:iron_sheet')
      .deploy('minecraft:tnt')
      .deploy('minecraft:tripwire_hook')
      .outputs('4x createarmory:impact_nade')
    create
      .SequencedAssembly('create:iron_sheet')
      .deploy('minecraft:gunpowder')
      .deploy('kubejs:zinc_dust')
      .deploy('minecraft:gray_dye')
      .deploy('minecraft:tripwire_hook')
      .outputs('16x createarmory:smoke_nade')
    // Casings overhaul
    e.remove({ output: 'createarmory:nine_mm_casing' })
    e.remove({ output: 'createarmory:fifty_cal_casing' })
    e.remove({ output: 'createarmory:five_five_six_casing' })
    e.stonecutting('createarmory:nine_mm_casing', 'create:brass_sheet')
    e.stonecutting('createarmory:fifty_cal_casing', 'create:brass_sheet')
    e.stonecutting('createarmory:five_five_six_casing', 'create:brass_sheet')
    // Bullets overhaul
    e.remove({ id: 'createarmory:nine_mm_recipe' })
    create
      .SequencedAssembly(
        'createarmory:nine_mm_casing',
        'createarmory:unfinished_nine_mm'
      )
      .curve(CONVEX_CURVING_HEAD)
      .deploy('minecraft:gunpowder')
      .deploy('create:copper_nugget')
      .press()
      .outputs('16x createarmory:nine_mm', 16)
    e.remove({ id: 'createarmory:fifty_cal_recipe' })
    create
      .SequencedAssembly(
        'createarmory:fifty_cal_casing',
        'createarmory:unfinished_fifty_cal_casing'
      )
      .curve(CONVEX_CURVING_HEAD)
      .deploy('minecraft:gunpowder')
      .deploy('create:copper_nugget')
      .press()
      .outputs('16x createarmory:fifty_cal')
    e.remove({ id: 'createarmory:five_five_six_recipe' })
    create
      .SequencedAssembly(
        'createarmory:five_five_six_casing',
        'createarmory:unfinished_five_five_six_casing'
      )
      .curve(CONVEX_CURVING_HEAD)
      .deploy('minecraft:gunpowder')
      .deploy('create:copper_nugget')
      .press()
      .outputs('16x createarmory:five_five_six')

    e.remove({ id: 'createarmory:barrel_part_recipe' })
    create.turning(
      [
        'createarmory:barrel_part',
        Item.of('kubejs:steel_dust').withChance(0.5),
      ],
      'tfmg:steel_ingot'
    )
  }

  /////////////////////////////
  // Create: Balanced Flight //
  /////////////////////////////
  {
    e.remove({ id: 'balancedflight:sequenced_assembly/flight_anchor' })
    create
      .SequencedAssembly('minecraft:beacon')
      .deploy(VIBRATION_MECHANISM)
      .deploy('create_connected:brass_gearbox')
      .fill(potionFluid('apotheosis:extra_long_flying', 1000))
      .energize(10000000)
      .outputs('balancedflight:flight_anchor')

    e.remove({ id: 'create:mechanical_crafting/ascended_flight_ring' })
    create
      .SequencedAssembly('ars_nouveau:jump_ring')
      .deploy(VIBRATION_MECHANISM)
      .fill(potionFluid('apotheosis:extra_long_flying', 1000))
      .fill(Fluid.of('kubejs:molten_gold', 1000))
      .energize(1000000)
      .loops(4)
      .outputs('balancedflight:ascended_flight_ring')
  }

  ///////////////////////////////
  // Create Crafts & Additions //
  ///////////////////////////////
  {
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
        M: KINETIC_MECHANISM,
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
        M: PRECISION_MECHANISM,
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
        B: 'thermal:electrum_block',
      }
    )
    redefineMechanismRecipe(PRECISION_MECHANISM)(
      'createaddition:portable_energy_interface',
      'create_new_age:copper_wire',
      'create:brass_casing',
      'minecraft:air'
    )
  }

  ///////////////////////
  // Create: Connected //
  ///////////////////////
  // This is cut from the redstone mechanism instead.
  e.remove({
    id: 'create_connected:crafting/kinetics/sequenced_pulse_generator',
  })
  // Convenience recipes for vertical gearboxes.
  e.shapeless('create_connected:vertical_parallel_gearbox', [
    'create:vertical_gearbox',
    'create:large_cogwheel',
  ])
  e.shapeless('create_connected:vertical_six_way_gearbox', [
    'create:vertical_gearbox',
    'create:large_cogwheel',
    'create:large_cogwheel',
  ])
  e.shapeless('create_connected:vertical_six_way_gearbox', [
    'create_connected:vertical_parallel_gearbox',
    'create:large_cogwheel',
  ])

  /////////////////////
  // Create: Encased //
  /////////////////////
  {
    let casingMap = {
      'createcasing:brass_mixer': 'create:brass_casing',
      'createcasing:copper_mixer': 'create:copper_casing',
      'createcasing:railway_mixer': 'create:railway_casing',
      'createcasing:industrial_iron_mixer': 'create:industrial_iron_block',
    }
    for (const [machine, casing] of Object.entries(casingMap)) {
      redefineMechanismRecipe(KINETIC_MECHANISM)(
        machine,
        'create:cogwheel',
        casing,
        'create:whisk'
      )
    }
    casingMap = {
      'createcasing:brass_press': 'create:brass_casing',
      'createcasing:copper_press': 'create:copper_casing',
      'createcasing:railway_press': 'create:railway_casing',
      'createcasing:industrial_iron_press': 'create:industrial_iron_block',
    }
    for (const [machine, casing] of Object.entries(casingMap)) {
      redefineMechanismRecipe(KINETIC_MECHANISM)(
        machine,
        'create:shaft',
        casing,
        'minecraft:iron_block'
      )
    }

    // Remove all crafting recipes for wooden shafts and only allow them to be
    // lathed.
    e.forEachRecipe(
      { mod: 'createcasing', output: /^createcasing:.*_shaft$/ },
      (r) => {
        const ingredients = r.originalRecipeIngredients
        if (ingredients.size() < 2) {
          return
        }
        r.remove()
        const log = r.originalRecipeIngredients[1].asIngredient().first.id
        create.turning(
          [r.originalRecipeResult, Item.of('thermal:sawdust').withChance(0.5)],
          log
        )
      }
    )
    // TODO chorium ingot might be useful?
  }

  //////////////////////////////////
  // Create: Enchantment Industry //
  //////////////////////////////////
  {
    redefineRecipe('create_enchantment_industry:disenchanter', ['S', 'D'], {
      S: '#create:sandpaper',
      D: 'create:item_drain',
    })
    redefineRecipe('create_enchantment_industry:printer', ['C', 'M', 'P'], {
      C: 'create:copper_casing',
      M: COPPER_MECHANISM,
      P: 'create:mechanical_press',
    })
  }

  ////////////////////
  // Create Jetpack //
  ////////////////////
  {
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
        P: PRECISION_MECHANISM,
        T: 'create:copper_backtank',
        C: 'create:chute',
        S: STEEL_MECHANISM,
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
        M: STEEL_MECHANISM,
        P: 'create:netherite_backtank',
        C: 'create:smart_chute',
        J: 'create_jetpack:jetpack',
      }
    )
  }

  ////////////////////////////////
  // Create Mechanical Extruder //
  ////////////////////////////////
  {
    redefineMechanismRecipe(STEEL_MECHANISM)(
      'create_mechanical_extruder:mechanical_extruder',
      'create:shaft',
      'create:mechanical_press',
      'create:andesite_casing'
    )
    e.remove({ mod: 'create_mechanical_extruder', output: 'minecraft:stone' })
    // Cannot use tags here, recipe ends up not working, so we are manually
    // creating all the recipe combinations for cobblegen.
    let equivalentWaterBlocks = [
      Fluid.water(1000),
      'minecraft:packed_ice',
      'create_connected:fan_splashing_catalyst',
    ]
    let equivalentLavaBlocks = [
      Fluid.lava(1000),
      'create_connected:fan_blasting_catalyst',
    ]
    let cobblegens = {
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
      create.extruding('create:limestone', [
        Fluid.of('create:honey', 1000),
        lava,
      ])
    }
  }

  /////////////////////
  // Create: New Age //
  /////////////////////
  {
    let createNewAgeKeys = {
      S: 'create:shaft',
      E: 'create_new_age:electrical_connector',
      L: 'minecraft:lightning_rod',
      H: 'tfmg:heavy_plate',
      C: 'tfmg:heavy_machinery_casing',
      I: 'tfmg:steel_ingot',
      M: STEEL_MECHANISM,
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
    redefineRecipe(
      'create_new_age:electrical_connector',
      [
        'CNC', //
        'HHH', //
      ],
      Object.assign({}, createNewAgeKeys, {
        C: 'create_new_age:copper_wire',
        N: 'thermal:electrum_nugget',
      })
    )
    create
      .SequencedAssembly('tfmg:heavy_plate')
      .deploy('thermal:electrum_nugget')
      .deploy('create_new_age:copper_wire')
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
  }

  ////////////////////////////
  // Create: Slice and Dice //
  ////////////////////////////
  {
    redefineMechanismRecipe(KINETIC_MECHANISM)(
      'sliceanddice:slicer',
      'create:cogwheel',
      'create:andesite_casing',
      'create:turntable'
    )
  }

  ////////////////////////
  // Create Teleporters //
  ////////////////////////

  ///////////////////////////////////
  // Create: The Factory Must Grow //
  ///////////////////////////////////
  {
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
        M: STEEL_MECHANISM,
      }
    )

    // Replace pumpjack components that require aluminum with heavy plates.
    e.replaceInput(
      { output: /^tfmg:pumpjack.*$/, input: 'tfmg:aluminum_ingot' },
      'tfmg:aluminum_ingot',
      'tfmg:heavy_plate'
    )

    // Make pipes require a sheet
    let redefinePipeRecipe = (output, ingot, sheet) => {
      e.remove({ output: output })
      const keys = {
        I: ingot,
        S: sheet,
      }
      e.shaped(output, ['SIS'], keys)
      e.shaped(output, ['I', 'S', 'I'], keys)
    }
    let aestheticPipeReplacements = [
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
      {
        material: 'aluminum',
        ingot: 'tfmg:aluminum_ingot',
        sheet: 'vintageimprovements:aluminum_sheet',
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

    // Steel fluid tanks and pumpjack components
    redefineRecipe(
      'tfmg:steel_fluid_tank',
      [
        'H', //
        'T', //
        'H', //
      ],
      { H: 'tfmg:heavy_plate', T: 'create:fluid_tank' }
    )
    redefineRecipe(
      'tfmg:pumpjack_crank',
      [
        'H H', //
        'RIR', //
      ],
      { H: 'tfmg:heavy_plate', R: 'tfmg:rebar', I: 'tfmg:machine_input' }
    )
    e.replaceInput({ mod: 'tfmg' }, 'tfmg:slag', 'thermal:slag')
    e.replaceOutput({ mod: 'tfmg' }, 'tfmg:slag', 'thermal:slag')

    // Thermite powder
    e.remove({ id: 'tfmg:compacting/thermite_powder' })
    e.shapeless('tfmg:thermite_powder', [
      'kubejs:aluminum_dust',
      'kubejs:iron_oxide_dust',
    ])

    // Thermite grenade.
    redefineRecipe('tfmg:thermite_grenade', [
      'createarmory:impact_nade',
      'tfmg:thermite_powder',
    ])
    // Zinc grenade.
    redefineRecipe('tfmg:zinc_grenade', [
      'createarmory:impact_nade',
      'kubejs:zinc_dust',
    ])
    // Copper grenade.
    redefineRecipe('tfmg:copper_grenade', [
      'createarmory:impact_nade',
      'thermal:copper_dust',
    ])

    // TODO: add efficient liquid concrete overhaul + cement
  }

  //////////////////////
  // Create Utilities //
  //////////////////////
  {
    create.polishing(
      'createutilities:polished_amethyst',
      'minecraft:amethyst_shard',
      POLISHING_HIGH_SPEED
    )
    let createUtilitiesKeys = {
      V: 'createutilities:void_steel_ingot',
      S: 'createutilities:void_steel_sheet',
      C: 'createutilities:void_casing',
      G: 'createutilities:graviton_tube',
      Q: QUANTUM_MECHANISM,
    }
    redefineRecipe(
      'createutilities:void_motor',
      [
        'VGV', //
        'QMQ', //
        'VCV', //
      ],
      Object.assign({}, createUtilitiesKeys, {
        M: 'create_new_age:reinforced_motor',
      })
    )
    redefineRecipe(
      'createutilities:void_chest',
      [
        'VGV', //
        'QEQ', //
        'VCV', //
      ],
      Object.assign({}, createUtilitiesKeys, { E: 'minecraft:ender_chest' })
    )
    redefineRecipe(
      'createutilities:void_tank',
      [
        'VGV', //
        'QTQ', //
        'VCV', //
      ],
      Object.assign({}, createUtilitiesKeys, { T: 'create:fluid_tank' })
    )
    redefineRecipe(
      'createutilities:void_battery',
      [
        'VGV', //
        'QBQ', //
        'VCV', //
      ],
      Object.assign({}, createUtilitiesKeys, {
        B: 'createaddition:modular_accumulator',
      })
    )
  }

  //////////////////////////////////
  // Create: Vintage Improvements //
  //////////////////////////////////
  {
    redefineMechanismRecipe(KINETIC_MECHANISM)(
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
        M: STEEL_MECHANISM,
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
        M: STEEL_MECHANISM,
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
    redefineMechanismRecipe(KINETIC_MECHANISM)(
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
        M: PRECISION_MECHANISM,
        P: 'create:iron_sheet',
      }
    )
    redefineRecipe(
      'vintageimprovements:laser',
      [
        'CSC', //
        'NMN', //
        ' L ', //
      ],
      {
        C: 'create:brass_casing',
        S: 'create:shaft',
        N: 'create_new_age:electrical_connector',
        M: STEEL_MECHANISM,
        L: 'vintageimprovements:laser_item',
      }
    )
    redefineRecipe(
      'vintageimprovements:grinder_belt',
      [
        'SSS', //
        'SBS', //
        'SSS', //
      ],
      { S: '#create:sandpaper', B: 'create:mechanical_belt' }
    )
    redefineRecipe(
      'vintageimprovements:laser_item',
      [
        'HGH', //
        'HEH', //
        'HDH', //
      ],
      {
        H: 'tfmg:heavy_plate',
        G: 'minecraft:red_stained_glass',
        E: 'create:electron_tube',
        D: 'minecraft:glowstone_dust',
      }
    )

    // Curving heads are made from steel on the lathe.
    e.remove({ id: 'vintageimprovements:turning/convex_curving_head' })
    e.remove({ id: 'vintageimprovements:turning/concave_curving_head' })
    create.turning(
      [
        'vintageimprovements:concave_curving_head',
        Item.of('kubejs:steel_dust').withChance(0.5),
      ],
      'tfmg:steel_block'
    )
    create.turning(
      [
        'vintageimprovements:convex_curving_head',
        Item.of('kubejs:steel_dust').withChance(0.5),
      ],
      'tfmg:steel_block'
    )

    // Consolidate recipe categories
    e.remove({ id: 'vintageimprovements:curving/diamond' })

    // Manually add curving recipes that are desired
    // Any sequenced assembly recipes that curve an iron sheet may conflict
    // with the default bucket recipe.
    create
      .curving('minecraft:glass_bottle', 'minecraft:glass')
      .mode(CONVEX_CURVING_HEAD)
    create
      .curving('minecraft:bowl', '#minecraft:planks')
      .mode(CONVEX_CURVING_HEAD)
    create
      .curving('minecraft:flower_pot', 'minecraft:brick')
      .mode(CONVEX_CURVING_HEAD)
  }
})
