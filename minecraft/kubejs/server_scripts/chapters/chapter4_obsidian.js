// priority: 100
// Recipe overhauls and standardization for obsidian automation.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Remove magma block alternatives.
  e.remove({ output: 'minecraft:magma_block' })
  e.remove({ id: 'thermal:machines/press/packing2x2/press_magma_packing' })
  create.filling('minecraft:magma_block', [
    '#forge:cobblestone',
    Fluid.lava(250),
  ])

  // Magma blocks cool to obsidian instead of netherrack.
  e.remove({ id: 'pneumaticcraft:block_heat_properties/minecraft/magma' })
  pneumaticcraft
    .heat_properties()
    .block('minecraft:magma_block')
    .temperature(273 + 1027)
    .thermalResistance(500)
    .heatCapacity(10000)
    .transformCold({ block: 'minecraft:obsidian' })
  pneumaticcraft
    .heat_frame_cooling('minecraft:magma_block', 'minecraft:obsidian')
    .max_temp(273 + 0)

  // Obsidian overhaul.
  e.shapeless('minecraft:obsidian', [
    'minecraft:water_bucket',
    'minecraft:lava_bucket',
  ])
    .replaceIngredient('minecraft:water_bucket', 'minecraft:bucket')
    .replaceIngredient('minecraft:lava_bucket', 'minecraft:bucket')
  create.mixing('minecraft:obsidian', [Fluid.lava(1000), Fluid.water(1000)])
  e.remove({ id: 'pneumaticcraft:fluid_mixer/mix_obsidian' })
  pneumaticcraft
    .fluid_mixer(Fluid.water(500), Fluid.lava(500))
    .item_output('minecraft:obsidian')
    .pressure(4)
    .time(80)

  // Powdered obsidian.
  e.remove({ id: 'create:crushing/obsidian' })
  create.crushing(
    [
      '5x create:powdered_obsidian',
      Item.of('create:powdered_obsidian', 2).withChance(0.5),
      Item.of('create:powdered_obsidian', 2).withChance(0.25),
    ],
    'minecraft:obsidian'
  )
  e.recipes.ars_nouveau.crush('minecraft:obsidian', [
    Item.of('create:powdered_obsidian', 5).withChance(1),
    Item.of('create:powdered_obsidian', 2).withChance(0.5),
    Item.of('create:powdered_obsidian', 2).withChance(0.25),
  ])

  // Powdered obsidian block back to obsidian.
  e.blasting(
    'minecraft:obsidian',
    'create_things_and_misc:powdered_obsidian_block'
  )
})
