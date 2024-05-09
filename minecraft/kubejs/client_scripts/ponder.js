// priority: 100

const deployerBlockEntity = Java.loadClass(
  'com.simibubi.create.content.kinetics.deployer.DeployerBlockEntity'
)

/**
 * Helper methods for spawning composter growth particles
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {Internal.SceneBuildingUtilDelegate} util
 * @param {BlockPos} pos
 */
const spawnGrowthParticles = (scene, util, pos) => {
  scene.particles
    .simple(8, 'minecraft:composter', util.vector.topOf(pos))
    .delta([0.3, 0.3, 0.3])
    .density(2)
}

/**
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos} deployerPos
 * @param {Internal.ItemStack_?} id
 */
const setDeployerHeldItem = (scene, deployerPos, id) => {
  scene.world.modifyBlockEntityNBT(deployerPos, (nbt) => {
    nbt.HeldItem = {
      id: id,
      Count: 1,
    }
  })
}

/**
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos} pos
 * @param {number} ticks
 * @param {boolean?} clearHand
 */
const cycleDeployerMovement = (scene, pos, ticks, clearHand) => {
  ticks = ticks === undefined ? 25 : ticks
  clearHand = clearHand === undefined ? true : clearHand
  scene.world.moveDeployer(pos, 1, ticks)
  scene.idle(ticks)
  if (clearHand) {
    setDeployerHeldItem(scene, pos, 'minecraft:air')
  }
  scene.world.moveDeployer(pos, -1, ticks)
}

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

