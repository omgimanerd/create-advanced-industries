// priority: 900

// JS prototype class to make registering Pneumaticcraft Thermopneumatic
// Processing Recipes easier.

function ThermoPlantRecipe(inputs) {
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

ThermoPlantRecipe.prototype.minTemp = function (minTemp_) {
  this.temperature_.min_temp = minTemp_
  return this
}

ThermoPlantRecipe.prototype.maxTemp = function (maxTemp_) {
  this.temperature_.max_temp = maxTemp_
  return this
}

ThermoPlantRecipe.prototype.outputs = function (e, outputs) {
  if (outputs === undefined) {
    throw new Error('No recipe outputs were specified')
  }

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
    if (typeof input !== 'string') {
      throw new Error(`Invalid input ${input}`)
    }
    let m = PneumaticcraftUtils.parseItemInput(input)
    if (PneumaticcraftUtils.setIfValid(base, 'item_input', m)) {
      continue
    }
    m = PneumaticcraftUtils.parseFluidInput(input)
    if (PneumaticcraftUtils.setIfValid(base, 'fluid_input', m)) {
      continue
    }
    throw new Error(`Input did not match a known format: ${input}`)
  }

  // Attempt to parse the outputs into the expected custom JSON format
  outputs = Array.isArray(outputs) ? outputs : [outputs]
  if (outputs.length > 2) {
    throw new Error(`Too many outputs: ${outputs}`)
  }
  for (let output of outputs) {
    if (typeof output !== 'string') {
      throw new Error(`Invalid output ${output}`)
    }
    // If the output matched an item, parse it into the expected JSON format.
    let m = PneumaticcraftUtils.parseItemOutput(output)
    if (PneumaticcraftUtils.setIfValid(base, 'item_output', m)) {
      continue
    }
    // If the output matched a fluid, parse it into the expected JSON format.
    m = PneumaticcraftUtils.parseFluidOutput(output)
    if (PneumaticcraftUtils.setIfValid(base, 'fluid_output', m)) {
      continue
    }
    throw new Error(`Output did not match a known format: ${output}`)
  }

  e.custom(base)
}
