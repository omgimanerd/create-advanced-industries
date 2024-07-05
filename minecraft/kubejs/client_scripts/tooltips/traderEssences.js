// priority: 0

ItemEvents.tooltip((e) => {
  const defaultUnshiftText = 'Hold [<green>SHIFT</green>] for more info'
  // Update tooltips for wandering trader essences.
  tooltipHelper(e, 'kubejs:agony_essence', {
    baseText: 'Magical Essences created through the distillation of agony.',
    shiftText: [
      '  Low drop rate: death by drowning', //
      '  High drop rate: death by fire', //
    ],
    unShiftText: defaultUnshiftText,
  })
  tooltipHelper(e, 'kubejs:suffering_essence', {
    baseText:
      'Magical Essences created through the concentration of raw suffering.',
    shiftText: [
      '  Low drop rate: death by lightning strike',
      '  High drop rate: death by Tesla Coil electrocution',
    ],
    unShiftText: defaultUnshiftText,
  })
  tooltipHelper(e, 'kubejs:torment_essence', {
    baseText: 'Magical Essences created through the application of torment.',
    shiftText: [
      '  Low drop rate: death by crushing wheel',
      '  High drop rate: death by suffocation',
    ],
    unShiftText: defaultUnshiftText,
  })
  tooltipHelper(e, 'kubejs:debilitation_essence', {
    baseText:
      'Magical Essences created through the refinement of debilitation.',
    shiftText: [
      '  Low drop rate: death by potions of harming',
      '  High drop rate: death by withering',
    ],
    unShiftText: defaultUnshiftText,
  })
  tooltipHelper(e, 'kubejs:mutilation_essence', {
    baseText: 'Magical Essences created through merciless mutilation.',
    shiftText: [
      '  Low drop rate: death by mechanical saw',
      '  High drop rate: death by minigun',
    ],
    unShiftText: defaultUnshiftText,
  })
})
