// priority: 900

// JS prototype class to make registering Pneumaticcraft Thermopneumatic
// Processing Recipes easier.

function ThermoPlantRecipe(e, inputs) {
  this.e_ = e
  this.inputs_ = inputs

  this.exothermic_ = false
  this.pressure_ = undefined
  this.temperature_ = {}
}

ThermoPlantRecipe.RECIPE_TYPE = 'pneumaticcraft:thermo_plant'

ThermoPlantRecipe.prototype.exothermic = function (exothermic_) {
  this.exothermic = exothermic_
  return this
}

ThermoPlantRecipe.prototype.pressure = function (pressure) {
  this.pressure_ = pressure
  return this
}

ThermoPlantRecipe.prototype.temperature = function (min_temp, max_temp) {
  this.temperature_ = {
    min_temp: min_temp,
    max_temp: max_temp,
  }
  return this
}

ThermoPlantRecipe.prototype.minTemp = function (min_temp) {
  this.temperature_.min_temp = min_temp
  return this
}

ThermoPlantRecipe.prototype.maxTemp = function (max_temp) {
  this.temperature_.max_temp = max_temp
  return this
}

ThermoPlantRecipe.prototype.outputs = function (outputs) {
  if (outputs === undefined) throw new Error('No recipe outputs were specified')
  // Fields are keys used in Pneumaticcraft's recipe JSON
  const base = {
    type: ThermoPlantRecipe.RECIPE_TYPE,
    exothermic: this.exothermic_,
  }
  if (
    this.temperature_.min_temp !== undefined ||
    this.temperature_.max_temp !== undefined
  ) {
    base.temperature = this.temperature_
  }
  if (this.pressure_ !== undefined) {
    base.pressure = this.pressure_
  }

  // Attempt to parse the inputs into the expected custom JSON format
  this.inputs_ = Array.isArray(this.inputs_) ? this.inputs_ : [this.inputs_]
  if (this.inputs_.length > 2) {
    throw new Error(`Too many ingredients: ${this.inputs_}`)
  }
  for (const input of this.inputs_) {
    // If the input matched an item, parse it into the expected JSON format.
    let g = Parser.parseItemInput(input)
    if (setIfValid(base, 'item_input', g)) {
      continue
    }
    // If the input matched a fluid, parse it into the expected JSON format.
    g = Parser.parseFluidInput(input)
    if (setIfValid(base, 'fluid_input', g)) {
      continue
    }
    throw new Error(`Input did not match a known format: ${input}`)
  }

  // Attempt to parse the outputs into the expected custom JSON format
  outputs = Array.isArray(outputs) ? outputs : [outputs]
  if (outputs.length > 2) throw new Error(`Too many outputs: ${outputs}`)
  for (const output of outputs) {
    // If the output matched an item, parse it into the expected JSON format.
    let g = Parser.parseItemOutput(output)
    if (setIfValid(base, 'item_output', g)) {
      continue
    }
    // If the output matched a fluid, parse it into the expected JSON format.
    g = Parser.parseFluidOutput(output)
    if (setIfValid(base, 'fluid_output', g)) {
      continue
    }
    throw new Error(`Output did not match a known format: ${output}`)
  }

  return this.e_.custom(base)
}
