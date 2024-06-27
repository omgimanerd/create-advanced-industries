// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  const metals = [
    {
      raw: 'minecraft:raw_iron',
      crushed: 'create:crushed_raw_iron',
      dirty: 'kubejs:dirty_iron_dust',
      dust: 'thermal:iron_dust',
      ingot: 'minecraft:iron_ingot',
    },
    {
      raw: 'minecraft:raw_copper',
      crushed: 'create:crushed_raw_copper',
      dirty: 'kubejs:dirty_copper_dust',
      dust: 'thermal:copper_dust',
      ingot: 'minecraft:copper_ingot',
    },
    {
      raw: 'minecraft:raw_gold',
      crushed: 'create:crushed_raw_gold',
      dirty: 'kubejs:dirty_gold_dust',
      dust: 'thermal:gold_dust',
      ingot: 'minecraft:gold_ingot',
    },
    {
      raw: 'create:raw_zinc',
      crushed: 'create:crushed_raw_zinc',
      dirty: 'kubejs:dirty_zinc_dust',
      dust: 'kubejs:zinc_dust',
      ingot: 'create:zinc_ingot',
    },
    {
      raw: 'thermal:raw_tin',
      crushed: 'create:crushed_raw_tin',
      dirty: 'kubejs:dirty_tin_dust',
      dust: 'thermal:tin_dust',
      ingot: 'thermal:tin_ingot',
    },
    {
      raw: 'thermal:raw_lead',
      crushed: 'create:crushed_raw_lead',
      dirty: 'kubejs:dirty_lead_dust',
      dust: 'thermal:lead_dust',
      ingot: 'thermal:lead_ingot',
    },
    {
      raw: 'thermal:raw_silver',
      crushed: 'create:crushed_raw_silver',
      dirty: 'kubejs:dirty_silver_dust',
      dust: 'thermal:silver_dust',
      ingot: 'thermal:silver_ingot',
    },
    {
      raw: 'thermal:raw_nickel',
      crushed: 'create:crushed_raw_nickel',
      dirty: 'kubejs:dirty_nickel_dust',
      dust: 'thermal:nickel_dust',
      ingot: 'thermal:nickel_ingot',
    },
  ]

  //////////////////////////
  // BASIC ORE PROCESSING //
  //////////////////////////

  // MeltableItem will become too bloated if we include the ore processing flow,
  // so it only handles the base registrations and the metallic forms of the
  // output, not the ore processing.

  for (const { raw, crushed, dirty, dust, ingot } of metals) {
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

    // The crushed form can be vibrated to dirty dust.
    create.vibrating([dirty, Item.of(dirty).withChance(0.5)], crushed)

    // The crushed form can also be smelted into ingots.
    e.blasting(ingot, dirty)

    // Dirty dust can be washed to the regular dust form.
    create.splashing([dust, Item.of(dust).withChance(0.1)], dirty)
  }

  // Only zinc dust does not have a smelting recipe since it was custom.
  e.blasting('create:zinc_ingot', 'kubejs:zinc_dust')

  /////////////////////////////
  // ADVANCED ORE PROCESSING //
  /////////////////////////////

  // Remove default crushing recipes.
  e.remove({ id: /^create:crushing\/crimsite.*$/ })
  e.remove({ id: /^create:crushing\/asurine.*$/ })
  e.remove({ id: /^create:crushing\/ochrum.*$/ })

  // Tier 1

  // The four create stones veridium, ochrum, asurine, and crimsite can be
  // processed into 8 different ore types with varying amounts of effort.
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
})
