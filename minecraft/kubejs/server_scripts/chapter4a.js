// priority: 100
// Recipe overhauls for Chapter 4A progression.

ServerEvents.tags('item', (e) => {
  e.add('kubejs:screwdriver', 'tfmg:screwdriver')
  e.add('kubejs:screwdriver', 'kubejs:screwdriver_of_assblasting')
})

ServerEvents.recipes((e) => {
  const ingotFluid = global.metallurgy.kDefaultIngotFluid

  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)

  // Eggs from dough
  e.recipes.create.haunting('minecraft:egg', 'create:dough')

  // Lava generation should be cheaper as well.
  e.remove({ id: 'create:mixing/lava_from_cobble' })
  e.recipes.create
    .mixing(Fluid.lava(250), '#minecraft:cobblestone')
    .superheated()

  // Make the lava filling recipe cheaper
  e.remove({ id: 'create:filling/blaze_cake' })
  e.recipes.create.filling('create:blaze_cake', [
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
  e.custom({
    type: 'createaddition:liquid_burning',
    input: {
      fluidTag: 'forge:biofuel',
      amount: 1000,
    },
    burnTime: 25600, // 25600 ticks per bucket (equivalent to 8x blaze cake)
    superheated: true,
  })

  // Bone blocks
  e.recipes.create.compacting('minecraft:bone_block', [
    Fluid.of('minecraft:milk', 1000),
  ])

  // Lime automation to allow limesand creation
  e.recipes.create.mixing('create:limestone', [
    'minecraft:bone_block',
    Fluid.water(1000),
  ])

  // Charcoal transmutation to coal, with a slight discount for blocks
  const pedestalItems = [
    'ars_nouveau:earth_essence',
    'minecraft:coal_block',
    'ars_nouveau:earth_essence',
    'minecraft:coal_block',
  ]
  e.recipes.ars_nouveau.imbuement(
    'minecraft:charcoal',
    'minecraft:coal',
    2000,
    pedestalItems
  )
  e.recipes.ars_nouveau.imbuement(
    'thermal:charcoal_block',
    'minecraft:coal_block',
    15000,
    pedestalItems
  )

  // Coke oven blocks
  // todo overhaul coke oven blocks

  // Coke overhaul, this actually produces the fluid amount per tick, so the
  // total output is determined by multiplying by the processing time.
  e.forEachRecipe({ type: 'tfmg:coking' }, (r) => {
    console.log(r)
    r.remove()
  })
  e.custom({
    type: 'tfmg:coking',
    ingredients: [
      {
        item: 'minecraft:coal',
        count: 1,
      },
    ],
    processingTime: 1000,
    results: [
      {
        item: 'tfmg:coal_coke',
        count: 4,
      },
      {
        fluid: 'tfmg:creosote',
        amount: 1,
      },
    ],
  })

  // Remove TFMG steel recipes
  e.remove({ id: 'tfmg:casting/steel' })
  // Steel overhaul
  e.remove({ id: 'tfmg:industrial_blasting/steel' })
  e.recipes.create
    .mixing(
      [Fluid.of('tfmg:molten_steel', 3 * ingotFluid), 'thermal:slag'],
      [
        Item.of('tfmg:coal_coke_dust', 2),
        Fluid.of('kubejs:molten_iron', 3 * ingotFluid),
        'tfmg:limesand',
      ]
    )
    .superheated()
    .id('kubejs:steel_smelting_overhaul')

  // Recipes for reusable steel casts
  new SequencedAssembly('tfmg:heavy_plate')
    .transitional('kubejs:intermediate_steel_ingot_cast')
    .deploy('tfmg:steel_ingot')
    .press(3)
    .outputs(e, 'kubejs:steel_ingot_cast')
  new SequencedAssembly('tfmg:heavy_plate')
    .transitional('kubejs:intermediate_steel_gem_cast')
    .deploy('minecraft:diamond')
    .press(3)
    .outputs(e, 'kubejs:steel_gem_cast')

  // Overhaul sturdy sheets and make them require industrial iron

  // Steel mechanism overhaul
  e.remove({ id: 'tfmg:sequenced_assembly/steel_mechanism' })
  new SequencedAssembly('create:precision_mechanism')
    .deploy('tfmg:heavy_plate')
    .deploy('create:sturdy_sheet')
    .press()
    .deploy('tfmg:screw')
    .deploy('#kubejs:screwdriver')
    .loops(2)
    .outputs(e, 'tfmg:steel_mechanism')
})
