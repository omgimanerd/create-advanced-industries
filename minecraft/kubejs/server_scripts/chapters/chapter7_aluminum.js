// priority: 500

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  const MeltableItem = global.MeltableItem
  const ingotFluid = MeltableItem.DEFAULT_INGOT_FLUID

  // Aluminum overhaul
  e.remove({ id: 'tfmg:crushing/bauxite_recycling' })
  create.centrifuging(
    [
      Item.of('create:crushed_raw_aluminum').withChance(0.25),
      Fluid.of('tfmg:molten_slag', ingotFluid * 5),
    ],
    [
      'thermal:rich_slag',
      'create_things_and_misc:crushed_magma',
      Fluid.lava(ingotFluid * 4),
    ],
    192,
    1000
  )

  // Manually added recipes for aluminum dust
  create.crushing(
    Item.of('kubejs:aluminum_dust').withChance(
      MeltableItem.DEFAULT_CRUSH_RETURN_CHANCE
    ),
    'tfmg:aluminum_ingot'
  )
  // TODO add dirty aluminum dust, add aluminum to metallurgy screen
  e.smelting('tfmg:aluminum_ingot', 'kubejs:aluminum_dust')
})
