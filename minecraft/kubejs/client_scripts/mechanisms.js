// priority: 0

// https://github.com/AlmostReliable/ponderjs/wiki
Ponder.registry((e) => {
  // e.create('minecraft:cobblestone').scene(
  //   'test_scene',
  //   'Example Scene',
  //   (scene, util) => {
  //     scene.showBasePlate()
  //     scene.idle(10)
  //   }
  // )
})

JEIEvents.hideItems((e) => {
  // Hide intermediate mechanism items.
  // e.hide('kubejs:incomplete_andesite_mechanism')
  // e.hide('kubejs:incomplete_copper_mechanism')
  // e.hide('kubejs:incomplete_source_mechanism')
  // Hide removed recipes from JEI.
  // e.hide('createaddition:electric_motor')
})
