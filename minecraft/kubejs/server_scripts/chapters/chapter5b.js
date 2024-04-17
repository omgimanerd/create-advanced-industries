// priority: 100
// Recipe overhauls for Chapter 4B progression.

// Rclick
// https://discord.com/channels/303440391124942858/1228365529136496681
// BlockEvents.rightClicked('minecraft:stone', (e) => {
//   const player = e.getPlayer()
//   if (!player.level.isClientSide()) {
//     console.log(player)
//     console.log(e.getBlock())
//   }
// })

// entity feeding
// https://discord.com/channels/303440391124942858/1200079069316923392

// list features
// https://discord.com/channels/303440391124942858/1229784826559729756

EntityEvents.death('minecraft:wandering_trader', (e) => {
  console.log(e.source)
})

LootJS.modifiers((e) => {
  e.enableLogging()

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('lightningBolt')
    })
    .addLoot(
      'kubejs:suffering_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('create.crush')
    })
    .addLoot(
      'kubejs:torment_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('create.mechanical_saw')
    })
    .addLoot(
      'kubejs:mutilation_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  e.addEntityLootModifier('minecraft:wandering_trader')
    .matchDamageSource((source) => {
      return source.anyType('pnc_minigun')
    })
    .addLoot(
      'kubejs:debilitation_essence',
      LootEntry.of('create:experience_nugget').when((c) => c.randomChance(0.5))
    )

  // Suffocation damage source 'inWall'
})

EntityEvents.spawned((e) => {
  let { entity, level } = e
  if (entity.type == 'ars_nouveau:an_lightning') {
    for (let offsetX = -1; offsetX <= 1; offsetX += 1) {
      for (let offsetY = -1; offsetY <= 1; offsetY += 1) {
        for (let offsetZ = -1; offsetZ <= 1; offsetZ += 1) {
          let block = entity.block.offset(offsetX, offsetY, offsetZ)
          if (block == 'minecraft:emerald_block') {
            let trader = block.createEntity('minecraft:wandering_trader')
            trader.spawn()
            level.destroyBlock(block.getPos(), false)
          }
        }
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
  const create = defineCreateRecipes(e)
  const pneumaticcraft = definePneumaticcraftRecipes(e)
  const redefineRecipe = redefineRecipe_(e)

  // Sawdust recipe
  create.milling(
    ['9x thermal:sawdust', Item.of('thermal:sawdust', 3).withChance(0.5)],
    '#minecraft:logs'
  )
  create.crushing('9x thermal:sawdust', '#minecraft:logs')
  e.recipes.ars_nouveau.crush('#minecraft:logs', [
    Item.of('thermal:sawdust', 9).withChance(1),
    Item.of('thermal:sawdust', 9).withChance(0.5),
  ])

  // Blasting recipe for sawdust to charcoal dust.
  e.remove({ id: 'create:milling/charcoal' })
  e.blasting('tfmg:charcoal_dust', 'thermal:sawdust')

  // Potash/potassium nitrate, or nitrate dust.
  // TODO(remove thermal niter / remove tfmg nitrate)
  create
    .mixing('2x thermal:niter_dust', [
      Fluid.water(1000),
      '2x tfmg:charcoal_dust',
    ])
    .heated()

  // Overhaul all gunpowder recipes to only use powders
  e.remove({ id: 'thermal:gunpowder_4' })
  e.remove({ id: 'tfmg:mixing/gun_powder' })
  e.shapeless(
    '8x minecraft:gunpowder',
    Array(6)
      .fill('thermal:niter_dust')
      .concat(['thermal:sulfur_dust', 'tfmg:charcoal_dust'])
  )

  // Automate emeralds
  // Strike emerald block with lightning to spawn a wandering trader
  // Kill wandering trader in 4 ways to get essences
  // Automate moss + growth => sprinkly bits
  // liquid fert can be augmented into crystal growth accelerator
  // automate food, higher feed level = more production of something
  // tree extractor ars trees?

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

  // Require flower azaleas for stuff here to incentivize moss farming
})
