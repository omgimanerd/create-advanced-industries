// priority: 500

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
        Item.of('quark:red_corundum_cluster').withChance(0.15),
        Item.of('quark:violet_corundum_cluster').withChance(0.15),
        Item.of('quark:orange_corundum_cluster').withChance(0.05),
        Item.of('quark:yellow_corundum_cluster').withChance(0.05),
      ],
      [
        'apotheosis:gem_dust',
        Fluid.of('starbunclemania:source_fluid', 250),
        Fluid.of('kubejs:crystal_growth_accelerator', 250),
      ]
    )
    .heated()

  // Aluminum oxide growth acceleration.
  create
    .mixing(getCorundumClusterOutput(0.25), [
      'kubejs:aluminum_dust',
      Fluid.water(100),
      Fluid.of('kubejs:crystal_growth_accelerator', 100),
    ])
    .heated()

  // Corundum clusters are tagged by a datapack file.
  for (const [color, data] of Object.entries(global.CorundumClusterMapping)) {
    let { cluster, block } = data
    let dye = `minecraft:${color}_dye`

    // Make manual dyeing recipes
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
