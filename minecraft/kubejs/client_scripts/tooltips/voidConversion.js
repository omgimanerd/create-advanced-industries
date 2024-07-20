// priority: 1000

ItemEvents.tooltip((e) => {
  // Add tooltips to items that are crafted via void conversion.
  for (const [input, output] of Object.entries(global.VoidConversionRecipes)) {
    let inputDisplayName = Item.of(input).displayName
    tooltipHelper(e, output, {
      baseText: Text.of('Obtained by dropping ')
        .append(inputDisplayName)
        .append(' into the void.')
        .blue(),
    })
  }
})
