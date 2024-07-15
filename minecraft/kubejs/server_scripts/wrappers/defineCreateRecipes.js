// priority: 900

const POLISHING_LOW_SPEED = 1
const POLISHING_MEDIUM_SPEED = 2
const POLISHING_HIGH_SPEED = 3

const CONVEX_CURVING_HEAD = 1
const CONCAVE_CURVING_HEAD = 2
const W_SHAPED_CURVING_HEAD = 3
const V_SHAPED_CURVING_HEAD = 4

/**
 * @param {Internal.RecipesEventJS_} e
 */
const defineCreateRecipes = (e) => {
  return {
    // Shorthand references to KubeJS Create functions
    compacting: e.recipes.create.compacting,
    crushing: e.recipes.create.crushing,
    cutting: e.recipes.create.cutting,
    deploying: e.recipes.create.deploying,
    emptying: e.recipes.create.emptying,
    filling: e.recipes.create.filling,
    haunting: e.recipes.create.haunting,
    item_application: e.recipes.create.item_application,
    /**
     * Wrapper for Create's mechanical crafting recipes that automatically
     * remove unused items from the key if they are not present in the pattern.
     * @param {OutputItem_} output
     * @param {string[]} pattern
     * @param {{ [key in string]: InputItem_ }} key
     * @returns {Special.Recipes.MechanicalCraftingCreate}
     */
    mechanical_crafting: (output, pattern, key) => {
      e.recipes.create.mechanical_crafting(
        output,
        pattern,
        removeUnusedKeys(pattern, key)
      )
    },
    milling: e.recipes.create.milling,
    mixing: e.recipes.create.mixing,
    pressing: e.recipes.create.pressing,
    sandpaper_polishing: e.recipes.create.sandpaper_polishing,
    splashing: e.recipes.create.splashing,

    // Create Crafts & Additions aliases
    rolling: e.recipes.createaddition.rolling,
    burnableFluid: e.recipes.createaddition.liquid_burning,

    // Create: New Age aliases
    // Man, really?
    energizing: e.recipes.create_new_age.energising,

    // Create Mechanical Extruder aliases
    extruding: e.recipes.create_mechanical_extruder.extruding,

    // Create: Vintage Improvements aliases
    centrifuging: e.recipes.vintageimprovements.centrifugation,
    coiling: e.recipes.vintageimprovements.coiling,
    curving: e.recipes.vintageimprovements.curving,
    hammering: e.recipes.vintageimprovements.hammering,
    laser_cutting: e.recipes.vintageimprovements.laser_cutting,
    polishing: e.recipes.vintageimprovements.polishing,
    /**
     * @callback CVIPressurizingWrapperCB
     * @param {($InputItem_|$InputFluid_)[]} inputs
     * @returns {CVIPressurizingWrapper}
     *
     * @type {CVIPressurizingWrapperCB}
     */
    pressurizing: getConstructorWrapper(e, CVIPressurizingWrapper),
    vacuumizing: e.recipes.vintageimprovements.vacuumizing,
    vibrating: e.recipes.vintageimprovements.vibrating,
    turning: e.recipes.vintageimprovements.turning,

    /**
     * @callback SequencedAssemblyWrapper
     * @param {Internal.ItemStack_} input
     * @param {Internal.ItemStack_=} transitional
     * @returns {SequencedAssembly}
     *
     * @type {SequencedAssemblyWrapper}
     */
    SequencedAssembly: getConstructorWrapper(e, SequencedAssembly),
  }
}
