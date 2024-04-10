// priority: 100
// Recipe overhauls for Chapter 4C progression.

ServerEvents.tags('fluid', (e) => {
  e.add('forge:crude_oil', 'tfmg:crude_oil_fluid')
})

ServerEvents.recipes((e) => {
  // Plastic must come from petrochemical processing
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_biodiesel' })
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_lpg' })
  e.custom({
    type: 'pneumaticcraft:thermo_plant',
    exothermic: false,
    fluid_input: {
      type: 'pneumaticcraft:fluid',
      amount: 250,
      tag: 'forge:lpg',
    },
    fluid_output: {
      fluid: 'pneumaticcraft:plastic',
      amount: 250,
    },
    item_input: {
      item: 'minecraft:coal',
    },
    temperature: {
      min_temp: 373,
    },
  })

  // Cool plastic in a heat frame
  e.remove({ id: 'pneumaticcraft:heat_frame_cooling/plastic' })
  e.custom({
    type: 'pneumaticcraft:heat_frame_cooling',
    input: {
      type: 'pneumaticcraft:fluid',
      amount: 1000,
      tag: 'pneumaticcraft:plastic',
    },
    max_temp: 273,
    result: {
      item: 'tfmg:plastic_sheet',
    },
  })
  e.recipes.create.cutting(
    Item.of('pneumaticcraft:plastic', 3),
    'tfmg:plastic_sheet'
  )

  // Basalt probabilistic crushing
  e.recipes.create.crushing(
    [
      Item.of('minecraft:ancient_debris').withChance(0.005),
      Item.of('minecraft:iron_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('create:copper_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('minecraft:gold_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('create:zinc_nugget').withChance(randRange(0.01, 0.1)),
      Item.of('thermal:silver_nugget').withChance(randRange(0.01, 0.1)),
    ],
    'minecraft:basalt'
  )

  // overhaul reinf stone

  // requirements
  // plastic

  // Make transistors and capacitors

  // make gates with pneu assemblylatc

  // netherite
  //

  // red alloy
  // amethyst?

  // Hardened planks can only be crafted in a pressure chamber

  new SequencedAssembly('create:precision_mechanism')
    .transitional('kubejs:incomplete_logistics_mechanism')
    .deploy('pneumaticcraft:plastic')
    .outputs(e, 'kubejs:logistics_mechanism')
})
