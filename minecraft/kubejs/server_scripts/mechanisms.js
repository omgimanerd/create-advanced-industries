// priority: 0

ServerEvents.recipes(e => {

  let deployIntermediate = (intermediate, input) => {
    return e.recipes.create.deploying(intermediate, [intermediate, input])
  }

  // Andesite Mechanism
  e.recipes.create.sequenced_assembly(
    ['kubejs:andesite_mechanism'],  // output
    'create:andesite_alloy',  // input
    [
      deployIntermediate(
        'kubejs:incomplete_andesite_mechanism', '#minecraft:planks'),
      deployIntermediate(
        'kubejs:incomplete_andesite_mechanism', 'create:shaft'),
      deployIntermediate(
        'kubejs:incomplete_andesite_mechanism', 'create:cogwheel'),
    ],
  ).transitionalItem('kubejs:incomplete_andesite_mechanism').loops(1)

  // Copper Mechanism
  e.recipes.create.sequenced_assembly(
    ['kubejs:copper_mechanism'],  // output
    'kubejs:andesite_mechanism',  // input
    [
      deployIntermediate(
        'kubejs:incomplete_copper_mechanism', 'create:copper_sheet'),
      deployIntermediate(
        'kubejs:incomplete_copper_mechanism', 'thermal:cured_rubber'),
      e.recipes.createPressing(
        'kubejs:incomplete_copper_mechanism', 'kubejs:incomplete_copper_mechanism'),
    ],
  ).transitionalItem('kubejs:incomplete_copper_mechanism').loops(1)

  // Source Mechanism
  e.recipes.create.sequenced_assembly(
    ['kubejs:source_mechanism'],  // output
    'kubejs:andesite_mechanism',  // input
    [
      deployIntermediate(
        'kubejs:incomplete_source_mechanism', 'ars_nouveau:source_gem'),
      e.recipes.createPressing(
        'kubejs:incomplete_source_mechanism', 'kubejs:incomplete_source_mechanism'),
      e.recipes.createFilling(
        'kubejs:incomplete_source_mechanism',
        ['kubejs:incomplete_source_mechanism',
          Fluid.of(Fluid.getId('starbunclemania:source_fluid'), 100)]
      ),
      e.recipes.createPressing(
        'kubejs:incomplete_source_mechanism', 'kubejs:incomplete_source_mechanism'),
    ],
  ).transitionalItem('kubejs:incomplete_source_mechanism').loops(1)

  // Redo precision mechanism recipe
  e.remove({ output: 'create:precision_mechanism' })
  e.recipes.create.sequenced_assembly(
    ['create:precision_mechanism'],  // output
    'kubejs:andesite_mechanism',  // input
    [
      deployIntermediate(
        'create:incomplete_precision_mechanism', 'create:electron_tube'),
      e.recipes.createPressing(
        'create:incomplete_precision_mechanism', 'create:incomplete_precision_mechanism'),
      deployIntermediate(
        'create:incomplete_precision_mechanism', 'create:brass_sheet'),
      e.recipes.createPressing(
        'create:incomplete_precision_mechanism', 'create:incomplete_precision_mechanism'),
    ],
  ).transitionalItem('create:incomplete_precision_mechanism').loops(1)

})