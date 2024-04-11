// priority: 100
// Recipe overhauls for Chapter 4B progression.

// BlockEvents.rightClicked('minecraft:stone', (e) => {
//   const player = e.getPlayer()
//   if (!player.level.isClientSide()) {
//     console.log(player)
//     console.log(e.getBlock())
//   }
// })

EntityEvents.death('minecraft:wandering_trader', (e) => {
  // console.log(e)
  // console.log(e.source)
})

EntityEvents.spawned((e) => {
  let { entity, level } = e
  if (entity.type == 'ars_nouveau:an_lightning') {
    const surroundingBlocks = [
      { x: -1, y: -1, z: -1 },
      { x: -1, y: -1, z: 0 },
      { x: -1, y: -1, z: 1 },
      { x: 0, y: -1, z: -1 },
      { x: 0, y: -1, z: 0 },
      { x: 0, y: -1, z: 1 },
      { x: 1, y: -1, z: -1 },
      { x: 1, y: -1, z: 0 },
      { x: 1, y: -1, z: 1 },
    ]
    for (let offset of surroundingBlocks) {
      let block = entity.block.offset(offset.x, offset.y, offset.z)
      if (block == 'minecraft:emerald_block') {
        let trader = block.createEntity('minecraft:wandering_trader')
        trader.spawn()
        level.destroyBlock(block.getPos(), false)
      }
    }
  }
})

ServerEvents.compostableRecipes((e) => {
  // Add compostable magical stuff
  e.remove('minecraft:flowering_azalea')
  e.add('minecraft:flowering_azalea', 1)
})

ServerEvents.recipes((e) => {
  const redefineRecipe = redefineRecipe_(e)
  // Automate emeralds
  // Strike emerald block with lightning to spawn a wandering trader
  // Kill wandering trader in 4 ways to get essences
  // Automate moss + growth => sprinkly bits
  // liquid fert can be augmented into crystal growth accelerator

  // amethyst?

  // Catalyst for first moss block
  e.recipes.create
    .item_application('minecraft:moss_block', [
      'minecraft:stone',
      'createaddition:biomass',
    ])
    .id('kubejs:moss_from_biomass_application')

  // Bonemeal cannot be reverse crafted from bone blocks.
  e.remove({ id: 'minecraft:bone_meal_from_bone_block' })
  e.recipes.create.milling(
    [
      Item.of('minecraft:bone_meal', 6),
      Item.of('minecraft:bone_meal', 3).withChance(0.5),
    ],
    'minecraft:bone_block'
  )
  e.recipes.create.crushing(
    Item.of('minecraft:bone_meal', 9),
    'minecraft:bone_block'
  )

  // Compost block from compost
  redefineRecipe(
    'farmersdelight:organic_compost',
    [
      'CBC', //
      'BDB', //
      'CBC',
    ],
    {
      C: 'thermal:compost',
      B: 'minecraft:bone_meal',
      D: 'minecraft:dirt',
    }
  )

  // Liquid fertilizer
  e.remove({ id: /^sliceanddice:mixing\/fertilizer.*/ })
  e.recipes.create
    .mixing(Fluid.of('sliceanddice:fertilizer', 1000), [
      'farmersdelight:organic_compost',
      Fluid.water(1000),
    ])
    .heated()

  // Require flower azaleas for stuff here
})
