// priority: 0

// Chapter 6: Apotheosis recipe overhauls
// It is important that this recipe priority is low so that this runs after
// all Apotheosis custom enchanting recipes.

/**
 * Returns an ItemStack corresponding to the Apotheosis gem with the given ID
 * and rarity tier.
 * @param {string} id
 * @param {string} rarity
 * @returns {$ItemStack_}
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

// Wrap this code in a closure to avoid polluting global namespace with
// Apotheosis helper methods.
;(() => {
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
  // ServerEvents.recipes below to define automation recipes for combining the
  // gems.
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

  ServerEvents.recipes((e) => {
    const create = defineCreateRecipes(e)
    const pneumaticcraft = definePneumaticcraftRecipes(e)

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
        pattern[x] =
          rowstring.substring(0, y) + 'M' + rowstring.substring(y + 1)
      })
      create.mechanical_crafting(getGemItem(gem, tiers[0]), pattern, {
        A: 'createutilities:polished_amethyst',
        B: 'create:experience_nugget',
        M: 'kubejs:crystalline_mechanism',
      })
      ++i
    }

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
  })
})()
