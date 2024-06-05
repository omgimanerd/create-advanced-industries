// priority: 900

/**
 * JS prototype class to make registering Pneumaticcraft Fluid Mixer Processing
 * recipes easier
 *
 * @constructor
 * @param {Internal.RecipesEventJS} e
 * @param {Internal.InputFluid_} input1
 * @param {Internal.InputFluid_} input2
 */
function FluidMixer(e, input1, input2) {
  this.e_ = e
  this.input1_ = input1
  this.input2_ = input2

  this.pressure_ = undefined
  this.time_ = 40
}

/**
 * @constant {string}
 * @private
 */
FluidMixer.RECIPE_TYPE = 'pneumaticcraft:fluid_mixer'

/**
 * @param {number} pressure
 * @returns {FluidMixer}
 */
FluidMixer.prototype.pressure = function (pressure) {
  this.pressure_ = pressure
  return this
}

/**
 * @description Sets the processing time for this recipe.
 * @param {number} time
 * @returns {Fluid}
 */
FluidMixer.prototype.time = function (time) {
  this.time_ = time
  return this
}

/**
 * @param {OutputItem|OutputItem_[]} outputs
 * @returns {Internal.RecipeJS}
 */
FluidMixer.prototype.outputs = function (outputs) {
  const base = {
    type: FluidMixer.RECIPE_TYPE,
    time: this.time_,
  }
  if (this.pressure_ !== undefined) {
    base.pressure = this.pressure_
  }

  base.input1 = Parser.parseFluidInput(this.input1_)
  base.input1.type = 'pneumaticcraft:fluid'
  base.input2 = Parser.parseFluidInput(this.input2_)
  base.input2.type = 'pneumaticcraft:fluid'
  outputs = Parser.parseItemOrFluidOutputs(outputs, {
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
