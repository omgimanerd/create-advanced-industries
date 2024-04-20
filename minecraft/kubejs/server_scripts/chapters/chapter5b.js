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

ItemEvents.entityInteracted((e) => {
  /**
   * @param {Internal.FoodProperties}
   */
  const computeAmethystGolemFeedResults = (foodProperties) => {
    const { nutrition, saturationModifier } = foodProperties
    const saturation = nutrition * saturationModifier

    // if (foodProperties.effects) console.log(foodProperties.effects)

    // DO NOT REMOVE THE PARENTHESES. RHINO JS EVALUATES THIS DIFFERENTLY
    const tier = 4 * (JavaMath.E ** (nutrition / 4)) - 4 // prettier-ignore
    const output = [
      'minecraft:small_amethyst_bud',
      'minecraft:medium_amethyst_bud',
      'minecraft:large_amethyst_bud',
      'minecraft:amethyst_cluster',
    ][clamp(Math.round(tier / 25), 0, 3)]
    let quantity = JavaMath.E ** (saturation / 8)
    quantity = clamp(quantity + randRange(-1, 2), 0, 10)
    const avg = (saturation + nutrition) / 2
    // Feed cooldown in seconds
    const feedCooldown = 7 - (JavaMath.E ** (avg / 8)) // prettier-ignore
    return {
      result: Item.of(output, quantity),
      feedCooldown: feedCooldown * 20, // Feed cooldown in ticks
    }
  }

  /**
   *
   * @param {Internal.ItemEntityInteractedEventJS} e
   */
  const handleAmethystFeedingMechanic = (e) => {
    const { item, hand, target, level, player } = e
    if (hand !== 'main_hand') return
    if (target.type !== 'ars_nouveau:amethyst_golem') return
    if (target.name.getString() !== 'Remy') return
    if (!item.isEdible()) return
    const currentTime = level.getTime()
    const nextFeedableTime = target.persistentData.nextFeedableTime ?? 0
    if (nextFeedableTime >= currentTime) return

    target.playSound('entity.item.pickup', 0.3, 1)
    target.playSound('entity.fox.bite', 0.8, 1)
    player.addItem(item.getCraftingRemainingItem())
    item.count--
    const { x, y, z } = target
    level.spawnParticles(
      'minecraft:poof',
      true,
      x,
      y + 0.25,
      z,
      0.2,
      0.2,
      0.2,
      20,
      0.1
    )
    const { result, feedCooldown } = computeAmethystGolemFeedResults(
      item.getFoodProperties(null)
    )
    level.getBlock(x, y, z).popItem(result)
    target.persistentData.nextFeedableTime = currentTime + feedCooldown
  }

  // Feed an amethyst golem named Remy good food and it will drop amethyst
  // clusters.
  handleAmethystFeedingMechanic(e)
})

// list features
// https://discord.com/channels/303440391124942858/1229784826559729756

EntityEvents.death('minecraft:wandering_trader', (e) => {
  // console.log(e.source)
})

// Kill wandering trader in 4 ways to get essences
LootJS.modifiers((e) => {
  // e.enableLogging()

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

// Strike emerald block with lightning to spawn a wandering trader
EntityEvents.spawned((e) => {
  let { entity, level, server } = e
  // Search in a small square around a lightning strike for emerald blocks
  if (entity.type == 'ars_nouveau:an_lightning') {
    for (const [offsetX, offsetY, offsetZ] of getOffsetList({
      minX: -1,
      maxX: 1,
      minY: -1,
      maxX: 1,
      minZ: -1,
      maxZ: 1,
    })) {
      let block = entity.block.offset(offsetX, offsetY, offsetZ)
      if (block == 'minecraft:emerald_block') {
        let pos = block.getPos()
        let trader = level.createEntity('minecraft:wandering_trader')
        // Center the wandering trader on the block
        trader.setPos(pos.x + 0.5, pos.y, pos.z + 0.5)
        trader.spawn()
        trader.setInvulnerable(true)
        trader.setGlowing(true)
        level.destroyBlock(pos, false)

        entity.persistentData.spawnedTrader = true

        server.scheduleInTicks(15, () => {
          trader.extinguish()
          trader.setInvulnerable(false)
          trader.setGlowing(false)
        })
      }
    }
  }
})

/**
 * The event itself is registered in startup_scripts/forgeEventRegistration.js
 * @param {Internal.EntityStruckByLightningEvent} e
 */
global.EntityStruckByLightningEventCallback = (e) => {
  const { entity, lightning } = e
  if (
    entity.type === 'minecraft:wandering_trader' &&
    lightning.persistentData.spawnedTrader
  ) {
    e.setCanceled(true)
  }
}

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

  // Automate moss + growth => sprinkly bits
  // liquid fert can be augmented into crystal growth accelerator
  // tree extractor ars trees?
  //
  // Axes: Crystal refinement, enchanting, essence, potion, food, apotheosis,

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

  // Liquid fertilizer requires some other stuff to become crystal growth
  // accelerator.
})
