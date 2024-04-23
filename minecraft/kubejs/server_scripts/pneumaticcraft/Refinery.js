// priority: 900

/**
 * JS prototype class to make registering Pneumaticcraft Refinery recipes
 * easier.
 *
 * @constructor
 * @param {Internal.RecipesEventJS} e
 * @param {Internal.InputFluid_} input
 */
function Refinery(e, input) {
  this.e_ = e
  this.input_ = input

  this.temperature_ = {
    min_temp: 273,
  }
}

/**
 * @constant
 * @private
 */
Refinery.RECIPE_TYPE = 'pneumaticcraft:refinery'

/**
 * @param {number} min_temp The min temperature in C
 * @param {number} max_temp The max temperature in C
 * @returns {Refinery}
 */
Refinery.prototype.temperature = function (min_temp, max_temp) {
  this.temperature_ = {
    min_temp: min_temp + 273,
    max_temp: max_temp + 273,
  }
  return this
}

/**
 * @param {number} min_temp The min temperature in C
 * @returns {Refinery}
 */
Refinery.prototype.minTemp = function (min_temp) {
  this.temperature_.min_temp = min_temp + 273
  return this
}

/**
 * @param {number} max_temp The max temperature in C
 * @returns {Refinery}
 */
Refinery.prototype.maxTemp = function (max_temp) {
  this.temperature_.max_temp = max_temp + 273
  return this
}

/**
 * @param {Internal.OutputFluid_[]} outputs
 * @returns {Internal.RecipeJS}
 */
Refinery.prototype.outputs = function (outputs) {
  if (outputs === undefined) throw new Error('No recipe outputs were specified')
  const base = {
    type: Refinery.RECIPE_TYPE,
    temperature: this.temperature_,
    results: [],
  }

  const inputFluid = Parser.parseFluidInput(this.input_)
  if (inputFluid !== null) inputFluid.type = 'pneumaticcraft:fluid'
  if (!setIfValid(base, 'input', inputFluid)) {
    throw new Error(`Fluid input invalid: ${this.input_}`)
  }

  outputs = Array.isArray(outputs) ? outputs : [outputs]
  if (outputs.length < 2 || outputs.length > 4) {
    throw new Error('A refinery recipe can only have 2-4 outputs')
  }
  for (const output of outputs) {
    let outputFluid = Parser.parseFluidOutput(output)
    if (outputFluid === null) throw new Error(`Invalid output: ${output}`)
    base.results.push(outputFluid)
  }

  return this.e_.custom(base)
}
