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
function SequencedAssembly(input) {
  this.input_ = input
  this.intermediate_ = input

  this.loops_ = 1
  this.steps_ = []
}

SequencedAssembly.prototype.transitional = function (intermediate) {
  this.intermediate_ = intermediate
  return this
}

SequencedAssembly.prototype.loops = function (loops) {
  this.loops_ = loops
  return this
}

SequencedAssembly.prototype.cut = function (repeats) {
  if (repeats === undefined) repeats = 1
  this.steps_ = this.steps_.concat(Array(repeats).fill({ cut: true }))
  return this
}

SequencedAssembly.prototype.press = function (repeats) {
  if (repeats === undefined) repeats = 1
  this.steps_ = this.steps_.concat(Array(repeats).fill({ press: true }))
  return this
}

SequencedAssembly.prototype.fill = function (fluid, qty_mb) {
  // 1-argument, Fluid object is provided.
  if (qty_mb === undefined) {
    this.steps_.push({ fill: fluid })
  } else {
    // 2-argument, fluid id + quantity in mb
    this.steps_.push({ fill: Fluid.of(fluid, qty_mb) })
  }
  return this
}

SequencedAssembly.prototype.deploy = function (item, keepHeldItem) {
  this.steps_.push({ deploy: item, keepHeldItem: !!keepHeldItem })
  return this
}

SequencedAssembly.prototype.outputs = function (e, output) {
  const steps = this.steps_.map((step) => {
    if (step.cut !== undefined) {
      return e.recipes.createPressing(this.intermediate_, this.intermediate_)
    } else if (step.press !== undefined) {
      return e.recipes.createPressing(this.intermediate_, this.intermediate_)
    } else if (step.fill !== undefined) {
      return e.recipes.createFilling(this.intermediate_, [
        this.intermediate_,
        step.fill,
      ])
    } else if (step.deploy !== undefined) {
      let r = e.recipes.createDeploying(this.intermediate_, [
        this.intermediate_,
        step.deploy,
      ])
      if (step.keepHeldItem) {
        return r.keepHeldItem()
      }
      return r
    } else {
      throw new Error('Unknown SequencedAssembly step!')
    }
  })
  const outputArray = typeof output === 'string' ? [output] : output
  return e.recipes.create
    .sequenced_assembly(outputArray, this.input_, steps)
    .transitionalItem(this.intermediate_)
    .loops(this.loops_)
}
