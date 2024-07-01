// priority: 0

ItemEvents.tooltip((e) => {
  const defaultUnshiftText = 'Hold [<green>SHIFT</green>] for more info'
  // Update tooltips for wandering trader essences.
  tooltipHelper(
    e,
    'kubejs:agony_essence',
    'Magical Essences created through the distillation of agony.',
    [
      '  Low drop rate: death by drowning', //
      '  High drop rate: death by fire', //
    ],
    defaultUnshiftText
  )
  tooltipHelper(
    e,
    'kubejs:suffering_essence',
    'Magical Essences created through the concentration of raw suffering.',
    [
      '  Low drop rate: death by lightning strike',
      '  High drop rate: death by Tesla Coil electrocution',
    ],
    defaultUnshiftText
  )
  tooltipHelper(
    e,
    'kubejs:torment_essence',
    'Magical Essences created through the application of torment.',
    [
      '  Low drop rate: death by crushing wheel',
      '  High drop rate: death by suffocation',
    ],
    defaultUnshiftText
  )
  tooltipHelper(
    e,
    'kubejs:debilitation_essence',
    'Magical Essences created through the refinement of debilitation.',
    [
      '  Low drop rate: death by potions of harming',
      '  High drop rate: death by withering',
    ],
    defaultUnshiftText
  )
  tooltipHelper(
    e,
    'kubejs:mutilation_essence',
    'Magical Essences created through merciless mutilation.',
    [
      '  Low drop rate: death by mechanical saw',
      '  High drop rate: death by minigun',
    ],
    defaultUnshiftText
  )
})
