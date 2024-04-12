// priority: 900

// JS prototype class to make registering Pneumaticcraft Pressure Chamber
// recipes easier.

function PressureChamberRecipe(e, inputs) {
  this.e_ = e
  this.inputs_ = inputs

  this.pressure_ = 1.0
}

PressureChamberRecipe.RECIPE_TYPE = 'pneumaticcraft:pressure_chamber'

PressureChamberRecipe.prototype.pressure = function (pressure) {
  this.pressure_ = pressure
  return this
}

PressureChamberRecipe.prototype.outputs = function (outputs) {
  let base = {
    type: PressureChamberRecipe.RECIPE_TYPE,
    pressure: this.pressure_,
    inputs: [],
    results: [],
  }

  this.inputs_ = Array.isArray(this.inputs_) ? this.inputs_ : [this.inputs_]
  for (const input of this.inputs_) {
    const g = Parser.parseStackedItemInput(input)
    if (g === null) throw new Error(`Invalid input ${input}`)
    base.inputs.push(g)
  }

  outputs = Array.isArray(outputs) ? outputs : [outputs]
  for (const output of outputs) {
    const g = Parser.parseItemOutput(output)
    if (g === null) throw new Error(`Invalid output ${output}`)
    base.results.push(g)
  }

  return this.e_.custom(base)
}
