// priority: 100

Ponder.registry((e) => {
  e.create('minecraft:infested_stone').scene(
    'infested_stone_expulsion',
    'Getting rid of Pests',
    (scene, util) => {
      scene.showBasePlate()
      const center = util.grid.at(2, 1, 2)
      const deployer = center.above(2)
      const sigil = 'apotheosis:sigil_of_withdrawal'

      // Scene setup
      scene.world.setBlock(center, 'minecraft:infested_stone', false)
      scene.world.setBlock(
        deployer,
        Block.id('create:deployer').with('facing', 'down'),
        false
      )
      setDeployerFilter(scene, deployer, sigil)
      setDeployerHeldItem(scene, deployer, sigil)
      scene.world.showSection(util.select.everywhere(), Facing.SOUTH)
      scene.idle(20)

      // Expelling pests
      scene.addKeyframe()
      scene.text(40, 'Infested stone is full of pests!', center)
      scene.idle(50)
      scene.text(
        40,
        'You can expel the silverfish out of infested stone with a ' +
          'Sigil of Withdrawal.',
        center
      )
      scene.idle(50)

      scene.addKeyframe()
      scene.world.setKineticSpeed(deployer, 24)
      let silverfish
      const silverFishLerpedMovement = [
        { x: 3.5, y: 2.2, z: 2.5, yRot: -90, xRot: 0, steps: 3 },
        { x: 3.5, y: 1.2, z: 2.5, steps: 3 },
        { x: 5.5, y: 1.2, z: 2.5, steps: 10 },
      ]
      cycleDeployerMovement(scene, deployer, 20, false, () => {
        silverfish = scene.world.createEntity(
          'minecraft:silverfish',
          center.above()
        )
        scene.particles.simple(5, 'minecraft:poof', center.above()).density(5)
      })
      lerpEntityMovement(scene, silverfish, silverFishLerpedMovement)
      scene.world.removeEntity(silverfish)
      scene.particles.simple(5, 'minecraft:poof', [5, 1, 2]).density(5)
      scene.idle(20)

      // End stone
      scene.addKeyframe()
      scene.text(
        40,
        'If you expel all the silverfish, the infested stone will turn into end stone.',
        center
      )
      // Expel two more silverfish
      cycleDeployerMovement(scene, deployer, 20, false, () => {
        silverfish = scene.world.createEntity(
          'minecraft:silverfish',
          center.above()
        )
        scene.particles.simple(5, 'minecraft:poof', center.above()).density(5)
      })
      lerpEntityMovement(scene, silverfish, silverFishLerpedMovement)
      scene.world.removeEntity(silverfish)
      scene.particles.simple(5, 'minecraft:poof', [5, 1, 2]).density(5)
      scene.idle(20)

      cycleDeployerMovement(scene, deployer, 20, false, () => {
        // On the second boop, turn it into end stone.
        scene.world.setBlock(center, 'minecraft:end_stone', true)
        silverfish = scene.world.createEntity(
          'minecraft:silverfish',
          center.above()
        )
        scene.particles.simple(5, 'minecraft:poof', center.above()).density(5)
      })
      lerpEntityMovement(scene, silverfish, silverFishLerpedMovement)
      scene.world.removeEntity(silverfish)
      scene.particles.simple(5, 'minecraft:poof', [5, 1, 2]).density(5)
      scene.world.setKineticSpeed(deployer, 0)
      scene.idle(20)
      scene.text(
        40,
        'Each usage has a small chance to consume the Sigil of Withdrawal.',
        deployer
      )
      scene.idle(50)
    }
  )
})