Ponder.registry((e) => {
  // Ponder for moss block spreading
  e.create('minecraft:moss_block').scene(
    'moss_block_seeding',
    'Moss Blocks and You',
    (scene, util) => {
      scene.showBasePlate()
      let center = new BlockPos(2, 1, 2)
      let deployerPos = center.above(2)

      // Scene setup
      scene.world.setBlock(
        deployerPos,
        Block.id('create:deployer').with('facing', 'down'),
        false
      )
      scene.world.setKineticSpeed(deployerPos, 24)
      scene.world.setBlocks(util.select.layer(1), 'minecraft:stone', false)
      scene.world.showSection(util.select.everywhere(), Facing.WEST)
      scene.idleSeconds(1)

      // Getting the first moss block
      scene.addKeyframe()
      scene.text(
        40,
        "If you can't find a moss block, you can turn a stone block into one " +
          'by right clicking it with biomass.',
        deployerPos
      )
      scene
        .showControls(40, center, 'right')
        .rightClick()
        .withItem('createaddition:biomass')
      scene.world.setFilterData(
        deployerPos,
        deployerBlockEntity,
        'createaddition:biomass'
      )
      setDeployerHeldItem(scene, deployerPos, 'createaddition:biomass')
      scene.idleSeconds(1)
      cycleDeployerMovement(scene, deployerPos)
      spawnGrowthParticles(scene, util, center)
      scene.world.setBlock(center, 'minecraft:moss_block', true)
      scene.idleSeconds(2)

      // Spreading moss
      scene.addKeyframe()
      scene.world.setFilterData(
        deployerPos,
        deployerBlockEntity,
        'minecraft:bone_meal'
      )
      scene.text(
        60,
        'Right clicking a moss block with a fertilizer will cause it to ' +
          'spread to all nearby stone blocks.',
        deployerPos
      )
      scene
        .showControls(20, center, 'right')
        .rightClick()
        .withItem('thermal:compost')
      scene.idle(30)
      scene
        .showControls(20, center, 'right')
        .rightClick()
        .withItem('minecraft:bone_meal')
      scene.idle(30)
      setDeployerHeldItem(scene, deployerPos, 'minecraft:bone_meal')
      scene.idleSeconds(1)
      cycleDeployerMovement(scene, deployerPos)
      spawnGrowthParticles(scene, util, center)
      let newBlocks = [
        [util.select.fromTo(1, 1, 1, 3, 1, 3), 'minecraft:moss_block'],
        [util.select.fromTo(0, 1, 1, 0, 1, 2), 'minecraft:moss_block'],
        [[4, 1, 1], 'minecraft:moss_block'],
        [[1, 1, 4], 'minecraft:moss_block'],
        [util.select.fromTo(3, 1, 0, 2, 1, 0), 'minecraft:moss_block'],
        [[3, 2, 2], 'minecraft:moss_carpet'],
        [util.select.fromTo(1, 2, 2, 1, 2, 3), 'minecraft:moss_carpet'],
        [util.select.fromTo(2, 2, 1, 2, 2, 2), 'minecraft:grass'],
        [[1, 2, 4], 'minecraft:flowering_azalea'],
      ]
      newBlocks.forEach((data) => {
        let [selection, block] = data
        scene.world.setBlocks(selection, block, true)
        if (Array.isArray(selection)) {
          spawnGrowthParticles(scene, util, selection)
        } else {
          selection.forEach((blockPos) => {
            spawnGrowthParticles(scene, util, blockPos)
          })
        }
      })
      scene.idleSeconds(3)

      // Mushroom farming
      scene.addKeyframe()
      scene.world.hideSection(util.select.fromTo(0, 1, 0, 4, 2, 4), Facing.DOWN)
      scene.idle(25)
      scene.world.setBlocks(util.select.layer(1), 'minecraft:moss_block', false)
      scene.world.setBlocks(util.select.layer(2), 'minecraft:air', false)
      scene.world.showSection(util.select.fromTo(0, 1, 0, 4, 2, 4), Facing.UP)
      scene.idle(25)
      scene.world.setFilterData(
        deployerPos,
        deployerBlockEntity,
        'minecraft:red_mushroom'
      )
      scene.text(
        30,
        'Right clicking a moss block with a mushroom will seed it into a ' +
          'mushroom block.',
        deployerPos
      )
      scene
        .showControls(20, center, 'right')
        .rightClick()
        .withItem('minecraft:red_mushroom')
      scene.idle(40)
      scene.text(
        30,
        'This works with both red and brown mushrooms',
        deployerPos
      )
      scene
        .showControls(20, center, 'right')
        .rightClick()
        .withItem('minecraft:brown_mushroom')
      scene.idle(40)
      setDeployerHeldItem(scene, deployerPos, 'minecraft:red_mushroom')
      scene.idleSeconds(1)
      cycleDeployerMovement(scene, deployerPos)
      let mushroomGrowth = [
        [center, 10],
        [center.west(), 8],
        [center.west().north(), 1],
        [center.west().south(), 3],
      ]
      mushroomGrowth.forEach((data) => {
        let [blockPos, delay] = data
        scene.world.setBlocks(blockPos, 'minecraft:red_mushroom_block', true)
        spawnGrowthParticles(scene, util, blockPos)
        scene.idle(delay)
      })
    }
  )

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
      cycleDeployerMovement(scene, deployerPos)
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
      cycleDeployerMovement(scene, deployerPos)
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
      cycleDeployerMovement(scene, deployerPos)
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
      cycleDeployerMovement(scene, deployerPos)
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

      // First keyframe explanation
      scene.addKeyframe()
      scene
        .text(
          80,
          'In addition to the recipes shown in JEI, amethyst ' +
            'shards can also be grown using budding amethyst as a catalyst.',
          center.west()
        )
        .placeNearTarget()
      scene.idle(90)
      scene
        .text(
          80,
          'In this pack, budding amethyst does not naturally cause attached ' +
            'buds to grow, and require crystal growth accelerator to be ' +
            'spouted on them.',
          center.west()
        )
        .placeNearTarget()
      scene.idle(90)

      // Spouting growth
      scene.addKeyframe()
      scene
        .text(
          100,
          'For every 500mb of crystal growth accelerator spouted, a random ' +
            'amethyst bud attached to the budding amethyst will advance one ' +
            'growth stage.',
          spoutPos
        )
        .placeNearTarget()
      scene.idle(60)
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
