// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Void Steel's regular recipe is removed.
  e.remove({ id: 'createutilities:mixing/void_steel_ingot' })

  // Void steel sheets can only be made with void steel crushing
  e.remove({ id: 'createutilities:pressing/void_steel_sheet' })

  // Void casings require sheets instead
  e.replaceInput(
    { output: 'createutilities:void_casing' },
    'createutilities:void_steel_ingot',
    'createutilities:void_steel_sheet'
  )

  // Graviton tube
  e.remove({ id: 'createutilities:shaped/graviton_tube' })
  create
    .SequencedAssembly('createutilities:void_steel_sheet')
    .deploy(
      'quark:bottled_cloud',
      false,
      /*additionalOutputs*/ 'minecraft:glass_bottle'
    )
    .deploy('createutilities:polished_amethyst')
    .energize(10000)
    .outputs('createutilities:graviton_tube')

  // Energized glowstone
  create.energizing(
    'kubejs:energized_glowstone',
    'minecraft:glowstone_dust',
    64000
  )
  create
    .SequencedAssembly('minecraft:glowstone_dust')
    .fill(potionFluid('ars_elemental:shock_potion', 100))
    .energize(16000)
    .outputs('2x kubejs:energized_glowstone')
  create
    .mixing(Fluid.of('thermal:glowstone', 250), 'kubejs:energized_glowstone')
    .heated()

  // Alternate ways to get Potions of Static Charge.
  for (const type of [
    'minecraft:potion',
    'minecraft:splash_potion',
    'minecraft:lingering_potion',
  ]) {
    create.energizing(
      Item.of(type, { Potion: 'ars_elemental:shock_potion' }),
      Item.of(type, { Potion: 'minecraft:awkward' }).weakNBT(),
      24000
    )
  }

  // Echo Shards
  pneumaticcraft.pressure_chamber(
    'minecraft:sculk',
    'minecraft:echo_shard',
    4.5
  )

  // Resonant Ender
  create
    .compacting(Fluid.of('thermal:ender', 100), 'kubejs:resonant_ender_pearl')
    .superheated()
  create
    .compacting(Fluid.of('thermal:ender', 100), 'minecraft:echo_shard')
    .superheated()
  create
    .pressurizing(['kubejs:resonant_ender_pearl', 'minecraft:echo_shard'])
    .secondaryFluidInput(
      Fluid.of('create_enchantment_industry:hyper_experience', 100)
    )
    .superheated()
    .outputs(Fluid.of('thermal:ender', 1000))

  // Destabilized Redstone
  create
    .centrifuging(
      [Fluid.of('thermal:redstone', 500), potionFluid('quark:resilience', 500)],
      Fluid.of('kubejs:molten_redstone', 1000)
    )
    .minimalRPM(256)
    .processingTime(100)
  create
    .mixing(Fluid.of('kubejs:molten_redstone', 1000), [
      Fluid.of('thermal:redstone', 500),
      potionFluid('quark:resilience', 500),
    ])
    .superheated()

  // Redstone pearls, which have a chance to shatter the ender pearl.
  create
    .SequencedAssembly('kubejs:resonant_ender_pearl')
    .fill(potionFluid('quark:resilience', 25))
    .fill(Fluid.of('kubejs:molten_redstone', 180))
    .energize(40000)
    .outputs([
      Item.of('kubejs:redstone_pearl').withChance(4),
      Item.of('kubejs:shattered_ender_pearl').withChance(1),
    ])
  // Glueing the shattered ender pearl back together.
  create.deploying('minecraft:ender_pearl', [
    'kubejs:shattered_ender_pearl',
    'create:super_glue',
  ])
  create.filling('minecraft:ender_pearl', [
    'kubejs:shattered_ender_pearl',
    Fluid.of('create_things_and_misc:slime', 5),
  ])

  // TODO: Control chip overhaul
  // e.remove({ id: 'create_connected:sequenced_assembly/control_chip' })
  // create
  //   .SequencedAssembly('create:brass_sheet')
  //   .deploy('vintageimprovements:signalum_wire')
  //   .fill(potionFluid('ars_elemental:shock_potion', 250))
  //   .laser(8000, 250)
  //   .press()
  //   .outputs('create_connected:control_chip')

  // Quantum chips
  create
    .SequencedAssembly(
      'vintageimprovements:enderium_sheet',
      'kubejs:incomplete_quantum_chip'
    )
    .deploy('create:sturdy_sheet')
    .deploy('vintageimprovements:signalum_sheet')
    .deploy('vintageimprovements:lumium_wire')
    .laser(16000)
    .outputs('kubejs:quantum_chip')

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
  create
    .SequencedAssembly(VIBRATION_MECHANISM, INCOMPLETE_QUANTUM_MECHANISM)
    .fill(potionFluid('quark:resilience', 250))
    .deploy('kubejs:quantum_chip')
    .deploy('kubejs:singularity')
    .deploy('extrastorage:neural_processor')
    .energize(100000)
    .outputs(QUANTUM_MECHANISM)
})
