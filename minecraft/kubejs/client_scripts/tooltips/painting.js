// priority: 0
// Add a tooltip to the tiered painting based on the world seed.

ItemEvents.tooltip((e) => {
  const tieredVariants = global.getTieredPaintingVariants()

  e.addAdvanced('minecraft:painting', (itemstack, advanced, text) => {
    const variant = itemstack?.nbt?.EntityTag?.variant
    if (variant === null || !(variant in tieredVariants)) {
      return
    }

    // Remove the advanced tooltips if they are present, add them back at the
    // end.
    let advancedTooltips = []
    if (advanced) {
      if (itemstack.nbt !== null) {
        advancedTooltips.push(text.remove(text.size() - 1))
      }
      advancedTooltips.push(text.remove(text.size() - 1))
    }

    switch (tieredVariants[variant]) {
      case 'artifact':
        text.add(Text.red('████████████████████████'))
        text.add(Text.red('█ This is an artifact tier painting!█').bold())
        text.add(Text.red('████████████████████████'))
        break
      case 'legendary':
        text.add(Text.gold('█████████████████████████'))
        text.add(Text.gold('█ This is a legendary tier painting! █').bold())
        text.add(Text.gold('█████████████████████████'))
        break
      case 'epic':
        text.add(Text.lightPurple('████████████████████').bold())
        text.add(Text.lightPurple('█ This is a epic tier painting!   █').bold())
        text.add(Text.lightPurple('████████████████████').bold())
        break
      case 'rare':
        text.add(Text.blue('████████████████████').bold())
        text.add(Text.blue('█ This is a rare tier painting!  █').bold())
        text.add(Text.blue('████████████████████').bold())
        break
      default:
        break
    }

    if (advanced) {
      advancedTooltips.reverse().forEach((tooltip) => text.add(tooltip))
    }
  })
})
