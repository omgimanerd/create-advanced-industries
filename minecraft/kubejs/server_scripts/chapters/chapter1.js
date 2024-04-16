// priority: 100
// Recipe overhauls for Chapter 1 progression.

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  // Andesite and iron nugget overhaul
  e.remove({ id: 'minecraft:andesite' })
  e.remove({ id: 'create:compacting/andesite_from_flint' })
  e.shapeless('minecraft:andesite', [
    'minecraft:cobblestone',
    'minecraft:flint',
  ]).id('kubejs:andesite_manual_only')
  create.compacting('2x minecraft:andesite', [
    'minecraft:cobblestone',
    'minecraft:flint',
  ])
  create.splashing(
    ['minecraft:iron_nugget', Item.of('minecraft:flint').withChance(0.1)],
    'minecraft:gravel'
  )

  // Andesite alloy crafting
  e.remove({ id: 'create:crafting/materials/andesite_alloy_from_zinc' })
  e.remove({ type: 'create:mixing', output: 'create:andesite_alloy' })
  create.mixing('2x create:andesite_alloy', [
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
      create.cutting(Item.of(result, 3), wood)
    }
  )

  // Cogwheel crafting
  e.remove({ type: 'create:deploying', output: 'create:cogwheel' })
  create.deploying('8x create:cogwheel', [
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
  create
    .SequencedAssembly('create:andesite_alloy')
    .transitional('kubejs:incomplete_andesite_mechanism')
    .deploy('#minecraft:wooden_slabs')
    .deploy('create:shaft')
    .deploy('create:cogwheel')
    .outputs(e, 'kubejs:andesite_mechanism')
})
