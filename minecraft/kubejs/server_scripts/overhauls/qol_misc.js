// priority: 0
// Recipe overhauls for uncategorized misc and qol mods.

ServerEvents.tags('block', (e) => {
  Ingredient.of(/.*_trapdoor$/).itemIds.forEach((id) => {
    if (Item.of(id).block) {
      e.add('create:wrench_pickup', id)
    }
  })
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Basalt can be crushed into cobblestone
  e.remove({ id: 'vintageimprovements:crushing/basalt_recycling' })
  e.remove({ id: 'vintageimprovements:crushing/basalt' })
  create.crushing('minecraft:cobblestone', 'minecraft:basalt')

  // Rosin from resin
  create.mixing('thermal:rosin', Fluid.of('thermal:resin', 250)).heated()

  // Add crushing recipes for items not overhauled by metallurgy.
  const ingotDustMap = {
    'thermal:ruby': 'thermal:ruby_dust',
    'thermal:sapphire': 'thermal:sapphire_dust',
    'thermal:apatite': 'thermal:apatite_dust',
    'thermal:cinnabar': 'thermal:cinnabar_dust',
    'thermal:niter': 'thermal:niter_dust',
    // Sulfur dust overhauled in chapter 5a
    'minecraft:netherite_ingot': 'thermal:netherite_dust',
  }
  for (const [ingot, dust] of Object.entries(ingotDustMap)) {
    create.milling(dust, ingot)
  }

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

  // Leads can be recycled
  create.crushing(
    ['3x minecraft:string', Item.of('minecraft:string').withChance(0.5)],
    'minecraft:lead'
  )

  // Craftable ways to get some of Quark's nice stones.
  create.compacting('quark:jasper', 'minecraft:granite')
  create.compacting('quark:shale', 'create:limestone')

  // Haunting cobblestone to get infested cobblestone.
  create.haunting('minecraft:infested_cobblestone', 'minecraft:cobblestone')

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
      console.error(`Unknown recipe ${recipe}`)
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
      console.error(`No dust form for gear recipe ${r.json}`)
    }
  })

  // smithing template netherite upgrade duping

  // neural processor
  // drop ascended coins into a well?
})
