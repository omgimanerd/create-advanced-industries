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
  e.create('kubejs:arcane_portal')
    .texture('up', 'kubejs:block/arcane_portal_top')
    .texture('down', 'kubejs:block/arcane_portal_side')
    .texture('north', 'kubejs:block/arcane_portal_side')
    .texture('south', 'kubejs:block/arcane_portal_side')
    .texture('east', 'kubejs:block/arcane_portal_side')
    .texture('west', 'kubejs:block/arcane_portal_side')
    .blockEntity((c) => {
      c.serverTick(20, 0, (blockEntity) => {
        if (global.PortalBlockTickingCallback) {
          global.PortalBlockTickingCallback(blockEntity)
        }
      })
    })
})
