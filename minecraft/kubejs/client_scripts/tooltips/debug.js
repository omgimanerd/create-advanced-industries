// priority: 100
// This file is not packaged in the final release modpack.

ItemEvents.tooltip((e) => {
  // Neat utility to display NBT in the tooltip, debug only, remove for the 1.0
  // release.
  e.addAdvancedToAll((item, _, text) => {
    if (item.nbt && e.alt) {
      text.add(Text.of('NBT: ').append(Text.prettyPrintNbt(item.nbt)))
    }
  })
})
