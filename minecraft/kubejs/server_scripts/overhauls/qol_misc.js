// priority: 0
// Recipe overhauls for uncategorized misc and qol mods.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Craftable ways to get some of Quark's nice stones.
  create.compacting('quark:jasper', 'minecraft:granite')
  create.compacting('quark:shale', 'create:limestone')

  // Gate advanced magnet behind brass instead of gold.
  e.replaceInput(
    { id: 'simplemagnets:advancedmagnet' },
    'minecraft:gold_ingot',
    'create:brass_ingot'
  )
})
