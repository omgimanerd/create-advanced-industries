// priority: 0
// Information Recipe categories for nontrivial recipes.

JEIEvents.information((e) => {
  // Chromatic Fluid
  e.addFluid(
    'kubejs:chromatic_fluid',
    Text.of(
      'Can also be obtained by hitting a sheep with a Chromatic Bop Stick.'
    )
  )

  // Wandering Trader Essences.
  ;[
    ('kubejs:agony_essence',
    'kubejs:suffering_essence',
    'kubejs:torment_essence',
    'kubejs:debilitation_essence',
    'kubejs:mutilation_essence'),
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
    Text.of('A chance result that can come from crafting Redstone Pearls.')
  )

  // Singularities
  e.addItem(
    'kubejs:singularity',
    Text.of(
      'Crafted by dropping a redstone pearl into an unstable singularity.'
    )
  )

  // Paintings
  e.addItem(
    'minecraft:painting',
    Text.of('Give paint kits and canvas to Pembi the Artist.')
  )
})
