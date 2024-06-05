// priority: 900

/**
 * @param {Internal.RecipesEventJS} e
 */
const defineCreateRecipes = (e) => {
  /**
   * Returns a new function that constructs a concrete instance of
   * SequencedAssembly with the recipe event applied as the first argument.
   * @param {Internal.RecipesEventJS} e
   * @returns {SequencedAssembly}
   */
  const SequencedAssemblyWrapper = (e) => {
    try {
      return getConstructorWrapper(e, SequencedAssembly)
    } catch (e) {
      if (e.name === 'ReferenceError') {
        console.log('Custom SequencedAssembly wrapper is not loaded.')
      }
      return null
    }
  }

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
    sequenced_assembly: e.recipes.create.sequenced_assembly,
    splashing: e.recipes.create.splashing,

    /**
     * Rolling recipe from Create Crafts & Additions
     * @param {OutputItem_} output
     * @param {InputItem_} input
     * @return {Internal.RecipeJS}
     */
    rolling: (output, input) => {
      const base = {
        type: 'createaddition:rolling',
        input: Parser.parseItemInput(input),
        result: Parser.parseItemOutput(output),
      }
      return e.custom(base)
    },

    /**
     * Registers a burnable fluid for liquid blaze burners from Create Crafts &
     * Additions
     * @param {Special.FluidTag} fluid
     * @param {number} burnTime Fluid burn time in ticks
     * @param {boolean=} superheated Whether or not the blaze burner will be
     *   superheated, defaults to false
     * @return {Internal.RecipeJS}
     */
    burnableFluid: (fluid, burnTime, superheated) => {
      if (typeof fluid !== 'string') throw new Error(`Invalid input ${fluid}`)
      return e.custom({
        type: 'createaddition:liquid_burning',
        input: {
          fluidTag: fluid.startsWith('#') ? fluid.substring(1) : fluid,
          amount: 1000,
        },
        burnTime: burnTime,
        superheated: !!superheated,
      })
    },

    /**
     * Energiser recipes from Create: New Age
     * @param {OutputItem_|string} output
     * @param {InputItem_|string} input
     * @param {number=} energyNeeded
     * @returns {Internal.RecipeJS}
     */
    energizing: (output, input, energyNeeded) => {
      const base = {
        type: 'create_new_age:energising',
        // https://gitlab.com/antarcticgardens/create-new-age
        // JSON recipe key changed in latest dev branch to 'energyNeeded'
        // instead of 'energy_needed'
        energy_needed: energyNeeded !== undefined ? energyNeeded : 1000,
        ingredients: [Parser.parseItemInput(input)],
        results: [Parser.parseItemOutput(output)],
      }
      return e.custom(base)
    },

    /**
     * Mechanical extruder recipes from Create Mechanical Extruder
     * @param {OutputItem_|string} output
     * @param {(InputItem_|Internal.InputFluid_|string)[]} inputs The input
     *   items or fluids that must be on the sides of the extruder. Must have
     *   exactly two elements
     * @param {Internal.Block=} catalyst An optional catalyst block
     *   underneath the extruder
     * @return {Internal.RecipeJS}
     */
    extruding: (output, inputs, catalyst) => {
      const base = {
        type: 'create_mechanical_extruder:extruding',
        ingredients: [],
        result: Parser.parseItemOutput(output),
      }
      if (!Array.isArray(inputs) || inputs.length != 2) {
        throw new Error(`Two inputs are required: ${inputs}`)
      }
      for (const input of inputs) {
        base.ingredients.push(Parser.parseItemOrFluidInput(input))
      }
      if (catalyst !== undefined) {
        base.catalyst = Parser.parseItemInput(catalyst)
      }
      return e.custom(base)
    },

    /**
     * Centrifugation recipe from Create: Vintage Improvements. Can have a
     * maximum of 9 inputs and 4 outputs. There may only be 2 fluid inputs and
     * 2 fluid outputs.
     *
     * @param {(OutputItem_|Internal.OutputFluid_)[]} outputs
     * @param {(InputItem_|Internal.InputFluid_)[]} inputs
     * @param {number=} minimalRPM
     * @param {number=} processingTime
     * @returns {Internal.RecipeJS}
     */
    centrifuging: (outputs, inputs, minimalRPM, processingTime) => {
      const base = {
        type: 'vintageimprovements:centrifugation',
        ingredients: [],
        results: [],
        minimalRPM: minimalRPM === undefined ? 100 : minimalRPM,
        processingTime: processingTime === undefined ? 1000 : processingTime,
      }
      inputs = Array.isArray(inputs) ? inputs : [inputs]
      for (const input of inputs) {
        base.ingredients.push(Parser.parseItemOrFluidInput(input))
      }
      outputs = Array.isArray(outputs) ? outputs : [outputs]
      for (const output of outputs) {
        base.results.push(Parser.parseItemOrFluidOutput(output))
      }
      return e.custom(base)
    },

    /**
     * @param {InputItem_} output
     * @param {OutputItem_} input
     * @param {number=} processingTime
     * @returns {Internal.RecipeJS}
     */
    coiling: (output, input, processingTime) => {
      return e.custom({
        type: 'vintageimprovements:coiling',
        ingredients: [Parser.parseItemInput(input)],
        results: [Parser.parseItemOutput(output)],
        processingTime: processingTime === undefined ? 120 : processingTime,
      })
    },

    /**
     * @param {OutputItem_} output
     * @param {InputItem_} input
     * @param {InputItem_?} itemAsHead
     * @returns {Internal.RecipeJS}
     */
    curving: (output, input, itemAsHead) => {
      const base = {
        type: 'vintageimprovements:curving',
        ingredients: [Parser.parseItemInput(input)],
        results: [Parser.parseItemOutput(output)],
      }
      itemAsHead =
        itemAsHead === undefined
          ? 'vintageimprovements:convex_curving_head'
          : itemAsHead
      const headToMode = {
        'vintageimprovements:convex_curving_head': 1,
        'vintageimprovements:concave_curving_head': 2,
        'vintageimprovements:w_shaped_curving_head': 3,
        'vintageimprovements:v_shaped_curving_head': 4,
      }
      if (itemAsHead in headToMode) {
        base.mode = headToMode[itemAsHead]
      } else {
        base.itemAsHead = itemAsHead
      }
      return e.custom(base)
    },

    /**
     * @param {OutputItem_} output
     * @param {InputItem_} input
     * @param {('low'|'medium'|'high')=} speedLimit
     * @param {number=} processingTime
     * @returns {Internal.RecipeJS}
     */
    polishing: (output, input, speedLimit, processingTime) => {
      const base = {
        type: 'vintageimprovements:polishing',
        ingredients: [Parser.parseItemInput(input)],
        results: [Parser.parseItemOutput(output)],
        processingTime: processingTime === undefined ? 20 : processingTime,
      }
      speedLimit = speedLimit === undefined ? 'low' : speedLimit
      const speedLimitToInt = {
        low: 1,
        medium: 2,
        high: 3,
      }
      if (speedLimit in speedLimitToInt) {
        base.speed_limits = speedLimitToInt[speedLimit]
      } else {
        throw new Error(`Invalid speed limit ${speedLimit}`)
      }
      return e.custom(base)
    },

    /**
     * @param {OutputItem_} output
     * @param {InputItem_} input
     * @param {number=} hammerBlows
     * @returns {Internal.RecipeJS}
     */
    hammering: (output, input, hammerBlows) => {
      return e.custom({
        type: 'vintageimprovements:hammering',
        ingredients: [Parser.parseItemInput(input)],
        results: [Parser.parseItemOutput(output)],
        hammerBlows: hammerBlows === undefined ? 3 : hammerBlows,
      })
    },

    /**
     * @param {(OutputItem_|OutputFluid_)[]} outputs
     * @param {OutputItem_=} secondaryFluidOutput
     * @param {(InputItem_|Internal.InputFluid_)[]} inputs
     * @param {Internal.InputFluid_=} secondaryFluidInput
     * @param {number=} processingTime
     * @returns {Internal.RecipeJS}
     */
    pressurizing: (
      outputs,
      secondaryFluidOutput,
      inputs,
      secondaryFluidInput,
      processingTime
    ) => {
      const base = {
        type: 'vintageimprovements:pressurizing',
        ingredients: [],
        results: [],
        processingTime: processingTime === undefined ? 600 : processingTime,
      }
      inputs = Array.isArray(inputs) ? inputs : [inputs]
      for (const input of inputs) {
        base.ingredients.push(Parser.parseItemOrFluidOutput(input))
      }
      outputs = Array.isArray(outputs) ? outputs : [outputs]
      for (const output of outputs) {
        base.results.push(Parser.parseItemOrFluidOutput(output))
      }
      if (secondaryFluidInput !== undefined) {
        base.ingredients.push(Parser.parseFluidInput(secondaryFluidInput))
        base.secondaryFluidInputs = base.ingredients.length
      }
      if (secondaryFluidOutput !== undefined) {
        base.results.push(Parser.parseFluidOutput(secondaryFluidOutput))
        base.secondaryFluidResults = base.results.length
      }
      return e.custom(base)
    },

    /**
     * @param {OutputItem_|OutputItem_[]} outputs
     * @param {InputItem_|InputItem_[]} inputs
     * @param {number=} processingTime
     * @returns {Internal.RecipeJS}
     */
    vacuumizing: (outputs, inputs, processingTime) => {
      const base = {
        type: 'vintageimprovements:vacuumizing',
        ingredients: [],
        results: [],
        processingTime: processingTime === undefined ? 20 : processingTime,
      }
      inputs = Array.isArray(inputs) ? inputs : [inputs]
      for (const input of inputs) {
        base.ingredients.push(Parser.parseItemInput(input))
      }
      outputs = Array.isArray(outputs) ? outputs : [outputs]
      for (const output of outputs) {
        base.results.push(Parser.parseItemOutput(output))
      }
      return e.custom(base)
    },

    /**
     * @param {OutputItem_} output
     * @param {InputItem} input
     * @param {number=} processingTime
     * @returns {Internal.RecipeJS}
     */
    vibrating: (output, input, processingTime) => {
      return e.custom({
        type: 'vintageimprovements:vibrating',
        ingredients: [Parser.parseItemInput(input)],
        results: [Parser.parseItemOutput(output)],
        processingTime: processingTime === undefined ? 300 : processingTime,
      })
    },

    /**
     * @param {Internal.ItemStack_} input
     * @param {Internal.ItemStack_} transitional
     * @returns {SequencedAssembly}
     */
    SequencedAssembly: SequencedAssemblyWrapper(e),
  }
}
