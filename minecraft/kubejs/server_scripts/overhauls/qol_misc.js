// priority: 0
// Recipe overhauls for uncategorized misc and qol mods.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Another source of green dye
  e.blasting('minecraft:green_dye', 'minecraft:kelp')

  // Craftable ways to get some of Quark's nice stones.
  create.compacting('quark:jasper', 'minecraft:granite')
  create.compacting('quark:shale', 'create:limestone')

  // Haunting cobblestone to get infested cobblestone.
  create.haunting('minecraft:infested_cobblestone', 'minecraft:cobblestone')

  // Move pressure chamber crafting of slime ball to create mixing.
  e.remove({ id: 'pneumaticcraft:pressure_chamber/milk_to_slime_balls' })
  create.mixing(Item.of('minecraft:slime_ball', 4), [
    Fluid.of('minecraft:milk', 1000),
    Item.of('minecraft:green_dye', 4),
  ])

  // Gate advanced magnet behind brass instead of gold.
  e.replaceInput(
    { id: 'simplemagnets:advancedmagnet' },
    'minecraft:gold_ingot',
    'create:brass_ingot'
  )
})
