// priority: 500

ServerEvents.tags('item', (e) => {
  e.add('kubejs:disc_fragment', 'minecraft:disc_fragment_5')
  e.add('kubejs:disc_fragment', 'idas:disc_fragment_slither')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Empty music discs
  create
    .SequencedAssembly('pneumaticcraft:plastic')
    .press()
    .fill(Fluid.of('kubejs:molten_silver', 125))
    .laser(8000, 1000)
    .outputs('kubejs:empty_music_disc')

  // Disc fragment cutting and recycling
  // create.cutting(
  //   Item.of('kubejs:empty_disc_fragment').withChance(0.5),
  //   '#minecraft:music_discs'
  // )
  // create.laser_cutting(
  //   'kubejs:empty_disc_fragment',
  //   '#minecraft:music_discs',
  //   8000,
  //   1000
  // )
  create.splashing('kubejs:empty_disc_fragment', '#kubejs:disc_fragment')
  create.splashing('kubejs:empty_music_disc', '#minecraft:music_discs')
  create
    .SequencedAssembly('kubejs:empty_disc_fragment')
    .fill(Fluid.of('create_things_and_misc:slime', 25))
    .deploy('kubejs:empty_disc_fragment')
    .loops(3)
    .outputs('kubejs:empty_music_disc')

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
      { M: 'kubejs:creative_mechanism', I: input }
    )
  }

  // Creative Spellbook
  e.recipes.ars_nouveau.enchanting_apparatus(
    Array(8).fill(SOURCE_MECHANISM),
    'ars_nouveau:archmage_spell_book',
    'ars_nouveau:creative_spell_book',
    24000,
    true
  )

  // Creative Source Jar
  create
    .SequencedAssembly('ars_nouveau:source_jar')
    .fill(Fluid.of('starbunclemania:source_fluid', 1000))
    .fill(Fluid.of('starbunclemania:source_fluid', 1000))
    .deploy('kubejs:creative_mechanism')
    .loops(8)
    .outputs('ars_nouveau:creative_source_jar')

  // Creative Building Wand
  e.smithing(
    'wands:creative_wand',
    // Todo make custom smithing template
    'minecraft:netherite_upgrade_smithing_template',
    'wands:netherite_wand',
    'kubejs:creative_mechanism'
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

  // creative crate

  // Creative Blaze Cake
  wrappedCreativeRecipe('create:creative_blaze_cake', 'create:blaze_cake')

  // Creative Generator
  wrappedCreativeRecipe(
    'createaddition:creative_energy',
    'createaddition:modular_accumulator'
  )

  // creative vending upgrade

  // Creative Compressed Iron Block
  const r = pneumaticcraft.pressure_chamber(
    [Item.of('pneumaticcraft:compressed_iron_block', 64)],
    'pneumaticcraft:creative_compressed_iron_block',
    4.5
  )
  r.createRecipe()
  console.log(r.json)

  const a = e.custom({
    type: 'pneumaticcraft:pressure_chamber',
    inputs: [
      {
        type: 'pneumaticcraft:stacked_item',
        count: 64,
        item: 'pneumaticcraft:ingot_iron_compressed',
      },
    ],
    pressure: 4,
    results: [
      {
        item: 'minecraft:stone',
      },
    ],
  })
  a.createRecipe()
  console.log(a.json)

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

  // creative supply upgrade

  // creative storage disk
  // creative fluid storage disk
  // creative storage block

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
