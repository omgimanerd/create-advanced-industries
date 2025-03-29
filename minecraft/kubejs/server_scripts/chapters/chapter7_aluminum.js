// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)

  const MeltableItem = global.MeltableItem

  // Aluminum overhaul
  e.remove({ id: 'tfmg:crushing/bauxite_recycling' })
  create
    .pressurizing('thermal:rich_slag')
    .secondaryFluidInput(
      Fluid.of('tfmg:molten_slag', MeltableItem.DEFAULT_INGOT_FLUID * 4)
    )
    .heated()
    .processingTime(200)
    .outputs('create:crushed_raw_aluminum')
  e.recipes.thermal
    .crystallizer('create:crushed_raw_aluminum', [
      'thermal:rich_slag',
      Fluid.of('tfmg:molten_slag', MeltableItem.DEFAULT_INGOT_FLUID * 2),
    ])
    .energy(36000)
  pneumaticcraft
    .thermo_plant()
    .item_input('thermal:rich_slag')
    .fluid_input(Fluid.of('tfmg:molten_slag', MeltableItem.DEFAULT_INGOT_FLUID))
    .temperature({ min_temp: 273 + 250 })
    .pressure(4)
    .item_output('create:crushed_raw_aluminum')

  // Manually added recipes for aluminum dust
  create.crushing(
    Item.of('kubejs:aluminum_dust').withChance(
      MeltableItem.DEFAULT_CRUSH_RETURN_CHANCE
    ),
    'tfmg:aluminum_ingot'
  )
  e.smelting('tfmg:aluminum_ingot', 'kubejs:aluminum_dust')
})
