// priority: 0

ServerEvents.tags('item', (e) => {
  e.add('kubejs:item_melts_to_slag', 'thermal:slag')
  e.add('kubejs:item_melts_to_slag', 'thermal:rich_slag')

  e.add('kubejs:block_melts_to_slag', 'thermal:slag_block')
  e.add('kubejs:block_melts_to_slag', 'thermal:polished_slag')
  e.add('kubejs:block_melts_to_slag', 'thermal:chiseled_slag')
  e.add('kubejs:block_melts_to_slag', 'thermal:slag_bricks')
  e.add('kubejs:block_melts_to_slag', 'thermal:cracked_slag_bricks')
  e.add('kubejs:block_melts_to_slag', 'thermal:rich_slag_block')
  e.add('kubejs:block_melts_to_slag', 'thermal:polished_rich_slag')
  e.add('kubejs:block_melts_to_slag', 'thermal:chiseled_rich_slag')
  e.add('kubejs:block_melts_to_slag', 'thermal:rich_slag_bricks')
  e.add('kubejs:block_melts_to_slag', 'thermal:cracked_rich_slag_bricks')
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  // Molten slag from gravel
  e.remove({ id: 'thermal:smelting/slag_from_smelting' })
  create
    .mixing(Fluid.of('tfmg:molten_slag', ingotFluid), 'minecraft:gravel')
    .heated()

  // Molten slag from slag/rich slag.
  e.remove({ id: 'tfmg:mixing/slag' })
  create
    .mixing(
      Fluid.of('tfmg:molten_slag', ingotFluid),
      '#kubejs:item_melts_to_slag'
    )
    .heated()
  create.mixing(
    Fluid.of('tfmg:molten_slag', ingotFluid * 4),
    '#kubejs:block_melts_to_slag'
  )

  // Slag solidication.
  create.compacting('thermal:slag', Fluid.of('tfmg:molten_slag', ingotFluid))
  create.compacting(
    'thermal:slag_block',
    Fluid.of('tfmg:molten_slag', 4 * ingotFluid)
  )

  // Slag processing as an alternate iron route.
  create
    .mixing(
      [
        Fluid.of('kubejs:molten_iron', 1.5 * ingotFluid),
        '3x thermal:slag',
        '3x minecraft:gravel',
      ],
      Fluid.of('tfmg:molten_slag', 10 * ingotFluid)
    )
    .processingTime(200)
    .heated()

  // Slag enrichment to rich slag.
  e.recipes.ars_nouveau.imbuement('thermal:slag', 'thermal:rich_slag', 1000, [])
  create
    .pressurizing('thermal:slag')
    .secondaryFluidInput(Fluid.of('starbunclemania:source_fluid', 750))
    .heated()
    .outputs('thermal:rich_slag')
  pneumaticcraft
    .thermo_plant()
    .item_input('thermal:slag')
    .fluid_input(Fluid.of('starbunclemania:source_fluid', 500))
    .temperature({ min_temp: 273 + 500 })
    .pressure(2)
    .item_output('thermal:rich_slag')
})
