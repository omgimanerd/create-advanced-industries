// priority: 100

PlayerEvents.loggedIn((e) => {
  if (e.player.stages.has('starting_items')) {
    e.player.stages.add('starting_items')
    e.player.inventory.clear()
    e.player.give('ftbquests:book')
  }
})

// Temporary command for playtesting
ServerEvents.customCommand('playtest', (e) => {
  e.player.give(Item.of('minecraft:oak_log', 256))
  e.player.give(Item.of('minecraft:copper_block', 32))
  e.player.give(Item.of('minecraft:iron_block', 64))
  e.player.give(Item.of('minecraft:gold_block', 32))
  e.player.give(Item.of('minecraft:andesite', 128))
  e.player.give(Item.of('ars_nouveau:sourceberry_bush'), 16)
})
