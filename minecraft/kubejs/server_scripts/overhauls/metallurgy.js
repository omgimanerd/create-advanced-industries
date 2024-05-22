// priority: 500
// Recipe registrations for metal casting and melting

ServerEvents.recipes((e) => {
  global.metallurgy.meltable_items.forEach((i) => {
    i.registerMeltingRecipes(e)
      .registerCastingRecipes(e)
      .registerWashedCastRecipes(e)
  })

  // Manually register melting recipes for all glass types
  e.recipes.create
    .mixing([Fluid.of('kubejs:molten_glass', 360)], '#forge:glass')
    .heated()
})
