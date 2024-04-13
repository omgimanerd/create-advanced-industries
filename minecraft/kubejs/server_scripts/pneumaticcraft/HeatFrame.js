// priority: 900

// JS prototype class to make registering Pneumaticcraft Heat Frame Processing
// Recipes easier

function HeatFrame(e, input) {
  this.e_ = e
  this.input_ = input

  this.bonus_output_ = {}
  this.max_temp_ = 273
}

HeatFrame.RECIPE_TYPE = 'pneumaticcraft:heat_frame_cooling'

HeatFrame.prototype.bonusOutput = function (limit, multiplier) {
  this.bonus_output_ = {
    limit: limit,
    multiplier: multiplier,
  }
  return this
}

/**
 * @param {number} max_temp The maximum temperature in C
 * @returns
 */
HeatFrame.prototype.maxTemp = function (max_temp) {
  this.max_temp_ = max_temp + 273
  return this
}

HeatFrame.prototype.outputs = function (output) {
  const base = {
    type: HeatFrame.RECIPE_TYPE,
    max_temp: this.max_temp_,
  }
  if (
    this.bonus_output_.limit !== undefined &&
    this.bonus_output_.multiplier !== undefined
  ) {
    base.bonus_output = this.bonus_output_
  }

  // There should be exactly one fluid input and one item output.
  const fluidOutput = Parser.parseFluidInput(this.input_)
  if (!setIfValid(base, 'input', fluidOutput)) {
    throw new Error(`Invalid input ${this.input_}`)
  }
  const itemOutput = Parser.parseItemOutput(output)
  if (!setIfValid(base, 'result', itemOutput)) {
    throw new Error(`Invalid output ${output}`)
  }

  return this.e_.custom(base)
}