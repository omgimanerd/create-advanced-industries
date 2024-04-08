// priority: 100
// Recipe overhauls for Chapter 1 progression.

ServerEvents.recipes((e) => {
  // Andesite and iron nugget overhaul
  e.remove({ id: 'minecraft:andesite' })
  e.remove({ id: 'create:compacting/andesite_from_flint' })
  e.shapeless('minecraft:andesite', [
    'minecraft:cobblestone',
    'minecraft:flint',
  ]).id('kubejs:andesite_manual_only')
  e.recipes.create.compacting(Item.of('minecraft:andesite', 2), [
    'minecraft:cobblestone',
    'minecraft:flint',
  ])
  e.recipes.create.splashing(
    ['minecraft:iron_nugget', Item.of('minecraft:flint').withChance(0.1)],
    'minecraft:gravel'
  )

  // Andesite alloy crafting
  e.remove({ id: 'create:crafting/materials/andesite_alloy_from_zinc' })
  e.remove({ type: 'create:mixing', output: 'create:andesite_alloy' })
  e.recipes.create.mixing(Item.of('create:andesite_alloy', 2), [
    'minecraft:andesite',
    'minecraft:iron_nugget',
  ])

  // Cutting recipes for all wooden slabs.
  e.forEachRecipe(
    { type: 'minecraft:crafting_shaped', output: '#minecraft:wooden_slabs' },
    (r) => {
      const parsed = JSON.parse(r.json)
      const wood = parsed.key['#'].item
      const result = parsed.result.item
      e.recipes.create.cutting(Item.of(result, 3), wood)
    }
  )

  // Cogwheel crafting
  e.remove({ type: 'create:deploying', output: 'create:cogwheel' })
  e.recipes.create.deploying(Item.of('create:cogwheel', 8), [
    'create:shaft',
    '#forge:stripped_logs',
  ])

  // Andesite mechanism
  e.shaped(
    'kubejs:andesite_mechanism',
    [
      'PSP', //
      'CAC', //
      'PSP', //
    ],
    {
      P: '#minecraft:planks',
      S: 'create:shaft',
      C: 'create:cogwheel',
      A: 'create:andesite_alloy',
    }
  ).id('kubejs:andesite_mechanism_manual_only')
  new SequencedAssembly('create:andesite_alloy')
    .transitional('kubejs:incomplete_andesite_mechanism')
    .deploy('#minecraft:wooden_slabs')
    .deploy('create:shaft')
    .deploy('create:cogwheel')
    .outputs(e, 'kubejs:andesite_mechanism')
})
