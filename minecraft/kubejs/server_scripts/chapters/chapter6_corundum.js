// priority: 500

/**
 * Handler defined in startup_scripts/spoutHandlerRegistration.js
 * @type {Internal.SpecialSpoutHandlerEvent$SpoutHandler_}
 * @param {Internal.BlockContainerJS_} block
 * @param {Internal.FluidStackJS} fluid
 * @param {boolean} simulate
 * @returns {number}
 */
global.CorundumBlockSpoutHandlerCallback = (block, fluid, simulate) => {
  const fluidConsumption = 125
  if (fluid.id !== 'kubejs:crystal_growth_accelerator') return 0
  if (block.up.id !== 'minecraft:air') return 0
  if (fluid.amount < fluidConsumption) return 0
  const growCandidates = Direction.ALL.values()
    .stream()
    .map((dir) => {
      return { block: block.offset(dir), dir: dir }
    })
    .filter((data) => {
      return data.block.id === 'minecraft:air'
    })
    .toArray()
  if (growCandidates.length === 0) return 0
  const candidate = choice(growCandidates)
  // Each spouting has a 25% chance of growing a corundum cluster.
  if (Math.random() >= 0.25) return 0
  // All checks passed, perform the growth if we are not simulating.
  if (!simulate) {
    // Set the corresponding corundum cluster.
    let corundumCluster = `${block.id}_cluster`
    candidate.block.set(corundumCluster, {
      facing: candidate.dir,
    })
  }
  return fluidConsumption
}

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  /**
   * Internal helper to return a list of all the corundum cluster types as
   * probabilistic outputs.
   * @param {number} probability
   * @returns {Internal.ItemStack_[]}
   */
  const getCorundumClusterOutput = (probability) => {
    return Object.values(global.CorundumClusterMapping).map((data) => {
      const item = Item.of(data.cluster)
      return probability === undefined ? item : item.withChance(probability)
    })
  }

  // Gem dust magical growth
  create
    .mixing(
      [
        Item.of('quark:red_corundum_cluster').withChance(0.1),
        Item.of('quark:violet_corundum_cluster').withChance(0.1),
        Item.of('quark:orange_corundum_cluster').withChance(0.05),
        Item.of('quark:yellow_corundum_cluster').withChance(0.05),
      ],
      [
        'apotheosis:gem_dust',
        Fluid.of('starbunclemania:source_fluid', 500),
        Fluid.of('kubejs:crystal_growth_accelerator', 500),
      ]
    )
    .heated()

  // Ruby and sapphire growth
  create.mixing(
    [
      Item.of('quark:blue_corundum_cluster').withChance(0.25),
      Item.of('quark:indigo_corundum_cluster').withChance(0.25),
    ],
    [
      'thermal:sapphire_dust',
      Fluid.of('starbunclemania:source_fluid', 250),
      Fluid.of('kubejs:crystal_growth_accelerator', 250),
    ]
  )
  create.mixing(
    [
      Item.of('quark:red_corundum_cluster').withChance(0.25),
      Item.of('quark:violet_corundum_cluster').withChance(0.25),
    ],
    [
      'thermal:ruby_dust',
      Fluid.of('starbunclemania:source_fluid', 250),
      Fluid.of('kubejs:crystal_growth_accelerator', 250),
    ]
  )

  // Aluminum oxide growth acceleration.
  create
    .mixing(getCorundumClusterOutput(0.05), [
      'kubejs:aluminum_dust',
      Fluid.water(100),
      Fluid.of('kubejs:crystal_growth_accelerator', 100),
    ])
    .heated()

  // Register dyeing recipes for corundum clusters and blocks.
  for (const [color, data] of Object.entries(global.CorundumClusterMapping)) {
    let { cluster, block } = data
    let dye = `minecraft:${color}_dye`
    e.shaped(
      cluster,
      [
        'DDD', //
        'DCD', //
        'DDD', //
      ],
      {
        D: dye,
        C: '#kubejs:corundum_cluster',
      }
    )
    e.shaped(
      block,
      [
        'DDD', //
        'DBD', //
        'DDD', //
      ],
      {
        D: dye,
        B: '#quark:corundum',
      }
    )

    // Vibrating recipes for alternate dye farming
    create.vibrating([Item.of(dye, 2), Item.of(dye).withChance(0.5)], cluster)

    // Pressing into panes
    create.pressing(cluster.replace('cluster', 'pane'), cluster)
  }
})
