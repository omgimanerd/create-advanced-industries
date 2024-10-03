// priority: 500
// Recipe overhauls for storage and logistics mods

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  const redefineRecipe = redefineRecipe_(e)

  ////////////////////////
  // Functional Storage //
  ////////////////////////
  // Fluid drawers should depend on Create fluid tanks.
  e.replaceInput(
    {
      mod: 'functionalstorage',
      id: /^functionalstorage:fluid_[0-9]{1}$/,
    },
    'minecraft:bucket',
    'create:fluid_tank'
  )
  // Remove woodless functional storage crafting recipes.
  e.remove({ id: /^functionalstorage:.*alternate.*$/ })
  e.replaceInput(
    [
      {
        id: 'functionalstorage:armory_cabinet',
      },
      { id: 'functionalstorage:storage_controller' },
    ],
    'minecraft:comparator',
    PRECISION_MECHANISM
  )
  redefineRecipe(
    'functionalstorage:framed_storage_controller',
    [
      'NNN', //
      'NCN', //
      'NNN', //
    ],
    { N: 'minecraft:iron_nugget', C: 'functionalstorage:storage_controller' }
  )
  redefineRecipe('functionalstorage:controller_extension', [
    'functionalstorage:storage_controller',
  ])
  redefineRecipe(
    'functionalstorage:framed_controller_extension',
    [
      'NNN', //
      'NCN', //
      'NNN', //
    ],
    { N: 'minecraft:iron_nugget', C: 'functionalstorage:controller_extension' }
  )
  redefineRecipe(
    'functionalstorage:ender_drawer',
    [
      'PPP', //
      'MDM', //
      'PPP', //
    ],
    {
      P: '#minecraft:planks',
      M: QUANTUM_MECHANISM,
      D: '#functionalstorage:drawer',
    }
  )
  e.replaceInput(
    [
      { id: 'functionalstorage:collector_upgrade' },
      { id: 'functionalstorage:pusher_upgrade' },
      { id: 'functionalstorage:puller_upgrade' },
    ],
    'minecraft:redstone',
    PRECISION_MECHANISM
  )

  /////////////////////
  // Refined Storage //
  /////////////////////
  const commonRefinedStorageKeys = {
    Q: 'refinedstorage:quartz_enriched_iron',
    B: 'refinedstorage:basic_processor',
    G: 'refinedstorage:improved_processor',
    M: LOGISTICS_MECHANISM,
    L: '#forge:glass',
    R: 'minecraft:redstone',
  }
  e.replaceInput(
    { mod: 'refinedstorage' },
    'refinedstorage:silicon',
    'kubejs:silicon_wafer'
  )
  redefineRecipe(
    '2x refinedstorage:construction_core',
    [
      ' C ', //
      'BMB', //
      ' C ', //
    ],
    Object.assign({}, commonRefinedStorageKeys, {
      C: 'pneumaticcraft:capacitor',
    })
  )
  redefineRecipe(
    '2x refinedstorage:destruction_core',
    [
      ' E ', //
      'BMB', //
      ' E ', //
    ],
    Object.assign({}, commonRefinedStorageKeys, { E: 'create:electron_tube' })
  )
  e.remove({ id: 'refinedstorage:quartz_enriched_iron' })
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.of('kubejs:molten_quartz', 90))
    .item_input('minecraft:iron_ingot')
    .item_output('2x refinedstorage:quartz_enriched_iron')
    .pressure(8)
    .temperature({ min_temp: 273 + 300 })
  create
    .pressurizing('minecraft:iron_ingot')
    .secondaryFluidInput(Fluid.of('kubejs:molten_quartz', 90))
    .superheated()
    .outputs('2x refinedstorage:quartz_enriched_iron')
  e.replaceInput(
    {
      mod: 'refinedstorage',
      id: /^refinedstorage:[0-9]+k(fluid_){0,1}_storage_part$/,
    },
    'minecraft:redstone',
    LOGISTICS_MECHANISM
  )
  redefineRecipe(
    '2x refinedstorage:upgrade',
    [
      'QLQ', //
      'GMG', //
      'QLQ', //
    ],
    commonRefinedStorageKeys
  )
  redefineRecipe(
    'refinedstorage:pattern',
    [
      'GRG', //
      'RGR', //
      'QMQ', //
    ],
    commonRefinedStorageKeys
  )
  e.replaceInput(
    { id: 'refinedstorage:range_upgrade' },
    'minecraft:ender_pearl',
    QUANTUM_MECHANISM
  )
  e.replaceInput(
    { id: 'refinedstorage:crafting_upgrade' },
    'minecraft:crafting_table',
    'create:mechanical_crafter'
  )
  e.replaceInput(
    { id: 'refinedstorage:regulator_upgrade' },
    'minecraft:redstone_dust',
    REDSTONE_MECHANISM
  )
  e.remove({ output: 'refinedstorage:machine_casing' })
  create.item_application('refinedstorage:machine_casing', [
    'tfmg:steel_casing',
    'refinedstorage:quartz_enriched_iron',
  ])
  e.replaceInput(
    [
      { id: 'refinedstorage:cable' },
      { id: 'refinedstorage:interface' },
      { id: 'refinedstorage:constructor' },
      { id: 'refinedstorage:destructor' },
    ],
    'minecraft:redstone',
    LOGISTICS_MECHANISM
  )
  e.replaceInput(
    { id: 'refinedstorage:controller' },
    'kubejs:silicon_wafer',
    LOGISTICS_MECHANISM
  )

  //////////////////
  // ExtraStorage //
  //////////////////
  e.replaceInput(
    { id: /^extrastorage:part\/storagepart_[0-9]+k(_fluid){0,1}$/ },
    'minecraft:redstone',
    LOGISTICS_MECHANISM
  )

  ///////////////////////
  // RSInfinityBooster //
  ///////////////////////
  redefineRecipe(
    'rsinfinitybooster:infinity_card',
    [
      'EME', //
      'MRM', //
      'NNN', //
    ],
    {
      E: 'kubejs:resonant_ender_pearl',
      M: QUANTUM_MECHANISM,
      R: 'refinedstorage:range_upgrade',
      N: 'thermal:enderium_ingot',
    }
  )
  redefineRecipe(
    'rsinfinitybooster:dimension_card',
    [
      'UQU', //
      'QSQ', //
      'UQU', //
    ],
    {
      U: 'rsinfinitybooster:infinity_card',
      Q: QUANTUM_MECHANISM,
      S: 'minecraft:nether_star',
    }
  )

  //////////////////
  // RSRequestify //
  //////////////////
  e.replaceInput(
    { id: 'rsrequestify:requester' },
    'minecraft:redstone',
    LOGISTICS_MECHANISM
  )

  //////////////////////////////
  // Tom's Simple Storage Mod //
  //////////////////////////////
  e.replaceInput(
    { mod: 'toms_storage' },
    'minecraft:comparator',
    PRECISION_MECHANISM
  )
  e.replaceInput(
    { mod: 'toms_storage' },
    '#minecraft:trapdoors',
    'create:brass_ingot'
  )
  e.replaceInput(
    { mod: 'toms_storage' },
    'minecraft:quartz',
    'create:electron_tube'
  )
  e.replaceInput(
    { id: 'toms_storage:inventory_cable_connector' },
    'minecraft:quartz',
    PRECISION_MECHANISM
  )
  e.remove({ id: 'toms_storage:adv_wireless_terminal' })
  e.shaped(
    'toms_storage:ts.adv_wireless_terminal',
    [
      'SSS', //
      'MTM', //
      'SQS', //
    ],
    {
      S: '#forge:plates/netherite',
      M: LOGISTICS_MECHANISM,
      T: 'toms_storage:ts.wireless_terminal',
      Q: QUANTUM_MECHANISM,
    }
  )
  e.replaceInput(
    { id: 'toms_storage:tag_item_filter' },
    'minecraft:name_tag',
    'create:attribute_filter'
  )
})
