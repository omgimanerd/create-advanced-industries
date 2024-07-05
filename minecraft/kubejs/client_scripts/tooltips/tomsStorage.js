// priority: 0

ItemEvents.tooltip((e) => {
  // Update tooltips for Tom's Simple Storage Mod with pack specific overrides.
  tooltipHelper(e, 'toms_storage:ts.inventory_cable_connector', {
    shiftText: [
      'Connects the inventory to the Inventory Network.',
      'Or gives access to the Network.',
      'Required to connect terminals.',
      'Linking to other cable connectors is disabled.',
    ],
    unShiftText: '<gray><italic>Hold SHIFT for more info.</italic><gray>',
    clear: true,
  })
  tooltipHelper(e, 'toms_storage:ts.adv_wireless_terminal', {
    shiftText: [
      'Shift right click a terminal to bind it. Range: 64 blocks',
      "The terminal's chunk must be loaded.",
      'Build a level 4 beacon in an 8 block radius ',
      'of the bound terminal to make it accessible from ',
      'anywhere in the same dimension.',
    ],
    unShiftText: '<gray><italic>Hold SHIFT for more info.</italic><gray>',
    clear: true,
  })
})
