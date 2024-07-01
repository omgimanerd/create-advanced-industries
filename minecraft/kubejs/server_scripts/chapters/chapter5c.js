// priority: 200
// Recipe overhauls for Chapter 5C progression.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const MeltableItem = global.MeltableItem

  e.remove({ id: 'create_connected:sequenced_assembly/control_chip' })

  // TODO do something with control chip?

  e.remove({ id: 'vintageimprovements:sequenced_assembly/redstone_module' })
  create
    .SequencedAssembly('create:precision_mechanism')
    .fill(Fluid.of('kubejs:molten_redstone', MeltableItem.DEFAULT_NUGGET_FLUID))
    .deploy('create_connected:control_chip')
    .deploy('morered:red_alloy_wire')
    .loops(4)
    .outputs('vintageimprovements:redstone_module')
})
