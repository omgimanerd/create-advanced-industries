// priority: 100
// Global data for overhauling the Thermal Aquatic Entangler, defined here
// to be made available in both server_scripts and client_scripts.

global.LootTableToJsonPath = (s) => {
  return s.replace(':', '/data/kubejs/loot_tables/') + '.json'
}

global.AquaticEntanglerRecipes = [
  {
    input: 'thermal:aquachow',
    useChance: 0.5,
    lootTable: 'kubejs:gameplay/fishing/aquachow',
  },
  {
    input: 'thermal:deep_aquachow',
    useChance: 0.75,
    lootTable: 'kubejs:gameplay/fishing/deep_aquachow',
  },
  {
    input: 'thermal:junk_net',
    useChance: 0,
    lootTable: 'kubejs:gameplay/fishing/junk_net',
  },
  {
    input: 'kubejs:treasure_net',
    useChance: 0.05,
    lootTable: 'kubejs:gameplay/fishing/treasure_net',
  },
]

/**
 * @param {$RecipesEventJS_} e
 */
global.RegisterAquaticEntanglerRecipeOverhauls = (e) => {
  e.remove({ type: 'thermal:fisher_boost' })
  global.AquaticEntanglerRecipes.forEach((data) => {
    e.recipes.thermal.fisher_boost(
      data.input,
      1,
      data.useChance,
      data.lootTable
    )
  })
}
