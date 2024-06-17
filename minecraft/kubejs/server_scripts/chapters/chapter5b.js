// priority: 100
// Recipe overhauls for Chapter 5B progression.

/**
 * Handler defined in startup_scripts/spoutHandlerRegistration.js
 * Defined here to allow for server side reload.
 * @type {Internal.SpecialSpoutHandlerEvent$SpoutHandler}
 * @param {Internal.BlockContainerJS} block
 * @param {Internal.FluidStackJS} fluid
 * @param {boolean} simulate
 * @returns {number} The amount of fluid used by the spout
 */
global.NetherWartSpoutHandlerCallback = (block, fluid, simulate) => {
  const fluidConsumption = 250
  const { properties } = block
  const age = parseInt(properties.getOrDefault('age', 3), 10)
  if (age == 3) return 0
  if (fluid.id !== 'sliceanddice:fertilizer') return 0
  if (fluid.amount < fluidConsumption) return 0
  if (!simulate) {
    block.set(block.id, { age: new String(age + 1) })
  }
  return fluidConsumption
}

/**
 * Callback handler for feeding and milking a blaze.
 */
ItemEvents.entityInteracted((e) => {
  const { hand, item, player, target } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'minecraft:blaze') return
  if (item.id !== 'minecraft:bucket' && item.id !== 'minecraft:lava_bucket') {
    return
  }
  let remainingMilks = target.persistentData.getInt('remaining_milks')
  // Feeding lava to the blaze.
  if (item.id === 'minecraft:lava_bucket') {
    item.count--
    player.addItem(item.getCraftingRemainingItem())
    remainingMilks = 3
  }

  if (item.id === 'minecraft:bucket') {
    if (remainingMilks === 0) {
      target.playSound('entity.villager.ambient', 2, 2)
      return
    }
    item.count--
    player.addItem('kubejs:blaze_milk_bucket')
    remainingMilks--
  }
  target.persistentData.putInt('remaining_milks', remainingMilks)
})

/**
 * Event handler for mushroom growth from moss blocks.
 */
BlockEvents.rightClicked('minecraft:moss_block', (e) => {
  const { item, hand, block, level, server } = e
  if (hand !== 'main_hand') return
  if (
    item.id !== 'minecraft:brown_mushroom' &&
    item.id !== 'minecraft:red_mushroom'
  ) {
    return
  }
  const newBlock = `${item.id}_block`

  /**
   * Recursive function to spread mushroom blocks to nearby moss blocks with
   * a configurable decay and increasing delay.
   * @param {Internal.BlockContainerJS} block
   * @param {number} probability
   * @param {number} decayFactor
   * @param {number} delay
   */
  const decayedSpread = (block, probability, decayFactor, delay) => {
    if (block.id !== 'minecraft:moss_block') return
    if (Math.random() > probability) return
    spawnParticles(
      level,
      'minecraft:composter',
      block.pos.center.add(0, 0.5, 0),
      0.3,
      20,
      0.3
    )
    block.set(newBlock)
    server.scheduleInTicks(delay, (c) => {
      const newProbability = probability * decayFactor
      const newDelay = delay + global.randRange(10)
      decayedSpread(block.north, newProbability, decayFactor, newDelay)
      decayedSpread(block.south, newProbability, decayFactor, newDelay)
      decayedSpread(block.east, newProbability, decayFactor, newDelay)
      decayedSpread(block.west, newProbability, decayFactor, newDelay)
      c.reschedule()
    })
  }
  decayedSpread(block, 1, 0.5, global.randRange(10))
})

/**
 * Event handler to handle spawning spiders with Anima Essence.
 */
BlockEvents.rightClicked('minecraft:cobweb', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'ars_elemental:anima_essence') return
  const spider = block.createEntity('minecraft:spider')
  // Center the spider on the block
  spider.setPos(block.pos.center)
  spider.spawn()
  level.destroyBlock(block, false)
  item.count--
})

