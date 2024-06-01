// priority: 100
// Chapter 6: Apotheosis recipe overhauls

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

/**
 * The order of the rarity tiers in Apotheosis.
 * @type {string[]}
 */
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
    // Parse the gem ID from the filename
    let gemId = k.replace('gems/', '').replace(/\.json$/, '')
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
 * Helper to define a custom infusion recipe with Apotheosis enchantments.
 *
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
