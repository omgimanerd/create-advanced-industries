// priority: 0
// Recipe overhauls for uncategorized misc and qol mods.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Another source of green dye
  e.blasting('minecraft:green_dye', 'minecraft:kelp')

  // Fish hooks and fishing rods.
  e.shaped(
    'kubejs:fish_hook',
    [
      '  I', //
      'I I', //
      ' I ', //
    ],
    { I: 'minecraft:iron_nugget' }
  )
  redefineRecipe(
    'minecraft:fishing_rod',
    [
      '  S', //
      ' ST', //
      'S H', //
    ],
    {
      S: 'minecraft:stick',
      T: 'minecraft:string',
      H: 'kubejs:fish_hook',
    }
  )

  // Craftable ways to get some of Quark's nice stones.
  create.compacting('quark:jasper', 'minecraft:granite')
  create.compacting('quark:shale', 'create:limestone')

  // Haunting cobblestone to get infested cobblestone.
  create.haunting('minecraft:infested_cobblestone', 'minecraft:cobblestone')

  // Pressurized crafting of slime balls.
  e.remove({ id: 'pneumaticcraft:pressure_chamber/milk_to_slime_balls' })
  create.mixing(Item.of('minecraft:slime_ball', 4), [
    Fluid.of('minecraft:milk', 1000),
    Item.of('minecraft:green_dye', 8),
  ])
  create
    .pressurizing('minecraft:green_dye')
    .secondaryFluidInput(Fluid.of('minecraft:milk', 250))
    .processingTime(40)
    .outputs('minecraft:slime_ball')
  pneumaticcraft
    .thermo_plant()
    .item_input('minecraft:green_dye')
    .fluid_input(Fluid.of('minecraft:milk', 250))
    .pressure(2)
    .item_output('minecraft:slime_ball')

  // Another alternative paper recipe
  create
    .SequencedAssembly('thermal:sawdust')
    .fill(Fluid.of('create_things_and_misc:slime', 10))
    .press()
    .outputs('minecraft:paper')

  // Gate advanced magnet behind brass instead of gold.
  e.replaceInput(
    { id: 'simplemagnets:advancedmagnet' },
    'minecraft:gold_ingot',
    'create:brass_ingot'
  )

  // smithing template netherite upgrade duping

  // neural processor
  // drop ascended coins into a well?
})
