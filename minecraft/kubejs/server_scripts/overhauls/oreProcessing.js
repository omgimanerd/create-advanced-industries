// priority: 500

ServerEvents.tags('block', (e) => {
  for (const stone of [
    'asurine',
    'veridium',
    'crimsite',
    'ochrum',
    'scorchia',
    'scoria',
  ]) {
    e.add('kubejs:dormant_vent', `molten_vents:dormant_molten_${stone}`)
    e.add('kubejs:active_vent', `molten_vents:active_molten_${stone}`)
  }
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  const MeltableItem = global.MeltableItem
  const DEFAULT_INGOT_FLUID = MeltableItem.DEFAULT_INGOT_FLUID

  const oreProcessingMetals = global.getMaterialType(
    global.MATERIAL_TYPE_BASE_METAL
  )

  //////////////////////////
  // BASIC ORE PROCESSING //
  //////////////////////////
  for (const {
    raw,
    crushed,
    dirty,
    dust,
    ingot,
    fluid,
  } of oreProcessingMetals) {
    // Overhaul crushing the raw ore to the crushed form.
    e.remove({ type: 'create:crushing', output: crushed })
    create.crushing(
      [
        crushed,
        Item.of(crushed).withChance(0.5),
        Item.of('create:experience_nugget').withChance(0.1),
      ],
      raw
    )

    // Melting the raw ore has a slight additional yield and has slag byproduct.
    create
      .mixing(
        [Fluid.of(fluid, DEFAULT_INGOT_FLUID * (10 / 9)), 'thermal:slag'],
        raw
      )
      .heated()

    // The crushed form can be vibrated to dirty dust.
    create.vibrating([dirty, Item.of(dirty).withChance(0.5)], crushed)

    // The crushed form can also be smelted into ingots.
    e.blasting(ingot, dirty)

    // Melting the crushed form has slight additional yield
    create
      .mixing(
        [Fluid.of(fluid, DEFAULT_INGOT_FLUID * (11 / 9)), 'thermal:slag'],
        crushed
      )
      .heated()

    // Dirty dust can be washed to the regular dust form.
    create.splashing([dust, Item.of(dust).withChance(0.1)], dirty)

    // Dirty dust can be melted for a slight gain and slag output
    create
      .mixing(
        [Fluid.of(fluid, DEFAULT_INGOT_FLUID * (12 / 9)), 'thermal:slag'],
        dirty
      )
      .heated()
  }

  // Only zinc dust does not have a smelting recipe.
  e.blasting('create:zinc_ingot', 'kubejs:zinc_dust')

  /////////////////////////////
  // ADVANCED ORE PROCESSING //
  /////////////////////////////

  // The four create stones veridium, ochrum, asurine, and crimsite can be
  // processed into 8 different ore types with varying amounts of effort.

  // Remove default crushing recipes.
  e.remove({ id: /^create:crushing\/crimsite.*$/ })
  e.remove({ id: /^create:crushing\/asurine.*$/ })
  e.remove({ id: /^create:crushing\/ochrum.*$/ })

  create.crushing('kubejs:crushed_crimsite', 'create:crimsite')
  e.recipes.ars_nouveau.crush(
    'create:crimsite',
    Item.of('kubejs:crushed_crimsite').withChance(1)
  )
  create.crushing('kubejs:crushed_veridium', 'create:veridium')
  e.recipes.ars_nouveau.crush(
    'create:veridium',
    Item.of('kubejs:crushed_veridium').withChance(1)
  )
  create.crushing('kubejs:crushed_ochrum', 'create:ochrum')
  e.recipes.ars_nouveau.crush(
    'create:ochrum',
    Item.of('kubejs:crushed_ochrum').withChance(1)
  )
  create.crushing('kubejs:crushed_asurine', 'create:asurine')
  e.recipes.ars_nouveau.crush(
    'create:asurine',
    Item.of('kubejs:crushed_ochrum').withChance(1)
  )

  const tier1Crushing = {
    'kubejs:crushed_crimsite': 'minecraft:raw_iron',
    'kubejs:crushed_veridium': 'minecraft:raw_copper',
    'kubejs:crushed_ochrum': 'minecraft:raw_gold',
    'kubejs:crushed_asurine': 'create:raw_zinc',
  }
  const crushedStones = Object.keys(tier1Crushing)
  const dichotomicSecondary = {
    'minecraft:raw_iron': 'thermal:raw_nickel',
    'minecraft:raw_copper': 'thermal:raw_tin',
    'minecraft:raw_gold': 'thermal:raw_silver',
    'create:raw_zinc': 'thermal:raw_lead',
  }
  for (const [stone, result] of Object.entries(tier1Crushing)) {
    // Tier 1
    create.crushing(
      [
        Item.of(result),
        Item.of(result).withChance(0.25),
        Item.of('create:experience_nugget').withChance(0.25),
      ],
      stone
    )

    // Tier 2
    let secondary = dichotomicSecondary[result]
    create
      .mixing(
        [
          Item.of(result),
          Item.of(result).withChance(0.25),
          Item.of(secondary).withChance(0.75),
          'thermal:rich_slag',
        ],
        [stone, 'create_things_and_misc:crushed_magma']
      )
      .heated()
  }

  // Tier 3
  const tier3Combinations = global.combinatorics(4, 3).map((indexes) => {
    return indexes.map((i) => crushedStones[i])
  })
  for (const combination of tier3Combinations) {
    let primaries = combination.map((v) => tier1Crushing[v])
    let secondaries = primaries.map((v) => dichotomicSecondary[v])
    let primaryItems = primaries.map((i) => Item.of(i).withChance(0.25))
    let secondaryItems = secondaries.map((i) => Item.of(i))
    create
      .pressurizing(
        combination.concat(Fluid.of('starbunclemania:source_fluid', 300))
      )
      .secondaryFluidInput(Fluid.of('vintageimprovements:sulfuric_acid', 150))
      .heated()
      .outputs(primaryItems.concat(secondaryItems))
  }
})
