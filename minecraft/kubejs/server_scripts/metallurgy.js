// priority: 100

global.metallurgy = global.metallurgy === undefined ? {} : global.metallurgy

ServerEvents.recipes((e) => {
  global.metallurgy.meltable_items.forEach((i) => {
    i.registerMeltingRecipes(e)
      .registerCastingRecipes(e)
      .registerWashedCastRecipes(e)
  })
})
