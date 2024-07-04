// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // sculk farming to make enderium
  // enderium recipe from liquid hyper exp

  // Thermal molten fluid components
  create
    .SequencedAssembly('minecraft:glowstone_dust')
    .custom('', (pre, post) => {
      create.crushing(post, pre)
    })
    .custom('Next: Energize with 8000 RF', (pre, post) => {
      e.recipes.create_new_age.energising(post, pre, 8000)
    })
    .custom('Next: Melt in a heated basin', (pre, post) => {
      create.mixing(post, pre).heated()
    })
    .outputs(Fluid.of('thermal:glowstone', 250))
  create
    .compacting(Fluid.of('thermal:ender', 250), 'kubejs:resonant_ender_pearl')
    .superheated()

  // Redstone pearls
  e.remove({ id: 'createteleporters:redstone_pearl_recipe' })
  create
    .SequencedAssembly('minecraft:ender_pearl')
    .fill(Fluid.of('kubejs:molten_redstone', 180))
    .energize(40000)
    .outputs('createteleporters:redstone_pearl')
})
