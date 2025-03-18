// priority: 100

BlockEvents.rightClicked('minecraft:note_block', (e) => {
  const { player } = e
  if (player.isCrouching()) {
    player.swing()
    e.cancel()
  }
})
