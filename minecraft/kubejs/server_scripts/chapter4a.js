// priority: 100
// Recipe overhauls for Chapter 4A progression.

ServerEvents.recipes((e) => {
  const ingotFluid = global.metallurgy.kDefaultIngotFluid

  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)

  // Eggs from doughs
  e.recipes.create.haunting('minecraft:egg', 'create:dough')

  // 1000 biofuel = 20mins
  //   8 sugar
  //   8 cinder flour
  //   16 biomass
  //     1600 mb seed oil
  //     misc vegs

  // 8 blaze cakes = 21.3 mins
  //   2000 mb lava
  //   8 eggs
  //   8 sugar
  //   8 cinder flour

  // Bone blocks
  e.recipes.create.compacting('minecraft:bone_block', [
    Fluid.of('minecraft:milk', 1000),
  ])

  // Lime automation
  e.recipes.create.mixing('create:limestone', [
    'minecraft:bone_block',
    Fluid.water(1000),
  ])

  // Steel overhaul
  e.remove({ id: 'tfmg:industrial_blasting/steel' })
  e.recipes.create
    .mixing(Fluid.of('tfmg:molten_steel', 3 * ingotFluid), [
      'tfmg:limesand',
      Item.of('tfmg:coal_coke_dust', 2),
      Fluid.of('kubejs:molten_iron', 3 * ingotFluid),
    ])
    .superheated()

  // Remove TFMG steel recipes
  e.remove({ id: 'tfmg:casting/steel' })

  // Steel mechanism
})
