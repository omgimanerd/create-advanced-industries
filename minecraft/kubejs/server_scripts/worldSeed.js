// priority: 10000

ServerEvents.recipes(() => {
  const server = Utils.getServer()
  global.WORLD_SEED =
    server === null ? null : server.worldData.worldGenOptions().seed()
  if (global.WORLD_SEED !== null) {
    console.log(`Successfully got world seed: ${global.WORLD_SEED}`)
  } else {
    throw new Error('Forced reload was not triggered! World seed unavailable!')
  }
})

// Send the world seed to players when they log in.
PlayerEvents.loggedIn((e) => {
  e.player.sendData('worldSeed', {
    worldSeed: global.WORLD_SEED,
  })
})

// This only fires the first time a world is loaded into. Logging out and in
// does not trigger the event.
ServerEvents.loaded((e) => {
  // Reloads the server on the first world load to ensure the world seed is
  // available for recipe registration. This also ensures tags are available
  // in many of the server events.
  e.server.runCommandSilent('reload')
})
