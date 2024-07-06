// priority: 500

ServerEvents.tags('item', (e) => {
  Ingredient.of(/^quark:[a-z]+_corundum_cluster$/).itemIds.forEach((id) => {
    e.add('kubejs:corundum_cluster', id)
  })
})
