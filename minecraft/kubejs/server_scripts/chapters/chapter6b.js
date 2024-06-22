// priority: 100
// Recipe overhauls for Chapter 6 progression.

// Call the method to register time pouch crafting recipes.
if (global.RegisterTimePouchCraftingEventHandlers) {
  global.RegisterTimePouchCraftingEventHandlers()
  console.log('Successfully registered time pouch crafting recipes.')
}

/**
 * Event handler for expelling the silverfish from infested stone to generate
 * end stone.
 */
BlockEvents.rightClicked('minecraft:infested_stone', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'apotheosis:vial_of_expulsion') return

  // Each usage will spawn a silverfish.
  const silverfish = block.createEntity('minecraft:silverfish')
  silverfish.setPos(block.pos.center.add(0, 1, 0))
  silverfish.spawn()

  spawnParticles(level, 'block', block.pos.center, [0.5, 0.5, 0.5], 35, 0.01)
  // There is a 25% chance of converting the block to end stone.
  if (Math.random() < 0.25) {
    block.set('minecraft:end_stone')

    // Upon a successful conversion, there is a 2% chance the vial of expulsion
    // will be consumed.
    if (Math.random() < 0.02) {
      item.count--
    }
  }
})

/**
 * Event handler for extracting honeycombs and saturated honeycombs from
 * beehives.
 */
BlockEvents.rightClicked('minecraft:beehive', (e) => {
  const { item, hand, block, level } = e
  if (hand !== 'main_hand') return
  if (item.id !== 'apotheosis:vial_of_extraction') return
  const honeyLevel = block.properties.getOrDefault('honey_level', 0)
  // Each usage will reset the honey level and create an explosion.
  block.set('minecraft:beehive', {
    facing: block.properties.facing,
    honey_level: '0',
  })
  const pos = block.pos.getCenter()
  for (let i = 0; i < 5; ++i) {
    level
      .createExplosion(
        pos.x() + global.randRange(-1.5, 1.5),
        pos.y() + global.randRange(0, 1.5),
        pos.z() + global.randRange(-1.5, 1.5)
      )
      .strength(1)
      .explode()
  }
  // Only if the honey level is 5 will there be loot returned.
  if (honeyLevel < 5) return
  const honeyCombs = Math.floor(honeyLevel * global.randRange(1.5, 2))
  block.popItemFromFace(Item.of('minecraft:honeycomb', honeyCombs), 'up')
  if (Math.random() < 0.5) {
    block.popItemFromFace(
      Item.of('kubejs:saturated_honeycomb', global.randRangeInt(3)),
      'up'
    )
  }
  // There is a 5% chance to consume the vial of extraction.
  if (Math.random() < 0.05) {
    item.count--
  }
})

