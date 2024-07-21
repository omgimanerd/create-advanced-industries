// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // sculk farming to make enderium
  // enderium recipe from liquid hyper exp

  // Void steel sheets can only be made with void steel crushing
  e.remove({ id: 'createutilities:pressing/void_steel_sheet' })

  // Void casings require sheets instead
  e.replaceInput(
    { output: 'createutilities:void_casing' },
    'createutilities:void_steel_ingot',
    'createutilities:void_steel_sheet'
  )

  // Thermal molten fluid components
  create
    .SequencedAssembly('minecraft:glowstone_dust')
    .custom('', (pre, post) => {
      e.recipes.create_new_age.energising(post, pre, 8000)
    })
    .custom('Next: Melt in a heated basin', (pre, post) => {
      create.mixing(post, pre).heated()
    })
    .outputs(Fluid.of('thermal:glowstone', 250))
  create
    .compacting(Fluid.of('thermal:ender', 250), 'kubejs:resonant_ender_pearl')
    .superheated()

  // Quantum fluid
  e.remove({ id: 'createteleporters:quantum_fluid_recipe' })
  e.remove({ id: 'createteleporters:tele_fluid_chorus' })

  // TODO quantum casing

  // Redstone pearls
  e.remove({ id: 'createteleporters:redstone_pearl_recipe' })
  create
    .SequencedAssembly('minecraft:ender_pearl')
    .fill(Fluid.of('kubejs:molten_redstone', 180))
    .energize(40000)
    .outputs('createteleporters:redstone_pearl')

  // Advanced component overhaul
  e.remove({ id: 'createteleporters:advanced_part_recipe' })
  create
    .SequencedAssembly('refinedstorage:advanced_processor')
    .deploy('create:sturdy_sheet')
    .deploy('vintageimprovements:signalum_sheet')
    .deploy('vintageimprovements:lumium_wire')
    .outputs('createteleporters:advanced_part')

  // Neural processors, similar to regular processors in chapter 5a
  e.remove({ id: 'extrastorage:raw_neural_processor' })
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .deploy('create:super_glue')
    .deploy('morered:red_alloy_wire')
    .deploy('createutilities:graviton_tube')
    .outputs('extrastorage:raw_neural_processor')
  create
    .SequencedAssembly('kubejs:silicon_wafer')
    .fill(Fluid.of('create_things_and_misc:slime', 5))
    .deploy('morered:red_alloy_wire')
    .deploy('createutilities:graviton_tube')
    .outputs('extrastorage:raw_neural_processor')
  e.remove({ id: 'extrastorage:neural_processor' })
  pneumaticcraft.assembly_laser(
    'extrastorage:raw_neural_processor',
    'extrastorage:neural_processor'
  )

  // Quantum Mechanism
  e.remove({ id: 'createteleporters:quantum_mechanism_recipe' })
  create
    .SequencedAssembly(VIBRATION_MECHANISM, INCOMPLETE_QUANTUM_MECHANISM)
    .fill(potionFluid('quark:resilience', 250))
    .fill(Fluid.of('createteleporters:quantum_fluid', 1000))
    .deploy('createteleporters:advanced_part')
    .deploy('createteleporters:redstone_pearl')
    .deploy('extrastorage:neural_processor')
    .energize(100000)
    .outputs(QUANTUM_MECHANISM)
})
