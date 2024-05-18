// priority: 500
// Recipe registrations for automated potion brewing with Create

const $PotionBrewing = Java.loadClass(
  'net.minecraft.world.item.alchemy.PotionBrewing'
)

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Create automated brewing recipes should be disabled in the Create server
  // config. They cannot be removed with KubeJS.

  const parseFluid = (s, bottle) => {
    if (bottle === undefined) bottle = 'REGULAR'
    if (typeof s !== 'string') throw new Error(`Invalid input ${s}`)
    if (s === 'minecraft:water') return Fluid.water(1000)
    return Fluid.of('create:potion', 1000).withNBT({
      Bottle: bottle,
      Potion: s,
    })
  }

  let recipeNumber = 1

  // Store all the unique potion IDs to generate splash and lingering potions
  let uniqueOutputs = {}
  for (const mix of $PotionBrewing.POTION_MIXES) {
    // Register all the potion brewing mixes as mixing recipes.
    let inputFluidString = new String(mix.from.key().location().toString())
    let inputItems = mix.ingredient.getItemIds()
    if (inputItems.size() !== 1) {
      throw new Error(`Invalid item ingredient ${inputItems}`)
    }
    let outputFluidString = new String(mix.to.key().location().toString())
    let outputId = outputFluidString.replace(/[^a-z_]/, '_')

    create
      .mixing(parseFluid(outputFluidString), [
        parseFluid(inputFluidString),
        inputItems[0],
      ])
      .heated()
      // The resulting recipe id prefix is important because the JEI client
      // script relies on this to move all the recipes to the automated brewing
      // recipe category.
      .id(`kubejs:create_potion_mixing_${recipeNumber}_${outputId}`)

    // Store all the unique potion types
    uniqueOutputs[inputFluidString] = true
    uniqueOutputs[outputFluidString] = true

    recipeNumber += 1
  }

  // Register splash and lingering version of each potion type
  const typeMap = [
    { from: 'REGULAR', to: 'SPLASH', ingredient: 'minecraft:gunpowder' },
    { from: 'SPLASH', to: 'LINGERING', ingredient: 'minecraft:dragon_breath' },
  ]
  for (const potion in uniqueOutputs) {
    let potionId = potion.replace(/[^a-z_]/, '_')
    for (const { from, to, ingredient } of typeMap) {
      let suffix = to.toLowerCase()
      create
        .mixing(parseFluid(potion, to), [parseFluid(potion, from), ingredient])
        .heated()
        .id(`kubejs:create_potion_mixing_${recipeNumber}_${potionId}_${suffix}`)
      recipeNumber += 1
    }
  }
})
