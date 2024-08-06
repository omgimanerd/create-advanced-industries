// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

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

  // creative wand
  // creative worldshaper
  // creative motor
  // creative tank
  // creative crate
  // creative blaze cake
  // creative fluid vessel
  // creative generator
  // creative vending upgrade
  // creative compressed iron block
  // creative compressor
  // creative supply upgrade
  // creative storage disk
  // creative fluid storage disk
  // creative grids
  // creative storage block
  // creative controller
  // creative wireless universal grid
})
