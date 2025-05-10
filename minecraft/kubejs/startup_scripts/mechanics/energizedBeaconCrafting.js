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
    block: 'quark:red_corundum',
    cluster: 'quark:red_corundum_cluster',
    beaconColor: [1, 0, 0],
  },
  orange: {
    block: 'quark:orange_corundum',
    cluster: 'quark:orange_corundum_cluster',
    beaconColor: [1, 0.5, 0],
  },
  yellow: {
    block: 'quark:yellow_corundum',
    cluster: 'quark:yellow_corundum_cluster',
    beaconColor: [1, 1, 0],
  },
  lime: {
    block: 'quark:green_corundum',
    cluster: 'quark:green_corundum_cluster',
    beaconColor: [0, 1, 0],
  },
  light_blue: {
    block: 'quark:blue_corundum',
    cluster: 'quark:blue_corundum_cluster',
    beaconColor: [0, 1, 1],
  },
  blue: {
    block: 'quark:indigo_corundum',
    cluster: 'quark:indigo_corundum_cluster',
    beaconColor: [0, 0, 1],
  },
  magenta: {
    block: 'quark:violet_corundum',
    cluster: 'quark:violet_corundum_cluster',
    beaconColor: [1, 0, 1],
  },
  white: {
    block: 'quark:white_corundum',
    cluster: 'quark:white_corundum_cluster',
    beaconColor: [1, 1, 1],
  },
  black: {
    block: 'quark:black_corundum',
    cluster: 'quark:black_corundum_cluster',
    beaconColor: [0, 0, 0],
  },
}

// Register the actual beacon crafting recipes.
;(() => {
  for (const [color, data] of Object.entries(global.CorundumClusterMapping)) {
    let { block, cluster, beaconColor } = data
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

    // Recipes for corundum clusters.
    global.EnergizedBeaconCraftingRecipes.push({
      // This tag is added via datapack json so that it can be resolved in the
      // client scripts with Ingredient.of.
      ingredient: '#kubejs:corundum_cluster',
      results: cluster,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      energy: 500,
    })

    // Recipes for corundum blocks.
    global.EnergizedBeaconCraftingRecipes.push({
      ingredient: '#quark:corundum',
      results: block,
      redirectorBlock: cluster,
      beaconColor: beaconColor,
      // One corundum block is technically 2.66 clusters, but doesn't cost 2.66x
      // the energy to color.
      energy: 1000,
    })
  }

  // PCB etching
  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'pneumaticcraft:empty_pcb',
    results: 'pneumaticcraft:unassembled_pcb',
    redirectorBlock: global.CorundumClusterMapping.magenta.cluster,
    beaconColor: global.CorundumClusterMapping.magenta.beaconColor,
    energy: 5000,
  })

  // Ghast Tears
  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'kubejs:honey_droplet',
    results: 'minecraft:ghast_tear',
    redirectorBlock: global.CorundumClusterMapping.white.cluster,
    beaconColor: global.CorundumClusterMapping.white.beaconColor,
    energy: 1000,
  })

  // Energized Glowstone
  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'minecraft:glowstone_dust',
    results: 'kubejs:energized_glowstone',
    redirectorBlock: global.CorundumClusterMapping.white.cluster,
    beaconColor: global.CorundumClusterMapping.white.beaconColor,
    energy: 1000,
  })

  // Tesseracts
  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'minecraft:end_crystal',
    results: 'kubejs:tesseract',
    redirectorBlock: global.CorundumClusterMapping.white.cluster,
    beaconColor: global.CorundumClusterMapping.white.beaconColor,
    energy: 10000,
  })

  // Magnetic Confinement Units for Antimatter
  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'kubejs:magnetic_confinement_unit_filled',
    results: [
      'kubejs:magnetic_confinement_unit',
      'kubejs:unstable_singularity',
    ],
    redirectorBlock: global.CorundumClusterMapping.white.cluster,
    beaconColor: global.CorundumClusterMapping.white.beaconColor,
    energy: 20000,
  })

  // Refined Radiance
  global.EnergizedBeaconCraftingRecipes.push({
    ingredient: 'create:chromatic_compound',
    results: ['create:refined_radiance'],
    redirectorBlock: global.CorundumClusterMapping.magenta.cluster,
    beaconColor: global.CorundumClusterMapping.magenta.beaconColor,
    energy: 10000,
  })
})()
