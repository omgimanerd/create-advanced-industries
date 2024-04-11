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

JEIEvents.addItems((e) => {
  e.add('thermal:drill_head')
  e.add('thermal:saw_blade')
})

JEIEvents.hideItems((e) => {
  // Defined in server_scripts/removed_recipes.js
  if (global.hideJEI) {
    global.removedRecipes.forEach((r) => {
      if (r.output) {
        e.hide(r.output)
      }
    })
  }

  // Hide intermediate mechanism items.
  // e.hide('kubejs:incomplete_andesite_mechanism')
  // e.hide('kubejs:incomplete_copper_mechanism')
  // e.hide('kubejs:incomplete_source_mechanism')
})

JEIEvents.removeCategories((e) => {
  e.remove('thermal:bottler')
  e.remove('thermal:furnace')
})
