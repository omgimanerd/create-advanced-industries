// priority: 900

// JS prototype class to make registering Pneumaticcraft Heat Frame Processing
// Recipes easier

function HeatFrameRecipe(input) {
  this.input_ = input

  this.bonus_output_ = {}
  this.max_temp_ = 273
}

HeatFrameRecipe.RECIPE_TYPE = 'pneumaticcraft:heat_frame_cooling'

HeatFrameRecipe.prototype.bonusOutput = function (limit, multiplier) {
  this.bonus_output_ = {
    limit: limit,
    multiplier: multiplier,
  }
  return this
}

HeatFrameRecipe.prototype.maxTemp = function (max_temp) {
  this.max_temp_ = max_temp
}

HeatFrameRecipe.prototype.outputs = function (e, output) {
  let base = {
    type: HeatFrameRecipe.RECIPE_TYPE,
    max_temp: this.max_temp_,
  }
  if (
    this.bonus_output_.limit !== undefined &&
    this.bonus_output_.multiplier !== undefined
  ) {
    base.bonus_output = this.bonus_output_
  }

  // There should be exactly one fluid input and one item output.
  let g = PneumaticcraftUtils.parseFluidInput(this.input_)
  if (!PneumaticcraftUtils.setIfValid(base, 'input', g)) {
    throw new Error(`Invalid input ${this.input_}`)
  }
  g = PneumaticcraftUtils.parseItemOutput(output)
  if (!PneumaticcraftUtils.setIfValid(base, 'result', g)) {
    throw new Error(`Invalid output ${output}`)
  }

  if (PneumaticcraftUtils.LOG_DEBUG_OUTPUT) {
    console.log(JSON.stringify(base))
  }

  e.custom(base)
}
