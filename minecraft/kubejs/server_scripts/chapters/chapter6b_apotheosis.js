// priority: 500
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
