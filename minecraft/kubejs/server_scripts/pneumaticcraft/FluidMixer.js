// priority: 900

// JS prototype class to make registering Pneumaticcraft Heat Frame Processing
// Recipes easier

function FluidMixerRecipe(e, input1, input2) {
  this.e_ = e
  this.input1_ = input1
  this.input2_ = input2

  this.pressure_ = undefined
  this.time_ = 40
}

FluidMixerRecipe.RECIPE_TYPE = 'pneumaticcraft:fluid_mixer'

FluidMixerRecipe.prototype.pressure = function (pressure) {
  this.pressure_ = pressure
  return this
}

FluidMixerRecipe.prototype.time = function (time) {
  this.time_ = time
  return this
}

FluidMixerRecipe.prototype.outputs = function (outputs) {
  let base = {
    type: FluidMixerRecipe.RECIPE_TYPE,
    time: this.time_,
  }
  if (this.pressure_ !== undefined) {
    base.pressure = this.pressure_
  }

  const input1 = PneumaticcraftUtils.parseFluidInput(this.input1_)
  if (!PneumaticcraftUtils.setIfValid(base, 'input1', input1)) {
    throw new Error(`Fluid input invalid: ${this.input1_}`)
  }
  const input2 = PneumaticcraftUtils.parseFluidInput(this.input2_)
  if (!PneumaticcraftUtils.setIfValid(base, 'input2', input2)) {
    throw new Error(`Fluid input invalid: ${this.input2_}`)
  }

  outputs = Array.isArray(outputs) ? outputs : [outputs]
  if (outputs.length > 2) {
    throw new Error(`Too many outputs: ${outputs}`)
  }
  for (let output of outputs) {
    if (typeof output !== 'string') {
      throw new Error(`Invalid output ${output}`)
    }
    // If the output matched an item, parse it into the expected JSON format.
    let g = PneumaticcraftUtils.parseItemOutput(output)
    if (PneumaticcraftUtils.setIfValid(base, 'item_output', g)) {
      continue
    }
    // If the output matched a fluid, parse it into the expected JSON format.
    g = PneumaticcraftUtils.parseFluidOutput(output)
    if (PneumaticcraftUtils.setIfValid(base, 'fluid_output', g)) {
      continue
    }
    throw new Error(`Output did not match a known format: ${output}`)
  }

  if (PneumaticcraftUtils.LOG_DEBUG_OUTPUT) {
    console.log(JSON.stringify(base))
  }

  return this.e_.custom(base)
}
