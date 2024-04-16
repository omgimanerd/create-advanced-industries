// priority: 900

/**
 * JS prototype class to make registering Pneumaticcraft Pressure Chamber
 * recipes easier.
 *
 * @constructor
 * @param {Internal.RecipesEventJS} e
 * @param {InputItem_[]} inputs
 */
function PressureChamber(e, inputs) {
  this.e_ = e
  this.inputs_ = inputs

  this.pressure_ = 1.0
}

/**
 * @constant {string}
 * @private
 */
PressureChamber.RECIPE_TYPE = 'pneumaticcraft:pressure_chamber'

/**
 * @param {number} pressure
 * @returns {PressureChamber}
 */
PressureChamber.prototype.pressure = function (pressure) {
  this.pressure_ = pressure
  return this
}

/**
 * @param {OutputItem_[]} outputs
 * @returns {Internal.RecipeJS}
 */
PressureChamber.prototype.outputs = function (outputs) {
  let base = {
    type: PressureChamber.RECIPE_TYPE,
    pressure: this.pressure_,
    inputs: [],
    results: [],
  }

  this.inputs_ = Array.isArray(this.inputs_) ? this.inputs_ : [this.inputs_]
  for (const input of this.inputs_) {
    let g = Parser.parseStackedItemInput(input)
    if (g === null) throw new Error(`Invalid input ${input}`)
    g.type = 'pneumaticcraft:stacked_item'
    base.inputs.push(g)
  }

  outputs = Array.isArray(outputs) ? outputs : [outputs]
  for (const output of outputs) {
    let g = Parser.parseItemOutput(output)
    if (g === null) throw new Error(`Invalid output ${output}`)
    base.results.push(g)
  }

  return this.e_.custom(base)
}
