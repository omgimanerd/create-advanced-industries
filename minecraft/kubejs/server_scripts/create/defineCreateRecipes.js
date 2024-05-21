// priority: 900

/**
 * Rolling recipe from Create Crafts & Additions
 * @param {Internal.RecipesEventJS} e
 * @param {OutputItem_|string} output
 * @param {InputItem_|string} input
 * @return {Internal.RecipeJS}
 */
const createRolling = (e, output, input) => {
  const base = {
    type: 'createaddition:rolling',
  }
  if (!setIfValid(base, 'input', Parser.parseItemInput(input))) {
    throw new Error(`Invalid input ${input}`)
  }
  if (!setIfValid(base, 'result', Parser.parseItemOutput(output))) {
    throw new Error(`Invalid output ${output}`)
  }
  return e.custom(base)
}

/**
 * Registers a burnable fluid for liquid blaze burners.
 * @param {Internal.RecipesEventJS} e
 * @param {Special.FluidTag} fluid
 * @param {number} burnTime Fluid burn time in ticks
 * @param {boolean=} superheated Whether or not the blaze burner will be
 *   superheated, defaults to false
 * @return {Internal.RecipeJS}
 */
const createBurnableFluid = (e, fluid, burnTime, superheated) => {
  if (typeof fluid !== 'string') throw new Error(`Invalid input ${fluid}`)
  superheated = !!superheated
  return e.custom({
    type: 'createaddition:liquid_burning',
    input: {
      fluidTag: fluid.startsWith('#') ? fluid.substring(1) : fluid,
      amount: 1000,
    },
    burnTime: burnTime,
    superheated: superheated,
  })
}

/**
 * Energiser recipes from Create: New Age
 * @param {Internal.RecipesEventJS} e
 * @param {OutputItem_|string} output
 * @param {InputItem_|string} input
 * @param {number} energyNeeded
 * @returns {Internal.RecipeJS}
 */
const createEnergizing = (e, output, input, energyNeeded) => {
  const base = {
    type: 'create_new_age:energising',
    // https://gitlab.com/antarcticgardens/create-new-age
    // JSON recipe key changed in latest dev branch to 'energyNeeded' instead of
    // 'energy_needed'
    energy_needed: energyNeeded !== undefined ? energyNeeded : 1000,
    ingredients: [],
    results: [],
  }
  const parsedInput = Parser.parseItemInput(input)
  if (parsedInput === null) throw new Error(`Invalid input ${input}`)
  base.ingredients.push(parsedInput)
  const itemOutput = Parser.parseItemOutput(output)
  if (itemOutput === null) throw new Error(`Invalid output ${output}`)
  base.results.push(itemOutput)
  return e.custom(base)
}

/**
 * Mechanical extruder recipes from Create Mechanical Extruder
 * @param {Internal.RecipesEventJS} e
 * @param {OutputItem_|string} output
 * @param {(InputItem_|Internal.InputFluid_|string)[]} inputs The input items
 *   or fluids that must be on the sides of the extruder. Must have exactly two
 *   elements
 * @param {(Internal.Block|string)=} catalyst An optional catalyst block
 *   underneath the extruder
 * @return {Internal.RecipeJS}
 */
const createExtruding = (e, output, inputs, catalyst) => {
  const base = {
    type: 'create_mechanical_extruder:extruding',
    ingredients: [],
  }
  if (!Array.isArray(inputs) || inputs.length != 2) {
    throw new Error(`Two inputs are required: ${inputs}`)
  }
  for (const input of inputs) {
    let itemInput = Parser.parseItemInput(input)
    if (itemInput !== null) {
      base.ingredients.push(itemInput)
      continue
    }
    let fluidInput = Parser.parseFluidInput(input)
    if (fluidInput !== null) {
      base.ingredients.push(fluidInput)
      continue
    }
    throw new Error(`Unknown input ${input}`)
  }
  const itemOutput = Parser.parseItemOutput(output)
  if (!setIfValid(base, 'result', itemOutput)) {
    throw new Error(`Invalid output ${output}`)
  }
  const catalystItem = Parser.parseItemInput(catalyst)
  setIfValid(base, 'catalyst', catalystItem)

  return e.custom(base)
}

/**
 * @param {Internal.RecipesEventJS} e
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
    mechanical_crafting: (output, pattern, shape) => {
      e.recipes.create.mechanical_crafting(
        output,
        pattern,
        removeUnusedKeys(pattern, shape)
      )
    },
    milling: e.recipes.create.milling,
    mixing: e.recipes.create.mixing,
    pressing: e.recipes.create.pressing,
    sandpaper_polishing: e.recipes.create.sandpaper_polishing,
    sequenced_assembly: e.recipes.create.sequenced_assembly,
    splashing: e.recipes.create.splashing,

    // Helpers
    /**
     * @callback CreateSequencedAssembly
     * @param {Internal.ItemStack_} input
     * @returns {SequencedAssembly}
     * @type {CreateSequencedAssembly}
     */
    SequencedAssembly: getConstructorWrapper(e, SequencedAssembly),

    // Addons
    /**
     * @callback CreateRolling
     * @param {OutputItem_|string} output
     * @param {InputItem_|string} input
     * @return {Internal.RecipeJS}
     * @type {CreateRolling}
     */
    rolling: getPartialApplication(e, createRolling),
    /**
     * @callback CreateBurnableFluid
     * @param {Special.FluidTag} fluid
     * @param {number} burnTime Fluid burn time in ticks
     * @param {boolean=} superheated Whether or not the blaze burner will be
     *   superheated, defaults to false
     * @return {Internal.RecipeJS}
     * @type {CreateBurnableFluid}
     */
    burnableFluid: getPartialApplication(e, createBurnableFluid),
    /**
     * @callback CreateEnergising
     * @param {OutputItem_|string} output
     * @param {InputItem_|string} input
     * @param {number} energyNeeded
     * @return {Internal.RecipeJS}
     * @type {CreateEnergising}
     */
    energizing: getPartialApplication(e, createEnergizing),
    /**
     * @callback CreateExtruding
     * @param {OutputItem_|string} output
     * @param {(InputItem_|Internal.InputFluid_|string)[]} inputs The input
     *   items or fluids that must be on the sides of the extruder. Must have
     *   exactly two elements
     * @param {(Internal.Block|string)=} catalyst An optional catalyst block
     *   underneath the extruder
     * @return {Internal.RecipeJS}
     * @type {CreateExtruding}
     */
    extruding: getPartialApplication(e, createExtruding),
  }
}
