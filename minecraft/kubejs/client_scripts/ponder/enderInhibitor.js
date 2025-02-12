// priority: 0

Ponder.registry((e) => {
  e.create('kubejs:ender_inhibitor').scene(
    'ender_inhibitor',
    'Ender Inhibitor',
    (scene, util) => {
      const tank = util.grid.at(3, 1, 2)
      const enderInhibitor = tank.above()
      const endermanLoc = tank.west().west()

      // Scene setup
      scene.world.setBlock(tank, 'create:fluid_tank', false)
      scene.world.setBlock(enderInhibitor, 'kubejs:ender_inhibitor', false)
      scene.world.showIndependentSectionImmediately(util.select.everywhere())
      scene.idle(20)
      scene.text(
        40,
        'The Ender Inhibitor can inhibit nearby entities from teleporting.',
        enderInhibitor
      )
      scene.idle(50)
      const r = global.ENDER_INHIBITOR_RANGE * 2 + 1
      scene.text(
        40,
        `It has an effective range of ${r}x${r}, centered on the block`,
        enderInhibitor
      )
      scene.idle(50)

      // Spawn an enderman
      scene.addKeyframe()
      scene
        .showControls(20, endermanLoc, 'up')
        .rightClick()
        .withItem('minecraft:enderman_spawn_egg')
      scene.idle(10)
      const enderman = scene.world.createEntity(
        'minecraft:enderman',
        endermanLoc.getCenter()
      )
      console.log(endermanLoc.getCenter())
      scene.idle(40)
      for (let tankContents = 0; tankContents < 8000; tankContents += 2000) {
        scene.world.modifyEntity(enderman, (entity) => {
          entity.animateHurt(1)
        })
        animateTank(
          scene,
          tank,
          'kubejs:teleportation_juice',
          tankContents,
          tankContents + 2000,
          250
        )
        scene.idle(20)
      }

      // Exploding if overfilled
      scene.addKeyframe()
      scene
        .text(
          60,
          'Make sure the Ender Inhibitor has somewhere to put the fluid, or it will explode!',
          enderInhibitor
        )
        .placeNearTarget()
      scene.idle(70)
      scene.world.modifyEntity(enderman, (entity) => {
        entity.animateHurt(1)
      })
      scene.particles
        .simple(5, 'minecraft:explosion', enderInhibitor)
        .density(5)
        .delta([1, 1, 1])
      scene.world.setBlock(enderInhibitor, 'minecraft:air', false)
    }
  )
})
