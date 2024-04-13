// priority: 900

// JS prototype class to make registering Pneumaticcraft Fluid Mixer Processing
// Recipes easier

function FluidMixer(e, input1, input2) {
  this.e_ = e
  this.input1_ = input1
  this.input2_ = input2

  this.pressure_ = undefined
  this.time_ = 40
}

FluidMixer.RECIPE_TYPE = 'pneumaticcraft:fluid_mixer'

FluidMixer.prototype.pressure = function (pressure) {
  this.pressure_ = pressure
  return this
}

FluidMixer.prototype.time = function (time) {
  this.time_ = time
  return this
}

FluidMixer.prototype.outputs = function (outputs) {
  const base = {
    type: FluidMixer.RECIPE_TYPE,
    time: this.time_,
  }
  if (this.pressure_ !== undefined) {
    base.pressure = this.pressure_
  }

  const input1 = Parser.parseFluidInput(this.input1_)
  if (!setIfValid(base, 'input1', input1)) {
    throw new Error(`Fluid input invalid: ${this.input1_}`)
  }
  const input2 = Parser.parseFluidInput(this.input2_)
  if (!setIfValid(base, 'input2', input2)) {
    throw new Error(`Fluid input invalid: ${this.input2_}`)
  }

  outputs = Array.isArray(outputs) ? outputs : [outputs]
  if (outputs.length > 2) {
    throw new Error(`Too many outputs: ${outputs}`)
  }
  for (const output of outputs) {
    if (typeof output !== 'string') {
      throw new Error(`Invalid output ${output}`)
    }
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
