// priority: 500
// Recipe overhauls for the Thermal Series mods

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

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
  // TODO thermal:centrifugal_separator
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
  redefineRecipe(
    'thermal:device_tree_extractor',
    [
      'PGP', //
      'NBN', //
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

  // Replace Thermal Creosote with TFMG Creosote
  e.replaceOutput(
    { mod: 'thermal' },
    Fluid.of('thermal:creosote'),
    Fluid.of('tfmg:creosote')
  )

  // Overhaul Thermal Crystallizer recipes
  e.remove({ id: /^thermal:machines\/crystallizer\/crystallizer_.*$/ })
  const crystallizerFromTo = {
    'thermal:sulfur_dust': 'thermal:sulfur',
    'thermal:quartz_dust': 'minecraft:quartz',
    // 'thermal:apatite_dust': 'thermal:apatite', what to do with this?
    'thermal:cinnabar_dust': 'thermal:cinnabar',
    'thermal:emerald_dust': 'minecraft:emerald',
    'thermal:niter_dust': 'thermal:niter',
    'thermal:lapis_dust': 'minecraft:lapis',
    'thermal:diamond_dust': 'minecraft:diamond',
  }
  for (let [from, to] of Object.entries(crystallizerFromTo)) {
    e.recipes.thermal.crystallizer(to, [
      from,
      Fluid.of('kubejs:crystal_growth_accelerator', 250),
    ])
  }

  // Allow rubberwood to be centrifuged into latex.
  create
    .centrifuging(
      [Fluid.of('thermal:latex', 250), '4x thermal:sawdust'],
      'thermal:rubberwood_log'
    )
    .minimalRPM(128)
    .processingTime(20)
})
