// priority: 800

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Create automated brewing recipes should be disabled in the Create server
  // config. They cannot be removed with KubeJS.

  const parseFluid = (s) => {
    if (typeof s !== 'string') throw new Error(`Invalid input ${s}`)
    if (s === 'minecraft:water') return Fluid.water(1000)
    return Fluid.of('create:potion', 1000).withNBT({
      Potion: s,
    })
  }

  let potionNumber = 1
  for (const mix of $PotionBrewing.POTION_MIXES) {
    let inputFluid = parseFluid(
      new String(mix.from.key().location().toString())
    )
    let inputItems = mix.ingredient.getItemIds()
    if (inputItems.size() !== 1) {
      throw new Error(`Invalid item ingredient ${inputItems}`)
    }
    let outputString = new String(mix.to.key().location().toString())
    let outputFluid = parseFluid(outputString)

    let outputId = outputString.replace(/[^a-z_]/, '_')
    create
      .mixing(outputFluid, [inputFluid, inputItems[0]])
      .heated()
      .id(`kubejs:create_potion_mixing_${potionNumber}_${outputId}`)
    potionNumber += 1
  }
})
