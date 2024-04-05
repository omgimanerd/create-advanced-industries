// priority: 100

// Recipes for molten fluids
ServerEvents.recipes((e) => {
  const createMeltingRecipe = (item, fluid, superheated) => {
    const recipe = e.recipes.create.mixing([fluid], item)
    if (superheated) {
      recipe.superheated()
    } else {
      recipe.heated()
    }
  }

  const createCastingRecipe = (o) => {
    const isGem = o.gem !== undefined

    const clayCastOutput = global.metallurgy.getClayCastName(o.fluid)
    const steelCastOutput = global.metallurgy.getSteelCastName(o.fluid)

    const inputClayCast = isGem
      ? 'kubejs:clay_gem_cast'
      : 'kubejs:clay_ingot_cast'
    const inputSteelCast = isGem
      ? 'kubejs:steel_gem_cast'
      : 'kubejs:steel_ingot_cast'

    e.recipes.create.filling(clayCastOutput, [
      Fluid.of(o.fluid, global.kDefaultIngotFluid),
      inputClayCast,
    ])
    e.recipes.create.filling(steelCastOutput, [
      Fluid.of(o.fluid, global.kDefaultIngotFluid),
      inputSteelCast,
    ])

    e.recipes.create.splashing(
      [isGem ? o.gem : o.ingot, Item.of(inputClayCast).withChance(0.5)],
      clayCastOutput
    )
    e.recipes.create.splashing(
      [isGem ? o.gem : o.ingot, inputSteelCast],
      steelCastOutput
    )
  }

  global.metallurgy.meltable_item_data.forEach((data) => {
    if (data.fluid === undefined) {
      throw new Error('No output fluid specified!')
    }
    const nuggetFluid = global.metallurgy.kDefaultNuggetFluid
    const ingotFluid = global.metallurgy.kDefaultIngotFluid

    if (data.gem === undefined) {
      createMeltingRecipe(
        data.nugget,
        Fluid.of(data.fluid, nuggetFluid),
        data.superheated
      )
      createMeltingRecipe(
        data.ingot,
        Fluid.of(data.fluid, ingotFluid),
        data.superheated
      )
      createCastingRecipe(data)
    } else {
      createMeltingRecipe(
        data.gem,
        Fluid.of(data.fluid, ingotFluid),
        data.superheated
      )
      createCastingRecipe(data)
    }

    if (data.block !== undefined) {
      const ratio =
        data.block_ratio === undefined
          ? global.metallurgy.kDefaultBlockRatio
          : data.block_ratio
      createMeltingRecipe(
        data.block,
        Fluid.of(data.fluid, ingotFluid * ratio),
        data.superheated
      )
    }
  })
})
