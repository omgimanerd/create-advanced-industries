// priority: 500
// Recipe overhauls for storage and logistics mods

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  const redefineRecipe = redefineRecipe_(e)

  ////////////////////////
  // Functional Storage //
  ////////////////////////
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
    'create:precision_mechanism'
  )
  redefineRecipe(
    'functionalstorage:framed_storage_controller',
    [
      'NNN', //
      'NCN', //
      'NNN', //
    ],
    {
      N: 'minecraft:iron_nugget',
      C: 'functionalstorage:storage_controller',
    }
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
    {
      N: 'minecraft:iron_nugget',
      C: 'functionalstorage:controller_extension',
    }
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
      M: 'createteleporters:quantum_mechanism',
      D: '#functionalstorage:drawer',
    }
  )
  e.replaceInput(
    [
      {
        id: 'functionalstorage:collector_upgrade',
      },
      {
        id: 'functionalstorage:pusher_upgrade',
      },
      {
        id: 'functionalstorage:puller_upgrade',
      },
    ],
    'minecraft:redstone',
    'create:precision_mechanism'
  )

  /////////////////////
  // Refined Storage //
  /////////////////////
  const commonRefinedStorageKeys = {
    Q: 'refinedstorage:quartz_enriched_iron',
    B: 'refinedstorage:basic_processor',
    G: 'refinedstorage:improved_processor',
    M: 'kubejs:logistics_mechanism',
    L: '#minecraft:glass',
    R: 'minecraft:redstone',
  }
  e.replaceInput(
    {
      mod: 'refinedstorage',
    },
    'refinedstorage:silicon',
    'kubejs:silicon_wafer'
  )
  redefineRecipe(
    '2x refinedstorage:construction_core',
    [
      ' G ', //
      'BMB', //
      ' G ', //
    ],
    Object.assign({}, commonRefinedStorageKeys, {
      G: 'minecraft:glowstone_dust',
    })
  )
  redefineRecipe(
    '2x refinedstorage:destruction_core',
    [
      ' E ', //
      'BMB', //
      ' E ', //
    ],
    Object.assign({}, commonRefinedStorageKeys, {
      E: 'create:electron_tube',
    })
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
    'kubejs:logistics_mechanism'
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
  e.remove({ output: 'refinedstorage:machine_casing' })
  create.item_application('refinedstorage:machine_casing', [
    'tfmg:steel_casing',
    'refinedstorage:quartz_enriched_iron',
  ])
  e.replaceInput(
    [
      {
        id: 'refinedstorage:cable',
      },
      {
        id: 'refinedstorage:interface',
      },
      {
        id: 'refinedstorage:constructor',
      },
      {
        id: 'refinedstorage:destructor',
      },
    ],
    'minecraft:redstone',
    'kubejs:logistics_mechanism'
  )
  e.replaceInput(
    {
      id: 'refinedstorage:controller',
    },
    'kubejs:silicon_wafer',
    'kubejs:logistics_mechanism'
  )

  //////////////////
  // ExtraStorage //
  //////////////////
  e.replaceInput(
    {
      id: /^extrastorage:part\/storagepart_[0-9]+k(_fluid){0,1}$/,
    },
    'minecraft:redstone',
    'kubejs:logistics_mechanism'
  )
  e.remove({ id: 'extrastorage:raw_neural_processor' })
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_ingot')
    .deploy('createutilities:polished_amethyst')
    .outputs('extrastorage:raw_neural_processor')
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .fill(Fluid.of('create_things_and_misc:slime', 5))
    .deploy('morered:red_alloy_ingot')
    .deploy('createutilities:polished_amethyst')
    .outputs('extrastorage:raw_neural_processor')
  e.remove({ id: 'extrastorage:neural_processor' })
  pneumaticcraft.assembly_laser(
    'extrastorage:raw_neural_processor',
    'extrastorage:neural_processor'
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
      M: 'createteleporters:quantum_mechanism',
      R: 'refinedstorage:range_upgrade',
      N: 'thermal:enderium_ingot',
    }
  )
  // TODO gate behind quantum mechanism
  e.remove({ id: 'rsinfinitybooster:dimension_card' })

  //////////////////
  // RSRequestify //
  //////////////////
  e.replaceInput(
    { id: 'rsrequestify:requester' },
    'minecraft:redstone',
    'kubejs:logistics_mechanism'
  )

  //////////////////////////////
  // Tom's Simple Storage Mod //
  //////////////////////////////
  e.replaceInput(
    {
      mod: 'toms_storage',
    },
    'minecraft:comparator',
    'create:precision_mechanism'
  )
  e.replaceInput(
    {
      mod: 'toms_storage',
    },
    '#minecraft:trapdoors',
    'create:brass_ingot'
  )
  e.replaceInput(
    {
      mod: 'toms_storage',
    },
    'minecraft:quartz',
    'create:electron_tube'
  )
  e.replaceInput(
    {
      id: 'toms_storage:inventory_cable_connector',
    },
    'minecraft:quartz',
    'create:precision_mechanism'
  )
  // TODO gate behind quantum mechanism
  e.remove({ id: 'toms_storage:adv_wireless_terminal' })
  e.replaceInput(
    { id: 'toms_storage:tag_item_filter' },
    'minecraft:name_tag',
    'create:attribute_filter'
  )
})
