// priority: 0

Ponder.registry((e) => {
  e.create('kubejs:chromatic_bop_stick').scene(
    'chromatic_bop_stick',
    'Using the Chromatic Bop Stick',
    // kubejs/assets/kubejs/ponder/chromatic_bop_stick.nbt
    'kubejs:chromatic_bop_stick',
    (scene, util) => {
      const center = util.grid.at(3, 1, 3)
      const kinetics = util.select.fromTo(3, 1, 5, 4, 1, 6)
      const bigTank = util.grid.at(3, 1, 6)

      // Scene setup
      scene.world.setKineticSpeed(kinetics, 32)
      scene.world.showSection(util.select.everywhere(), Facing.UP)
      scene.idleSeconds(1)

      // Hitting a colored sheep
      scene.addKeyframe()
      scene
        .text(40, 'Move a colored sheep on top of a Create drain.', center)
        .placeNearTarget()
      scene.idle(50)
      const sheep = scene.world.createEntity(
        'minecraft:sheep',
        center.getCenter().add(0, 0.25, 0),
        (entity) => {
          entity.setNbt(entity.nbt.merge({ Color: NBT.b(2) }))
        }
      )
      scene.particles
        .simple(5, 'minecraft:poof', center.above())
        .motion([0, 0.1, 0])
        .delta([0.2, 0.2, 0.2])
        .density(20)
      scene.idle(40)

      scene
        .showControls(40, center.above(), 'down')
        .leftClick()
        .withItem('kubejs:chromatic_bop_stick')
      scene
        .text(
          40,
          'Then smack them with the Chromatic Bop Stick.',
          center.above()
        )
        .placeNearTarget()
      scene.idle(60)

      // Sheep gets uncolored
      scene.world.modifyEntity(sheep, (entity) => {
        entity.animateHurt(1)
        entity.setNbt(entity.nbt.merge({ Color: NBT.b(0) }))
      })
      scene.idle(20)
      scene
        .text(
          40,
          'This will fill the drain with Chromatic fluid, which you can pump ' +
            'out.',
          center
        )
        .placeNearTarget()
      animateTank(scene, bigTank, 'kubejs:chromatic_fluid', 0, 1000, 50)
      scene.idle(50)

      // Recoloring the sheep
      scene.addKeyframe()
      scene.world.modifyEntity(sheep, (entity) => {
        entity.setNbt(entity.nbt.merge({ Color: NBT.b(11) }))
      })
      scene
        .text(20, 'You can recolor the sheep to do this again.', center.above())
        .placeNearTarget()
      scene.idle(30)
      scene
        .showControls(40, center.above(), 'down')
        .leftClick()
        .withItem('kubejs:chromatic_bop_stick')
      scene.idle(60)
      scene.world.modifyEntity(sheep, (entity) => {
        entity.animateHurt(1)
        entity.setNbt(entity.nbt.merge({ Color: NBT.b(0) }))
      })
      animateTank(scene, bigTank, 'kubejs:chromatic_fluid', 1000, 2000, 50)
      scene.idle(20)
      scene.text(
        40,
        'The Chromatic Bop Stick can only do this once per color until it is ' +
          'recharged with a piece of Chromatic Compound.',
        center.above()
      )
      scene.idle(50)
      scene.text(
        40,
        'Check the tooltip on the Chromatic Bop Stick to see which colors ' +
          'are left.',
        center.above()
      )
    }
  )
})
