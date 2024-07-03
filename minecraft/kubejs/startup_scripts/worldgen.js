// priority: 1000

// list features
// https://discord.com/channels/303440391124942858/1229784826559729756

WorldgenEvents.remove((e) => {
  e.removeOres((ores) => {
    ores.blocks = ['create_new_age:thorium_ore']
  })
})
