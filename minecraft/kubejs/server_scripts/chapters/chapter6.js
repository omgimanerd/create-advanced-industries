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
  return 2 * index + 1
}

// Populated by ServerEvents.highPriorityData
let apotheoticGems = {}

ServerEvents.highPriorityData((e) => {
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

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  for (let [gem, tiers] of Object.entries(apotheoticGems)) {
    for (let i = 0; i < tiers.length - 1; ++i) {
      let fromTier = tiers[i]
      let fromGem = getGemItem(gem, fromTier)
      let toTier = tiers[i + 1]
      let toGem = getGemItem(gem, toTier)
      let gemDustCost = getTierGemDustCost(toTier)
      let validMaterials = getTierUpgradeMaterialCost(toTier)

      for (let material of validMaterials) {
        create.compacting(toGem, [
          material,
          Item.of('apotheosis:gem_dust', gemDustCost),
          fromGem,
        ])
      }
    }
  }

  // require going to end
  // ender transmission end automation
  // enderium?
})
