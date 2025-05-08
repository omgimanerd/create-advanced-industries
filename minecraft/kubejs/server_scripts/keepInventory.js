// priority: 0

ServerEvents.loaded((e) => {
  e.server.gameRules.set('keepInventory', true)
})
