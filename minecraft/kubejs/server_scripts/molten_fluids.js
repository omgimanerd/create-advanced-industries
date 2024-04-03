// priority: 100

// Recipes for molten fluids

ServerEvents.recipes((e) => {
  const kDefaultNuggetValue = 10
  const kDefaultIngotValue = 90
  const kDefaultBlockRatio = 9

  const meltables = [
    {
      nugget: 'minecraft:iron_nugget',
      ingot: 'minecraft:iron_ingot',
      block: 'minecraft:iron_block',
      output: 'kubejs:molten_iron',
      intermediateCast: 'kubejs:iron_intermediate_cast',
    },
    {
      nugget: 'create:copper_nugget',
      ingot: 'minecraft:copper_ingot',
      block: 'minecraft:copper_block',
      output: 'kubejs:molten_copper',
      intermediateCast: 'kubejs:copper_intermediate_cast',
    },
    {
      nugget: 'minecraft:gold_nugget',
      ingot: 'minecraft:gold_ingot',
      block: 'minecraft:gold_block',
      output: 'kubejs:molten_gold',
      intermediateCast: 'kubejs:gold_intermediate_cast',
    },
    {
      nugget: 'create:zinc_nugget',
      ingot: 'create:zinc_ingot',
      block: 'create:zinc_block',
      output: 'kubejs:molten_zinc',
      intermediateCast: 'kubejs:zinc_intermediate_cast',
    },
    {
      nugget: 'create:brass_nugget',
      ingot: 'create:brass_ingot',
      block: 'create:brass_block',
      output: 'kubejs:molten_brass',
      intermediateCast: 'kubejs:brass_intermediate_cast',
    },
    {
      ingot: 'minecraft:quartz',
      block: 'minecraft:quartz_block',
      output: 'kubejs:molten_quartz',
      intermediateCast: 'kubejs:quartz_intermediate_cast',
      block_ratio: 4,
    },
    {
      ingot: 'minecraft:diamond',
      block: 'minecraft:diamond_block',
      output: 'kubejs:molten_diamond',
      intermediateCast: 'kubejs:diamond_intermediate_cast',
      superheated: true,
    },
    {
      ingot: 'minecraft:emerald',
      block: 'minecraft:emerald_block',
      output: 'kubejs:molten_emerald',
      intermediateCast: 'kubejs:emerald_intermediate_cast',
      superheated: true,
    },
    {
      ingot: 'minecraft:lapis_lazuli',
      block: 'minecraft:lapis_block',
      output: 'kubejs:molten_lapis',
      intermediateCast: 'kubejs:lapis_intermediate_cast',
    },
    {
      ingot: 'minecraft:redstone',
      block: 'minecraft:redstone_block',
      output: 'kubejs:molten_redstone',
      intermediateCast: 'kubejs:redstone_intermediate_cast',
    },
  ]

  const createMeltingRecipe = (item, fluid, superheated) => {
    const recipe = e.recipes.create.mixing([fluid], item)
    if (superheated) {
      recipe.superheated()
    } else {
      recipe.heated()
    }
  }

  const createCastingRecipe = (fluid, item, isGem, intermediateCast) => {
    new SequencedAssembly(
      isGem ? 'kubejs:clay_gem_cast' : 'kubejs:clay_ingot_cast'
    )
      .transitional(intermediateCast)
      .fill(fluid)
      .press()
      .outputs(e, item)
  }

  meltables.forEach((o) => {
    if (o.output === undefined) {
      throw new Error('No output fluid specified!')
    }
    const isGem = o.nugget === undefined
    if (!isGem) {
      const fluidEquivalent = Fluid.of(o.output, kDefaultNuggetValue)
      createMeltingRecipe(o.nugget, fluidEquivalent, o.superheated)
    }
    if (o.ingot !== undefined) {
      const fluidEquivalent = Fluid.of(o.output, kDefaultIngotValue)
      createMeltingRecipe(o.ingot, fluidEquivalent, o.superheated)
      createCastingRecipe(fluidEquivalent, o.ingot, isGem, o.intermediateCast)
    }
    if (o.block !== undefined) {
      const ratio =
        o.block_ratio === undefined ? kDefaultBlockRatio : o.block_ratio
      createMeltingRecipe(
        o.block,
        Fluid.of(o.output, kDefaultIngotValue * ratio),
        o.superheated
      )
    }
  })
})
