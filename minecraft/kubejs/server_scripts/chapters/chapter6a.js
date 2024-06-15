// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // sculk farming to make enderium
  // enderium recipe from liquid hyper exp

  // Thermal molten fluid components
  create
    .mixing(
      [
        Fluid.of('thermal:redstone', 500),
        potionFluid('quark:resilience', 500),
        Item.of('apotheosis:vial_of_extraction').withChance(0.75),
      ],
      [
        Fluid.of('kubejs:molten_redstone', 1000),
        'apotheosis:vial_of_extraction',
      ]
    )
    .superheated()
  create
    .mixing(Fluid.of('kubejs:molten_redstone', 10), [
      Fluid.of('thermal:redstone', 500),
      potionFluid('quark:resilience', 500),
      'minecraft:glowstone_dust',
    ])
    .superheated()
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

  // Thermal alloys dusts
  e.remove({ id: 'thermal:lumium_dust_4' })
  create.mixing('4x thermal:lumium_dust', [
    '3x thermal:tin_dust',
    'thermal:silver_dust',
    Fluid.of('thermal:glowstone', 500),
  ])
  e.remove({ id: 'thermal:signalum_dust_4' })
  create.mixing('4x thermal:signalum_dust', [
    '3x thermal:copper_dust',
    'thermal:silver_dust',
    Fluid.of('thermal:redstone', 1000),
  ])
  e.remove({ id: 'thermal:enderium_dust_2' })
  create.mixing('4x thermal:enderium_dust', [
    '3x thermal:lead_dust',
    'thermal:diamond_dust',
    Fluid.of('thermal:ender', 500),
  ])

  // Redstone pearls
  e.remove({ id: 'createteleporters:redstone_pearl_recipe' })
  create
    .SequencedAssembly('minecraft:ender_pearl')
    .fill('kubejs:molten_redstone', 180)
    .energize(40000)
    .outputs('createteleporters:redstone_pearl')
})
