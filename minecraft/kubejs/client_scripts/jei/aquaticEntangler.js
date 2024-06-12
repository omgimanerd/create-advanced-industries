// priority: 0

;(() => {
  // Hack used to store the custom device fisher category. This file is wrapped
  // in this closure to avoid leaking this to the global namespace.
  let aquaticEntanglerRecipeType = null

  JEIAddedEvents.registerCategories((e) => {
    const guiHelper = e.data.jeiHelpers.guiHelper

    const columns = 5
    const xBaseOffset = 64
    const yBaseOffset = 2

    e.custom('thermal:device_fisher', (category) => {
      // Ugly hack to store the custom recipe category.
      aquaticEntanglerRecipeType = category.recipeType
      category
        .title('Aquatic Entangler')
        .background(guiHelper.createBlankDrawable(160, 60))
        .icon(guiHelper.createDrawableItemStack('thermal:device_fisher'))
        .isRecipeHandled(() => true) // Only appropriate recipes are added?
        .handleLookup((builder, recipe) => {
          const data = recipe.data
          // Add the Aquatic Entangler as an invisible ingredient so the recipe
          // category can be accessed in JEI.
          builder
            .addInvisibleIngredients('input')
            .addItemStack('thermal:device_fisher')

          // Add the input catalyst item to the input slot
          builder
            .addSlot('input', 5, 21)
            .addItemStack(data.input)
            .setBackground(guiHelper.getSlotDrawable(), -1, -1)
            .addTooltipCallback((_, tooltip) => {
              if (data.useChance != 0) {
                tooltip.add(
                  Text.of(
                    `${data.useChance * 100}% chance to be consumed.`
                  ).gold()
                )
              }
            })

          // Add each output item with a custom tooltip for its output chance
          // and biome requirement.
          let i = 0
          const totalWeight = data.lootTableJson.totalWeight
          /**
           * Internal helper to wrap variables in a closure and generate a
           * tooltip callback using the given item yield weight and biome
           * requirement.
           * @param {Internal.ItemStack} item
           * @param {number} weight
           * @param {number} totalWeight
           * @param {string[]} biomes
           * @returns {Internal.IRecipeSlotTooltipCallback_}
           */
          const getTooltipCallback = (item, weight, totalWeight, biomes) => {
            return (_, tooltip) => {
              if (item === 'minecraft:barrier') {
                tooltip.clear()
                tooltip.add(Text.of('Nothing'))
              }
              const percent = Math.floor((weight / totalWeight) * 10000) / 100
              tooltip.add(Text.of(`Yield chance: ${percent}%`))
              if (biomes.length > 0) {
                tooltip.add(Text.of(`Found in: ${biomes.join(', ')}`))
              }
            }
          }
          data.lootTableJson.entries.forEach((entry) => {
            // Build the item slot in the correct place.
            let xOffset = (i % columns) * 19
            let yOffset = Math.floor(i / columns) * 19
            // If there is a chance to yield an empty item, show a
            // 'minecraft:barrier' instead.
            if (entry.item === undefined) entry.item = 'minecraft:barrier'
            builder
              .addSlot('input', xBaseOffset + xOffset, yBaseOffset + yOffset)
              .setBackground(guiHelper.getSlotDrawable(), -1, -1)
              .addItemStack(Item.of(entry.item, entry.count))
              .addTooltipCallback(
                getTooltipCallback(
                  entry.item,
                  entry.weight,
                  totalWeight,
                  entry.biomes
                )
              )
            i++
          })
          // Fill the remaining slots in the 3x5 grid if we have not populated
          // them.
          for (; i < 15; ++i) {
            let xOffset = (i % columns) * 19
            let yOffset = Math.floor(i / columns) * 19
            builder
              .addSlot(
                'render_only',
                xBaseOffset + xOffset,
                yBaseOffset + yOffset
              )
              .setBackground(guiHelper.getSlotDrawable(), -1, -1)
          }
        })
    })
  })

  JEIAddedEvents.registerRecipes((e) => {
    if (!global.AquaticEntanglerRecipes) return
    const r = e.custom('thermal:device_fisher')

    /**
     * Internal helper to condense a loot table biome condition list to a single
     * flat list of accepted biomes
     * @param {object} conditions
     * @returns {string[]}
     */
    const condenseBiomeConditions = (conditions) => {
      if (conditions === undefined) return []
      if (conditions.length !== 1 || conditions[0].terms === undefined) {
        throw new Error(`Unsupported conditions: ${conditions}`)
      }
      return conditions[0].terms.map((condition) => {
        return condition?.predicate?.biome
      })
    }

    /**
     * Internal helper to condense the entire loot table JSON file down to just
     * a list of items in the loot pool.
     * @param {object} json
     * @returns {object}
     */
    const condenseJson = (json) => {
      let totalWeight = 0
      if (json.pools.length !== 1 || json.pools[0].entries === undefined) {
        throw new Error(`Unsupported JSON: ${json}`)
      }
      const entries = json.pools[0].entries.map((entry) => {
        totalWeight += entry.weight
        let count = 1
        if (entry.functions !== undefined) {
          entry.functions.forEach((fn) => {
            if (fn.function === 'minecraft:set_count') {
              count = fn.count
            }
          })
        }
        return {
          item: entry.name,
          count: count,
          weight: entry.weight !== undefined ? entry.weight : 0,
          biomes: condenseBiomeConditions(entry.conditions),
        }
      })
      return {
        totalWeight: totalWeight,
        entries: entries,
      }
    }

    global.AquaticEntanglerRecipes.forEach((data) => {
      const jsonPath = global.LootTableToJsonPath(data.lootTable)
      const condensedJson = condenseJson(JsonIO.read(jsonPath))
      r.add(
        Object.assign({}, data, {
          lootTableJson: condensedJson,
        })
      )
    })
  })

  JEIAddedEvents.registerRecipeCatalysts((e) => {
    e.data.addRecipeCatalyst(
      'thermal:device_fisher',
      aquaticEntanglerRecipeType
    )
    e.data.addRecipeCatalyst(
      'minecraft:fishing_rod',
      aquaticEntanglerRecipeType
    )
  })
})()
