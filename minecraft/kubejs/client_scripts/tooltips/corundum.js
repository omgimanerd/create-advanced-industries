// priority: 0

ItemEvents.tooltip((e) => {
  Ingredient.of('#quark:corundum').itemIds.forEach((id) => {
    tooltipHelper(e, id, {
      unShiftText: 'Hold [<green>SHIFT</green>] for more info',
      shiftText: [
        'Place below <red>Y=24</red> and it will naturally grow.',
        'Or spout crystal growth accelerator on it...',
      ],
    })
  })
})
