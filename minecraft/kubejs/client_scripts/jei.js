// priority: 0

const hiddenFluids = [
  'pneumaticcraft:memory_essence',
  'sophisticatedcore:xp_still',
  'thermal:creosote',
  'thermal:crude_oil',
  'thermal:heavy_oil',
  'thermal:light_oil',
  'thermal:refined_fuel',
  'tfmg:liquid_plastic',
  'tfmg:molten_slag',
  'tfmg:gasoline',
  'tfmg:diesel',
  'tfmg:kerosene',
  'tfmg:naphtha',
  'tfmg:heavy_oil',
  'tfmg:lubrication_oil',
  'tfmg:cooling_fluid',
]

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

  // Hide all the buckets for unused fluids.
  hiddenFluids.forEach((fluid) => {
    e.hide(`${fluid}_bucket`)
  })

  // Hide intermediate mechanism items.
  // e.hide('kubejs:incomplete_andesite_mechanism')
  // e.hide('kubejs:incomplete_copper_mechanism')
  // e.hide('kubejs:incomplete_source_mechanism')
})

JEIEvents.hideFluids((e) => {
  hiddenFluids.forEach((fluid) => {
    e.hide(fluid)
  })
})

// TODO: group all automated brewing recipes into custom category

JEIEvents.removeCategories((e) => {
  e.remove('thermal:bottler')
  e.remove('thermal:furnace')
  e.remove('thermal:brewer')
  e.remove('jumbofurnace:jumbo_smelting')
  e.remove('jumbofurnace:jumbo_furnace_upgrade')

  // DEBUG LOGGING ONLY
  // for (const b of e.getCategoryIds()) {
  //   console.log(b)
  // }
})
