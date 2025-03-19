// priority: 0
// Information Recipe categories for nontrivial recipes.

JEIEvents.information((e) => {
  // Blaze milk buckets
  e.addItem(
    'kubejs:blaze_milk_bucket',
    Text.of(
      'Obtain by right clicking a blaze with an empty bucket after feeding it.'
    )
  )

  // Amethyst Buds
  ;[
    'minecraft:small_amethyst_bud',
    'minecraft:medium_amethyst_bud',
    'minecraft:large_amethyst_bud',
    'minecraft:amethyst_cluster',
  ].forEach((v) => {
    e.addItem(
      v,
      Text.of(
        'Can also be grown on budding amethyst. Ponder a block of budding ' +
          'amethyst to learn more.'
      )
    )
  })

  // Teleportation Juice
  e.addFluid(
    'kubejs:teleportation_juice',
    Text.of('Generated by the Ender Inhibitor. See the Ponder for details.')
  )

  // Chromatic Fluid
  e.addFluid(
    'kubejs:chromatic_fluid',
    Text.of(
      'Can also be obtained by hitting a sheep with a Chromatic Bop Stick.'
    )
  )

  // Wandering Trader Essences.
  ;[
    'kubejs:agony_essence',
    'kubejs:suffering_essence',
    'kubejs:torment_essence',
    'kubejs:debilitation_essence',
    'kubejs:mutilation_essence',
  ].forEach((v) => {
    e.addItem(v, Text.of('Obtained by murdering a Wandering Trader.'))
  })

  // Arcane Portal
  e.addItem(
    'kubejs:arcane_portal',
    Text.of('Right click crying obsidian with a source gem.')
  )

  // Hearthstones
  e.addItem(
    'gag:hearthstone',
    Text.of('Can also be obtained via the Arcane Portal.')
  )

  // Shattered Ender Pearls
  e.addItem(
    'kubejs:shattered_ender_pearl',
    Text.of('A chance result that can result from crafting Redstone Pearls.')
  )

  // Paintings
  e.addItem(
    'minecraft:painting',
    Text.of(
      'Give paint kits and canvas to Pembi the Artist for a chance of ' +
        'obtaining masterpiece paintings.'
    )
  )
})
