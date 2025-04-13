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

ServerEvents.tags('item', (e) => {
  e.add('kubejs:create_stone_ore_processing', 'create:asurine')
  e.add('kubejs:create_stone_ore_processing', 'create:veridium')
  e.add('kubejs:create_stone_ore_processing', 'create:crimsite')
  e.add('kubejs:create_stone_ore_processing', 'create:ochrum')
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
    // Crushing the raw ore yields the crushed form with better yields and some
    // experience as a byproduct.
    e.remove({ type: 'create:crushing', output: crushed })
    create.crushing(
      [
        crushed,
        Item.of(crushed).withChance(0.5),
        Item.of('create:experience_nugget').withChance(0.1),
      ],
      raw
    )

    // The crushed form can be vibrated to dirty dust.
    create.vibrating([dirty, Item.of(dirty).withChance(0.5)], crushed)

    // Dirty dust can be washed to the regular dust form. This has a higher
    // yield to compensate for the fact that melting dust is a 1x conversion.
    create.splashing([dust, Item.of(dust).withChance(0.5)], dirty)

    // The dirty dust can also be smelted into ingots (lazy conversion).
    e.smelting(ingot, dirty)

    // Melting each of the raw intermediate forms increases yield and has a slag
    // byproduct. This is only not applicable to dust, otherwise ore can be
    // duped with crushing + melting.
    for (const form of [raw, crushed, dirty]) {
      create
        .mixing(
          [
            Fluid.of(fluid, DEFAULT_INGOT_FLUID * (4 / 3)),
            Fluid.of('tfmg:molten_slag', DEFAULT_INGOT_FLUID),
          ],
          form
        )
        .heated()
    }
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

  const basicCrushing = {
    'create:crimsite': 'kubejs:crushed_crimsite',
    'create:veridium': 'kubejs:crushed_veridium',
    'create:ochrum': 'kubejs:crushed_ochrum',
    'create:asurine': 'kubejs:crushed_asurine',
  }
  for (const [raw, crushed] of Object.entries(basicCrushing)) {
    create.crushing(crushed, raw)
    e.recipes.ars_nouveau.crush(raw, Item.of(crushed).withChance(1))
  }

  const tier1Crushing = {
    'kubejs:crushed_crimsite': 'minecraft:raw_iron',
    'kubejs:crushed_veridium': 'minecraft:raw_copper',
    'kubejs:crushed_ochrum': 'minecraft:raw_gold',
    'kubejs:crushed_asurine': 'create:raw_zinc',
  }
  // Every Create stone has a dichotomic opposite.
  const dichotomicSecondary = {
    'minecraft:raw_iron': 'thermal:raw_nickel',
    'minecraft:raw_copper': 'thermal:raw_tin',
    'minecraft:raw_gold': 'thermal:raw_silver',
    'create:raw_zinc': 'thermal:raw_lead',
  }
  for (const [stone, result] of Object.entries(tier1Crushing)) {
    // Tier 1: Basic crushing yields its direct result.
    create.crushing(
      [
        Item.of(result),
        Item.of(result).withChance(0.25),
        Item.of('create:experience_nugget').withChance(0.25),
      ],
      stone
    )

    // Tier 2: Mixing with slag has a chance to yield the dichotomic secondary
    // and some rich slag.
    let secondary = dichotomicSecondary[result]
    create
      .mixing(
        [
          Item.of(result),
          Item.of(result).withChance(0.25),
          Item.of(secondary).withChance(0.75),
          'thermal:rich_slag',
        ],
        [stone, 'thermal:slag']
      )
      .heated()

    // Tier 3: Using liquid source as a catalyst can quadruple the output.
    create
      .pressurizing([stone, 'thermal:slag'])
      .secondaryFluidInput(Fluid.of('starbunclemania:source_fluid', 250))
      .heated()
      .outputs([
        Item.of(result, 3),
        Item.of(secondary, 1),
        Item.of(secondary).withChance(0.5),
        '2x thermal:rich_slag',
      ])
  }
})
