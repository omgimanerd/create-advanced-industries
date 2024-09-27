// priority: 0

ItemEvents.tooltip((e) => {
  e.addAdvanced('kubejs:chromatic_bop_stick', (item, advanced, text) => {
    let last = undefined
    // Last element is the id if advanced tooltips are enabled. Store this and
    // add it back on at the end.
    if (advanced) {
      last = text.remove(text.size() - 1)
    }

    const colorText = Text.empty()
    // slice(1) to exclude white
    for (const color of global.CHROMATIC_BOP_STICK_COLORS.slice(1)) {
      if (item.nbt && item.nbt.getBoolean(color)) {
        colorText.append(
          Text.of('█').color(global.CHROMATIC_BOP_STICK_COLOR_MAP[color])
        )
      } else {
        colorText.append(Text.of('▒'))
      }
    }
    text.add(colorText)

    if (!e.shift) {
      text.add(
        global.parseTextFormat(
          '<darkGray>Hold [</darkGray><gray>Shift</gray><darkGray>] for ' +
            'more information.</darkGray>'
        )
      )
    } else {
      text.addAll(
        textWrap(
          [
            'Look! A gay stick!',
            '',
            'Hit a colored sheep above a drain with the Chromatic Bop Stick ' +
              'to drain out Chromatic Fluid.',
            '',
            'Each usage will use one color charge of the corresponding ' +
              'color. The wand will not work without a color charge.',
            '',
            'Recharge the wand with Chromatic Compound.',
          ],
          48
        ).map((t) => {
          return Text.of(t).color(0xc7954b)
        })
      )
    }

    if (last) {
      text.add(last)
    }
  })
})
