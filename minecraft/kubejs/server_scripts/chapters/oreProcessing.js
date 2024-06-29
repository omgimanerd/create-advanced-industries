// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const MeltableItem = global.MeltableItem
  const DEFAULT_INGOT_FLUID = MeltableItem.DEFAULT_INGOT_FLUID

  // MeltableItem will become too bloated if we include the ore processing flow,
  // so it only handles the base registrations and the metallic forms of the
  // output, not the ore processing.
  const oreProcessingMetals = {
    iron: {
      raw: 'minecraft:raw_iron',
      crushed: 'create:crushed_raw_iron',
      dirty: 'kubejs:dirty_iron_dust',
      dust: 'thermal:iron_dust',
      ingot: 'minecraft:iron_ingot',
      fluid: 'kubejs:molten_iron',
    },
    copper: {
      raw: 'minecraft:raw_copper',
      crushed: 'create:crushed_raw_copper',
      dirty: 'kubejs:dirty_copper_dust',
      dust: 'thermal:copper_dust',
      ingot: 'minecraft:copper_ingot',
      fluid: 'kubejs:molten_copper',
    },
    gold: {
      raw: 'minecraft:raw_gold',
      crushed: 'create:crushed_raw_gold',
      dirty: 'kubejs:dirty_gold_dust',
      dust: 'thermal:gold_dust',
      ingot: 'minecraft:gold_ingot',
      fluid: 'kubejs:molten_gold',
    },
    zinc: {
      raw: 'create:raw_zinc',
      crushed: 'create:crushed_raw_zinc',
      dirty: 'kubejs:dirty_zinc_dust',
      dust: 'kubejs:zinc_dust',
      ingot: 'create:zinc_ingot',
      fluid: 'kubejs:molten_zinc',
    },
    tin: {
      raw: 'thermal:raw_tin',
      crushed: 'create:crushed_raw_tin',
      dirty: 'kubejs:dirty_tin_dust',
      dust: 'thermal:tin_dust',
      ingot: 'thermal:tin_ingot',
      fluid: 'kubejs:molten_tin',
    },
    lead: {
      raw: 'thermal:raw_lead',
      crushed: 'create:crushed_raw_lead',
      dirty: 'kubejs:dirty_lead_dust',
      dust: 'thermal:lead_dust',
      ingot: 'thermal:lead_ingot',
      fluid: 'kubejs:molten_lead',
    },
    silver: {
      raw: 'thermal:raw_silver',
      crushed: 'create:crushed_raw_silver',
      dirty: 'kubejs:dirty_silver_dust',
      dust: 'thermal:silver_dust',
      ingot: 'thermal:silver_ingot',
      fluid: 'kubejs:molten_silver',
    },
    nickel: {
      raw: 'thermal:raw_nickel',
      crushed: 'create:crushed_raw_nickel',
      dirty: 'kubejs:dirty_nickel_dust',
      dust: 'thermal:nickel_dust',
      ingot: 'thermal:nickel_ingot',
      fluid: 'kubejs:molten_nickel',
    },
  }

  //////////////////////////
  // BASIC ORE PROCESSING //
  //////////////////////////
  for (const [_, data] of Object.entries(oreProcessingMetals)) {
    let { raw, crushed, dirty, dust, ingot, fluid } = data
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

    // Melting the raw has only a slight additional yield, and is quite messy.
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

    // Regular dust can always be melted, and does not produce slag
    create.mixing(Fluid.of(fluid, DEFAULT_INGOT_FLUID), dust).heated()

    // Ingots can be crushed back into dust
    create.crushing(dust, ingot)
  }

  // Only zinc dust does not have a smelting recipe.
  e.blasting('create:zinc_ingot', 'kubejs:zinc_dust')

  // Lapis, diamond, emerald, and quartz dust can also be melted.
  create
    .mixing(
      Fluid.of('kubejs:molten_lapis', DEFAULT_INGOT_FLUID),
      'thermal:lapis_dust'
    )
    .heated()
  create
    .mixing(
      Fluid.of('kubejs:molten_diamond', DEFAULT_INGOT_FLUID),
      'thermal:diamond_dust'
    )
    .superheated()
  create
    .mixing(
      Fluid.of('kubejs:molten_emerald', DEFAULT_INGOT_FLUID),
      'thermal:emerald_dust'
    )
    .superheated()
  create
    .mixing(
      Fluid.of('kubejs:molten_quartz', DEFAULT_INGOT_FLUID),
      'thermal:quartz_dust'
    )
    .heated()

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
  create.crushing('kubejs:crushed_veridium', 'create:veridium')
  create.crushing('kubejs:crushed_ochrum', 'create:ochrum')
  create.crushing('kubejs:crushed_asurine', 'create:asurine')

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
          'thermal:slag',
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
