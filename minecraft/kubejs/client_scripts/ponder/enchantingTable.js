// priority: 0

Ponder.registry((e) => {
  e.create('minecraft:enchanting_table').scene(
    'enchanting_table_overhaul',
    'Enchanting Table',
    'kubejs:baseplate7', // kubejs/assets/kubejs/ponder/baseplate7.nbt
    (scene, util) => {
      scene.showStructure()
      const center = util.grid.at(3, 1, 3)
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
          100,
          'Blocks placed around the enchanting table affect four attributes ' +
            'called Eterna, Quanta, Arcana, and Rectification. Refer to the ' +
            'Chronicle of Shadows for details about what they do.',
          center
        )
        .placeNearTarget()
      scene.idle(110)

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
          100,
          'Your vanilla enchanting setup gives you an Eterna level of 15, ' +
            'unlocking access to level 30 enchantments. The maximum ' +
            'enchanting power of any setup is twice the Eterna level.',
          center
        )
        .placeNearTarget()
      scene.idle(110)
      scene
        .text(
          100,
          'Apotheosis adds advanced bookshelves that let you modify the ' +
            'enchanting attributes in almost any way you desire, leading to ' +
            'extremely powerful enchantments.',
          center
        )
        .placeNearTarget()
      scene.idle(110)

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
      const miscSetup = [
        { pos: [5, 1, 3], block: 'apotheosis:draconic_endshelf' },
        { pos: [5, 1, 4], block: 'apotheosis:draconic_endshelf' },
        { pos: [5, 1, 5], block: 'apotheosis:draconic_endshelf' },
        { pos: [4, 1, 5], block: 'apotheosis:draconic_endshelf' },
        { pos: [3, 1, 5], block: 'apotheosis:draconic_endshelf' },
        { pos: [2, 1, 5], block: 'apotheosis:treasure_shelf' },
        {
          pos: [5, 2, 3],
          block: Block.id('minecraft:purple_candle', {
            candles: '3',
            lit: 'true',
          }),
        },
        {
          pos: [5, 2, 4],
          block: Block.id('minecraft:wither_skeleton_skull', {
            rotation: '13',
          }),
        },
        {
          pos: [4, 2, 5],
          block: Block.id('minecraft:black_candle', { lit: 'true' }),
        },
      ]
      for (const { pos, block } of miscSetup) {
        scene.world.setBlock(pos, block, false)
      }
      scene.world.showSection(tableModifierArea, Facing.SOUTH)
      scene.idle(20)
      scene
        .text(
          40,
          "Experiment with different setups! There's no single best way to " +
            'do it!',
          center
        )
        .placeNearTarget()
      scene.idle(50)
    }
  )
})
