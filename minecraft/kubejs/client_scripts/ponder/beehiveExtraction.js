// priority: 0

Ponder.registry((e) => {
  e.create('minecraft:beehive').scene(
    'beehive_extraction',
    'Beehive Extraction',
    'kubejs:beehive', // kubejs/assets/kubejs/ponder/beehive.nbt
    (scene, util) => {
      const basePlate = util.select.layer(0)
      const comparatorSection = util.select.fromTo(2, 1, 1, 2, 2, 1)
      const comparator = util.grid.at(2, 2, 1)
      const pumpTank = util.select.fromTo(1, 3, 2, 0, 1, 2)
      const tank = util.grid.at(0, 1, 2)
      const deployer = util.grid.at(2, 4, 2)
      const beehive = util.grid.at(2, 2, 2)

      /**
       * Helper to set the beehive honey level
       * @param {number} honey_level
       * @param {boolean=} particles
       */
      const setBeehive = (honey_level) => {
        scene.world.setBlock(
          beehive,
          Block.id('minecraft:beehive', {
            facing: 'north',
            honey_level: `${honey_level}`,
          }),
          false
        )
      }

      // Scene setup
      setBeehive(5)
      scene.world.showSection(
        basePlate.add(util.select.fromTo(2, 1, 2, 2, 2, 2)),
        Facing.UP
      )
      scene.idleSeconds(1)

      // Basic shearing
      scene.addKeyframe()
      scene.text(
        40,
        'Beehives can be sheared to get their honeycombs when full. You can ' +
          'also do this with a deployer.',
        beehive
      )
      scene.idle(50)
      scene
        .showControls(20, beehive, 'right')
        .rightClick()
        .withItem('minecraft:shears')
      scene.idle(10)
      setBeehive(0)
      let honeycombs = [
        scene.world.createItemEntity(
          beehive,
          [-0.07, 0.4, -0.03],
          Item.of('minecraft:honeycomb', 2)
        ),
        scene.world.createItemEntity(
          beehive,
          [-0.02, 0.4, -0.12],
          Item.of('minecraft:honeycomb', 1)
        ),
      ]
      scene.idle(60)
      honeycombs.forEach((b) => scene.world.removeEntity(b))

      // Pumping out honey
      scene.addKeyframe()
      scene.world.setBlock(
        beehive,
        Block.id('minecraft:beehive', { facing: 'north' }),
        false
      )
      scene.world.showSection(pumpTank, Facing.EAST)
      scene.world.setKineticSpeed(pumpTank, 24)
      scene
        .text(
          40,
          'You can also use a mechanical pump to extract liquid honey from the beehive.',
          [1, 2, 2]
        )
        .placeNearTarget()
      scene.idle(20)
      animateTank(scene, tank, 'create:honey', 0, 12000, 250)
      scene.idle(20)
      scene.world.setKineticSpeed(pumpTank, 0)
      scene.idle(20)
      scene.world.hideSection(pumpTank, Facing.WEST)

      // Arcane Extraction
      scene.addKeyframe()
      setBeehive(5)
      scene.world.showSection(deployer, Facing.DOWN)
      scene.idle(10)
      setDeployerFilter(scene, deployer, 'apotheosis:sigil_of_withdrawal')
      setDeployerHeldItem(scene, deployer, 'apotheosis:sigil_of_withdrawal')
      scene.text(
        40,
        'For a chance to get a rare saturated honeycomb, you will need to ' +
          'use a Sigil of Withdrawal on the beehive.',
        deployer
      )
      scene.idle(50)
      scene.text(
        60,
        'The saturated honeycomb only has a chance to drop when the beehive ' +
          'full, using the Sigil of Withdrawal on the beehive will ' +
          'remove all the honey regardless of its fill level.',
        deployer
      )
      scene.idle(70)
      scene.text(
        60,
        'Be careful when doing it! The Sigil of Withdrawal is so powerful ' +
          'that it will cause an explosion when it is used! Make sure there ' +
          "aren't any bees nearby.",
        deployer
      )
      scene.world.setKineticSpeed(deployer, 24)
      cycleDeployerMovement(scene, deployer, 20, false, () => {
        scene.particles
          .simple(5, 'minecraft:explosion', beehive)
          .density(5)
          .delta([1, 1, 1])
        honeycombs = [
          scene.world.createItemEntity(
            beehive,
            [-0.07, 0.4, -0.03],
            Item.of('minecraft:honeycomb', 1)
          ),
          scene.world.createItemEntity(
            beehive,
            [-0.02, 0.4, -0.12],
            Item.of('kubejs:saturated_honeycomb', 1)
          ),
        ]
        setBeehive(0)
      })
      scene.world.setKineticSpeed(deployer, 0)
      scene.idle(70)
      honeycombs.forEach((b) => scene.world.removeEntity(b))
      scene.text(
        40,
        'Each usage has a small chance to consume the Sigil of Withdrawal.',
        deployer
      )
      scene.idle(50)
      scene.world.hideSection(deployer, Facing.UP)

      // Comparator explanation
      scene.addKeyframe()
      scene.world.showSection(comparatorSection, Facing.SOUTH)
      scene.idle(20)
      scene.text(
        40,
        'You can use a comparator to measure the honey level of a beehive. A ' +
          "value of 5 means it's full.",
        comparator
      )
      setBeehive(5)
      scene.world.modifyBlockEntityNBT(comparator, (nbt) => {
        nbt.putInt('OutputSignal', 5)
      })
      scene.world.toggleRedstonePower(comparator)
      scene.idle(60)
      scene.world.hideSection(comparatorSection, Facing.NORTH)
      scene
        .text(
          40,
          "Don't block the front of the beehive though, or the bees won't be " +
            'able to come out!',
          beehive
        )
        .placeNearTarget()
      scene.idle(50)
    }
  )
})
