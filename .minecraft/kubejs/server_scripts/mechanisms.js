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
    ]
  ).transitionalItem('kubejs:incomplete_andesite_mechanism').loops(1)


})