// priority: 100
// Recipe overhauls for Chapter 2B progression.

ServerEvents.recipes((e) => {
  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)
  const redefineEnchantingRecipe = redefineEnchantingRecipe_(e)

  // Source fluid automation
  e.recipes.create.compacting(
    Fluid.of('starbunclemania:source_fluid', 100),
    'ars_nouveau:sourceberry_bush'
  )

  // Gold nugget washing automation
  e.remove({ id: 'create:splashing/sand' })
  e.recipes.create.splashing(
    ['minecraft:gold_nugget', Item.of('minecraft:clay_ball').withChance(0.25)],
    'minecraft:sand'
  )

  // Source gem crafting
  e.remove({ id: 'ars_nouveau:imbuement_amethyst' })
  e.remove({ id: 'ars_nouveau:imbuement_lapis' })
  e.recipes.create.filling('ars_nouveau:source_gem', [
    Fluid.of('starbunclemania:source_fluid', 250),
    'minecraft:gold_nugget',
  ])

  // Source mechanism
  new SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('kubejs:incomplete_source_mechanism')
    .deploy('ars_nouveau:source_gem')
    .press()
    .fill('starbunclemania:source_fluid', 100)
    .press()
    .outputs(e, 'kubejs:source_mechanism')

  // Source mechanism dependent recipes, in order of JEI search.
  redefineRecipe('ars_nouveau:novice_spell_book', [
    'minecraft:book',
    'kubejs:source_mechanism',
  ])
  e.replaceInput(
    'ars_nouveau:enchanting_apparatus',
    'minecraft:gold_ingot',
    'kubejs:source_mechanism'
  )
  redefineRecipe(
    'ars_nouveau:source_jar',
    [
      'SSS', //
      'G G', //
      'SMS', //
    ],
    {
      S: 'ars_nouveau:archwood_slab',
      G: '#forge:glass',
      M: 'kubejs:source_mechanism',
    }
  )
  e.replaceInput(
    'ars_nouveau:relay',
    'ars_nouveau:source_gem_block',
    'kubejs:source_mechanism'
  )
  redefineRecipe(
    'ars_nouveau:scribes_table',
    [
      'PPP', //
      'NMN', //
      'L L', //
    ],
    {
      P: 'ars_nouveau:archwood_slab',
      N: 'minecraft:gold_nugget',
      M: 'kubejs:source_mechanism',
      L: '#forge:logs/archwood',
    }
  )
  redefineRecipe(
    'ars_nouveau:imbuement_chamber',
    [
      'PGP', //
      'P P',
      'PMP', //
    ],
    {
      P: 'ars_nouveau:archwood_planks',
      G: 'minecraft:gold_ingot',
      M: 'kubejs:source_mechanism',
    }
  )
  redefineEnchantingRecipe(
    'ars_nouveau:relay_splitter',
    [
      'minecraft:quartz',
      'minecraft:lapis_lazuli',
      'kubejs:source_mechanism',
      'minecraft:lapis_lazuli',
      'minecraft:quartz',
      'minecraft:lapis_lazuli',
      'kubejs:source_mechanism',
      'minecraft:lapis_lazuli',
    ],
    'ars_nouveau:relay'
  )
  e.replaceInput(
    'ars_nouveau:arcane_core',
    'ars_nouveau:source_gem',
    'kubejs:source_mechanism'
  )
  e.remove({ id: 'ars_nouveau:basic_spell_turret' })
  e.shaped(
    'ars_nouveau:basic_spell_turret',
    [
      ' S ', //
      'GMG', //
      ' S ', //
    ],
    {
      S: 'ars_nouveau:source_gem',
      G: 'minecraft:gold_ingot',
      M: 'kubejs:source_mechanism',
    }
  )
  redefineRecipe(
    'starbunclemania:fluid_sourcelink',
    [
      ' G ', //
      'GBG', //
      ' M ',
    ],
    {
      G: 'minecraft:gold_ingot',
      B: 'minecraft:bucket',
      M: 'kubejs:source_mechanism',
    }
  )
  // TODO: remove other sourcelink recipes and hide from JEI.
})