LootJS.modifiers((e) => {
  // Make the ender dragon drop its head regardless of death condition.
  e.addEntityLootModifier('minecraft:ender_dragon').addLoot(
    'minecraft:dragon_head'
  )
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Get a PRNG from the world seed so that recipes are randomized per world.
  const rand = global.mulberry32(global.WORLD_SEED)
  // Generate a shuffled list of 9C4 positions for 4 elements on a 3x3 crafting
  // grid.
  const positions = global.shuffle(global.combinatorics(9, 4), rand)
  const gemData = Object.entries(apotheoticGems)
  if (gemData.length > positions.length) {
    console.error('Not enough combinations to generate unique recipes!')
  }
  // Define automatable upgrade recipes for all the apotheotic gems.
  let i = 0
  for (let [gem, tiers] of gemData) {
    // Generate upgrade recipes for each tier of gem.
    for (let i = 0; i < tiers.length - 1; ++i) {
      let fromTier = tiers[i]
      let fromGem = getGemItem(gem, fromTier)
      let toTier = tiers[i + 1]
      let toGem = getGemItem(gem, toTier)
      let gemDustCost = getTierGemDustCost(toTier)
      let validMaterials = getTierUpgradeMaterialCost(toTier)

      let tierIndex = tierOrder.indexOf(toTier)

      for (let material of validMaterials) {
        // TODO maybe something more complicated than compacting
        let recipe = create.compacting(toGem, [
          material,
          Item.of('apotheosis:gem_dust', gemDustCost),
          fromGem,
        ])
        if (tierIndex >= 4) recipe.superheated()
        else if (tierIndex >= 2) recipe.heated()
      }
    }

    // Generate crafting recipes for the lowest tier of gem.
    let pattern = [
      ' AAA ', //
      'ABBBA', //
      'ABBBA', //
      'ABBBA', //
      ' AAA ', //
    ]
    positions[i].forEach((idx) => {
      let x = (idx % 3) + 1
      let y = Math.floor(idx / 3) + 1
      const rowstring = pattern[x]
      pattern[x] = rowstring.substring(0, y) + 'M' + rowstring.substring(y + 1)
    })
    create.mechanical_crafting(getGemItem(gem, tiers[0]), pattern, {
      A: 'minecraft:amethyst_shard',
      B: 'create:experience_nugget',
      M: 'kubejs:crystalline_mechanism',
    })
    ++i
  }

  // Remove tier salvaging recipes and recycling recipes so apotheotic materials
  // are only available through the automation recipes below.
  e.remove({ id: /^apotheotic_additions:salvaging\/[a-z]+_to_[a-z]+$/ })
  e.forEachRecipe(
    [
      { mod: 'apotheosis', type: 'create:crushing' },
      { mod: 'apotheotic_additions', type: 'create:crushing' },
    ],
    (r) => {
      const json = JSON.parse(r.json)
      if (
        json.ingredients.length === 1 &&
        json.ingredients[0].type === 'apotheosis:affix_item'
      ) {
        const rarity = json.ingredients[0].rarity
        r.replaceOutput(`${rarity}_material`, 'create:experience_block')
      }
    }
  )
  // Apotheosis material automation
  create // Common Material: Mysterious Scrap Metal
    .SequencedAssembly('tfmg:steel_mechanism')
    .fill('create_enchantment_industry:experience', 16)
    .cut(2, 40)
    .custom('Next: Crush with Crushing Wheels', (pre, post) => {
      create.crushing(post, pre)
    })
    .outputs([
      'apotheosis:common_material',
      Item.of('apotheosis:common_material').withChance(0.25),
    ])
  // Uncommon Material: Timeworn Fabric
  e.remove({ id: 'apotheotic_additions:stonecutting/timeworn_fabric' })
  e.remove({ id: 'apotheotic_additions:stonecutting/timeworn_fancy' })
  create
    .deploying('apotheotic_additions:timeworn_fancy', [
      'minecraft:green_wool',
      'gag:time_sand_pouch',
    ])
    .keepHeldItem()
  create
    .deploying('apotheotic_additions:timeworn_fabric', [
      'apotheotic_additions:timeworn_fancy',
      'gag:time_sand_pouch',
    ])
    .keepHeldItem()
  create.cutting(
    '4x apotheosis:uncommon_material',
    'apotheotic_additions:timeworn_fabric'
  )
  create.cutting(
    '4x apotheosis:uncommon_material',
    'apotheotic_additions:timeworn_fancy'
  )
  create // Rare Material: Luminous Crystal Shard
    .SequencedAssembly('kubejs:crystalline_mechanism')
    .fill('create_enchantment_industry:experience', 64)
    .cut(2, 40)
    .deploy('thermal:lumium_ingot')
    .custom('Next: Crush with Crushing Wheels', (pre, post) => {
      create.crushing(post, pre)
    })
    .outputs([
      'apotheosis:rare_material',
      Item.of('apotheosis:rare_material').withChance(0.25),
    ])
  create // Epic Material: Arcane Sands
    .SequencedAssembly('tfmg:limesand')
    .fill('starbunclemania:source_fluid', 1000)
    .fill('createteleporters:quantum_fluid', 1000) // TODO maybe not here?
    .energize(50000)
    .outputs([
      'apotheosis:epic_material',
      Item.of('apotheosis:epic_material').withChance(0.25),
    ])
  create // Mythic Material: Godforged Pearl
    .SequencedAssembly('minecraft:ender_pearl')
    .fill('create:honey', 1000)
    .energize(100000)
    .outputs('apotheosis:mythic_material')
  create // Ancient Material: rainbow thingy
    .SequencedAssembly('minecraft:totem_of_undying')
    .custom('', (pre, post) => {
      e.recipes.thermal.centrifuge(post, pre)
    })
    .press(2)
    .outputs('apotheosis:ancient_material')
  create // Artifact Material: Artifact Shards
    .SequencedAssembly('farmersdelight:pasta_with_meatballs')
    .custom('', (pre, post) => {
      create
        .mixing(post, [pre, Fluid.of('pneumaticcraft:lpg', 250)])
        .superheated()
    })
    .custom('Next: Blast with high heat', (pre, post) => {
      e.blasting(post, pre)
    })
    .custom('Next: Haunt with Soul Fire', (pre, post) => {
      create.haunting(post[0], pre)
    })
    .outputs('apotheotic_additions:artifact_material')
  // Heirloom Material: Core of the Family
  create.mixing('apotheotic_additions:heirloom_material', [
    'quark:diamond_heart',
    Fluid.of('thermal:ender', 250),
  ])
  const filledXpCrystal = Item.of('kubejs:xp_crystal')
    .enchant('cofh_core:holding', 3)
    .withNBT({ Xp: 25000 })
    .weakNBT()
  // Esoteric Material: Galactic Core
  create.energizing(
    'apotheotic_additions:esoteric_material',
    filledXpCrystal,
    1000000
  )

  // Phantom membranes
  e.remove({ id: 'minecraft:honey_block' })
  create.haunting('minecraft:phantom_membrane', 'minecraft:honeycomb')

  // TODO: overhaul ender pearls?

  // Overhauled recipe for Temporal Pouch
  e.remove({ id: 'gag:time_sand_pouch' })
  create
    .SequencedAssembly('thermal:satchel')
    .deploy('kubejs:crystalline_mechanism')
    .fill('create_enchantment_industry:experience', 1000)
    .energize(20000)
    .loops(4)
    .outputs('gag:time_sand_pouch')
  // The output item for this recipe does not match since .modifyResult will
  // dynamically add 1000 to the input item's nbt value.
  e.shapeless(Item.of('gag:time_sand_pouch', { grains: 1000 }), [
    'gag:time_sand_pouch',
    'ars_nouveau:glyph_extend_time',
  ]).modifyResult((grid) => {
    const currentGrains = grid.find('gag:time_sand_pouch').nbt.getInt('grains')
    return Item.of('gag:time_sand_pouch', `{grains:${currentGrains + 1000}}`)
  })

  // Apotheosis Vial of Searing Expulsion and Arcane Extraction
  create
    .SequencedAssembly('minecraft:glass_bottle')
    .fill(potionFluid('minecraft:thick', 125))
    .fill(Fluid.lava(500))
    .deploy('minecraft:blaze_rod')
    .deploy('minecraft:magma_cream')
    .deploy('apotheosis:gem_dust')
    .energize(10000)
    .outputs('apotheosis:vial_of_expulsion')
  create
    .SequencedAssembly('minecraft:glass_bottle')
    .fill(potionFluid('minecraft:thick', 125))
    .fill(Fluid.water(500))
    .deploy('minecraft:ender_pearl')
    .deploy('minecraft:amethyst_shard')
    .deploy('apotheosis:gem_dust')
    .energize(10000)
    .outputs('apotheosis:vial_of_extraction')

  // Custom XP Crystal
  e.replaceOutput(
    { id: 'thermal:tools/xp_crystal' },
    'thermal:xp_crystal',
    'kubejs:xp_crystal'
  )
  e.replaceInput({ mod: 'thermal' }, 'thermal:xp_crystal', 'kubejs:xp_crystal')
  create
    .SequencedAssembly('minecraft:experience_bottle')
    .deploy('minecraft:emerald')
    .deploy('minecraft:lapis_lazuli')
    .fill('create_enchantment_industry:experience', 100)
    .outputs('kubejs:xp_crystal')

  // The Treasure Net is gated by a level 60 enchant
  e.recipes.apotheosis
    .enchanting('thermal:junk_net', 'kubejs:treasure_net')
    .requirements({ eterna: 30, quanta: 40, arcana: 40 })
  e.recipes.thermal.fisher_boost(
    'kubejs:treasure_net',
    1,
    0,
    'kubejs:gameplay/fishing/treasure'
  )

  // Overhauled Aquatic Entangler outputs
  global.RegisterAquaticEntanglerRecipeOverhauls(e)
  // Fish chum cycling
  create.crushing(
    [
      'kubejs:fish_chum',
      Item.of('kubejs:fish_chum').withChance(0.5),
      Item.of('kubejs:fish_chum').withChance(0.1),
      'minecraft:bone_meal',
    ],
    '#minecraft:fishes'
  )
  create
    .mixing(Fluid.of('sliceanddice:fertilizer', 1000), [
      '4x kubejs:fish_chum',
      '4x minecraft:bone_meal',
      Fluid.water(1000),
    ])
    .heated()
  redefineRecipe('4x thermal:aquachow', [
    'kubejs:fish_chum',
    'kubejs:fish_chum',
    'kubejs:fish_chum',
    'minecraft:slime_ball',
  ])
  e.remove({ id: 'thermal:deep_aquachow_4' })
  create.filling('thermal:deep_aquachow', [
    'thermal:aquachow',
    Fluid.of('create_enchantment_industry:experience', 250),
  ])

  // Nautilus shells can also be crushed into limestone dust.
  create.milling('tfmg:limesand', 'minecraft:nautilus_shell')

  // Totem of undying automation from Create: Totem Factory
  create.cutting('kubejs:totem_body_casing', 'create:brass_sheet')
  create
    .SequencedAssembly(
      'kubejs:totem_body_casing',
      'kubejs:incomplete_totem_body'
    )
    .fill(potionFluid('minecraft:long_fire_resistance', 250))
    .fill(potionFluid('minecraft:strong_regeneration', 250))
    .deploy('create:brass_sheet')
    .outputs('kubejs:totem_body')
  create.cutting('kubejs:totem_head_casing', 'create:brass_sheet')
  create
    .SequencedAssembly(
      'kubejs:totem_head_casing',
      'kubejs:incomplete_totem_head'
    )
    .deploy('minecraft:end_crystal')
    .deploy('create:brass_sheet')
    .energize(50000)
    .outputs('kubejs:totem_head')
  create.mechanical_crafting(
    'kubejs:inactive_totem',
    [
      'EHE', //
      ' B ', //
    ],
    {
      E: 'minecraft:emerald',
      H: 'kubejs:totem_head',
      B: 'kubejs:totem_body',
    }
  )
  create.filling('minecraft:totem_of_undying', [
    'kubejs:inactive_totem',
    Fluid.of('create_enchantment_industry:experience', 1000),
  ])

  // require going to end
  // End stone automation
  // exp the silver fish from the infested stone
  // vial of searing expulsion

  // Bottles of Experience
  e.remove({ id: 'create_new_age:energising/splash_water_bottle' })

  // Liquid Hyper Experience condensing, gated behind a level 100 enchant
  e.remove({ id: 'create_enchantment_industry:mixing/hyper_experience' })
  e.recipes.apotheosis
    .enchanting('apotheosis:mythic_material', 'kubejs:inert_xp_condenser')
    .requirements({ eterna: 50, quanta: 80, arcana: 80 })
  // Hyper Experience condensing requires an inert XP condenser
  create
    .SequencedAssembly(
      'kubejs:inert_xp_condenser',
      'kubejs:incomplete_xp_condenser'
    )
    .fill('create_enchantment_industry:experience', 1000)
    .custom('Next: Compact in a superheated basin', (pre, post) => {
      create.compacting(post, pre).superheated()
    })
    .outputs('kubejs:xp_condenser')
  create.emptying(
    [
      Fluid.of('create_enchantment_industry:hyper_experience', 100),
      'kubejs:inert_xp_condenser',
    ],
    'kubejs:xp_condenser'
  )

  // Provide a way to get Eternal Steak with a level 100 enchant
  e.recipes.apotheosis
    .enchanting('minecraft:cooked_beef', 'artifacts:eternal_steak')
    .requirements({ eterna: 50, quanta: 60, arcana: 60 })

  // Nether Star automation
  // Skeleton skulls can be automated with resonance crafting
  create
    .SequencedAssembly('minecraft:skeleton_skull')
    .fill('create_enchantment_industry:ink', 100)
    .fill(potionFluid('apotheosis:strong_wither', 100))
    .energize(40000)
    .outputs('minecraft:wither_skeleton_skull')

  // defeat the warden

  // smithing template netherite upgrade duping

  // ender transmission end automation

  // neural processor
  // chorus fruit farming
  // drop ascended coins into a well?
  // dragon's breath automation
  // phantom membrane automation

  /**
   * Register automatable alternatives for Apotheosis custom enchanting.
   * @param {object} recipe
   */
  const registerAutomatedInfusionEnchanting = (recipe) => {
    const levels = recipe.requirements.eterna * 2
    // The eterna requirement is the minimum level you must be to perform the
    // enchantment, and the enchantment costs 3 levels of XP, not the entire XP
    // bar.
    const xpCost = global.levelToXp(levels) - global.levelToXp(levels - 3)
    // Hyper XP is a 10:1 conversion to allow for higher experience levels.
    let hyperXp = global.roundToNearest(xpCost / 10, 5)
    // Honey bottle enchanting is extremely inefficient, disabled to avoid
    // cluttering JEI
    if (recipe.input.item === 'minecraft:honey_bottle') return
    let outputCount = recipe.result.count || 1

    pneumaticcraft
      .thermo_plant()
      .fluid_input(
        Fluid.of('create_enchantment_industry:hyper_experience', hyperXp)
      )
      .item_input(recipe.input.item)
      .item_output(Item.of(recipe.result.item, outputCount))
      .pressure(8)
      .temperature({ min_temp: 273 + 1000 })
    create
      .pressurizing(recipe.input.item)
      .secondaryFluidInput(
        Fluid.of(
          'create_enchantment_industry:hyper_experience',
          Math.ceil(hyperXp * 1.5)
        )
      )
      .superheated()
      .outputs(Item.of(recipe.result.item, outputCount))
  }
  // Go through the existing Apotheosis recipes as well as added ones.
  e.forEachRecipe({ type: 'apotheosis:enchanting' }, (r) => {
    registerAutomatedInfusionEnchanting(JSON.parse(r.json))
  })
  e.addedRecipes.forEach((r) => {
    r.createRecipe()
    const recipe = JSON.parse(r.json)
    if (recipe.type === 'apotheosis:enchanting') {
      registerAutomatedInfusionEnchanting(recipe)
    }
  })

  // End crystal overhaul
  // TODO evaluate the downstream effects of this, totem of undying requires
  // end crystal

  e.remove({ id: 'minecraft:end_crystal' })
  create
    .SequencedAssembly('minecraft:glass_pane')
    .deploy('minecraft:purpur_slab')
    .deploy('kubejs:crystalline_mechanism')
    .deploy('minecraft:nether_star')
    .energize(25000)
    .outputs('minecraft:end_crystal')

  e.remove({ id: 'minecraft:beacon' })
  create
    .SequencedAssembly('minecraft:obsidian')
    .deploy('minecraft:end_crystal')
    .deploy('minecraft:diamond_block')
    .deploy('minecraft:glass')
    .outputs('minecraft:beacon')

  e.remove({ id: 'create_things_and_misc:vibration_mecanism_craft' })
  create
    .SequencedAssembly('kubejs:crystalline_mechanism')
    .deploy('createutilities:polished_amethyst')
    .deploy(
      getGemItem(
        'apotheotic_additions:modded/ars_mana',
        'apotheotic_additions:esoteric'
      ),
      false,
      'Cosmic Source Jewel'
    )
    .deploy('create_things_and_misc:rose_quartz_sheet')
    .fill(potionFluid('apotheosis:extra_long_flying'))
    .vibrate(200)
    .outputs('create_things_and_misc:vibration_mechanism')
})
