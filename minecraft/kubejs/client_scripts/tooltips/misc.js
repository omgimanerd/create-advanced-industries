// priority: 0

ItemEvents.tooltip((e) => {
  const $Lang = Java.loadClass('com.simibubi.create.foundation.utility.Lang')
  const $TooltipHelper = Java.loadClass(
    'com.simibubi.create.foundation.item.TooltipHelper'
  )

  const holdShift = (shift) => {
    return $Lang
      .translateDirect(
        'tooltip.holdForDescription',
        $Lang
          .translateDirect('tooltip.keyShift')
          .withStyle(shift ? 'white' : 'gray')
      )
      .withStyle('dark_gray')
  }

  // Add some additional text to the FTB Quests book.
  tooltipHelper(e, 'ftbquests:book', {
    baseText: Text.gray('You can also bind the quest window to a keybind'),
  })

  // Add a Create-style tooltip to the glass shaft.
  const glassCasingShiftText = $TooltipHelper.cutStringTextComponent(
    'Breaks when the system is overstressed.',
    $TooltipHelper.Palette.STANDARD_CREATE
  )
  glassCasingShiftText.add(0, holdShift(true))
  tooltipHelper(e, 'createcasing:glass_shaft', {
    shiftText: glassCasingShiftText,
    unShiftText: holdShift(false),
  })

  // Add the upgrade template style tooltip to the Creative Upgrade Template.
  tooltipHelper(e, 'kubejs:creative_upgrade_smithing_template', {
    baseText: [
      '<gray>Creative Upgrade</gray>',
      '',
      '<gray>Applies to:</gray>',
      '<blue> Valid Netherite Tools</blue>',
      '<gray>Ingredients:</gray>',
      '<blue> Creative Mechanism</blue>',
    ],
  })

  // TODO: remove for 1.0 release
  // Neat utility to display NBT in the tooltip, debug only, remove for the 1.0
  // release.
  e.addAdvancedToAll((item, _, text) => {
    if (item.nbt && e.alt) {
      text.add(Text.of('NBT: ').append(Text.prettyPrintNbt(item.nbt)))
    }
  })
})
