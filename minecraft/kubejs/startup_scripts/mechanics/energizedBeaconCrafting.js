// priority: 1000

global.ENERGIZED_BEACON_CRAFTING = 'kubejs:energized_beacon_crafting'

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
global.EnergizedBeaconCraftingRecipes = []

// Must be kept in sync with the energizing recipes for each of these items.
global.EnergizedBeaconItems = {
  'create_new_age:overcharged_iron': {
    result: 'minecraft:iron_ingot',
    energy: 1000,
  },
  'create_new_age:overcharged_gold': {
    result: 'minecraft:gold_ingot',
    energy: 2000,
  },
  'create_new_age:overcharged_diamond': {
    result: 'minecraft:diamond',
    energy: 10000,
  },
  'gag:energized_hearthstone': {
    result: 'gag:hearthstone',
    energy: 20000,
  },
}

// Direct from java/org/violetmoon/quark/base/util/CorundumColor.java
global.CorundumClusterMapping = {
  red: {
    cluster: 'quark:red_corundum_cluster',
    beaconColor: [1, 0, 0],
  },
  orange: {
    cluster: 'quark:orange_corundum_cluster',
    beaconColor: [1, 0.5, 0],
  },
  yellow: {
    cluster: 'quark:yellow_corundum_cluster',
    beaconColor: [1, 1, 0],
  },
  lime: {
    cluster: 'quark:green_corundum_cluster',
    beaconColor: [0, 1, 0],
  },
  light_blue: {
    cluster: 'quark:blue_corundum_cluster',
    beaconColor: [0, 1, 1],
  },
  blue: {
    cluster: 'quark:indigo_corundum_cluster',
    beaconColor: [0, 0, 1],
  },
  magenta: {
    cluster: 'quark:violet_corundum_cluster',
    beaconColor: [1, 0, 1],
  },
  white: {
    cluster: 'quark:white_corundum_cluster',
    beaconColor: [1, 1, 1],
  },
  black: {
    cluster: 'quark:black_corundum_cluster',
    beaconColor: [0, 0, 0],
  },
}

// Register the actual beacon crafting recipes.
;(() => {
  for (const [color, data] of Object.entries(global.CorundumClusterMapping)) {
    let { cluster, beaconColor } = data
    // Recipes for glass blocks.
    global.EnergizedBeaconCraftingRecipes.push({
      ingredient: '#forge:glass/silica',
      results: `minecraft:${color}_stained_glass`,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 100,
    })

    // Recipes for glass panes.
    global.EnergizedBeaconCraftingRecipes.push({
      ingredient: '#forge:glass_panes',
      results: `minecraft:${color}_stained_glass_pane`,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 50,
    })

    // Recipes for framed glass panes.
    global.EnergizedBeaconCraftingRecipes.push({
      ingredient: '#quark:framed_glasses',
      results: `quark:${color}_framed_glass_pane`,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 50,
    })

    // Recipes for glass shards.
    global.EnergizedBeaconCraftingRecipes.push({
      ingredient: '#quark:shards',
      results: `quark:${color}_shard`,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 25,
    })

    // Recipes for wool.
    global.EnergizedBeaconCraftingRecipes.push({
      ingredient: '#minecraft:wool',
      results: `minecraft:${color}_wool`,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 200,
    })

    // Recipes for terracotta.
    global.EnergizedBeaconCraftingRecipes.push({
      ingredient: '#minecraft:terracotta',
      results: `minecraft:${color}_terracotta`,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 400,
    })

    // Recipes for the corundum clusters.
    global.EnergizedBeaconCraftingRecipes.push({
      // This tag is added via datapack json so that it can be resolved in the
      // client scripts with Ingredient.of.
      ingredient: '#kubejs:corundum_cluster',
      results: cluster,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 500,
    })
  }

  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'minecraft:glowstone_dust',
    results: 'kubejs:energized_glowstone',
    redirectorBlock: 'quark:white_corundum_cluster',
    beaconColor: global.CorundumClusterMapping.white.beaconColor,
    energy: 1000,
  })

  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'kubejs:magnetic_confinement_unit_filled',
    results: ['kubejs:magnetic_confinement_unit', 'kubejs:antimatter'],
    redirectorBlock: 'quark:white_corundum_cluster',
    beaconColor: global.CorundumClusterMapping.white.beaconColor,
    energy: 2000,
  })
})()
