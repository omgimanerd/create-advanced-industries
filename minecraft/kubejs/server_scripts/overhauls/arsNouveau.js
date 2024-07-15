// priority: 500
// Recipe overhauls for Ars Nouveau and its addons

ServerEvents.tags('minecraft:entity_type', (e) => {
  // Prevent these mobs from being captured by the Ritual of Containment.
  e.add('minecraft:ender_dragon', 'ars_nouveau:jar_blacklist')
  e.add('minecraft:warden', 'ars_nouveau:jar_blacklist')
  e.add('minecraft:wither', 'ars_nouveau:jar_blacklist')
})

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
    PRECISION_MECHANISM,
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
    { B: 'minecraft:book', M: SOURCE_MECHANISM }
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
      M: QUANTUM_MECHANISM,
      P: 'minecraft:paper',
      S: 'ars_nouveau:source_gem',
    }
  )
  create
    .SequencedAssembly('minecraft:paper')
    .deploy('minecraft:lapis_lazuli')
    .deploy(QUANTUM_MECHANISM)
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
    SOURCE_MECHANISM
  )
  redefineRecipe(
    'ars_nouveau:source_jar',
    [
      'SSS', //
      'G G', //
      'SMS', //
    ],
    { S: 'ars_nouveau:archwood_slab', G: '#forge:glass', M: SOURCE_MECHANISM }
  )
  e.replaceInput(
    'ars_nouveau:relay',
    'ars_nouveau:source_gem_block',
    SOURCE_MECHANISM
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
      M: SOURCE_MECHANISM,
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
      M: SOURCE_MECHANISM,
    }
  )
  redefineEnchantingRecipe(
    'ars_nouveau:relay_splitter',
    [
      'minecraft:quartz',
      'minecraft:lapis_lazuli',
      SOURCE_MECHANISM,
      'minecraft:lapis_lazuli',
      'minecraft:quartz',
      'minecraft:lapis_lazuli',
      SOURCE_MECHANISM,
      'minecraft:lapis_lazuli',
    ],
    'ars_nouveau:relay'
  )
  e.replaceInput(
    'ars_nouveau:arcane_core',
    'ars_nouveau:source_gem',
    SOURCE_MECHANISM
  )
  redefineEnchantingRecipe(
    'ars_nouveau:relay_warp',
    [
      SOURCE_MECHANISM,
      'minecraft:ender_pearl',
      QUANTUM_MECHANISM,
      'minecraft:ender_pearl',
      SOURCE_MECHANISM,
      'minecraft:ender_pearl',
      QUANTUM_MECHANISM,
      'minecraft:ender_pearl',
    ],
    'ars_nouveau:relay'
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
      M: SOURCE_MECHANISM,
    }
  )
  redefineEnchantingRecipe(
    'ars_nouveau:storage_lectern',
    [
      SOURCE_MECHANISM,
      '#forge:chests',
      PRECISION_MECHANISM,
      '#forge:chests',
      SOURCE_MECHANISM,
      '#forge:chests',
      PRECISION_MECHANISM,
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
      M: SOURCE_MECHANISM,
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
    { G: 'minecraft:gold_ingot', B: 'minecraft:bucket', M: SOURCE_MECHANISM }
  )
})
