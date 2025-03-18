// priority: 100

BlockEvents.rightClicked('minecraft:note_block', (e) => {
  const { player, block, level } = e
  if (!player.isCrouching()) return

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

  // Display the note particle like the normal right click event
  const soundEvent = `block.note_block.${instrument}`
  const pitch = Math.pow(2, (newNote - 12) / 12)
  level.playSound(
    null, // player
    block.x,
    block.y,
    block.z,
    soundEvent,
    'blocks', // soundSource
    3, // volume
    pitch
  )
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
