// priority: 1000
// Handles receive the world seed from a network packet when logging in. This
// used for seed dependent RNG.

NetworkEvents.dataReceived('worldSeed', (e) => {
  global.WORLD_SEED = e.data.worldSeed
})
