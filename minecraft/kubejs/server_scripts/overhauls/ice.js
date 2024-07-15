// priority: 0
// Standardize all recipes for ice and snow.

ServerEvents.recipes((e) => {
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Ice
  const iceTemperature = 273 - 0
  e.remove({ id: 'pneumaticcraft:heat_frame_cooling/ice' })
  e.recipes.thermal.chiller('minecraft:ice', Fluid.water(1000)).energy(12000)
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.water(1000))
    .temperature({ max_temp: iceTemperature })
    .item_output('minecraft:ice')
  pneumaticcraft
    .heat_frame_cooling(Fluid.water(1000), 'minecraft:ice')
    .max_temp(iceTemperature)

  // Packed Ice
  const packedIceTemperature = 273 - 20
  e.remove({ id: 'create:splashing/ice' })
  e.recipes.thermal
    .chiller('minecraft:packed_ice', ['minecraft:ice', Fluid.water(1000)])
    .energy(2000)
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:ice')
    .temperature({ max_temp: packedIceTemperature })
    .item_output('minecraft:packed_ice')
  pneumaticcraft
    .heat_frame_cooling('minecraft:ice', 'minecraft:packed_ice')
    .max_temp(packedIceTemperature)

  // Blue Ice
  const blueIceTemperature = 273 - 40
  e.recipes.thermal
    .chiller('minecraft:blue_ice', ['minecraft:packed_ice', Fluid.water(1000)])
    .energy(2000)
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:packed_ice')
    .temperature({ max_temp: blueIceTemperature })
    .item_output('minecraft:blue_ice')
  pneumaticcraft
    .heat_frame_cooling('minecraft:packed_ice', 'minecraft:blue_ice')
    .max_temp(blueIceTemperature)
})
