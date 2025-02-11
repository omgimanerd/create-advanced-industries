// priority: 0

Ponder.registry((e) => {
  e.create('minecraft:note_block').scene(
    'note_block_resonance_crafting',
    'Resonance Crafting',
    'kubejs:baseplate7', // kubejs/assets/kubejs/ponder/baseplate7.nbt
    (scene, util) => {
      const pedestal = util.grid.at(3, 1, 3)
      const noteBlocks = [
        [util.grid.at(5, 1, 1), 'E4'],
        [util.grid.at(5, 1, 3), 'D4'],
        [util.grid.at(5, 1, 5), 'C4'],
        [util.grid.at(3, 1, 5), 'G4'],
        [util.grid.at(1, 1, 5), 'F#3'],
      ]

      // Scene setup
      scene.showStructure() // Needs to be called before adding blocks
      scene.world.setBlock(pedestal, 'ars_nouveau:arcane_pedestal', false)
      scene.idleSeconds(1)
      // Prehide the note block positions, do not move this before the
      // scene.idleSeconds line above or Minecraft will crash.
      for (const [pos, _] of noteBlocks) {
        scene.world.hideSection(util.select.position(pos), Facing.DOWN)
      }

      // Show note blocks
      scene.addKeyframe()
      scene.text(
        40,
        'Resonance crafting is a custom mechanic added by this modpack.',
        pedestal
      )
      scene.idle(50)
      for (const [pos, note] of noteBlocks) {
        scene.world.setBlock(
          pos,
          Block.id('minecraft:note_block', {
            instrument: 'basedrum',
            note: `${global.NOTE_TO_ID[note]}`,
          }),
          false
        )
        scene.world.showSection(pos, Facing.DOWN)
        scene.idle(4)
      }
      scene.text(
        40,
        'Place note blocks within 2 blocks of an Arcane Pedestal.',
        noteBlocks[4][0]
      )
      scene.idle(50)

      // Item on Pedestal
      scene.addKeyframe()
      scene.text(40, 'Place the input item on the pedestal', pedestal)
      scene
        .showControls(40, pedestal.above(), 'down')
        .rightClick()
        .withItem('minecraft:ender_pearl')
      setArsContainerItem(scene, pedestal, 'minecraft:ender_pearl')
      scene.idle(50)

      // Playing notes in the right order
      scene.addKeyframe()
      scene.text(
        40,
        'Play the right notes in the right order to perform the craft.',
        noteBlocks[4][0]
      )
      scene.idle(50)
      for (let i = 0; i < noteBlocks.length; ++i) {
        let [pos, note] = noteBlocks[i]
        scene.particles
          .simple(1, 'minecraft:note', pos.above())
          .density(10)
          .delta([0.2, 0.2, 0.2])
          .color(global.NOTE_TO_COLOR[note].hexJS)
        scene.particles
          .simple(1, 'minecraft:note', pedestal.above())
          .density(10)
          .delta([0.2, 0.2, 0.2])
          .color(global.NOTE_TO_COLOR[note].hexJS)
        if (i === noteBlocks.length - 1) {
          setArsContainerItem(scene, pedestal, 'kubejs:resonant_ender_pearl')
        }
        scene.idle(10)
      }
      scene.text(
        40,
        'JEI will tell you what notes to play to perform each craft.',
        noteBlocks[4][0]
      )
      scene.idle(50)
    }
  )
})
