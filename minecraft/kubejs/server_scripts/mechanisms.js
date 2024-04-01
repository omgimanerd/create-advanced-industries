// priority: 100

ServerEvents.recipes(e => {
  // Andesite Mechanism
  new SequencedAssembly('create:andesite_alloy')
    .transitional('kubejs:incomplete_andesite_mechanism')
    .deploy('#minecraft:planks')
    .deploy('create:shaft')
    .deploy('create:cogwheel')
    .outputs(e, 'kubejs:andesite_mechanism')

  // Copper Mechanism
  new SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('kubejs:incomplete_copper_mechanism')
    .deploy('create:copper_sheet')
    .deploy('thermal:cured_rubber')
    .press()
    .outputs(e, 'kubejs:copper_mechanism')

  // Source Mechanism
  new SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('kubejs:incomplete_source_mechanism')
    .deploy('ars_nouveau:source_gem')
    .press()
    .fill('starbunclemania:source_fluid', 100)
    .press()
    .outputs(e, 'kubejs:source_mechanism')

  // Precision mechanism recipe
  e.remove({ output: 'create:precision_mechanism' })
  new SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('create:incomplete_precision_mechanism')
    .deploy('create:electron_tube')
    .press()
    .deploy('create:brass_sheet')
    .press()
    .outputs(e, 'create:precision_mechanism')
})