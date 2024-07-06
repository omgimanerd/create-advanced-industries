// priority: 0
// Standardize all recipes for ice and snow.

ServerEvents.recipes((e) => {
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Ice
  e.recipes.thermal.chiller('minecraft:ice', Fluid.water(1000)).energy(12000)
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.water(1000))
    .temperature({ max_temp: 273 })
    .item_output('minecraft:ice')

  // Packed Ice
  e.remove({ id: 'create:splashing/ice' })
  e.recipes.thermal
    .chiller('minecraft:packed_ice', ['minecraft:ice', Fluid.water(1000)])
    .energy(12000)
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.water(1000))
    .temperature({ max_temp: 273 - 20 })
    .item_output('minecraft:packed_ice')

  // Blue Ice
  e.recipes.thermal
    .chiller('minecraft:blue_ice', ['minecraft:packed_ice', Fluid.water(1000)])
    .energy(12000)
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.water(1000))
    .temperature({ max_temp: 273 - 40 })
    .item_output('minecraft:blue_ice')
})
