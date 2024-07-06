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

  // Gravel mixing to get flint
  e.remove({ id: 'create:milling/gravel' })
  create.mixing(Item.of('minecraft:flint').withChance(0.5), 'minecraft:gravel')
  // Better recipe unlocked by steel
  create.vibrating('minecraft:flint', 'minecraft:gravel')

  // Andesite alloy crafting
  e.remove({ id: 'create:crafting/materials/andesite_alloy_from_zinc' })
  e.remove({ type: 'create:mixing', output: 'create:andesite_alloy' })
  create.mixing('2x create:andesite_alloy', [
    'minecraft:andesite',
    'minecraft:iron_nugget',
  ])

  // Shafts can be cut from andesite, or for more effort, lathed.
  create.turning('8x create:shaft', 'create:andesite_alloy')

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

  // Kinetic mechanism
  e.shaped(
    KINETIC_MECHANISM,
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
  ).id('kubejs:kinetic_mechanism_manual_only')
  create
    .SequencedAssembly('create:andesite_alloy', INCOMPLETE_KINETIC_MECHANISM)
    .deploy('#minecraft:wooden_slabs')
    .deploy('create:shaft')
    .deploy('create:cogwheel')
    .outputs(KINETIC_MECHANISM)
})
