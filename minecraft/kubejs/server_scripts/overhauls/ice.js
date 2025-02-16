// priority: 0
// Standardize all recipes for ice and snow.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
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
  pneumaticcraft
    .fluid_mixer(Fluid.water(1000), Fluid.of('tfmg:cooling_fluid', 50))
    .pressure(0)
    .item_output('minecraft:ice')

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
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:ice')
    .fluid_input(Fluid.of('tfmg:cooling_fluid', 50))
    .item_output('minecraft:packed_ice')

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
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:packed_ice')
    .fluid_input(Fluid.of('tfmg:cooling_fluid', 100))
    .item_output('minecraft:blue_ice')

  // Snow Blocks
  create.mixing(
    'minecraft:snow_block',
    [Fluid.water(1000), 'thermal:blizz_powder'],
    400
  )

  // Powdered Snow Buckets
  e.remove({ id: 'ars_nouveau:air_essence_to_snow_bucket' })
  create
    .SequencedAssembly('minecraft:water_bucket')
    .deploy('thermal:blizz_powder')
    .vibrate(100)
    .outputs('minecraft:powder_snow_bucket')
})
