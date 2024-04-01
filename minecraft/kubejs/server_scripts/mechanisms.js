// priority: 0

ServerEvents.recipes(e => {

  // JS prototype class to make registering mechanism sequenced assemblies
  // easier.
  function SequencedAssembly(input, intermediate) {
    this.input = input
    this.intermediate = intermediate

    this.loops = 1
    this.steps = []
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

  SequencedAssembly.prototype.outputs = function(output) {
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

  // Andesite Mechanism
  new SequencedAssembly('create:andesite_alloy',
                        'kubejs:incomplete_andesite_mechanism')
    .deploy('#minecraft:planks')
    .deploy('create:shaft')
    .deploy('create:cogwheel')
    .outputs('kubejs:andesite_mechanism')

  // Copper Mechanism
  new SequencedAssembly('kubejs:andesite_mechanism',
                        'kubejs:incomplete_copper_mechanism')
    .deploy('create:copper_sheet')
    .deploy('thermal:cured_rubber')
    .press()
    .outputs('kubejs:copper_mechanism')

  // Source Mechanism
  new SequencedAssembly('kubejs:andesite_mechanism',
                        'kubejs:incomplete_source_mechanism')
    .deploy('ars_nouveau:source_gem')
    .press()
    .fill('starbunclemania:source_fluid', 100)
    .press()
    .outputs('kubejs:source_mechanism')

  // Precision mechanism recipe
  e.remove({ output: 'create:precision_mechanism' })
  new SequencedAssembly('kubejs:andesite_mechanism',
                        'create:incomplete_precision_mechanism')
    .deploy('create:electron_tube')
    .press()
    .deploy('create:brass_sheet')
    .press()
    .outputs('create:precision_mechanism')
})