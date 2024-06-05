// priority: 900

/**
 * JS prototype class to make registering Pneumaticcraft Thermopneumatic
 * Processing recipes easier.
 *
 * @constructor
 * @param {Internal.RecipesEventJS} e
 * @param {(Internal.InputFluid_|InputItem_)[]} inputs
 */
function ThermoPlant(e, inputs) {
  this.e_ = e
  this.inputs_ = inputs

  this.exothermic_ = false
  this.pressure_ = undefined
  this.temperature_ = {}
}

/**
 * @constant
 * @private
 */
ThermoPlant.RECIPE_TYPE = 'pneumaticcraft:thermo_plant'

/**
 * @param {boolean} exothermic_
 * @returns {ThermoPlant}
 */
ThermoPlant.prototype.exothermic = function (exothermic_) {
  this.exothermic = exothermic_
  return this
}

/**
 * @param {number} pressure
 * @returns {ThermoPlant}
 */
ThermoPlant.prototype.pressure = function (pressure) {
  this.pressure_ = pressure
  return this
}

/**
 * Some general temperature constraints:
 *   Superheated blaze burner = 924C TPG
 *   Heated blaze burner = 261C TPG
 *   5 bar vortex tube = 490C => 465C TPG
 *   10 bar vortex tube = 1113CC => 1056 TPG
 *   15 bar vortex tube = 1741C => 1650C TPG
 *   16 bar vortex tube = 1866C => 1769C TPG
 *   17 bar vortex tube = 1990C => 1887C TPG
 *
 * @param {number} min_temp The min temperature in C
 * @param {number} max_temp The max temperature in C
 * @returns {ThermoPlant}
 */
ThermoPlant.prototype.temperature = function (min_temp, max_temp) {
  this.temperature_ = {
    min_temp: min_temp + 273,
    max_temp: max_temp + 273,
  }
  return this
}

/**
 * @param {number} min_temp The min temperature in C
 * @returns {ThermoPlant}
 */
ThermoPlant.prototype.minTemp = function (min_temp) {
  this.temperature_.min_temp = min_temp + 273
  return this
}

/**
 * @param {number} max_temp The min temperature in C
 * @returns {ThermoPlant}
 */
ThermoPlant.prototype.maxTemp = function (max_temp) {
  this.temperature_.max_temp = max_temp + 273
  return this
}

/**
 * @param {(Internal.OutputFluid_|OutputItem_)[]} outputs
 * @returns {Internal.RecipeJS}
 */
ThermoPlant.prototype.outputs = function (outputs) {
  if (outputs === undefined) throw new Error('No recipe outputs were specified')
  // Fields are keys used in Pneumaticcraft's recipe JSON
  const base = {
    type: ThermoPlant.RECIPE_TYPE,
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
  const inputs = Parser.parseItemOrFluidInputs(this.inputs_, {
    maxItems: 1,
    maxFluids: 1,
  })
  if (inputs.items.length === 1) {
    base.item_input = inputs.items[0]
  }
  if (inputs.fluids.length === 1) {
    base.fluid_input = inputs.fluids[0]
    base.fluid_input.type = 'pneumaticcraft:fluid'
  }

  outputs = Parser.parseItemOrFluidInputs(outputs, {
    maxItems: 1,
    maxFluids: 1,
  })
  if (outputs.items.length === 1) {
    base.item_output = outputs.items[0]
  }
  if (outputs.fluids.length === 1) {
    base.fluid_output = outputs.fluids[0]
  }

  return this.e_.custom(base)
}
