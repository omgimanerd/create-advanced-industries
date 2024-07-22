// priority: 500
// Recipe overhauls for Deepslate and Reinforced Deepslate

LootJS.modifiers((e) => {
  // Make reinforced mineable by pickaxes.
  e.addBlockLootModifier('minecraft:reinforced_deepslate')
    .matchMainHand(ItemFilter.PICKAXE)
    .addLoot('minecraft:reinforced_deepslate')
})

ServerEvents.tags('block', (e) => {
  // Make reinforced deepslate mineable by diamond level pickaxes.
  e.add('minecraft:mineable/pickaxe', 'minecraft:reinforced_deepslate')
  e.add('minecraft:needs_diamond_tool', 'minecraft:reinforced_deepslate')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Regular deepslate has a small nickel yield when melted, making it a
  // viable but inefficient way to get invar.
  create
    .compacting(
      [Fluid.of('kubejs:molten_iron', 10), Fluid.of('kubejs:molten_nickel', 2)],
      'minecraft:deepslate'
    )
    .superheated()

  // Make reinforced deepslate accessible.
  e.shaped(
    '4x minecraft:reinforced_deepslate',
    [
      'IDI', //
      'DDD', //
      'IDI', //
    ],
    { I: 'thermal:invar_ingot', D: 'minecraft:deepslate' }
  )
  create
    .SequencedAssembly('minecraft:deepslate')
    .deploy('vintageimprovements:invar_rod')
    .press(2)
    .outputs('minecraft:reinforced_deepslate')
})
