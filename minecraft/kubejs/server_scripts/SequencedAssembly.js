// priority: 0

// JS prototype class to make registering mechanism sequenced assemblies
// easier.
function SequencedAssembly(input) {
  this.input = input
  this.intermediate = input

  this.loops = 1
  this.steps = []
}

SequencedAssembly.prototype.transitional = function (intermediate) {
  this.intermediate = intermediate
  return this
}

SequencedAssembly.prototype.loops = function (n) {
  this.loops = n
  return this
}

SequencedAssembly.prototype.cut = function () {
  this.steps.push({ cut: true })
  return this
}

SequencedAssembly.prototype.press = function () {
  this.steps.push({ press: true })
  return this
}

SequencedAssembly.prototype.fill = function (fluid, qty_mb) {
  // 1-argument, Fluid object is provided.
  if (qty_mb === undefined) {
    this.steps.push({ fill: fluid })
  } else {
    // 2-argument, fluid id + quantity in mb
    this.steps.push({ fill: Fluid.of(fluid, qty_mb) })
  }

  return this
}

SequencedAssembly.prototype.deploy = function (item) {
  this.steps.push({ deploy: item })
  return this
}

SequencedAssembly.prototype.outputs = function (e, output) {
  const steps = this.steps.map((step) => {
    if (step.cut !== undefined) {
      return e.recipes.createPressing(this.intermediate, this.intermediate)
    } else if (step.press !== undefined) {
      return e.recipes.createPressing(this.intermediate, this.intermediate)
    } else if (step.fill !== undefined) {
      return e.recipes.createFilling(this.intermediate, [
        this.intermediate,
        step.fill,
      ])
    } else if (step.deploy !== undefined) {
      return e.recipes.createDeploying(this.intermediate, [
        this.intermediate,
        step.deploy,
      ])
    } else {
      throw new Error('Unknown SequencedAssembly step!')
    }
  })
  const outputArray = typeof output === 'string' ? [output] : output
  e.recipes.create
    .sequenced_assembly(outputArray, this.input, steps)
    .transitionalItem(this.intermediate)
    .loops(this.loops)
}
