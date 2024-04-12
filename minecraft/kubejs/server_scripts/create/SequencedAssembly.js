// priority: 900

// JS prototype class to make registering mechanism sequenced assemblies
// easier.
//
// Example usage:
// new SequencedAssembly('#minecraft:wooden_slabs')
//   .transitional('custom:incomplete_andesite_mechanism')
//   .deploy('create:andesite_alloy')
//   .deploy('create:shaft')
//   .deploy('create:cogwheel')
//   .outputs(e, 'kubejs:andesite_mechanism')
function SequencedAssembly(e, input) {
  this.e_ = e
  this.input_ = input
  this.transitional_ = input

  this.loops_ = 1
  this.steps_ = []
}

// If this is called, it must be called before any other methods to add steps.
SequencedAssembly.prototype.transitional = function (transitional) {
  this.transitional_ = transitional
  return this
}

SequencedAssembly.prototype.loops = function (loops) {
  this.loops_ = loops
  return this
}

SequencedAssembly.prototype.cut = function (processingTime, repeats) {
  if (repeats === undefined) repeats = 1
  const cuttingStep = this.e_.recipes.createCutting(
    this.transitional_,
    this.transitional_
  )
  if (processingTime !== undefined) {
    cuttingStep.processingTime(processingTime)
  }
  this.steps_ = this.steps_.concat(Array(repeats).fill(cuttingStep))
  return this
}

SequencedAssembly.prototype.press = function (repeats) {
  if (repeats === undefined) repeats = 1
  this.steps_ = this.steps_.concat(
    Array(repeats).fill(
      this.e_.recipes.createPressing(this.transitional_, this.transitional_)
    )
  )
  return this
}

SequencedAssembly.prototype.fill = function (fluid, qty_mb) {
  // 1-argument, Fluid object is provided.
  if (qty_mb === undefined) {
    this.steps_.push(
      this.e_.recipes.createFilling(this.transitional_, [
        this.transitional_,
        fluid,
      ])
    )
  } else {
    // 2-argument, fluid id + quantity in mb
    this.steps_.push(
      this.e_.recipes.createFilling(this.transitional_, [
        this.transitional_,
        Fluid.of(fluid, qty_mb),
      ])
    )
  }
  return this
}

SequencedAssembly.prototype.deploy = function (item, keepHeldItem) {
  const deployingStep = this.e_.recipes.createDeploying(this.transitional_, [
    this.transitional_,
    item,
  ])
  if (keepHeldItem) {
    deployingStep.keepHeldItem()
  }
  this.steps_.push(deployingStep)
  return this
}

SequencedAssembly.prototype.outputs = function (output) {
  const outputArray = typeof output === 'string' ? [output] : output
  return this.e_.recipes.create
    .sequenced_assembly(outputArray, this.input_, this.steps_)
    .transitionalItem(this.transitional_)
    .loops(this.loops_)
}
