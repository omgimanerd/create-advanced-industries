// priority: 0

Ponder.registry((e) => {
  e.create('kubejs:remy_spawner').scene(
    'remy_the_epicure',
    'Remy The Epicure',
    (scene, util) => {
      const basePlate = util.select.layer(0)
      const center = util.grid.at(2, 1, 2)
      const deployerPos = util.grid.at(2, 2, 4)

      // Scene setup
      scene.world.setBlock(center, 'create:white_seat', false)
      scene.world.setBlock(
        deployerPos,
        Block.id('create:deployer', {
          facing: 'north',
          axis_along_first: 'false',
        }),
        false
      )
      scene.world.setBlock(
        deployerPos.below(),
        Block.id('create:gearbox', { axis: 'z' }),
        false
      )
      scene.world.setBlocks(
        util.select.fromTo(
          deployerPos.below().east(),
          deployerPos.below().east(2)
        ),
        Block.id('create:shaft', { axis: 'x' })
      )
      scene.world.showSection(basePlate.add(center), Facing.UP)
      scene.idleSeconds(1)

      // Spawning Remy
      const remyLocation = center.getCenter().add(0, -0.2, 0)
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
      scene.particles
        .simple(5, 'minecraft:poof', center.above())
        .delta([0.3, 0.3, 0.3])
        .density(5)
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
      const buds = []
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
      const slice = util.select.fromTo(0, 1, 4, 4, 2, 4)
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
          'stomach.',
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
})
