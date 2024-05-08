// priority: 100

/**
 * Helper method for the Arcane Portal ponder
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos} center
 */
const setupArcanePortalBlockScene = (scene, center) => {
  // Set up all blocks in scene.
  scene.world.setBlock(center, 'minecraft:crying_obsidian', true)
  let fluidSpots = [
    center.north(),
    center.south(),
    center.east(),
    center.west(),
  ]
  for (let spot of fluidSpots) {
    scene.world.setBlock(spot, 'starbunclemania:source_fluid_block', false)
  }
  let pumps = {
    south: center.north().north(),
    north: center.south().south(),
    west: center.east().east(),
    east: center.west().west(),
  }
  for (let [pumpDirection, pumpSpot] of Object.entries(pumps)) {
    scene.world.setBlock(
      pumpSpot,
      Block.id('create:mechanical_pump').with('facing', pumpDirection),
      false
    )
    scene.world.setKineticSpeed(pumpSpot, 24)
  }
  return {
    fluidSpots: fluidSpots,
    pumps: pumps,
  }
}

/**
 * Helper method for the Arcane Portal ponder
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos} pos
 */
const spawnPortalConsumptionParticles = (scene, pos) => {
  scene.particles
    .simple(3, 'minecraft:enchant', pos)
    .motion([0, -0.15, 0])
    .scale(2.5)
    .density(10)
    .withinBlockSpace()
}

/**
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos} deployerPos
 * @param {ResourceLocation_?} id
 */
const setDeployerHeldItem = (scene, deployerPos, id) => {
  scene.world.modifyBlockEntityNBT(deployerPos, (nbt) => {
    nbt.HeldItem = {
      id: id,
      Count: 1,
    }
  })
}

