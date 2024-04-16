// priority: 100
// Recipe overhauls for Chapter 4B progression.

// BlockEvents.rightClicked('minecraft:stone', (e) => {
//   const player = e.getPlayer()
//   if (!player.level.isClientSide()) {
//     console.log(player)
//     console.log(e.getBlock())
//   }
// })

// https://discord.com/channels/303440391124942858/1200079069316923392

// Rclick
// https://discord.com/channels/303440391124942858/1228365529136496681

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
    for (const offset of surroundingBlocks) {
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
  // niter from sawdust and pot ash?
  // https://en.wikipedia.org/wiki/Potassium_nitrate

  const create = defineCreateRecipes(e)
  const redefineRecipe = redefineRecipe_(e)
  // Automate emeralds
  // Strike emerald block with lightning to spawn a wandering trader
  // Kill wandering trader in 4 ways to get essences
  // Automate moss + growth => sprinkly bits
  // liquid fert can be augmented into crystal growth accelerator
  // automate food, higher feed level = more production of something

  // TODO: better diamond cutting and diamond automation in chapter 5b
  // amethyst?

  // Catalyst for first moss block
  create
    .item_application('minecraft:moss_block', [
      'minecraft:stone',
      'createaddition:biomass',
    ])
    .id('kubejs:moss_from_biomass_application')

  // Bonemeal cannot be reverse crafted from bone blocks.
  e.remove({ id: 'minecraft:bone_meal_from_bone_block' })
  create.milling(
    [
      '6x minecraft:bone_meal',
      Item.of('minecraft:bone_meal', 3).withChance(0.5),
    ],
    'minecraft:bone_block'
  )
  create.crushing('9x minecraft:bone_meal', 'minecraft:bone_block')

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
  create
    .mixing(Fluid.of('sliceanddice:fertilizer', 1000), [
      'farmersdelight:organic_compost',
      Fluid.water(1000),
    ])
    .heated()

  // Require flower azaleas for stuff here
})
