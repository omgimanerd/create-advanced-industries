// priority: 0

ItemEvents.tooltip((e) => {
  const $Lang = Java.loadClass('com.simibubi.create.foundation.utility.Lang')
  const $TooltipHelper = Java.loadClass(
    'com.simibubi.create.foundation.item.TooltipHelper'
  )

  const holdShift = () => {
    return $Lang
      .translateDirect(
        'tooltip.holdForDescription',
        $Lang
          .translateDirect('tooltip.keyShift')
          .withStyle(e.shift ? 'white' : 'gray')
      )
      .withStyle('dark_gray')
  }

  // Add some additional text to the FTB Quests book.
  tooltipHelper(
    e,
    'ftbquests:book',
    '<gray>You can also bind the quest window to a keybind</gray>'
  )

  // Remove the weird 'Complete' text from the Quantum mechanism tooltip.
  tooltipHelper(
    e,
    'createteleporters:quantum_mechanism',
    null,
    null,
    null,
    true
  )

  // Add a Create-style tooltip to the glass shaft.
  e.addAdvanced('createcasing:glass_shaft', (_, advanced, text) => {
    let last = null
    if (advanced) {
      last = text.remove(text.size() - 1)
    }
    text.add(holdShift())
    if (e.shift) {
      text.addAll(
        $TooltipHelper.cutStringTextComponent(
          'Breaks when the system is overstressed.',
          $TooltipHelper.Palette.STANDARD_CREATE
        )
      )
    }
    if (last) {
      text.add(last)
    }
  })

  // Neat utility to display NBT in the tooltip
  e.addAdvancedToAll((item, advanced, text) => {
    if (item.nbt && e.alt) {
      text.add(Text.of('NBT: ').append(Text.prettyPrintNbt(item.nbt)))
    }
  })
})
