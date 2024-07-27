// priority: 200
// Redstone mechanisms.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  const MeltableItem = global.MeltableItem

  // Red alloy overhaul
  e.remove({ id: 'morered:red_alloy_ingot_from_jumbo_smelting' })
  e.shaped(
    'morered:red_alloy_ingot',
    [
      'RRR', //
      'ROR', //
      'RRR', //
    ],
    { R: 'minecraft:redstone', O: 'create_new_age:overcharged_iron' }
  )
  create.filling('morered:red_alloy_ingot', [
    'create_new_age:overcharged_iron',
    Fluid.of('kubejs:molten_redstone', 360),
  ])

  // Rolling red alloy into wire
  create.rolling('6x morered:red_alloy_wire', 'morered:red_alloy_ingot')

  // Alternative recipes for vanilla redstone components.
  create.filling('minecraft:redstone_torch', [
    'minecraft:stick',
    Fluid.of('kubejs:molten_redstone', MeltableItem.DEFAULT_INGOT_FLUID / 2),
  ])
  create
    .SequencedAssembly('minecraft:smooth_stone_slab')
    .deploy('minecraft:redstone_torch')
    .deploy('minecraft:redstone')
    .outputs('minecraft:repeater')
  create
    .SequencedAssembly('minecraft:smooth_stone_slab')
    .deploy('minecraft:redstone_torch')
    .deploy('minecraft:quartz')
    .outputs('minecraft:comparator')

  // Redstone mechanism overhaul, with more expensive manual recipe.
  e.remove({ id: 'vintageimprovements:sequenced_assembly/redstone_module' })
  e.shaped(
    REDSTONE_MECHANISM,
    [
      'RWR', //
      'CMC', //
      'RWR', //
    ],
    {
      R: 'minecraft:redstone_block',
      W: 'morered:red_alloy_wire',
      C: 'minecraft:comparator',
      M: PRECISION_MECHANISM,
    }
  )
  create
    .SequencedAssembly(PRECISION_MECHANISM, INCOMPLETE_REDSTONE_MECHANISM)
    .fill(Fluid.of('kubejs:molten_redstone', MeltableItem.DEFAULT_INGOT_FLUID))
    .deploy('morered:red_alloy_wire')
    .deploy('minecraft:comparator')
    .outputs(REDSTONE_MECHANISM)
})
