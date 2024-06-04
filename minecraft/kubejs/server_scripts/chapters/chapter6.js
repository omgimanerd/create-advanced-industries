// priority: 100
// Recipe overhauls for Chapter 6 progression.

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

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const enchanting = getPartialApplication(e, createEnchantingRecipe)
  const redefineRecipe = redefineRecipe_(e)

  // Define automatable upgrade recipes for all the apotheotic gems.
  for (let [gem, tiers] of Object.entries(apotheoticGems)) {
    for (let i = 0; i < tiers.length - 1; ++i) {
      let fromTier = tiers[i]
      let fromGem = getGemItem(gem, fromTier)
      let toTier = tiers[i + 1]
      let toGem = getGemItem(gem, toTier)
      let gemDustCost = getTierGemDustCost(toTier)
      let validMaterials = getTierUpgradeMaterialCost(toTier)

      let tierIndex = tierOrder.indexOf(toTier)

      for (let material of validMaterials) {
        let recipe = create.compacting(toGem, [
          material,
          Item.of('apotheosis:gem_dust', gemDustCost),
          fromGem,
        ])
        if (tierIndex >= 4) recipe.superheated()
        else if (tierIndex >= 2) recipe.heated()
      }
    }
  }

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
    .custom('Next: Energize with 8000 RF', (pre, post, json) => {
      create.energizing(json(post), json(pre), 8000)
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
    .fill('createteleporters:quantum_fluid', 1000)
    .outputs([
      'apotheosis:epic_material',
      Item.of('apotheosis:epic_material').withChance(0.25),
    ])
  create // Mythic Material: Godforged Pearl
    .SequencedAssembly('minecraft:ender_pearl')
    .fill('create:honey', 1000)
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
    JSON.parse(filledXpCrystal.toJson()),
    1000000
  )

  // The Treasure Net is gated by a level 60 enchant
  enchanting(
    'kubejs:treasure_net',
    'thermal:junk_net',
    [30, -1],
    [40, -1],
    [40, -1]
  )
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
  create.crushing('tfmg:limesand', 'minecraft:nautilus_shell')

  // Totem of undying automation, defaults to same setup as mod
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

  // Liquid Hyper Experience condensing, gated behind a level 100 enchant
  e.remove({ id: 'create_enchantment_industry:mixing/hyper_experience' })
  enchanting(
    'kubejs:inert_xp_condenser',
    'apotheosis:mythic_material',
    [50, -1],
    [80, -1],
    [80, -1]
  )
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
  enchanting(
    'artifacts:eternal_steak',
    'minecraft:cooked_beef',
    [50, -1],
    [60, -1],
    [60, -1]
  )

  // Nether Star automation
  // Skeleton skulls can be automated with resonance crafting
  create
    .SequencedAssembly('minecraft:skeleton_skull')
    .fill('create_enchantment_industry:ink', 100)
    .fill(potionFluid('apotheosis:strong_wither', 100))
    .energize(40000)
    .outputs('minecraft:wither_skeleton_skull')

  // defeat the warden
  // sculk farming to make enderium
  // enderium recipe from liquid hyper exp

  // smithing template netherite upgrade duping

  // ender transmission end automation

  // neural processor
  // chorus fruit farming
  // drop ascended coins into a well?

  // Register experience spouting recipes for Apotheosis custom enchanting
  e.forEachRecipe({ type: 'apotheosis:enchanting' }, (r) => {
    const recipe = JSON.parse(r.json)
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
      .ThermoPlant([
        recipe.input.item,
        `${hyperXp}mb create_enchantment_industry:hyper_experience`,
      ])
      .pressure(9.5)
      .minTemp(1300)
      .outputs(`${outputCount}x ${recipe.result.item}`)
  })
})
