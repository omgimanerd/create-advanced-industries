// priority: 900

/**
 * @param {$RecipesEventJS_} e
 */
const definePneumaticcraftRecipes = (e) => {
  return {
    amadron: e.recipes.pneumaticcraft.amadron,
    assembly_drill: e.recipes.pneumaticcraft.assembly_drill,
    assembly_laser: e.recipes.pneumaticcraft.assembly_laser,
    explosion_crafting: e.recipes.pneumaticcraft.explosion_crafting,
    fluid_mixer: e.recipes.pneumaticcraft.fluid_mixer,
    heat_frame_cooling: e.recipes.pneumaticcraft.heat_frame_cooling,
    fuel_quality: e.recipes.pneumaticcraft.fuel_quality,
    pressure_chamber: e.recipes.pneumaticcraft.pressure_chamber,
    refinery: e.recipes.pneumaticcraft.refinery,
    thermo_plant: e.recipes.pneumaticcraft.thermo_plant,
    heat_properties: e.recipes.pneumaticcraft.heat_properties,
    /**
     * @param {$OutputItem_} result
     * @param {string[]} pattern
     * @param {{[key in string]:$InputItem_} } key
     */
    compressor_upgrade_crafting: (result, pattern, key) => {
      return e.recipes.pneumaticcraft.compressor_upgrade_crafting(
        result,
        pattern,
        removeUnusedKeys(pattern, key)
      )
    },
    /**
     * @param {$OutputItem_} result
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
     * @param {$OutputItem_} result
     * @param {string[]} pattern
     * @param {{[key in string]:$InputItem_} } key
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
