// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Remove default crushing recipes.
  e.remove({ id: /^create:crushing\/crimsite.*$/ })
  e.remove({ id: /^create:crushing\/asurine.*$/ })
  e.remove({ id: /^create:crushing\/ochrum.*$/ })

  // The four create stones veridium, ochrum, asurine, and crimsite can be
  // processed into 8 different ore types with varying amounts of effort.
  const oresToCrushed = {
    'minecraft:raw_iron': 'create:crushed_raw_iron',
    'minecraft:raw_copper': 'create:crushed_raw_copper',
    'minecraft:raw_gold': 'create:crushed_raw_gold',
    'create:raw_zinc': 'create:crushed_raw_zinc',
    'thermal:raw_tin': 'create:crushed_raw_tin',
    'thermal:raw_lead': 'create:crushed_raw_lead',
    'thermal:raw_silver': 'create:crushed_raw_silver',
    'thermal:raw_nickel': 'create:crushed_raw_nickel',
  }
  for (const [raw, crushed] of Object.entries(oresToCrushed)) {
    e.remove({ type: 'create:crushing', output: crushed })
    create.crushing(
      [
        crushed,
        Item.of(crushed).withChance(0.25),
        Item.of('create:experience_nugget').withChance(0.1),
      ],
      raw
    )
  }

  // Tier 1
  const tier1Crushing = {
    'create:crimsite': 'create:crushed_raw_iron',
    'create:veridium': 'create:crushed_raw_copper',
    'create:ochrum': 'create:crushed_raw_gold',
    'create:asurine': 'create:crushed_raw_zinc',
  }
  for (const [stone, crushed] of Object.entries(tier1Crushing)) {
    create.crushing(
      [
        Item.of(crushed),
        Item.of(crushed).withChance(0.5),
        Item.of('create:experience_nugget').withChance(0.25),
      ],
      stone
    )
  }

  // Tier 2

  // Tier 3

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

  // Thermal alloys
  e.remove({ id: /^thermal:fire_charge.*$/ })

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
