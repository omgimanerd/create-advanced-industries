// priority: 500

ServerEvents.tags('item', (e) => {
  e.add('kubejs:disc_fragment', 'minecraft:disc_fragment_5')
  e.add('kubejs:disc_fragment', 'idas:disc_fragment_slither')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

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
})
