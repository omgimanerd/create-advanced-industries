// priority: 10

ItemEvents.modification((e) => {
  e.modify('tfmg:plastic_sheet', (i) => {
    i.displayName = 'Plastic'
  })
})

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  // Wooden hand used for crafting deployers
  registerItem('kubejs:wooden_hand')

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
