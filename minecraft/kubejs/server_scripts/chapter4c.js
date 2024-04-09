// priority: 100
// Recipe overhauls for Chapter 4C progression.

ServerEvents.recipes((e) => {
  // Plastic must come from petrochemical processing
  e.remove({ id: 'pneumaticcraft:thermo_plant/plastic_from_biodiesel' })

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

  // requirements
  // plastic
  // netherite
  // amethyst?

  new SequencedAssembly('create:precision_mechanism')
    .transitional('kubejs:incomplete_plastic_mechanism')
    .deploy('pneumaticcraft:plastic')
    .outputs(e, 'kubejs:plastic_mechanism')
})
