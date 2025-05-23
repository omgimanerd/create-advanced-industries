// priority: 0
// Recipe overhauls for uncategorized misc and qol mods.

ServerEvents.tags('block', (e) => {
  // For some reason Jumbo Furnaces is packaged JIJ with More Red. Disable the
  // multiblock from forming.
  e.remove('jumbofurnace:jumbofurnaceable', /.*/)
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Basalt can be crushed into cobblestone
  e.remove({ id: 'vintageimprovements:crushing/basalt_recycling' })
  e.remove({ id: 'vintageimprovements:crushing/basalt' })
  create.crushing('minecraft:cobblestone', 'minecraft:basalt')
  e.recipes.ars_nouveau.crush(
    'minecraft:basalt',
    Item.of('minecraft:cobblestone').withChance(1)
  )

  // Haunting cobblestone to get infested cobblestone.
  create.haunting('minecraft:infested_cobblestone', 'minecraft:cobblestone')

  // Recipes for the unobtainable sculk blocks.
  e.shaped(
    'minecraft:sculk_catalyst',
    [
      'S', //
      'B', //
    ],
    { S: 'minecraft:sculk', B: 'minecraft:end_stone_bricks' }
  )
  e.shaped(
    'minecraft:sculk_shrieker',
    [
      'B B', //
      'SSS', //
    ],
    { S: 'minecraft:sculk', B: 'minecraft:end_stone_bricks' }
  )
  e.shaped(
    'minecraft:sculk_sensor',
    [
      'T', //
      'S', //
    ],
    { T: 'apotheosis:warden_tendril', S: 'minecraft:sculk' }
  )

  // Another source of green dye
  create.crushing('minecraft:green_dye', 'minecraft:kelp')

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
    { S: 'minecraft:stick', T: 'minecraft:string', H: 'kubejs:fish_hook' }
  )

  // Leads can be recycled
  create.crushing(
    ['3x minecraft:string', Item.of('minecraft:string').withChance(0.5)],
    'minecraft:lead'
  )

  // Craftable ways to get some of Quark's nice stones.
  create.compacting('quark:jasper', 'minecraft:granite')
  create.compacting('quark:shale', 'create:limestone')

  // Pressurized crafting of slime balls.
  e.remove({ id: 'pneumaticcraft:pressure_chamber/milk_to_slime_balls' })
  create.mixing('4x minecraft:slime_ball', [
    Fluid.of('minecraft:milk', 1000),
    '8x minecraft:green_dye',
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

  // Lapis dust can be converted to blue dye, remove the standard lapis crushing
  // recipe.
  e.remove({ id: 'create:milling/lapis_lazuli' })
  e.shapeless('2x minecraft:blue_dye', 'thermal:lapis_dust')

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

  // Every gear can be made on the lathe for cheaper
  e.forEachRecipe({ output: '#forge:gears' }, (r) => {
    const ingredients = r.originalRecipeIngredients
    if (ingredients.size() < 2) {
      console.error(`Unknown recipe ${r}`)
    }
    const ingredientId = ingredients[1].asIngredient().first.id
    const block = global.lookupBlock(ingredientId)
    const dust = global.lookupDust(ingredientId)
    if (dust) {
      create
        .turning(
          [Item.of(r.originalRecipeResult, 3), Item.of(dust).withChance(0.5)],
          block
        )
        .processingTime(40)
    } else {
      console.log(`No dust form for gear recipe ${r.json}`)
    }
  })

  // Allow rubberwood to be centrifuged into latex.
  create
    .centrifuging(
      [Fluid.of('thermal:latex', 250), '4x thermal:sawdust'],
      'thermal:rubberwood_log'
    )
    .minimalRPM(128)
    .processingTime(20)

  // Energized hearthstones.
  create.energizing('gag:energized_hearthstone', 'gag:hearthstone', 20000)

  // Cloud in a bottle to artifact
  e.shapeless('artifacts:cloud_in_a_bottle', 'quark:bottled_cloud')

  // Netherite Upgrade Smithing Templates
  e.remove({ id: 'minecraft:netherite_upgrade_smithing_template' })
  create
    .SequencedAssembly('minecraft:nether_brick')
    .press(2)
    .deploy('functionalstorage:diamond_upgrade')
    .fill(
      Fluid.of('kubejs:molten_diamond', global.MeltableItem.DEFAULT_INGOT_FLUID)
    )
    .outputs('minecraft:netherite_upgrade_smithing_template')

  // End portal frames can be crafted
  create
    .SequencedAssembly('minecraft:end_stone')
    .cut()
    .curve(CONVEX_CURVING_HEAD)
    .fill(Fluid.of('thermal:ender', 1000))
    .fill(Fluid.of('kubejs:teleportation_juice', 1000))
    .outputs('minecraft:end_portal_frame')

  // Antique Ink
  create
    .SequencedAssembly('minecraft:glass_bottle')
    .fill(Fluid.of('create_enchantment_industry:ink', 250))
    .deploy('supplementaries:ash')
    .outputs('supplementaries:antique_ink')

  // Weird storage crates from Quark
  e.shaped(
    'quark:crate',
    [
      'WSW', //
      'S S', //
      'WSW', //
    ],
    { W: '#minecraft:planks', S: 'minecraft:stick' }
  )
})
