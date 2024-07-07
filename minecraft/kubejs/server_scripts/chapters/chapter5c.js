// priority: 200
// Recipe overhauls for Chapter 5C progression.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const MeltableItem = global.MeltableItem

  // Making destabilized redstone
  create
    .centrifuging(
      [Fluid.of('thermal:redstone', 500), potionFluid('quark:resilience', 500)],
      Fluid.of('kubejs:molten_redstone', 1000)
    )
    .minimalRPM(256)
    .processingTime(100)
  create
    .mixing(Fluid.of('kubejs:molten_redstone', 1000), [
      Fluid.of('thermal:redstone', 500),
      potionFluid('quark:resilience', 500),
      'minecraft:glowstone_dust',
    ])
    .superheated()

  // Control chip overhaul
  e.remove({ id: 'create_connected:sequenced_assembly/control_chip' })
  create
    .SequencedAssembly('create:brass_sheet')
    .deploy('vintageimprovements:signalum_wire')
    .fill(potionFluid('ars_elemental:shock_potion', 720))
    .energize(8000)
    .press()
    .outputs('create_connected:control_chip')

  // Redstone mechanism overhaul
  e.remove({ id: 'vintageimprovements:sequenced_assembly/redstone_module' })
  create
    .SequencedAssembly(PRECISION_MECHANISM, INCOMPLETE_REDSTONE_MECHANISM)
    .fill(Fluid.of('kubejs:molten_redstone', MeltableItem.DEFAULT_NUGGET_FLUID))
    .deploy('create_new_age:copper_circuit')
    .deploy('create_connected:control_chip')
    .deploy('morered:red_alloy_wire')
    .loops(4)
    .outputs(REDSTONE_MECHANISM)
})
