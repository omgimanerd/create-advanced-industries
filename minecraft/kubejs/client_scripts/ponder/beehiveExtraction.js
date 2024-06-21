// priority: 0

Ponder.registry((e) => {
  // Ponder for beehive extraction
  e.create('minecraft:beehive').scene(
    'beehive_extraction',
    'Beehive Extraction',
    'kubejs:beehive', // kubejs/assets/kubejs/ponder/beehive.nbt
    (scene, util) => {
      const comparator = util.select.fromTo(2, 1, 1, 2, 2, 1)
      const pumpTank = util.select.fromTo(1, 2, 2, 0, 1, 2)
      const deployer = util.grid.at(2, 4, 2)
      const beehive = util.grid.at(2, 2, 2)

      // Scene setup
      scene.showBasePlate()
      // Dirt block from being covered
      scene.world.setBlock([2, 0, 1], 'minecraft:grass_block', false)
      scene.world.showIndependentSectionImmediately(
        util.select.fromTo(2, 1, 2, 2, 2, 2)
      )
      scene.idle(20)

      // Basic shearing
      scene.addKeyframe()
      scene.text(
        40,
        'Beehives can be sheared to get their honeycombs when full.',
        beehive
      )
      scene.idle(50)
      scene.world.setBlock(
        beehive,
        Block.id('minecraft:beehive')
          .with('facing', 'north')
          .with('honey_level', '5'),
        false
      )
      scene
        .showControls(20, beehive, 'down')
        .rightClick()
        .withItem('minecraft:shears')
      scene.idle(20)
      let honeycombs = [
        scene.world.createItemEntity(
          beehive,
          [-0.07, 0.4, -0.03],
          Item.of('minecraft:honeycomb', 2)
        ),
        scene.world.createItemEntity(
          beehive,
          [-0.03, 0.4, -0.05],
          Item.of('minecraft:honeycomb', 1)
        ),
      ]
      scene.idle(60)
      honeycombs.forEach((b) => scene.world.removeEntity(b))
      scene.idle(20)

      // Pumping out honey
      scene.addKeyframe()
      scene.world.setBlock(
        beehive,
        Block.id('minecraft:beehive').with('facing', 'north'),
        false
      )
      scene.world.showSection(pumpTank, Facing.WEST)
      scene.world.setKineticSpeed(pumpTank, 24)
      scene
        .text(
          40,
          'You can also use a mechanical pump to extract liquid honey from the beehive.',
          [1, 2, 2]
        )
        .placeNearTarget()
      scene.idle(60)
      scene.world.hideSection(pumpTank, Facing.WEST)

      // Arcane Extraction
      scene.addKeyframe()
      scene.world.showSection(util.select.position(deployer), Facing.DOWN)
    }
  )
})
