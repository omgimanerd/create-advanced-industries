// priority: 10

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  registerItem('kubejs:zinc_hand')

  // Unbreakable screwdriver for crafting steel mechanisms
  e.create('kubejs:unbreakable_screwdriver')
    .texture('tfmg:item/screwdriver')
    .displayName('Unbreakable Screwdriver')
    .glow(true)
    .fireResistant(true)
    .maxDamage(0)
    .use((level, player) => {
      if (level.isClientSide()) {
        player.tell('You got screwed!')
      }
      return true
    })
})
