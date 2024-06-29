// priority: 100

Ponder.registry((e) => {
  e.create('minecraft:note_block').scene(
    'note_block_resonance_crafting',
    'Resonance Crafting',
    // kubejs/assets/kubejs/ponder/resonance_crafting.nbt
    'kubejs:resonance_crafting',
    (scene, util) => {
      scene.showBasePlate()
      const pedestal = util.grid.at(3, 1, 3)

      const noteBlocks = [
        util.grid.at(5, 1, 1),
        util.grid.at(5, 1, 3),
        util.grid.at(5, 1, 5),
        util.grid.at(3, 1, 5),
        util.grid.at(1, 1, 5),
      ]

      // Scene setup
      scene.world.showIndependentSectionImmediately(pedestal)
      scene.idleSeconds(1)

      // Show note blocks.
      scene.addKeyframe()
      scene.text(
        40,
        'Resonance crafting is a custom mechanic added by this modpack.',
        pedestal
      )
      scene.idle(50)
      for (const block of noteBlocks) {
        scene.world.showSection(block, Facing.DOWN)
        scene.idle(4)
      }
      scene.text(
        40,
        'Place note blocks within 2 blocks of an Arcane Pedestal.',
        noteBlocks[4]
      )
      scene.idle(50)

      // Item on Pedestal
      scene.addKeyframe()
      scene.text(40, 'Place the input item on the pedestal', pedestal)
      scene
        .showControls(40, pedestal.above(), 'down')
        .rightClick()
        .withItem('minecraft:ender_pearl')
      setPedestalItem(scene, pedestal, 'minecraft:ender_pearl')
      scene.idle(50)

      // Playing notes in the right order
      scene.addKeyframe()
      scene.text(
        40,
        'Play the right notes in the right order to perform the craft.',
        noteBlocks[4]
      )
      scene.idle(50)
      const noteColors = [
        '#CF0083', // E4
        '#F70033', // D4
        '#FC1E00', // C4
        '#5B00E7', // G4
        '#77D700', // F#3
      ]
      for (let i = 0; i < noteBlocks.length; ++i) {
        // Particle spawning constants should match those defined in
        // startup_scripts/noteBlockResonanceCrafting.js
        scene.particles
          .simple(1, 'minecraft:note', noteBlocks[i].above())
          .density(10)
          .delta([0.2, 0.2, 0.2])
          .color(noteColors[i])
        scene.particles
          .simple(1, 'minecraft:note', pedestal.above())
          .density(10)
          .delta([0.2, 0.2, 0.2])
          .color(noteColors[i])
        if (i === noteBlocks.length - 1) {
          setPedestalItem(scene, pedestal, 'kubejs:resonant_ender_pearl')
        }
        scene.idle(10)
      }
    }
  )
})
