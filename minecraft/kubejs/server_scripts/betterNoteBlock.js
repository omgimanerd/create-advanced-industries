// priority: 100

BlockEvents.rightClicked('minecraft:note_block', (e) => {
  const { player, item, block, level } = e
  // Only works if shift clicking with an empty hand.
  if (!player.isCrouching() || item.id !== 'minecraft:air') return

  // Set the block note to the previous note
  // https://minecraft.fandom.com/wiki/Note_Block
  const bp = block.properties
  const newNote = (parseInt(bp.getOrDefault('note', 0), 10) + 24) % 25
  const instrument = bp.getOrDefault('instrument', 'harp')
  block.set(block.getId(), {
    instrument: new String(instrument),
    note: new String(newNote),
    powered: new String(bp.getOrDefault('powered', false)),
  })

  // Helper to play sounds to players nearby
  const playSound = (sound, pitch) => {
    block.getPlayersInRadius(48).forEach((p) => {
      // https://minecraft.fandom.com/wiki/Commands/playsound
      Utils.server.runCommandSilent(
        `playsound ${sound} block ${p.displayName.string} ${block.x} ` +
          `${block.y} ${block.z} 3 ${pitch}`
      )
    })
  }

  // Display the note particle like how the normal right click event
  const soundEvent = `block.note_block.${instrument}`
  const pitch = Math.pow(2, (newNote - 12) / 12)
  playSound(soundEvent, pitch)
  const particlePos = block.pos.getCenter().add(0, 0.7, 0)
  level.spawnParticles(
    'minecraft:note',
    true, // overrideLimiter
    particlePos.x(), // x
    particlePos.y(), // y
    particlePos.z(), // z
    newNote / 24, // vx, used as pitch when count is 0
    0, // vy, unused
    0, // vz, unused
    0, // count, must be 0 for pitch argument to work
    1 // speed, must be 1 for pitch argument to work
  )

  // Cancel the default sound event
  e.cancel()
})
