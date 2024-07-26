// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // TODO corundum automation

  // Corundum clusters are tagged by a datapack file.
  for (const { color, cluster } of global.CorundumClusterMapping) {
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

    // Crushing recipes for alternate dye farming
    create.milling(
      [
        dye,
        Item.of(dye).withChance(0.5),
        Item.of('thermal:quartz_dust').withChance(0.25),
      ],
      cluster
    )

    // Pressing into panes
    create.pressing(cluster.replace('cluster', 'pane'), cluster)
  }
})