ServerEvents.compostableRecipes((e) => {
  // Edit compostable chances
  e.remove('minecraft:flowering_azalea')
  e.remove('minecraft:azalea')
  e.add('minecraft:flowering_azalea', 1)
  e.add('minecraft:azalea', 1)
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Blaze milk to blaze powder
  create
    .mixing('2x minecraft:blaze_powder', Fluid.of('kubejs:blaze_milk', 250))
    .heated()

  // Compost block from compost
  redefineRecipe(
    '8x farmersdelight:organic_compost',
    [
      'CBC', //
      'NDN', //
      'CBC',
    ],
    {
      C: 'thermal:compost',
      B: 'minecraft:bone_meal',
      D: 'minecraft:dirt',
      N: 'thermal:niter_dust',
    }
  )

  // Moss block automation
  create
    .item_application('minecraft:moss_block', [
      'minecraft:stone',
      'createaddition:biomass',
    ])
    .id('kubejs:moss_from_biomass_application')

  // Flowering Azaleas can be drained for a large amount of source.
  create.emptying(
    [Fluid.of('starbunclemania:source_fluid', 750), 'minecraft:azalea'],
    'minecraft:flowering_azalea'
  )

  // Bonemeal cannot be reverse crafted from bone blocks.
  e.remove({ id: 'minecraft:bone_meal_from_bone_block' })
  create.milling(
    [
      '6x minecraft:bone_meal',
      Item.of('minecraft:bone_meal', 3).withChance(0.5),
    ],
    'minecraft:bone_block'
  )
  create.crushing('9x minecraft:bone_meal', 'minecraft:bone_block')

  // Cobweb crafting
  e.shaped(
    'minecraft:cobweb',
    [
      'SSS', //
      'SLS', //
      'SSS', //
    ],
    {
      S: 'minecraft:string',
      L: 'minecraft:slimeball',
    }
  )

  // Sawdust recipe
  create.crushing(
    ['9x thermal:sawdust', Item.of('thermal:sawdust', 3).withChance(0.5)],
    '#minecraft:logs'
  )
  create.milling('9x thermal:sawdust', '#minecraft:logs')
  e.recipes.ars_nouveau.crush('#minecraft:logs', [
    Item.of('thermal:sawdust', 9).withChance(1),
    Item.of('thermal:sawdust', 9).withChance(0.5),
  ])

  // TODO sawdust + glue to paper

  // Blasting recipe for sawdust to charcoal dust.
  e.remove({ id: 'create:milling/charcoal' })
  e.blasting('tfmg:charcoal_dust', 'thermal:sawdust')

  // Potash/potassium nitrate, or nitrate dust.
  create
    .mixing('2x thermal:niter_dust', [
      Fluid.water(1000),
      '2x tfmg:charcoal_dust',
    ])
    .heated()

  // Potion filling way to make sulfur
  create.filling('thermal:sulfur_dust', [
    'create:cinder_flour',
    potionFluid('minecraft:swiftness', 25),
  ])

  // Overhaul all gunpowder recipes to only use powders
  e.remove({ id: 'thermal:gunpowder_4' })
  e.remove({ id: 'tfmg:mixing/gun_powder' })
  e.shapeless('8x minecraft:gunpowder', [
    '6x thermal:niter_dust',
    'thermal:sulfur_dust',
    'tfmg:charcoal_dust',
  ])

  // Glowstone and redstone automation from potion brewing is encouraged
  // Gem dust automation
  create.filling('apotheosis:gem_dust', [
    'create:cinder_flour',
    Fluid.of('starbunclemania:source_fluid', 9),
  ])

  // The four alchemical powders can be crafted into sacred salt.
  e.remove({ id: 'gag:sacred_salt' })
  e.shapeless('4x gag:sacred_salt', [
    'apotheosis:gem_dust',
    'minecraft:glowstone_dust',
    'minecraft:redstone',
    'minecraft:gunpowder',
  ])

  // Liquid fertilizer
  e.remove({ id: /^sliceanddice:mixing\/fertilizer.*/ })
  create
    .mixing(Fluid.of('sliceanddice:fertilizer', 1000), [
      '4x farmersdelight:organic_compost',
      Fluid.water(1000),
    ])
    .heated()

  // Crystal growth accelerator
  create.mixing(Fluid.of('kubejs:crystal_growth_accelerator', 1000), [
    'apotheosis:gem_dust',
    'minecraft:redstone',
    'minecraft:glowstone_dust',
    'minecraft:gunpowder',
    Fluid.of('sliceanddice:fertilizer', 1000),
  ])

  // Dowsing rod
  redefineRecipe(
    'ars_nouveau:dowsing_rod',
    [
      ' G ', //
      'GMG', //
      'P P', //
    ],
    {
      G: 'minecraft:gold_ingot',
      M: 'kubejs:source_mechanism',
      P: 'ars_nouveau:archwood_planks',
    }
  )

  // Budding amethyst alternative recipe
  create
    .SequencedAssembly('minecraft:amethyst_block')
    .deploy('minecraft:small_amethyst_bud')
    .deploy('minecraft:medium_amethyst_bud')
    .deploy('minecraft:large_amethyst_bud')
    .deploy('minecraft:amethyst_cluster')
    .fill(Fluid.of('kubejs:crystal_growth_accelerator', 1000))
    .outputs('minecraft:budding_amethyst')

  // Remy spawner charm
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'pneumaticcraft:salmon_tempura',
      'farmersdelight:fried_rice',
      'farmersdelight:squid_ink_pasta',
      'farmersdelight:apple_pie_slice',
      'farmersdelight:melon_juice',
      'farmersdelight:hamburger',
      'farmersdelight:roast_chicken',
      'farmersdelight:stuffed_potato',
    ],
    'ars_nouveau:amethyst_golem_charm',
    'kubejs:remy_spawner'
  )

  // Amethyst bud growth. The most expensive is sequenced filling, then
  // Thermal crystallization, then manual spouting.
  create
    .SequencedAssembly('minecraft:small_amethyst_bud')
    .fill('kubejs:crystal_growth_accelerator', 100)
    .loops(10)
    .outputs('minecraft:medium_amethyst_bud')
  create
    .SequencedAssembly('minecraft:medium_amethyst_bud')
    .fill('kubejs:crystal_growth_accelerator', 100)
    .loops(10)
    .outputs('minecraft:large_amethyst_bud')
  create
    .SequencedAssembly('minecraft:large_amethyst_bud')
    .fill('kubejs:crystal_growth_accelerator', 100)
    .loops(10)
    .outputs('minecraft:amethyst_cluster')
  e.recipes.thermal
    .crystallizer('minecraft:medium_amethyst_bud', [
      'minecraft:small_amethyst_bud',
      Fluid.of('kubejs:crystal_growth_accelerator', 500),
    ])
    .energy(8000) // 20 RF/t = 20s
  e.recipes.thermal
    .crystallizer('minecraft:large_amethyst_bud', [
      'minecraft:medium_amethyst_bud',
      Fluid.of('kubejs:crystal_growth_accelerator', 500),
    ])
    .energy(8000) // 20 RF/t = 20s
  e.recipes.thermal
    .crystallizer('minecraft:amethyst_cluster', [
      'minecraft:large_amethyst_bud',
      Fluid.of('kubejs:crystal_growth_accelerator', 500),
    ])
    .energy(8000) // 20 RF/t = 20s

  const elementals = [
    {
      element: 'air',
      gem: 'kubejs:topaz',
      focus: 'ars_elemental:lesser_air_focus',
      essence: 'ars_nouveau:air_essence',
      essence_fluid: 'kubejs:liquid_air_essence',
      archwood: 'ars_nouveau:yellow_archwood', // not a complete id
      archwood_sap: 'kubejs:flashing_archwood_sap',
      archwood_fruit: 'ars_elemental:flashpine_pod',
      sap_byproduct: 'createaddition:bioethanol',
    },
    {
      element: 'water',
      gem: 'minecraft:lapis_lazuli',
      focus: 'ars_elemental:lesser_water_focus',
      essence: 'ars_nouveau:water_essence',
      essence_fluid: 'kubejs:liquid_water_essence',
      archwood: 'ars_nouveau:blue_archwood', // not a complete id
      archwood_sap: 'kubejs:cascading_archwood_sap',
      archwood_fruit: 'ars_nouveau:frostaya_pod',
      sap_byproduct: 'thermal:latex',
    },
    {
      element: 'fire',
      gem: 'thermal:ruby',
      focus: 'ars_elemental:lesser_fire_focus',
      essence: 'ars_nouveau:fire_essence',
      essence_fluid: 'kubejs:liquid_fire_essence',
      archwood: 'ars_nouveau:red_archwood', // not a complete id
      archwood_sap: 'kubejs:blazing_archwood_sap',
      archwood_fruit: 'ars_nouveau:bombegranate_pod',
      sap_byproduct: 'tfmg:crude_oil_fluid',
    },
    {
      element: 'earth',
      gem: 'minecraft:emerald',
      focus: 'ars_elemental:lesser_earth_focus',
      essence: 'ars_nouveau:earth_essence',
      essence_fluid: 'kubejs:liquid_earth_essence',
      archwood: 'ars_nouveau:green_archwood', // not a complete id
      archwood_sap: 'kubejs:flourishing_archwood_sap',
      archwood_fruit: 'ars_nouveau:mendosteen_pod',
      sap_byproduct: 'create_enchantment_industry:experience',
    },
  ]

  for (let { gem, focus, essence } of elementals) {
    // Amethyst to elemental gem infusion
    e.recipes.ars_nouveau.imbuement(
      'minecraft:amethyst_shard',
      gem,
      2500,
      Array(8).fill(essence)
    )

    // Elemental gem to elemental foci crafting.
    e.remove({ id: focus })
    e.recipes.ars_nouveau.enchanting_apparatus(
      [essence, 'minecraft:gold_ingot', essence, 'minecraft:gold_ingot'],
      gem,
      focus,
      2000
    )
  }

  // Custom fertilizers for boosting the Arboreal Extractor
  e.recipes.thermal.tree_extractor_boost(
    'farmersdelight:organic_compost',
    /*output=*/ 8,
    /*cycles=*/ 16
  )

  // Elemental essence from Archwood trees.
  for (let {
    element,
    gem,
    essence,
    essence_fluid,
    archwood,
    archwood_sap,
    archwood_fruit,
    sap_byproduct,
  } of elementals) {
    // Archwood Tree Sap Extraction
    e.recipes.thermal.tree_extractor(
      Fluid.of(archwood_sap, 50),
      `${archwood}_log`,
      `${archwood}_leaves`
    )

    // Archwood tree sap can be processed into liquid essence
    // Create mixing recipes have slight loss compared to Pneumaticcraft
    let mixing = create.mixing(
      [
        Fluid.of(essence_fluid, 20),
        Fluid.of('starbunclemania:source_fluid', 10),
        Fluid.of(sap_byproduct, 5),
      ],
      Fluid.of(archwood_sap, 50)
    )
    if (element === 'fire') {
      mixing.superheated()
    } else {
      mixing.heated()
    }
    pneumaticcraft.refinery(
      Fluid.of(archwood_sap, 50),
      [
        Fluid.of(essence_fluid, 25),
        Fluid.of('starbunclemania:source_fluid', 15),
        Fluid.of(sap_byproduct, 10),
      ],
      { min_temp: 273 + 300 }
    )

    // Solidifying the liquid essences
    // Create recipes have a slight loss compared to Pneumaticcraft
    create.compacting(essence, Fluid.of(essence_fluid, 250))
    pneumaticcraft
      .heat_frame_cooling(Fluid.of(essence_fluid, 1000), Item.of(essence, 10))
      .max_temp(0)

    // The liquid essence can be crystallized directly into the elemental gem.
    e.recipes.thermal
      .crystallizer(gem, [
        Fluid.of(essence_fluid, 1000),
        'minecraft:amethyst_shard',
      ])
      .energy(8000)

    // Archwood tree sap can be used to get the Ars fruits
    create.filling(archwood_fruit, [
      'minecraft:apple',
      Fluid.of(archwood_sap, 1000),
    ])
  }

  // Manual definitions for Vexing Archwood, which does not correspond to an
  // element.
  e.recipes.thermal.tree_extractor(
    Fluid.of('kubejs:vexing_archwood_sap', 50),
    'ars_nouveau:purple_archwood_log',
    'ars_nouveau:purple_archwood_leaves'
  )
  create
    .mixing(
      [
        Fluid.of('starbunclemania:source_fluid', 25),
        Fluid.of('thermal:latex', 5),
        Fluid.of('kubejs:crystal_growth_accelerator', 5),
      ],
      Fluid.of('kubejs:vexing_archwood_sap', 50)
    )
    .heated()
  pneumaticcraft.refinery(
    Fluid.of('kubejs:vexing_archwood_sap', 50),
    [
      Fluid.of('starbunclemania:source_fluid', 30),
      Fluid.of('thermal:latex', 10),
      Fluid.of('kubejs:crystal_growth_accelerator', 10),
    ],
    { min_temp: 273 + 100 }
  )
  create.filling('ars_nouveau:bastion_pod', [
    'minecraft:apple',
    Fluid.of('kubejs:vexing_archwood_sap', 500),
  ])

  // Custom recipe for the Archmage Spell book without nether stars.
  e.remove({ id: 'ars_nouveau:archmage_spell_book_upgrade' })
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'ars_elemental:lesser_air_focus',
      'ars_elemental:lesser_earth_focus',
      'ars_elemental:lesser_fire_focus',
      'ars_elemental:lesser_water_focus',
      'ars_nouveau:wilden_tribute',
    ],
    'ars_nouveau:apprentice_spell_book',
    'ars_nouveau:archmage_spell_book',
    8000,
    true
  )

  // Wilden Tribute can be duped with Wandering Trader essences
  e.remove({ output: 'ars_elemental:mark_of_mastery' })
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'ars_nouveau:earth_essence',
      'ars_nouveau:fire_essence',
      'ars_nouveau:water_essence',
      'ars_nouveau:air_essence',
      'ars_nouveau:abjuration_essence',
      'ars_nouveau:conjuration_essence',
      'ars_nouveau:manipulation_essence',
      'ars_elemental:anima_essence',
    ],
    'ars_nouveau:wilden_tribute',
    'ars_elemental:mark_of_mastery'
  )
  create
    .SequencedAssembly('ars_elemental:mark_of_mastery')
    .deploy('kubejs:agony_essence')
    .deploy('kubejs:torment_essence')
    .deploy('kubejs:suffering_essence')
    .deploy('kubejs:mutilation_essence')
    .deploy('kubejs:debilitation_essence')
    .outputs([
      Item.of('ars_nouveau:wilden_tribute', 1).withChance(0.85),
      Item.of('ars_nouveau:wilden_tribute', 2).withChance(0.15),
    ])

  // Liquid experience standardization, it must be melted into liquid form.
  // Liquid experience is 1:1 with XP points
  e.remove({ id: 'compressedcreativity:thermo_plant/essence_to_nugget' })
  e.remove({ id: 'compressedcreativity:mixing/memory_essence' })
  e.remove({
    id: /^create_enchantment_industry:disenchanting\/experience_.*$/,
  })
  e.remove({
    id: /^create_enchantment_industry:compacting\/experience_block_.*$/,
  })
  e.remove({
    id: /^create_enchantment_industry:compat\/[a-z_]+\/mixing.*$/,
  })
  create
    .mixing(
      Fluid.of('create_enchantment_industry:experience', 3),
      'create:experience_nugget'
    )
    .superheated()
  create
    .mixing(
      Fluid.of('create_enchantment_industry:experience', 27),
      'create:experience_block'
    )
    .superheated()

  // Rotten flesh can be smoked into leather
  e.smoking('minecraft:leather', 'minecraft:rotten_flesh')

  // Name tag recipe
  e.shaped(
    'minecraft:name_tag',
    [
      ' LS', //
      'LPL', //
      ' L ', //
    ],
    {
      L: 'minecraft:leather',
      S: 'minecraft:string',
      P: 'minecraft:paper',
    }
  )

  // Crying obsidian can be crafted with lots of source
  create
    .SequencedAssembly('minecraft:obsidian')
    .fill(Fluid.of('starbunclemania:source_fluid', 1000))
    .loops(25)
    .outputs('minecraft:crying_obsidian')

  // Remove the regular hearthstone crafting recipe.
  e.remove({ id: 'gag:hearthstone' })

  // Crafting the Crystalline Mechanism
  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'ars_elemental:lesser_fire_focus',
      'gag:sacred_salt',
      'minecraft:amethyst_shard',
      'ars_elemental:lesser_air_focus',
      'minecraft:amethyst_shard',
      'gag:hearthstone',
      'ars_elemental:lesser_earth_focus',
      'gag:hearthstone',
      'minecraft:amethyst_shard',
      'ars_elemental:lesser_water_focus',
      'minecraft:amethyst_shard',
      'gag:sacred_salt',
    ],
    'kubejs:source_mechanism',
    'kubejs:incomplete_crystalline_mechanism',
    8000
  )
  create
    .SequencedAssembly('kubejs:incomplete_crystalline_mechanism')
    .deploy('ars_elemental:mark_of_mastery')
    .fill(potionFluid('ars_nouveau:spell_damage_potion_strong', 250))
    .fill(potionFluid('ars_nouveau:mana_regen_potion_long', 250))
    .fill(potionFluid('minecraft:strong_harming', 250))
    .fill(potionFluid('minecraft:strong_strength', 250))
    .fill(potionFluid('ars_elemental:shock_potion', 250))
    .outputs('kubejs:crystalline_mechanism')
})
