// priority: 100
// Recipe overhauls for Chapter 2B progression.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  // Source fluid automation
  create.compacting(
    Fluid.of('starbunclemania:source_fluid', 100),
    'ars_nouveau:sourceberry_bush'
  )

  // More efficient source fluid automation, gated by enchantment, each level of
  // Nutrient Infusion adds 100 extra source.
  for (let level = 1; level <= 5; ++level) {
    create.compacting(
      Fluid.of('starbunclemania:source_fluid', 100 * (level + 1)),
      Item.of('ars_nouveau:sourceberry_bush')
        .enchant('kubejs:nutrient_infusion', level)
        .weakNBT()
    )
  }

  // Source fluid to source conversion should be 1:1
  e.remove({ type: 'starbunclemania:fluid_sourcelink' })
  e.custom({
    type: 'starbunclemania:fluid_sourcelink',
    fluid: 'starbunclemania:source_fluid',
    mb_to_source_ratio: 1,
  })

  // Gold nugget washing automation
  e.remove({ id: 'create:splashing/sand' })
  create.splashing(
    [
      Item.of('minecraft:gold_nugget').withChance(0.5),
      Item.of('minecraft:clay_ball').withChance(0.25),
    ],
    'minecraft:sand'
  )

  // Sand vibrating gated by steel
  create.vibrating(
    ['minecraft:gold_nugget', Item.of('minecraft:clay_ball').withChance(0.4)],
    'minecraft:sand'
  )

  // Source gem crafting, remove imbuement recipes
  e.remove({ id: 'ars_nouveau:imbuement_amethyst' })
  e.remove({ id: 'ars_nouveau:imbuement_lapis' })
  e.remove({ id: 'ars_nouveau:imbuement_amethyst_block' })
  create.filling('ars_nouveau:source_gem', [
    Fluid.of('starbunclemania:source_fluid', 250),
    'minecraft:gold_nugget',
  ])

  // Better recipes gated by Steel and FE
  e.recipes.thermal
    .crystallizer('ars_nouveau:source_gem', [
      Fluid.of('starbunclemania:source_fluid', 125),
      'minecraft:gold_nugget',
    ])
    .energy(8000)
  pneumaticcraft
    .thermo_plant()
    .fluid_input(Fluid.of('starbunclemania:source_fluid', 125))
    .item_input('minecraft:gold_nugget')
    .pressure(4.5)
    .item_output('ars_nouveau:source_gem')

  // Source mechanism
  create
    .SequencedAssembly(KINETIC_MECHANISM, 'kubejs:incomplete_source_mechanism')
    .deploy('ars_nouveau:source_gem')
    .press()
    .fill('starbunclemania:source_fluid', 100)
    .press()
    .outputs('kubejs:source_mechanism')
})
