// priority: 500
// Recipe overhauls for PneumaticCraft: Repressurized and Compressed Creativity

LootJS.modifiers((e) => {
  // Remove compressed iron from random chest loot.
  e.addLootTypeModifier(LootType.CHEST).removeLoot(
    Item.of('pneumaticcraft:ingot_iron_compressed')
  )
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)

  ///////////////////////////
  // Compressed Creativity //
  ///////////////////////////
  e.replaceInput(
    {
      mod: 'compressedcreativity',
    },
    'pneumaticcraft:ingot_iron_compressed',
    'tfmg:steel_ingot'
  )
  const compressedCreativityKeys = {
    P: 'create:copper_sheet',
    S: 'create:shaft',
    H: 'tfmg:heavy_plate',
    B: 'tfmg:steel_bars',
    I: 'tfmg:steel_ingot',
    M: STEEL_MECHANISM,
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
    'pneumaticcraft:logistics_core': LOGISTICS_MECHANISM,
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
  // PneumaticCraft manual
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
    M: STEEL_MECHANISM,
    A: 'pneumaticcraft:advanced_pressure_tube',
    L: 'pneumaticcraft:plastic',
    N: 'pneumaticcraft:pneumatic_cylinder',
    T: 'pneumaticcraft:pressure_tube',
    P: 'pneumaticcraft:printed_circuit_board',
    O: 'tfmg:gray_concrete_slab',
  }
  // The advanced compressors require custom registration in order to preserve
  // the nbt data in the ingredient compressor.
  e.remove({ output: 'pneumaticcraft:advanced_air_compressor' })
  pneumaticcraft.compressor_upgrade_crafting(
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
  pneumaticcraft.compressor_upgrade_crafting(
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
    .thermo_plant()
    .fluid_input(Fluid.of('tfmg:molten_steel', 90))
    .item_input('pneumaticcraft:reinforced_pressure_tube')
    .item_output('pneumaticcraft:advanced_pressure_tube')
    .pressure(9.5)
    // Requires 10bar pressure to reach or a superheated blaze
    .temperature({ min_temp: 273 + 900 })
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
      'OMO', //
    ],
    pneumaticcraftKeys
  )
  redefineRecipe(
    'pneumaticcraft:assembly_drill',
    [
      'DNN', //
      '  N', //
      'OPO', //
    ],
    Object.assign({}, pneumaticcraftKeys, { D: 'thermal:drill_head' })
  )
  e.replaceInput(
    { id: /^pneumaticcraft:assembly_io_unit_(im|ex)port$/ },
    'tfmg:steel_ingot',
    'tfmg:gray_concrete_slab'
  )
  redefineRecipe(
    'pneumaticcraft:assembly_laser',
    [
      'LNN', //
      '  N', //
      'OPO',
    ],
    Object.assign({}, pneumaticcraftKeys, {
      L: 'vintageimprovements:laser_item',
    })
  )
  redefineRecipe(
    'pneumaticcraft:assembly_platform',
    [
      'NDN', //
      'LLL', //
      'OPO', //
    ],
    Object.assign({}, pneumaticcraftKeys, { D: 'create:depot' })
  )
  redefineRecipe(
    'pneumaticcraft:charging_station',
    [
      '   ', //
      'TDT', //
      'HPH', //
    ],
    Object.assign({}, pneumaticcraftKeys, { D: 'create:depot' })
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
      M: LOGISTICS_MECHANISM,
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
  create
    .turning(
      [
        '4x pneumaticcraft:pressure_tube',
        Item.of('kubejs:steel_dust').withChance(0.5),
      ],
      'tfmg:steel_ingot'
    )
    .processingTime(40)
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
    Object.assign({}, pneumaticcraftKeys, { O: 'pneumaticcraft:solar_cell' })
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
  e.remove({ id: 'pneumaticcraft:minigun' })
  pneumaticcraft.crafting_shaped_pressurizable(
    'pneumaticcraft:minigun',
    [
      'HMH', //
      'A  ', //
    ],
    {
      H: 'tfmg:heavy_plate',
      M: 'createarmory:upgraded_mini_gun',
      A: 'pneumaticcraft:air_canister',
    }
  )
  // Overhaul pneumatic armor to derive from netherite armor
  for (const equip of ['boots', 'chestplate', 'helmet', 'leggings']) {
    e.replaceInput(
      `pneumaticcraft:pneumatic_${equip}`,
      `pneumaticcraft:compressed_iron_${equip}`,
      `minecraft:netherite_${equip}`
    )
  }
  redefineRecipe('pneumaticcraft:transfer_gadget', [
    LOGISTICS_MECHANISM,
    'minecraft:hopper',
  ])
  // Minigun ammo manufacturing
  e.remove({ id: 'pneumaticcraft:gun_ammo' })
  create
    .SequencedAssembly('tfmg:heavy_plate')
    .deploy('createarmory:nine_mm')
    .loops(32)
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

  // Alternative lathing recipe for the cannon barrel.
  create
    .turning(
      [
        '2x pneumaticcraft:cannon_barrel',
        Item.of('kubejs:steel_dust').withChance(0.5),
      ],
      'tfmg:steel_block'
    )
    .processingTime(40)

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
    .cut()
    .outputs('2x pneumaticcraft:turbine_blade')
})
