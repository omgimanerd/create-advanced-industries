// priority: 100

const formatXp = (x) => {
  if (x < 1000) return x.toString()
  return `${(x / 1000).toFixed(2).toString()}k`
}

ItemEvents.tooltip((e) => {
  // Replicate the default Thermal tooltip.
  e.addAdvanced('kubejs:xp_crystal', (itemStack, _, text) => {
    let startIndex = 1
    // Consistency so the tooltip doesn't jump around when shift is pressed.
    if (itemStack.nbt) {
      text.add(Text.blue('KubeJS'))
      startIndex = 2
    }
    text.add(Text.gold('Stores experience'))
    if (!e.shift) {
      text.add(
        ++startIndex,
        Text.gray('Hold ')
          .append(Text.yellow('Shift').italic())
          .append(Text.gray(' for Details'))
      )
    } else {
      const capacity = global.customXpCrystalCapacity(itemStack)
      const xp = global.customXpCrystalContents(itemStack)
      text.add(
        ++startIndex,
        Text.gray('Use to transfer experience to the crystal.')
      )
      text.add(
        ++startIndex,
        Text.darkGray('Use while sneaking to retrieve stored experience.')
      )
      text.add(++startIndex, `Amount: ${formatXp(xp)} / ${formatXp(capacity)}`)
    }
  })
})
