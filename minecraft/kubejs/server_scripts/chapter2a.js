// priority: 100
// Recipe overhauls for Chapter 2A progression.

ServerEvents.recipes((e) => {
  // Generate utility functions from util.js
  const redefineRecipe = redefineRecipe_(e)
  const redefineMechanismRecipe = redefineMechanismRecipe_(e)

  // Copper automation from granite
  e.remove({ id: 'minecraft:granite' })
  e.remove({ id: 'ars_nouveau:manipulation_essence_to_granite' })
  e.remove({ id: 'create:compacting/granite_from_flint' })
  e.recipes.create.mixing(Item.of('minecraft:granite', 8), [
    Item.of('minecraft:cobblestone', 8),
    'minecraft:red_dye',
  ])
  e.recipes.create.splashing(
    ['create:copper_nugget', Item.of('minecraft:clay_ball').withChance(0.25)],
    'minecraft:red_sand'
  )

  // Rubber automation
  e.remove({ output: 'thermal:rubber' })
  e.shaped('thermal:rubber', ['FFF', 'FWF', 'FFF'], {
    F: '#minecraft:flowers',
    W: 'minecraft:water_bucket',
  })
  e.recipes.create.compacting('thermal:rubber', [Fluid.of('thermal:latex', 50)])
  e.smelting('thermal:cured_rubber_block', 'thermal:rubber_block')
  e.remove({ id: 'thermal:storage/cured_rubber_from_block' })
  e.recipes.create.cutting(
    Item.of('thermal:cured_rubber', 8),
    'thermal:cured_rubber_block'
  )

  // Copper mechanism
  e.shaped('kubejs:copper_mechanism', ['CRC', 'RMR', 'CRC'], {
    C: 'create:copper_sheet',
    R: 'thermal:cured_rubber',
    M: 'kubejs:andesite_mechanism',
  }).id('kubejs:copper_mechanism_manual_only')
  new SequencedAssembly('kubejs:andesite_mechanism')
    .transitional('kubejs:incomplete_copper_mechanism')
    .deploy('create:copper_sheet')
    .deploy('thermal:cured_rubber')
    .press()
    .outputs(e, 'kubejs:copper_mechanism')

  // Copper mechanism dependent recipes, in order of JEI search
  redefineRecipe(
    'create:copper_backtank',
    [
      'ASA', //
      'CMC', //
      ' C ', //
    ],
    {
      A: 'create:andesite_alloy',
      S: 'create:shaft',
      C: 'minecraft:copper_ingot',
      M: 'kubejs:copper_mechanism',
    }
  )
  redefineRecipe('create:mechanical_pump', [
    'kubejs:copper_mechanism',
    'create:cogwheel',
    'create:fluid_pipe',
  ])
  redefineMechanismRecipe(
    'kubejs:copper_mechanism',
    Item.of('create:smart_fluid_pipe', 2),
    'create:filter',
    'create:fluid_pipe',
    'minecraft:redstone_torch'
  )
  redefineRecipe('create:fluid_valve', [
    'kubejs:copper_mechanism',
    'create:fluid_pipe',
    'create:iron_sheet',
  ])
  redefineMechanismRecipe(
    'kubejs:copper_mechanism',
    Item.of('create:fluid_tank', 2),
    'create:copper_sheet',
    'minecraft:barrel',
    'create:copper_sheet'
  )
  redefineRecipe('create:hose_pulley', ['C', 'M', 'P'], {
    C: 'create:copper_casing',
    M: 'kubejs:copper_mechanism',
    P: 'create:rope_pulley',
  })
  redefineMechanismRecipe(
    'kubejs:copper_mechanism',
    Item.of('create:item_drain', 2),
    'minecraft:iron_bars',
    'create:copper_casing',
    'minecraft:air'
  )
  redefineMechanismRecipe(
    'kubejs:copper_mechanism',
    Item.of('create:spout', 2),
    'minecraft:air',
    'create:copper_casing',
    'thermal:cured_rubber'
  )
  redefineMechanismRecipe(
    'kubejs:copper_mechanism',
    Item.of('create:portable_fluid_interface', 2),
    'create:chute',
    'create:copper_casing',
    'minecraft:air'
  )
  redefineRecipe('create_enchantment_industry:disenchanter', ['S', 'D'], {
    S: '#create:sandpaper',
    D: 'create:item_drain',
  })
  redefineRecipe('create_enchantment_industry:printer', ['C', 'M', 'P'], {
    C: 'create:copper_casing',
    M: 'kubejs:copper_mechanism',
    P: 'create:mechanical_press',
  })
})
