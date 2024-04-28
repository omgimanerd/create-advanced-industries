// priority: 1000

BlockEvents.modification((e) => {
  // Disable the random ticking on budding amethyst so it cannot grow amethyst
  // clusters by itself.
  e.modify('minecraft:budding_amethyst', (block) => {
    block.setIsRandomlyTicking(false)
  })
})
