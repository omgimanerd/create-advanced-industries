// priority: 0

Ponder.registry((e) => {
  e.create('minecraft:sculk').scene(
    'sculk_spreading',
    'Sculk Spreading',
    'kubejs:sculk', // kubejs/assets/kubejs/ponder/sculk.nbt
    (scene, util) => {
      scene.showStructure()
      const sculkCatalyst = util.grid.at(2, 1, 2)

      // Initial setup
      scene.idle(20)
      scene.text(
        40,
        'Sculk Catalysts can be used to generate sculk blocks',
        sculkCatalyst
      )
      scene.idle(50)

      // Spawn and kill a sheep
      scene.addKeyframe()
      const sheepLoc = new Vec3d(1.2, 1, 2.2)
      const sheepParticleLoc = sheepLoc.add(0, 0.5, 0)
      scene.particles
        .simple(3, 'minecraft:poof', sheepParticleLoc)
        .scale(2)
        .delta([0.25, 0.25, 0.25])
        .density(20)
      const sheep = scene.world.createEntity('minecraft:sheep', sheepLoc)
      scene.text(
        40,
        'An animal that dies near a Sculk Catalyst has a chance of causing a sculk bloom',
        sheepLoc
      )
      scene.idle(50)
      scene
        .showControls(20, sheepParticleLoc, 'left')
        .leftClick()
        .withItem('minecraft:diamond_sword')
      scene.idle(20)
      scene.world.modifyEntity(sheep, (entity) => {
        entity.animateHurt(1)
      })
      scene.idle(10)
      scene.particles
        .simple(3, 'minecraft:poof', sheepParticleLoc)
        .scale(2)
        .delta([0.25, 0.25, 0.25])
        .density(20)
      scene.world.removeEntity(sheep)

      // Sculk Bloom
      scene.addKeyframe()
      scene.particles
        .simple(10, 'minecraft:sculk_soul', sculkCatalyst.above().center)
        .density(3)
        .delta([0.25, 0.1, 0.25])
      let sculkBloom = util.select
        .fromTo(sculkCatalyst.below(), [1, 0, 3])
        .add(util.select.position(3, 0, 2))
        .add(util.select.position(2, 0, 1))
      scene.world.setBlocks(sculkBloom, 'minecraft:sculk', true)
      let sculkVeinBloom = util.select
        .fromTo([3, 1, 4], [3, 1, 1])
        .add(util.select.fromTo([0, 1, 2], [0, 1, 3]))
        .add(util.select.position(1, 1, 1))
      scene.world.setBlocks(
        sculkVeinBloom,
        Block.id('minecraft:sculk_vein', {
          down: true,
          east: false,
          south: false,
          up: false,
          west: false,
        }),
        true
      )
      scene.idle(40)
    }
  )
})