Ponder.registry((e) => {
  // Ponder for Arcane Portal
  e.create('kubejs:portal_block')
    .scene('portal_block_open', 'Opening The Arcane Portal', (scene, util) => {
      scene.showBasePlate()
      let center = new BlockPos(2, 1, 2)

      // First segment before keyframe to show scene.
      let { pumps } = setupArcanePortalBlockScene(scene, center)
      scene.world.showSection(center, Facing.DOWN)
      scene.idleSeconds(1)

      // Opening the portal.
      scene.addKeyframe()
      scene.text(
        40,
        'Right click a crying obsidian block with a source gem to open an ' +
          'Arcane Portal.',
        [2, 2, 2]
      )
      scene.idleSeconds(1)
      scene
        .showControls(40, [2, 1, 2], 'up')
        .rightClick()
        .withItem('ars_nouveau:source_gem')
      scene.world.replaceBlocks(
        util.select.position([2, 1, 2]),
        'kubejs:portal_block',
        true
      )
      scene.world.createEntity('lightning_bolt', [2, 2, 2], (e) => {})
      scene.idleSeconds(3)

      // Supplying the portal with source.
      scene.addKeyframe()
      scene.world.showSection(util.select.layer(1), Facing.UP)
      scene.text(
        40,
        'Once you open the portal, it requires a constant supply of ' +
          'liquefied source to stay open.',
        [2, 2, 2]
      )
      scene.idleSeconds(3)

      // Source being consumed.
      let consumptionSpot = center.west()
      scene.addKeyframe()
      scene.text(
        40,
        'The Arcane Portal will consume a random liquefied source block ' +
          ' every so often.',
        consumptionSpot
      )
      scene.idleSeconds(1)
      scene.world.setBlock(consumptionSpot, 'minecraft:air', true)
      spawnPortalConsumptionParticles(scene, consumptionSpot)

      scene.idleSeconds(1)
      scene.world.setBlock(
        consumptionSpot,
        'starbunclemania:source_fluid_block',
        true
      )
      scene.idleSeconds(2)

      // Instability and portal collapse
      scene.addKeyframe()
      for (let [_, pumpSpot] of Object.entries(pumps)) {
        scene.world.setKineticSpeed(pumpSpot, 0)
      }
      scene.world.setBlock(consumptionSpot, 'minecraft:air', true)
      spawnPortalConsumptionParticles(scene, consumptionSpot)
      scene.text(
        40,
        "If you don't replace the liquid source, the portal will rapidly " +
          'become unstable and collapse.',
        consumptionSpot
      )
      scene.idleSeconds(1)
      scene.particles
        .simple(80, 'minecraft:campfire_cosy_smoke', center.above())
        .delta([0.2, 0.2, 0.2])
        .scale(0.4)
        .motion([0, 0.05, 0])
        .density(2)
      scene.idleSeconds(4)
      scene.particles.simple(5, 'minecraft:explosion', center).density(10)
      scene.world.setBlock(center, 'minecraft:air', true)
      scene.idleSeconds(1)
    })
    .scene('portal_block_usage', 'Using the Arcane Portal', (scene, util) => {
      let center = new BlockPos(2, 1, 2)

      // First segment before keyframe to show scene.
      scene.showBasePlate()
      setupArcanePortalBlockScene(scene, center)
      scene.world.setBlock(center, 'kubejs:portal_block', false)
      scene.world.showSection(util.select.layer(1), Facing.DOWN)
      scene.idleSeconds(1)

      // Wandering Traders being consumed.
      scene.addKeyframe()
      let wanderingTrader = scene.world.createEntity(
        'minecraft:wandering_trader',
        center.offset(0, 1, 0),
        (e) => {
          e.setY(2)
        }
      )
      scene.text(40, 'The portal will absorb wandering traders.', center)
      scene.idleSeconds(1)
      scene.world.removeEntity(wanderingTrader)
      spawnPortalConsumptionParticles(scene, center.above())
      scene.idleSeconds(2)

      // Pickaxes being consumed
      scene.addKeyframe()
      let enchantedPickaxe = scene.world.createItemEntity(
        [2.5, 2, 2.5],
        [0, 0, 0],
        Item.of('minecraft:iron_pickaxe')
          .enchant('minecraft:efficiency', 3)
          .enchant('minecraft:unbreaking', 3)
          .withName("Laborer's Pickaxe")
      )
      scene.text(
        40,
        'The portal will also absorb correctly enchanted named pickaxes. The ' +
          'quest book will guide you on how to make the appropriate sacrifice.',
        center
      )
      scene.idleSeconds(2)
      scene.world.removeEntity(enchantedPickaxe)
      spawnPortalConsumptionParticles(scene, center.above())
      scene.idleSeconds(2)

      // Hearthstone reward
      scene.addKeyframe()
      scene.text(
        40,
        'With the right sacrifices, the eldritch gods will be appeased and ' +
          'grant you a reward.',
        center
      )
      scene.idleSeconds(1)
      scene.world.createItemEntity(
        [2.5, 2, 2.5],
        [0, 0.4, 0.01],
        'gag:hearthstone'
      )
      scene.idleSeconds(1)
    })

  // Ponder for Remy charm
  e.create('kubejs:remy_spawner').scene(
    'remy_the_epicure',
    'Remy The Epicure',
    (scene, util) => {
      scene.showBasePlate()
      let center = new BlockPos(2, 1, 2)

      // Scene setup
      scene.world.setBlock(center, 'create:white_seat', false)
      let deployerPos = new BlockPos(2, 2, 4)
      scene.world.setBlock(
        deployerPos,
        Block.id('create:deployer')
          .with('facing', 'north')
          .with('axis_along_first', 'false'),
        false
      )
      scene.world.setBlock(
        deployerPos.below(),
        Block.id('create:gearbox').with('axis', 'z'),
        false
      )
      scene.world.setBlocks(
        util.select.fromTo(
          deployerPos.below().east(),
          deployerPos.below().east(2)
        ),
        Block.id('create:shaft').with('axis', 'x')
      )
      scene.world.showSection(center, Facing.DOWN)
      scene.idleSeconds(1)

      // Spawning Remy
      let remyLocation = center.getCenter().add(0, -0.2, 0)
      scene.addKeyframe()
      scene
        .showControls(40, center.above(1), 'down')
        .rightClick()
        .withItem('kubejs:remy_spawner')
      scene.text(
        40,
        'Right click the Remy Spawner on a block to spawn Remy The Epicure',
        center
      )
      scene.idleSeconds(1)
      scene.world.createEntity('ars_nouveau:amethyst_golem', remyLocation)
      scene.idleSeconds(2)

      scene.addKeyframe()
      scene
        .showControls(40, center.above(1), 'down')
        .rightClick()
        .withItem('cooked_beef')
      scene.text(
        40,
        'Feed Remy some tasty food and he will drop amethyst buds.',
        center
      )
      scene.idle(10)
      scene.particles
        .simple(5, 'minecraft:heart', center.above())
        .delta([0.25, 0.25, 0.25])
        .density(2)
      let buds = []
      buds.push(
        scene.world.createItemEntity(
          remyLocation,
          [0.07, 0.4, 0],
          Item.of('minecraft:small_amethyst_bud', 2)
        ),
        scene.world.createItemEntity(
          remyLocation,
          [0.03, 0.4, -0.04],
          Item.of('minecraft:medium_amethyst_bud', 2)
        )
      )
      scene.idleSeconds(3)
      buds.forEach((b) => scene.world.removeEntity(b))

      // Automation
      let slice = util.select.fromTo(0, 0, 4, 4, 2, 4)
      scene.addKeyframe()
      scene.world.showSection(slice, Facing.NORTH)
      scene.world.setKineticSpeed(slice, 24)
      setDeployerHeldItem(scene, deployerPos, 'minecraft:cooked_beef')
      scene.idle(10)

      scene.text(40, 'Feeding can be automated with the deployer.', deployerPos)
      scene.world.moveDeployer(deployerPos, 1, 25)
      scene.idle(25)
      setDeployerHeldItem(scene, deployerPos, 'minecraft:air')
      scene.world.moveDeployer(deployerPos, -1, 25)
      scene.particles
        .simple(5, 'minecraft:heart', center.above())
        .delta([0.25, 0.25, 0.25])
      buds.push(
        scene.world.createItemEntity(
          remyLocation,
          [-0.03, 0.4, -0.03],
          Item.of('minecraft:small_amethyst_bud', 2)
        ),
        scene.world.createItemEntity(
          remyLocation,
          [0.03, 0.4, -0.04],
          Item.of('minecraft:medium_amethyst_bud', 2)
        )
      )
      scene.idleSeconds(3)
      buds.forEach((b) => scene.world.removeEntity(b))

      // Higher food values
      scene.addKeyframe()
      setDeployerHeldItem(scene, deployerPos, 'farmersdelight:fried_rice')
      scene.idle(10)
      scene.text(
        40,
        'Feeding higher quality foods will result in more drops.',
        deployerPos
      )
      scene.world.moveDeployer(deployerPos, 1, 25)
      scene.idle(25)
      setDeployerHeldItem(scene, deployerPos, 'minecraft:air')
      scene.world.moveDeployer(deployerPos, -1, 25)
      scene.particles
        .simple(5, 'minecraft:heart', center.above())
        .delta([0.25, 0.25, 0.25])
      buds.push(
        scene.world.createItemEntity(
          remyLocation,
          [0.07, 0.4, 0],
          Item.of('minecraft:small_amethyst_bud', 2)
        ),
        scene.world.createItemEntity(
          remyLocation,
          [0.03, 0.4, -0.04],
          Item.of('minecraft:medium_amethyst_bud', 2)
        ),
        scene.world.createItemEntity(
          remyLocation,
          [-0.03, 0.4, 0.01],
          Item.of('minecraft:large_amethyst_bud', 2)
        ),
        scene.world.createItemEntity(
          remyLocation,
          [-0.05, 0.4, -0.04],
          Item.of('minecraft:amethyst_cluster', 2)
        )
      )
      scene.idleSeconds(3)
      buds.forEach((b) => scene.world.removeEntity(b))

      // Repeated Foods
      setDeployerHeldItem(scene, deployerPos, 'farmersdelight:fried_rice')
      scene.idle(10)
      scene.text(
        40,
        'Remy will get tired of the same food over and over though.',
        deployerPos
      )
      scene.world.moveDeployer(deployerPos, 1, 25)
      scene.idle(25)
      setDeployerHeldItem(scene, deployerPos, 'minecraft:air')
      scene.world.moveDeployer(deployerPos, -1, 25)
      scene.particles
        .simple(5, 'minecraft:heart', center.above())
        .delta([0.25, 0.25, 0.25])
      buds.push(
        scene.world.createItemEntity(
          remyLocation,
          [0.07, 0.4, 0],
          Item.of('minecraft:small_amethyst_bud', 2)
        )
      )
      scene.idleSeconds(1)
      scene.text(
        40,
        'There is a small cooldown every time you feed Remy.',
        deployerPos
      )
      scene.idleSeconds(3)
      buds.forEach((b) => scene.world.removeEntity(b))

      // Poisoning Remy
      scene.addKeyframe()
      setDeployerHeldItem(scene, deployerPos, 'minecraft:rotten_flesh')
      scene.idle(10)
      scene.text(
        40,
        "Be careful not to feed Remy anything that'll give him an upset " +
          'stomach',
        deployerPos
      )
      scene.world.moveDeployer(deployerPos, 1, 25)
      scene.idle(25)
      setDeployerHeldItem(scene, deployerPos, 'minecraft:air')
      scene.world.moveDeployer(deployerPos, -1, 25)
      scene.particles
        .simple(200, 'minecraft:entity_effect', remyLocation)
        .color('#119900')
        .scale(2)
        .density(4)
      scene.idleSeconds(1)
      scene.text(
        40,
        "You won't be able to feed Remy until the effect wears off.",
        deployerPos
      )
      scene.idleSeconds(1)
    }
  )

  // Ponder for Budding Amethyst spouting
  e.create('minecraft:budding_amethyst').scene(
    'budding_amethyst_spouting',
    'Growing Amethyst Buds',
    (scene, util) => {
      scene.showBasePlate()
      let center = new BlockPos(2, 1, 2)

      // Scene setup
      scene.world.setBlock(center, 'minecraft:budding_amethyst', false)
      let spoutPos = center.above(2)
      scene.world.setBlock(spoutPos, 'create:spout', false)
      scene.world.modifyBlockEntityNBT(spoutPos, (nbt) => {
        nbt.Tanks = [
          {
            Level: {
              Speed: 0.25,
              Target: 1,
              Value: 1,
            },
            TankContent: {
              FluidName: 'kubejs:crystal_growth_accelerator',
              Amount: 499, // Setting it to 500 will trigger the real logic
            },
            ProcessingTicks: -1,
          },
        ]
      })
      scene.world.setBlock(
        center.west(),
        Block.id('minecraft:small_amethyst_bud').with('facing', 'west'),
        false
      )
      scene.world.showSection(util.select.everywhere(), Facing.SOUTH)
      scene.idleSeconds(1)

      scene.addKeyframe()
      scene
        .text(
          40,
          'In addition to the recipes shown in JEI, amethyst ' +
            'shards can also be grown using budding amethyst as a catalyst.',
          center.west()
        )
        .placeNearTarget()
      scene.idleSeconds(2)
      scene.text(
        40,
        'In this pack, budding amethyst does not naturally cause attached ' +
          'buds to grow, and require crystal growth accelerator to be ' +
          'spouted on them.',
        center.west()
      )
      scene.idleSeconds(2)

      // Spouting growth
      scene.addKeyframe()
      scene.text(
        60,
        'For every 500mb of crystal growth accelerator spouted, a random ' +
          'amethyst bud attached to the budding amethyst will advance one ' +
          'growth stage.',
        spoutPos
      )
      scene.idleSeconds(3)
      scene.world.modifyBlockEntityNBT(spoutPos, (nbt) => {
        nbt.ProcessingTicks = 20
      })
      scene.idleSeconds(1)
      scene.world.replaceBlocks(
        center.west(),
        Block.id('minecraft:medium_amethyst_bud').with('facing', 'west'),
        false
      )
      scene.world.modifyBlockEntityNBT(spoutPos, (nbt) => {
        nbt.ProcessingTicks = 20
      })
      scene.idleSeconds(1)
      scene.world.replaceBlocks(
        center.west(),
        Block.id('minecraft:large_amethyst_bud').with('facing', 'west'),
        false
      )
      scene.world.modifyBlockEntityNBT(spoutPos, (nbt) => {
        nbt.ProcessingTicks = 20
      })
      scene.idleSeconds(1)
      scene.world.replaceBlocks(
        center.west(),
        Block.id('minecraft:amethyst_cluster').with('facing', 'west'),
        false
      )
      scene.idleSeconds(1)
    }
  )
})

/**
 * leon notes:
 *
 * achievements need to be overhauled
 *
 * reorder JEI recipes
 *
 * gearbox quests
 *
 */
