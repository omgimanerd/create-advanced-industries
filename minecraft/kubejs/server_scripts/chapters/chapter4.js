// priority: 100
// Recipe overhauls for Chapter 4 progression.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)
  const redefineRecipe = redefineRecipe_(e)
  const ingotFluid = global.MeltableItem.DEFAULT_INGOT_FLUID

  // Dough can be made with water or eggs combined with flour, with the
  // handcrafting recipes being less efficient.
  e.remove({ output: 'create:dough' })
  e.shaped(
    '4x create:dough',
    [
      'FFF', //
      'FBF', //
      'FFF', //
    ],
    { F: 'create:wheat_flour', B: 'minecraft:water_bucket' }
  )
    .replaceIngredient('minecraft:water_bucket', 'minecraft:bucket')
    .id('kubejs:dough_with_water_manual_only')
  e.shapeless('3x create:dough', [
    'create:wheat_flour',
    'create:wheat_flour',
    'create:wheat_flour',
    'minecraft:egg',
  ]).id('kubejs:dough_with_egg_manual_only')
  create.mixing('8x create:dough', ['8x create:wheat_flour', Fluid.water(1000)])
  create.mixing('6x create:dough', [
    'create:wheat_flour',
    'create:wheat_flour',
    'create:wheat_flour',
    'minecraft:egg',
  ])

  // Eggs from dough
  create.haunting('minecraft:egg', '#forge:dough/wheat')

  // Lava generation should be cheaper
  e.remove({ id: 'create:mixing/lava_from_cobble' })
  create.mixing(Fluid.lava(250), 'minecraft:cobblestone').superheated()

  // Make the lava filling recipe cheaper
  e.remove({ id: 'create:filling/blaze_cake' })
  create.filling('create:blaze_cake', [
    Fluid.of('minecraft:lava', 25),
    'create:blaze_cake_base',
  ])

  // Rebalance the biofuel recipe so that the ingredient per burn time
  // cost is exactly the same as blaze cakes.
  //
  // 1 blaze cake burns superheated for 160s x 20t/s = 3200t
  // 8 blaze cakes equal the ingredient cost for 1b
  // 3200t * 8 = 25600 t
  e.remove({ id: 'createaddition:liquid_burning/biofuel' })
  // 25600 ticks per bucket (equivalent to 8x blaze cake) = 21.33 minutes
  create.burnableFluid(
    { fluidTag: '#forge:biofuel', amount: 1000 },
    25600,
    true
  )

  // Biomass pellets can also be blasted into green dye
  e.blasting('minecraft:green_dye', 'createaddition:biomass_pellet')

  // Additional straw recipe from sugarcane
  create.rolling('createaddition:straw', 'minecraft:sugar_cane')

  // Bone blocks
  create.compacting('minecraft:bone_block', [Fluid.of('minecraft:milk', 1000)])

  // Lime automation to allow limesand creation
  create
    .mixing('create:limestone', ['2x minecraft:bone_block', Fluid.water(1000)])
    .heated()
  create
    .pressurizing('minecraft:bone_block')
    .secondaryFluidInput(Fluid.water(500))
    .heated()
    .outputs('create:limestone')

  // Charcoal transmutation to coal, with a discount for blocks
  e.recipes.ars_nouveau
    .enchanting_apparatus(
      ['ars_nouveau:earth_essence', 'ars_nouveau:fire_essence'],
      'minecraft:charcoal',
      'minecraft:coal',
      200
    )
    .id('kubejs:custom_ars_nouveau_charcoal_transmutation')
  e.recipes.ars_nouveau
    .enchanting_apparatus(
      ['ars_nouveau:earth_essence', 'ars_nouveau:fire_essence'],
      'thermal:charcoal_block',
      'minecraft:coal_block',
      1000
    )
    .id('kubejs:custom_ars_nouveau_charcoal_block_transmutation')

  // Obsidian overhaul in chapter4_obsidian.js

  // Fireclay ball recipe
  create
    .mixing('4x tfmg:fireclay_ball', [
      '2x minecraft:clay_ball',
      'create:cinder_flour',
      'create:powdered_obsidian',
    ])
    .heated()

  // Allow fireclay blocks to be crafted from fireclay
  e.shaped('tfmg:fireclay', ['FF', 'FF'], {
    F: 'tfmg:fireclay_ball',
  })

  // Coke oven blocks
  redefineRecipe(
    '9x tfmg:coke_oven',
    [
      'BBB', //
      'BFB', //
      'BBB',
    ],
    { B: 'tfmg:fireproof_bricks', F: 'minecraft:furnace' }
  )

  // Coke overhaul, this actually produces the fluid amount per tick, so the
  // total output is determined by multiplying by the processing time.
  e.remove({ id: 'tfmg:coking/coal_coke' })
  e.custom({
    type: 'tfmg:coking',
    ingredients: [{ item: 'minecraft:coal', count: 1 }],
    processingTime: 1000,
    results: [
      { item: 'tfmg:coal_coke', count: 1 },
      // Yields 1000 total creosote as a result of the processing time.
      { fluid: 'tfmg:creosote', amount: 1 },
    ],
  }).id('kubejs:coal_coking')
  e.recipes.thermal.pyrolyzer(
    ['tfmg:coal_coke', Fluid.of('tfmg:creosote', 1000)],
    'minecraft:coal'
  )
  create.burnableFluid('tfmg:creosote', 2400) // 2 minutes

  // Steel overhaul
  e.remove({ id: 'tfmg:casting/steel' })
  e.remove({ id: 'tfmg:industrial_blasting/steel' })
  create
    .mixing(
      [Fluid.of('tfmg:molten_steel', 3 * ingotFluid), '2x thermal:slag'],
      [
        '2x tfmg:coal_coke_dust',
        Fluid.of('kubejs:molten_iron', 3 * ingotFluid),
        'tfmg:limesand',
      ]
    )
    .superheated()
    .id('kubejs:steel_smelting_overhaul')
  e.shaped(
    'tfmg:steel_block',
    [
      'SSS', //
      'SSS', //
      'SSS', //
    ],
    { S: 'tfmg:steel_ingot' }
  )

  // Heavy plate overhaul
  e.remove({ id: 'tfmg:sequenced_assembly/heavy_plate' })
  create
    .SequencedAssembly('tfmg:steel_ingot')
    .press(3)
    .outputs('tfmg:heavy_plate')

  // Recipes for reusable steel casts
  e.shaped(
    '4x kubejs:steel_ingot_cast',
    [
      'S S', //
      'SSS', //
    ],
    { S: 'tfmg:heavy_plate' }
  )
  create
    .curving('kubejs:steel_ingot_cast', 'tfmg:heavy_plate')
    .mode(V_SHAPED_CURVING_HEAD)

  // Recipe for screwdriver with rebar overhaul.
  e.remove({ id: 'tfmg:stonecutting/rebar' })
  create.rolling('2x tfmg:rebar', 'tfmg:heavy_plate')
  redefineRecipe(
    'tfmg:screwdriver',
    [
      '  R', //
      ' S ', //
      'D  ', //
    ],
    { R: 'tfmg:rebar', S: 'tfmg:steel_ingot', D: 'minecraft:red_dye' }
  )

  // Screw overhaul
  e.remove({ id: 'tfmg:stonecutting/screw' })
  create.cutting('4x tfmg:screw', 'tfmg:steel_ingot')
  create
    .turning(['48x tfmg:screw', 'kubejs:steel_dust'], 'tfmg:steel_block')
    .processingTime(200)

  // Steel mechanism overhaul
  e.remove({ id: 'tfmg:sequenced_assembly/steel_mechanism' })
  create
    .SequencedAssembly(PRECISION_MECHANISM, INCOMPLETE_STEEL_MECHANISM)
    .deploy('tfmg:heavy_plate')
    .deploy('create:sturdy_sheet')
    .press()
    .deploy('tfmg:screw')
    .deploy('tfmg:screwdriver')
    .loops(2)
    .outputs(STEEL_MECHANISM)
})
