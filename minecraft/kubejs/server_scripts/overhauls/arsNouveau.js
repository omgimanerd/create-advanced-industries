// priority: 500
// Recipe overhauls for Ars Nouveau and its addons

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)
  const redefineEnchantingRecipe = redefineEnchantingRecipe_(e)

  // Allow all glyphs to be automated with Create
  e.forEachRecipe({ type: 'ars_nouveau:glyph' }, (r) => {
    const json = JSON.parse(r.json)
    const ingredients = json.inputItems
      .map((entry) => Ingredient.of(entry.item))
      .concat([Fluid.of('create_enchantment_industry:experience', json.exp)])
    const recipeId = `kubejs:mixing_glyph_${json.output.replace(
      /[^a-z_]/,
      '_'
    )}`
    create.mixing(json.output, ingredients).id(recipeId)
  })

  //////////////
  // Ars Creo //
  //////////////
  redefineRecipe('ars_creo:starbuncle_wheel', [
    'ars_nouveau:starbuncle_charm',
    'create:water_wheel',
    'create:precision_mechanism',
  ])

  /////////////////
  // Ars Nouveau //
  /////////////////
  redefineRecipe(
    'ars_nouveau:novice_spell_book',
    [
      ' M ', //
      'MBM', //
      ' M ', //
    ],
    {
      B: 'minecraft:book',
      M: 'kubejs:source_mechanism',
    }
  )
  redefineRecipe(
    'ars_nouveau:warp_scroll',
    [
      'LLL', //
      'MPM', //
      'SSS', //
    ],
    {
      L: 'minecraft:lapis_lazuli',
      M: 'createteleporters:quantum_mechanism',
      P: 'minecraft:paper',
      S: 'ars_nouveau:source_gem',
    }
  )
  create
    .SequencedAssembly('minecraft:paper')
    .deploy('minecraft:lapis_lazuli')
    .deploy('createteleporters:quantum_mechanism')
    .fill(Fluid.of('starbunclemania:source_fluid', 500))
    .outputs('ars_nouveau:warp_scroll')
  e.remove({ id: 'ars_nouveau:stable_warp_scroll' })
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'kubejs:resonant_ender_pearl',
      'create:experience_block',
      'create:experience_block',
      'kubejs:resonant_ender_pearl',
      'create:experience_block',
      'create:experience_block',
    ],
    'ars_nouveau:warp_scroll',
    'ars_nouveau:stable_warp_scroll'
  )
  create
    .SequencedAssembly('ars_nouveau:warp_scroll')
    .deploy('kubejs:resonant_ender_pearl')
    .fill(potionFluid('quark:resilience', 50))
    .energize(8000)
    .outputs('ars_nouveau:stable_warp_scroll')
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
  redefineEnchantingRecipe(
    'ars_nouveau:storage_lectern',
    [
      'kubejs:source_mechanism',
      '#forge:chests',
      'create:precision_mechanism',
      '#forge:chests',
      'kubejs:source_mechanism',
      '#forge:chests',
      'create:precision_mechanism',
      '#forge:chests',
    ],
    'minecraft:lectern',
    1000
  )
  redefineRecipe(
    'ars_nouveau:ritual_brazier',
    [
      ' M ', //
      'GPG', //
      ' G ', //
    ],
    {
      M: 'kubejs:source_mechanism',
      G: 'minecraft:gold_ingot',
      P: 'ars_nouveau:arcane_pedestal',
    }
  )
  // Alternative cheaper recipe for source stone
  create.filling('ars_nouveau:sourcestone', [
    '#forge:stone',
    Fluid.of('starbunclemania:source_fluid', 30),
  ])

  /////////////////////
  // Starbunclemania //
  /////////////////////
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
})
