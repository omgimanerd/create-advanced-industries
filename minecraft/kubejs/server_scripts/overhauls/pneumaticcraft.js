// priority: 500
// Recipe overhauls for PneumaticCraft: Repressurized and Compressed Creativity

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)

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
})
