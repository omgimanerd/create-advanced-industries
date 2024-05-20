// priority: 100
// Recipe overhauls for Chapter 6 progression.

/**
 * @param {string} jsonFilename
 * @returns {string}
 */
const getGemId = (jsonFilename) => {
  return jsonFilename.replace('gems/', '').replace(/\.json$/, '')
}

/**
 * @param {string} id
 * @param {string} rarity
 * @returns {Internal.ItemStack_}
 */
const getGemItem = (id, rarity) => {
  return Item.of('apotheosis:gem')
    .withNBT({
      affix_data: {
        rarity: rarity,
      },
      gem: id,
    })
    .weakNBT()
}

const tierOrder = [
  'apotheosis:common',
  'apotheosis:uncommon',
  'apotheosis:rare',
  'apotheosis:epic',
  'apotheosis:mythic',
  'apotheosis:ancient',
  'apotheotic_additions:artifact',
  'apotheotic_additions:heirloom',
  'apotheotic_additions:esoteric',
]

/**
 * @param {string} tier
 * @returns
 */
const getTierUpgradeMaterialCost = (tier) => {
  const index = tierOrder.indexOf(tier)
  let validMaterials = []
  for (let n = 0, i = index; i > 0 && n < 3; --i, ++n) {
    let material = `${tierOrder[i]}_material`
    let quantity = 3 ** n
    validMaterials.push(Item.of(material, quantity))
  }
  return validMaterials
}

/**
 * @param {string} tier
 * @returns
 */
const getTierGemDustCost = (tier) => {
  const index = tierOrder.indexOf(tier)
  return 2 * index - 1
}

// Populated by ServerEvents.highPriorityData with all the apotheotic gems
// available in the pack and their accessible tiers. Used in
// ServerEvents.recipes to define automation recipes for combining the gems.
let apotheoticGems = {}

ServerEvents.highPriorityData(() => {
  let apotheosisGemData = global.readJsonFolderFromMod(
    'data',
    'apotheosis',
    'gems'
  )
  let apotheoticAdditionsGemData = global.readJsonFolderFromMod(
    'data',
    'apotheotic_additions',
    'gems'
  )
  let mergedJson = Object.assign(
    {},
    JSON.parse(JsonIO.toString(apotheosisGemData)),
    JSON.parse(JsonIO.toString(apotheoticAdditionsGemData))
  )

  for (const [k, v] of Object.entries(mergedJson)) {
    let gemId = getGemId(k)
    // Skip the gem if it is not loaded by the modpack.
    let allModsLoaded = true
    if (v.conditions) {
      for (const x of v.conditions) {
        if (x.type === 'forge:mod_loaded') {
          allModsLoaded &= Platform.isLoaded(x.modid)
        }
      }
    }
    if (!allModsLoaded) continue

    // Store all accessible tiers of the gem
    if (!v.bonuses) console.error(`${gemId} does not have bonuses`)
    let tiers = []
    for (let bonus of v.bonuses) {
      if (!bonus.values) continue
      let bonusTiers = Object.keys(bonus.values)
      if (bonusTiers.length > tiers.length) tiers = bonusTiers
    }
    // If min_rarity is specified, prune away rarities below it.
    if (v.min_rarity) {
      while (tiers[0] !== v.min_rarity) tiers.shift()
    }

    apotheoticGems[gemId] = tiers.map((tier) => {
      if (tier.startsWith('apotheotic_additions:')) return tier
      return `apotheosis:${tier}`
    })
  }
})

/**
 * @param {Internal.RecipesEventJS} e
 * @param {OutputItem_|string} output
 * @param {InputItem_|string} input
 * @param {number[]} eternaRange
 * @param {number[]} quantaRange
 * @param {number[]} arcanaRange
 * @returns {Internal.RecipeJS}
 */
const createEnchantingRecipe = (
  e,
  output,
  input,
  eternaRange,
  quantaRange,
  arcanaRange
) => {
  const base = {
    type: 'apotheosis:enchanting',
    requirements: {},
    max_requirements: {},
  }
  if (!setIfValid(base, 'input', Parser.parseStackedItemInput(input))) {
    throw new Error(`Invalid input ${input}`)
  }
  if (!setIfValid(base, 'result', Parser.parseItemOutput(output))) {
    throw new Error(`Invalid output ${output}`)
  }
  if (!Array.isArray(eternaRange) && eternaRange.length !== 2) {
    throw new Error(`Invalid eterna ${eternaRange}`)
  }
  base.requirements.eterna = eternaRange[0]
  base.max_requirements.eterna = eternaRange[1]
  if (!Array.isArray(quantaRange) && quantaRange.length !== 2) {
    throw new Error(`Invalid quanta ${quantaRange}`)
  }
  base.requirements.quanta = quantaRange[0]
  base.max_requirements.quanta = quantaRange[1]
  if (!Array.isArray(arcanaRange) && arcanaRange.length !== 2) {
    throw new Error(`Invalid arcana ${arcanaRange}`)
  }
  base.requirements.arcana = arcanaRange[0]
  base.max_requirements.arcana = arcanaRange[1]
  return e.custom(base)
}

/**
 * Event handler for expelling the silver from infested stone to generate end
 * stone.
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

  // Redstone pearls
  e.remove({ id: 'createteleporters:redstone_pearl_recipe' })
  create
    .SequencedAssembly('minecraft:ender_pearl')
    .fill('kubejs:molten_redstone', 180)
    .custom('Next: Energize it with 40000 RF', (pre, post, json) => {
      create.energising(post[0], json(pre), 40000)
    })
    .outputs('createteleporters:redstone_pearl')

  // Custom XP Crystal
  e.replaceOutput(
    { id: 'thermal:tools/xp_crystal' },
    'thermal:xp_crystal',
    'kubejs:xp_crystal'
  )
  create
    .SequencedAssembly('minecraft:experience_bottle')
    .deploy('minecraft:emerald')
    .deploy('minecraft:lapis_lazuli')
    .fill('create_enchantment_industry:experience', 100)
    .outputs('kubejs:xp_crystal')

  // Remove tier salvaging recipes
  e.remove({ id: /^apotheotic_additions:salvaging\/[a-z]+_to_[a-z]+$/ })
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
  e.recipes.thermal.centrifuge('minecraft:stone', 'minecraft:oak_log')
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
  create.energising(
    // Esoteric Material: Galactic Core
    'apotheotic_additions:esoteric_material',
    JSON.parse(filledXpCrystal.toJson()),
    1000000
  )

  // require going to end
  // End stone automation
  // exp the silver fish from the infested stone
  // vial of searing expulsion
  create.haunting('minecraft:end_stone', 'minecraft:infested_stone')

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

  // nether star
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
    let hyperXp = roundToNearest(xpCost / 10, 5)
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
