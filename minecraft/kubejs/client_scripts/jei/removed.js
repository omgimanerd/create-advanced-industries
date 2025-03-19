// priority: 1000

JEIEvents.hideItems((e) => {
  // Defined in startup_scripts/removed.js
  global.REMOVED_ITEMS.forEach((r) => {
    e.hide(r)
  })
})

ItemEvents.tooltip((e) => {
  e.add(global.REMOVED_ITEMS, Text.red('This item is disabled!'))
})
