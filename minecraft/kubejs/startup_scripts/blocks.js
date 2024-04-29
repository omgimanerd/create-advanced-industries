// priority: 1000

BlockEvents.modification((e) => {
  // Disable the random ticking on budding amethyst so it cannot grow amethyst
  // clusters by itself.
  e.modify('minecraft:budding_amethyst', (block) => {
    block.setIsRandomlyTicking(false)
  })
})

StartupEvents.registry('block', (e) => {
  // Register a portal block to be used in Chapter 5b
  e.create('kubejs:portal_block').blockEntity((c) => {
    c.serverTick(10, 0, (block_entity) => {
      if (global.PortalBlockTickingCallback) {
        global.PortalBlockTickingCallback(block_entity)
      }
    })
  })
})
