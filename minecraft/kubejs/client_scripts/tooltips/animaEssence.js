// priority: 0

ItemEvents.tooltip((e) => {
  const defaultUnshiftText = 'Hold [<green>SHIFT</green>] for more info'
  tooltipHelper(e, 'ars_elemental:anima_essence', {
    unShiftText: defaultUnshiftText,
    shiftText: [
      'Use on the following blocks to spawn a mob:',
      '  Cobweb: Spider',
      '  Wool: Sheep',
      '  Magma Block: Magma Cube',
      '  Shulker Box: Shulker Box',
      '  Bone Block: Skeleton',
      '  Slime Block: Slime',
      '  Blue Ice: Blizz',
    ],
  })
})
