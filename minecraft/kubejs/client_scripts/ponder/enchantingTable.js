// priority: 100

Ponder.registry((e) => {
  e.create('minecraft:enchanting_table').scene(
    'enchanting_table_overhaul',
    'Enchanting Table',
    'kubejs:baseplate7',
    (scene, util) => {
      scene.showStructure()
      const center = new BlockPos(3, 1, 3)
      const tableModifierArea = util.select
        .fromTo(1, 1, 1, 5, 2, 5)
        .substract(util.select.fromTo(2, 1, 2, 4, 2, 4))

      // Scene setup
      scene.world.setBlock(center, 'minecraft:enchanting_table', false)
      scene.idle(20)
      scene
        .text(
          40,
          'Enchanting is completely overhauled by Apotheosis in this pack.',
          center
        )
        .placeNearTarget()
      scene.idle(50)
      scene
        .text(
          40,
          'Blocks placed around the enchanting table affect four attributes ' +
            'called Eterna, Quanta, Arcana, and Rectification. Refer to the ' +
            'Chronicle of Shadows for details about what they do.',
          center
        )
        .placeNearTarget()
      scene.idle(40)

      // Basic enchanting setup
      const bookShelfArea = util.select
        .fromTo(1, 1, 1, 5, 2, 5)
        .substract(util.select.fromTo(1, 1, 1, 4, 2, 4))
        .substract([5, 2, 1])
        .substract([1, 2, 5])
      scene.addKeyframe()
      scene.world.hideSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene.world.setBlocks(bookShelfArea, 'minecraft:bookshelf', false)
      scene.world.showSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene
        .text(
          60,
          'Your vanilla enchanting setup gives you an Eterna level of 15, ' +
            'unlocking access to level 30 enchantments. The maximum ' +
            'enchanting power of any setup is twice the Eterna level.',
          center
        )
        .placeNearTarget()
      scene.idle(70)
      scene
        .text(
          40,
          'Apotheosis adds advanced bookshelves that let you modify the ' +
            'enchanting attributes in almost any way you desire, leading to ' +
            'extremely powerful enchantments.',
          center
        )
        .placeNearTarget()
      scene.idle(50)

      // Hellshelf setup
      scene.addKeyframe()
      scene.world.hideSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene.world.setBlocks(
        bookShelfArea,
        'apotheosis:glowing_hellshelf',
        false
      )
      scene.world.showSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene
        .text(
          40,
          'For example, here is a setup with 30 Eterna, unlocking level 60 ' +
            'enchantments.',
          center
        )
        .placeNearTarget()
      scene.idle(50)
      scene
        .text(
          40,
          'Each tier of advanced bookshelves is gated by the previous tier.',
          center
        )
        .placeNearTarget()
      scene.idle(50)

      // Endshelf setup
      scene.addKeyframe()
      scene.world.hideSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene.world.setBlocks(bookShelfArea, 'apotheosis:pearl_endshelf', false)
      scene.world.showSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene
        .text(40, 'This is an example setup for level 90 enchantments.', center)
        .placeNearTarget()
      scene.idle(50)

      // Misc setup
      scene.addKeyframe()
      scene.world.hideSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene.world.setBlocks(bookShelfArea, 'minecraft:air', false)
      scene.world.setBlocks(
        util.grid.at(5, 1, 3),
        'apotheosis:draconic_endshelf',
        false
      )
      scene.world.setBlocks(
        util.grid.at(5, 1, 4),
        'apotheosis:draconic_endshelf',
        false
      )
      scene.world.setBlocks(
        util.grid.at(5, 1, 5),
        'apotheosis:draconic_endshelf',
        false
      )
      scene.world.setBlocks(
        util.grid.at(4, 1, 5),
        'apotheosis:draconic_endshelf',
        false
      )
      scene.world.setBlocks(
        util.grid.at(3, 1, 5),
        'apotheosis:draconic_endshelf',
        false
      )
      scene.world.setBlocks(
        util.grid.at(2, 1, 5),
        'apotheosis:treasure_shelf',
        false
      )
      scene.world.setBlocks(
        util.grid.at(5, 2, 3),
        'minecraft:purple_candle', // Cannot set block states in ponder.
        false
      )
      scene.world.setBlocks(
        util.grid.at(5, 2, 4),
        'minecraft:wither_skeleton_skull', // Cannot set block states in ponder.
        false
      )
      scene.world.setBlocks(
        util.grid.at(4, 2, 5),
        'minecraft:black_candle', // Cannot set block states in ponder.
        false
      )
      scene.world.showSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene
        .text(
          40,
          "Experiment with different setups! There's no single best way to do it!",
          center
        )
        .placeNearTarget()
      scene.idle(50)
    }
  )
})
