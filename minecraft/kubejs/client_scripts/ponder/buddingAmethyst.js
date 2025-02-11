// priority: 0

Ponder.registry((e) => {
  e.create('minecraft:budding_amethyst').scene(
    'budding_amethyst_spouting',
    'Budding Amethyst',
    (scene, util) => {
      const center = util.grid.at(2, 1, 2)
      const spoutPos = center.above(2)

      // Scene setup
      scene.world.setBlock(center, 'minecraft:budding_amethyst', false)
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
        Block.id('minecraft:small_amethyst_bud', { facing: 'west' }),
        false
      )
      scene.world.showSection(util.select.everywhere(), Facing.UP)
      scene.idleSeconds(1)

      // First keyframe explanation
      scene.addKeyframe()
      scene
        .text(
          40,
          'In addition to the recipes shown in JEI, amethyst ' +
            'shards can also be grown using budding amethyst as a catalyst.',
          center.west()
        )
        .placeNearTarget()
      scene.idle(50)

      // Second keyframe explanation
      scene.addKeyframe()
      scene
        .text(
          60,
          'In this pack, budding amethyst does not naturally cause attached ' +
            'buds to grow, and require crystal growth accelerator to be ' +
            'spouted on them.',
          center.west()
        )
        .placeNearTarget()
      scene.idle(70)

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
      scene.idle(20)
      for (const amethystStage of [
        'minecraft:medium_amethyst_bud',
        'minecraft:large_amethyst_bud',
        'minecraft:amethyst_cluster',
      ]) {
        scene.world.modifyBlockEntityNBT(spoutPos, (nbt) => {
          nbt.ProcessingTicks = 20
        })
        scene.idle(20)
        scene.world.replaceBlocks(
          center.west(),
          Block.id(amethystStage, { facing: 'west' }),
          false
        )
      }
    }
  )
})
