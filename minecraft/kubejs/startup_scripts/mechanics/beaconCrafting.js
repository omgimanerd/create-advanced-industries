// priority: 1000

/**
 * Beacon crafting recipes are registered and stored in a global here so that
 * they are available to the server side for processing and the client side for
 * rendering a custom JEI category.
 *
 * @typedef BeaconCraftingRecipe
 * @property {string} ingredient
 * @property {string} result
 * @property {string} redirectorBlock
 * @property {number} energy
 *
 * @type {BeaconCraftingRecipe[]}
 */
global.BeaconCraftingRecipes = []

// Register the actual beacon crafting recipes.
;(() => {
  const corundumClusterMapping = {
    'quark:black_corundum_cluster': 'black',
    'quark:white_corundum_cluster': 'white',
    'quark:violet_corundum_cluster': 'magenta',
    'quark:indigo_corundum_cluster': 'blue',
    'quark:blue_corundum_cluster': 'light_blue',
    'quark:green_corundum_cluster': 'lime',
    'quark:yellow_corundum_cluster': 'yellow',
    'quark:orange_corundum_cluster': 'orange',
    'quark:red_corundum_cluster': 'red',
  }
  for (const [cluster, color] of Object.entries(corundumClusterMapping)) {
    // Recipes for glass blocks.
    global.BeaconCraftingRecipes.push({
      ingredient: '#forge:glass/silica',
      result: `minecraft:${color}_stained_glass`,
      redirectorBlock: cluster,
      energy: 100,
    })

    // Recipes for glass panes.
    global.BeaconCraftingRecipes.push({
      ingredient: '#forge:glass_panes',
      result: `minecraft:${color}_stained_glass_pane`,
      redirectorBlock: cluster,
      energy: 50,
    })

    // Recipes for framed glass panes.
    global.BeaconCraftingRecipes.push({
      ingredient: '#quark:framed_glasses',
      result: `quark:${color}_framed_glass_pane`,
      redirectorBlock: cluster,
      energy: 50,
    })

    // Recipes for glass shards.
    global.BeaconCraftingRecipes.push({
      ingredient: '#quark:shards',
      result: `quark:${color}_shard`,
      redirectorBlock: cluster,
      energy: 25,
    })

    // Recipes for wool.
    global.BeaconCraftingRecipes.push({
      ingredient: '#minecraft:wool',
      result: `minecraft:${color}_wool`,
      redirectorBlock: cluster,
      energy: 200,
    })

    // Recipes for terracotta.
    global.BeaconCraftingRecipes.push({
      ingredient: '#minecraft:terracotta',
      result: `minecraft:${color}_terracotta`,
      redirectorBlock: cluster,
      energy: 400,
    })
  }
})()
