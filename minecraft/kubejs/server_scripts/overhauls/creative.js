// priority: 500
// Recipes using the Creative Mechanism

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  /**
   * Helper to register a shaped recipe for a creative item that is the simple
   * form of surrounding the base item with creative mechanisms.
   * @param {InputItem_} output
   * @param {OutputItem_} input
   */
  const wrappedCreativeRecipe = (output, input) => {
    e.shaped(
      output,
      [
        'MMM', //
        'MIM', //
        'MMM', //
      ],
      { M: CREATIVE_MECHANISM, I: input }
    )
  }

  // Creative Spellbook
  e.recipes.ars_nouveau.enchanting_apparatus(
    Array(8).fill(CREATIVE_MECHANISM),
    'ars_nouveau:archmage_spell_book',
    'ars_nouveau:creative_spell_book',
    24000,
    true
  )

  // Creative Source Jar
  e.recipes.ars_nouveau.enchanting_apparatus(
    Array(8).fill(CREATIVE_MECHANISM),
    'ars_nouveau:source_jar',
    'ars_nouveau:creative_source_jar',
    24000
  )

  // Creative Upgrade Smithing Template
  e.shaped(
    'kubejs:creative_upgrade_smithing_template',
    [
      'PMP', //
      'PTP', //
      'PPP', //
    ],
    {
      P: 'vintageimprovements:shadow_steel_sheet',
      M: CREATIVE_MECHANISM,
      T: 'minecraft:netherite_upgrade_smithing_template',
    }
  )

  // Creative Building Wand
  e.smithing(
    'wands:creative_wand',
    'kubejs:creative_upgrade_smithing_template',
    'wands:netherite_wand',
    CREATIVE_MECHANISM
  )

  // Creative Worldshaper
  create.mechanical_crafting(
    'create:handheld_worldshaper',
    [
      '  SSS', //
      'MCB  ', //
      'I SSS', //
    ],
    {
      S: 'tfmg:steel_ingot',
      M: 'create:creative_motor',
      C: 'create:creative_crate',
      B: 'minecraft:beacon',
      I: 'createcasing:chorium_ingot',
    }
  )

  // Creative Motor
  wrappedCreativeRecipe('create:creative_motor', 'createutilities:void_motor')

  // Creative Tank / Fluid Vessel
  wrappedCreativeRecipe('create:creative_fluid_tank', 'create:fluid_tank')
  wrappedCreativeRecipe(
    'create_connected:creative_fluid_vessel',
    'create_connected:fluid_vessel'
  )
  e.shapeless(
    'create:creative_fluid_tank',
    'create_connected:creative_fluid_vessel'
  )
  e.shapeless(
    'create_connected:creative_fluid_vessel',
    'create:creative_fluid_tank'
  )

  // Creative Crate
  wrappedCreativeRecipe('create:creative_crate', 'minecraft:barrel')

  // Creative Blaze Cake
  wrappedCreativeRecipe('create:creative_blaze_cake', 'create:blaze_cake')

  // Creative Generator
  wrappedCreativeRecipe(
    'createaddition:creative_energy',
    'createaddition:modular_accumulator'
  )

  // Creative Vending Upgrade
  wrappedCreativeRecipe(
    'functionalstorage:creative_vending_upgrade',
    'functionalstorage:netherite_upgrade'
  )
  e.shapeless(
    'functionalstorage:creative_vending_upgrade',
    'functionalstorage:max_storage_upgrade'
  )
  e.shapeless(
    'functionalstorage:max_storage_upgrade',
    'functionalstorage:creative_vending_upgrade'
  )

  // Creative Compressed Iron Block
  pneumaticcraft.pressure_chamber(
    [
      CREATIVE_MECHANISM,
      CREATIVE_MECHANISM,
      CREATIVE_MECHANISM,
      CREATIVE_MECHANISM,
      '8x pneumaticcraft:compressed_iron_block',
      CREATIVE_MECHANISM,
      CREATIVE_MECHANISM,
      CREATIVE_MECHANISM,
      CREATIVE_MECHANISM,
    ],
    'pneumaticcraft:creative_compressed_iron_block',
    4.75
  )

  // Creative Compressor
  create.mechanical_crafting(
    'pneumaticcraft:creative_compressor',
    [
      'RRRRRRR', //
      'R R R R', //
      'RRMAMRR', //
      'R LCL R', //
      'RRMAMRR', //
      'R R R R', //
      'RRRRRRR', //
    ],
    {
      R: 'tfmg:rebar',
      M: 'kubejs:creative_mechanism',
      A: 'pneumaticcraft:advanced_air_compressor',
      L: 'pneumaticcraft:advanced_liquid_compressor',
      C: 'pneumaticcraft:compressed_iron_block',
    }
  )

  // Creative Storage Parts (custom)
  e.shaped(
    'kubejs:creative_storage_part',
    [
      'NIN', //
      'PMP', //
      'NPN', //
    ],
    {
      N: 'extrastorage:neural_processor',
      I: 'createcasing:chorium_ingot',
      P: 'extrastorage:storagepart_16384k',
      M: CREATIVE_MECHANISM,
    }
  )
  e.shaped(
    'kubejs:creative_fluid_storage_part',
    [
      'NIN', //
      'PMP', //
      'NPN', //
    ],
    {
      N: 'extrastorage:neural_processor',
      I: 'createcasing:chorium_ingot',
      P: 'extrastorage:storagepart_1048576k_fluid',
      M: CREATIVE_MECHANISM,
    }
  )

  // Creative Storage Disk
  e.shapeless('refinedstorage:creative_storage_disk', [
    'refinedstorage:storage_housing',
    'kubejs:creative_storage_part',
  ])
  e.shaped(
    'refinedstorage:creative_storage_disk',
    [
      'GRG', //
      'RPR', //
      'QQQ', //
    ],
    {
      G: '#forge:glass',
      R: 'minecraft:redstone',
      P: 'kubejs:creative_storage_part',
      Q: 'refinedstorage:quartz_enriched_iron',
    }
  )

  // Creative Fluid Storage Disk
  e.shapeless('refinedstorage:creative_fluid_storage_disk', [
    'refinedstorage:storage_housing',
    'kubejs:creative_fluid_storage_part',
  ])
  e.shaped(
    'refinedstorage:creative_fluid_storage_disk',
    [
      'GRG', //
      'RPR', //
      'QQQ', //
    ],
    {
      G: '#forge:glass',
      R: 'minecraft:redstone',
      P: 'kubejs:creative_fluid_storage_part',
      Q: 'refinedstorage:quartz_enriched_iron',
    }
  )

  // Creative Storage Block
  e.shaped(
    'refinedstorage:creative_storage_block',
    [
      'QPQ', //
      'QCQ', //
      'QRQ', //
    ],
    {
      Q: 'refinedstorage:quartz_enriched_iron',
      P: 'kubejs:creative_storage_part',
      C: 'refinedstorage:machine_casing',
      R: 'minecraft:redstone',
    }
  )

  // Creative Fluid Storage Block
  e.shaped(
    'refinedstorage:creative_fluid_storage_block',
    [
      'QPQ', //
      'QCQ', //
      'QRQ', //
    ],
    {
      Q: 'refinedstorage:quartz_enriched_iron',
      P: 'kubejs:creative_fluid_storage_part',
      C: 'refinedstorage:machine_casing',
      R: 'minecraft:redstone',
    }
  )

  // Creative Controller
  wrappedCreativeRecipe(
    'refinedstorage:creative_controller',
    'refinedstorage:controller'
  )

  // Creative Grids
  wrappedCreativeRecipe(
    'refinedstorage:creative_portable_grid',
    'refinedstorage:portable_grid'
  )
  wrappedCreativeRecipe(
    'refinedstorage:creative_wireless_grid',
    'refinedstorage:wireless_grid'
  )
  wrappedCreativeRecipe(
    'refinedstorage:creative_wireless_fluid_grid',
    'refinedstorage:wireless_fluid_grid'
  )
  wrappedCreativeRecipe(
    'refinedstorage:creative_wireless_crafting_monitor',
    'refinedstorage:wireless_crafting_monitor'
  )

  // Creative Wireless Universal Grid
  wrappedCreativeRecipe(
    'universalgrid:creative_wireless_universal_grid',
    'universalgrid:wireless_universal_grid'
  )
})
