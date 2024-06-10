// priority: 900

/**
 * @param {Internal.RecipesEventJS} e
 * @returns
 */
const definePneumaticcraftRecipes = (e) => {
  return {
    /**
     * @param {string|string[]} inputs
     * @returns {ThermoPlant}
     */
    ThermoPlant: getConstructorWrapper(e, ThermoPlant),
    /**
     * @param {OutputItem_} result
     * @param {string[]} pattern
     * @param {{[key in string]:InputItem_} } key
     */
    compressor_upgrade_crafting: (result, pattern, key) => {
      return e.recipes.pneumaticcraft.compressor_upgrade_crafting(
        result,
        pattern,
        removeUnusedKeys(pattern, key)
      )
    },
    /**
     * @param {OutputItem_} result
     * @param {string[]} pattern
     * @param {{[key in string]:InputItem_} } key
     */
    crafting_shaped_no_mirror: (result, pattern, key) => {
      return e.recipes.pneumaticcraft.crafting_shaped_no_mirror(
        result,
        pattern,
        removeUnusedKeys(pattern, key)
      )
    },
    /**
     * @param {OutputItem_} result
     * @param {string[]} pattern
     * @param {{[key in string]:InputItem_} } key
     */
    crafting_shaped_pressurizable: (result, pattern, key) => {
      return e.recipes.pneumaticcraft.crafting_shaped_pressurizable(
        result,
        pattern,
        removeUnusedKeys(pattern, key)
      )
    },
  }
}
