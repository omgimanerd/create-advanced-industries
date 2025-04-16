// priority: 500
// Remove deleted blocks from structures, with some manual mappings.

MoreJSEvents.structureLoad((e) => {
  // Manually map some removed blocks to other ones.
  const mapping = {
    // Present in idas:enchanting_tower
    'ars_nouveau:alchemical_sourcelink': 'starbunclemania:fluid_sourcelink',
  }
  Ingredient.of(global.REMOVED_ITEMS)
    .itemIds.map((id) => {
      return Item.of(id).item.block?.id
    })
    .filter((blockId) => {
      return blockId !== 'undefined' // lmao what even
    })
    .forEach((blockId) => {
      if (!(blockId in mapping)) {
        mapping[blockId] = 'minecraft:air'
      }
    })
  e.forEachPalettes((p) => {
    p.forEach((block) => {
      if (block.id in mapping) {
        block.setBlock(mapping[block.id])
      }
    })
  })
})
