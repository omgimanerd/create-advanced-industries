// priority: 100

// Recipes for molten fluids

ServerEvents.recipes((e) => {
  const kDefaultNuggetValue = 10
  const kDefaultIngotValue = 90
  const kDefaultBlockRatio = 9

  const meltables = [
    {
      nugget: 'create:copper_nugget',
      ingot: 'minecraft:copper_ingot',
      block: 'minecraft:copper_block',
      output: 'kubejs:molten_copper',
    },
    {
      nugget: 'minecraft:iron_nugget',
      ingot: 'minecraft:iron_ingot',
      block: 'minecraft:iron_block',
      output: 'kubejs:molten_iron',
    },
    {
      nugget: 'create:zinc_nugget',
      ingot: 'create:zinc_ingot',
      block: 'create:zinc_block',
      output: 'kubejs:molten_zinc',
    },
    {
      nugget: 'create:brass_nugget',
      ingot: 'create:brass_ingot',
      block: 'create:brass_block',
      output: 'kubejs:molten_brass',
    },
    {
      ingot: 'minecraft:quartz',
      block: 'minecraft:quartz_block',
      output: 'kubejs:molten_quartz',
      block_ratio: 4,
    },
    {
      ingot: 'minecraft:diamond',
      block: 'minecraft:diamond_block',
      output: 'kubejs:molten_diamond',
      superheated: true,
    },
    {
      ingot: 'minecraft:emerald',
      block: 'minecraft:emerald_block',
      output: 'kubejs:molten_emerald',
      superheated: true,
    },
    {
      ingot: 'minecraft:lapis_lazuli',
      block: 'minecraft:lapis_block',
      output: 'kubejs:molten_lapis',
    },
    {
      ingot: 'minecraft:redstone',
      block: 'minecraft:redstone_block',
      output: 'kubejs:molten_redstone',
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
  meltables.forEach((o) => {
    if (o.output === undefined) {
      throw new Error('No output fluid specified!')
    }
    if (o.nugget !== undefined) {
      createMeltingRecipe(
        o.nugget,
        Fluid.of(o.output, kDefaultNuggetValue),
        o.superheated
      )
    }
    if (o.ingot !== undefined) {
      createMeltingRecipe(
        o.ingot,
        Fluid.of(o.output, kDefaultIngotValue),
        o.superheated
      )
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
