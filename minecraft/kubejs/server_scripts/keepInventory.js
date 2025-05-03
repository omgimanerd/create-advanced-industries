// priority: 0

ServerEvents.loaded((e) => {
  e.server.runCommandSilent('/gamerule keepInventory true')
})
