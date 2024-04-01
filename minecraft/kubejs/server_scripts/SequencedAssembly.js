// priority: 0

// JS prototype class to make registering mechanism sequenced assemblies
// easier.
function SequencedAssembly(input) {
  this.input = input
  this.intermediate = input

  this.loops = 1
  this.steps = []
}

SequencedAssembly.prototype.transitional = function(intermediate) {
  this.intermediate = intermediate
  return this
}

SequencedAssembly.prototype.loops = function(n) {
  this.loops = n
  return this
}

SequencedAssembly.prototype.cut = function() {
  this.steps.push({ cut: true })
  return this
}

SequencedAssembly.prototype.press = function() {
  this.steps.push({ press: true })
  return this
}

SequencedAssembly.prototype.fill = function(fluid_id, qty_mb) {
  this.steps.push({ fill: Fluid.of(Fluid.getId(fluid_id), qty_mb) })
  return this
}

SequencedAssembly.prototype.deploy = function(item) {
  this.steps.push({ deploy: item })
  return this
}

SequencedAssembly.prototype.outputs = function(e, output) {
  const steps = this.steps.map(step => {
    if (step.cut !== undefined) {
      return e.recipes.createPressing(this.intermediate, this.intermediate)
    } else if (step.press !== undefined) {
      return e.recipes.createPressing(this.intermediate, this.intermediate)
    } else if (step.fill !== undefined) {
      return e.recipes.createFilling(
        this.intermediate, [this.intermediate, step.fill])
    } else if (step.deploy !== undefined) {
      return e.recipes.createDeploying(
        this.intermediate, [this.intermediate, step.deploy])
    } else {
      throw new Error('Unknown SequencedAssembly step!')
    }
  })
  e.recipes.create.sequenced_assembly(
      [output], this.input, steps)
    .transitionalItem(this.intermediate)
    .loops(this.loops)
}