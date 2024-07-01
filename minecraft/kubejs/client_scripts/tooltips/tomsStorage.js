// priority: 0

ItemEvents.tooltip((e) => {
  // Update tooltips for Tom's Simple Storage Mod with pack specific overrides.
  e.addAdvanced('toms_storage:ts.inventory_cable_connector', (_, __, text) => {
    const textSize = text.size()
    if (e.shift && textSize > 1) {
      for (let i = textSize - 2; i >= 1; --i) {
        text.remove(i)
      }
      text.add(1, 'Connects the inventory to the Inventory Network.')
      text.add(2, 'Or gives access to the Network.')
      text.add(3, 'Required to connect terminals.')
      text.add(4, 'Linking to other cable connectors is disabled.')
    }
  })
  e.addAdvanced('toms_storage:ts.adv_wireless_terminal', (_, __, text) => {
    const textSize = text.size()
    if (e.shift && textSize > 1) {
      for (let i = textSize - 3; i >= 1; --i) {
        text.remove(i)
      }
      text.add(1, 'Shift right click a terminal to bind it. Range: 64 blocks')
      text.add(2, "The terminal's chunk must be loaded.")
      text.add(3, 'Build a level 4 beacon in an 8 block radius ')
      text.add(4, 'of the bound terminal to make it accessible from ')
      text.add(5, 'anywhere in the same dimension.')
    }
  })
})
