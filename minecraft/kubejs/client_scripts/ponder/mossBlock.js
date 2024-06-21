// priority: 100

Ponder.registry((e) => {
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

  e.create('minecraft:moss_block').scene(
    'moss_block_seeding',
    'Moss Blocks and You',
    (scene, util) => {
      scene.showBasePlate()
      const center = new BlockPos(2, 1, 2)
      const deployerPos = center.above(2)

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
      setDeployerFilter(scene, deployerPos, 'createaddition:biomass')
      setDeployerHeldItem(scene, deployerPos, 'createaddition:biomass')
      scene.idleSeconds(1)
      cycleDeployerMovement(scene, deployerPos)
      spawnGrowthParticles(scene, util, center)
      scene.world.setBlock(center, 'minecraft:moss_block', true)
      scene.idleSeconds(2)

      // Spreading moss
      scene.addKeyframe()
      setDeployerFilter(scene, deployerPos, 'minecraft:bone_meal')
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
      const newBlocks = [
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
        const [selection, block] = data
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
      setDeployerFilter(scene, deployerPos, 'minecraft:red_mushroom')
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
      const mushroomGrowth = [
        [center, 10],
        [center.west(), 8],
        [center.west().north(), 1],
        [center.west().south(), 3],
      ]
      mushroomGrowth.forEach((data) => {
        const [blockPos, delay] = data
        scene.world.setBlocks(blockPos, 'minecraft:red_mushroom_block', true)
        spawnGrowthParticles(scene, util, blockPos)
        scene.idle(delay)
      })
    }
  )
})
