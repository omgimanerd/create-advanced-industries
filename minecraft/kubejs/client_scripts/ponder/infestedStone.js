// priority: 100

Ponder.registry((e) => {
  // Ponder for infested stone expulsion.
  e.create('minecraft:infested_stone').scene(
    'infested_stone_expulsion',
    'Getting rid of Pests',
    (scene, util) => {
      scene.showBasePlate()
      const center = util.grid.at(2, 1, 2)
      const deployer = center.above(2)
      const vialOfExpulsion = 'apotheosis:vial_of_expulsion'

      // Scene setup
      scene.world.setBlock(center, 'minecraft:infested_stone', false)
      scene.world.setBlock(
        deployer,
        Block.id('create:deployer').with('facing', 'down'),
        false
      )
      setDeployerFilter(scene, deployer, vialOfExpulsion)
      setDeployerHeldItem(scene, deployer, vialOfExpulsion)
      scene.world.showSection(util.select.everywhere(), Facing.SOUTH)
      scene.idle(20)

      // Expelling pests
      scene.addKeyframe()
      scene.text(20, 'Infested stone is full of pests!', center)
      scene.idle(30)
      scene.text(
        40,
        'You can expel the silverfish out of infested stone with a Vial of Expulsion',
        center
      )
      scene.idle(50)

      scene.addKeyframe()
      scene.world.setKineticSpeed(deployer, 24)
      let silverfish
      cycleDeployerMovement(scene, deployer, 20, false, () => {
        silverfish = scene.world.createEntity(
          'minecraft:silverfish',
          center.above()
        )
        scene.particles.simple(5, 'minecraft:poof', center.above()).density(5)
      })
      scene.world.setKineticSpeed(deployer, 0)
      lerpEntityMovement(scene, silverfish, [
        [3.5, 2.2, 2.5, -90, 0, 3],
        [3.5, 1.2, 2.5, null, null, 3],
        [5.5, 1.2, 2.5, null, null, 10],
      ])
      scene.world.removeEntity(silverfish)
      scene.particles.simple(5, 'minecraft:poof', [5, 1, 2]).density(5)
      scene.idle(10)

      // End stone
      scene.addKeyframe()
      scene.text(
        40,
        'If you expel all the silverfish, the infested stone will turn into end stone.',
        center
      )
      scene.world.setKineticSpeed(deployer, 24)
      // Expel two more silverfish
      cycleDeployerMovement(scene, deployer, 20, false, () => {
        silverfish = scene.world.createEntity(
          'minecraft:silverfish',
          center.above()
        )
        scene.particles.simple(5, 'minecraft:poof', center.above()).density(5)
      })
      lerpEntityMovement(scene, silverfish, [
        [3.5, 2.2, 2.5, -90, 0, 3],
        [3.5, 1.2, 2.5, null, null, 3],
        [5.5, 1.2, 2.5, null, null, 10],
      ])
      scene.world.removeEntity(silverfish)
      scene.particles.simple(5, 'minecraft:poof', [5, 1, 2]).density(5)

      cycleDeployerMovement(scene, deployer, 20, false, () => {
        // On the second boop, turn it into end stone.
        scene.world.setBlock(center, 'minecraft:end_stone', true)
        silverfish = scene.world.createEntity(
          'minecraft:silverfish',
          center.above()
        )
        scene.particles.simple(5, 'minecraft:poof', center.above()).density(5)
      })
      lerpEntityMovement(scene, silverfish, [
        [3.5, 2.2, 2.5, -90, 0, 3],
        [3.5, 1.2, 2.5, null, null, 3],
        [5.5, 1.2, 2.5, null, null, 10],
      ])
      scene.world.removeEntity(silverfish)
      scene.particles.simple(5, 'minecraft:poof', [5, 1, 2]).density(5)
      scene.world.setKineticSpeed(deployer, 0)
      scene.idle(10)
    }
  )
})
