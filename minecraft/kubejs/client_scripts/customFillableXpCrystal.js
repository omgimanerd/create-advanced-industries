// priority: 100

/**
 * @param {number} x
 * @returns {string}
 */
const formatXp = (x) => {
  if (x < 1000) return x.toString()
  const t = x % 1000 === 0 ? `${x / 1000}.00` : `${x / 1000}0`
  return t.substring(0, t.indexOf('.') + 3) + 'k'
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

// Register the XP Crystal Holding enchantment recipe in JEI.
JEIAddedEvents.registerRecipes((e) => {
  /**
   * @param {any[]} l
   */
  const wrapList = (l) => {
    l = Array.isArray(l) ? l : [l]
    const r = Utils.newList()
    l.forEach((v) => r.add(v))
    return r
  }

  /**
   * @param {Internal.ItemStack_} itemStack
   * @param {Internal.List} books
   * @param {Internal.List} results
   * @returns {Internal.IJeiAnvilRecipe_}
   */
  const createAnvilRecipe = (itemStack, books, results) => {
    return e.data
      .getVanillaRecipeFactory()
      [
        'createAnvilRecipe(net.minecraft.world.item.ItemStack,java.util.List,' +
          'java.util.List)'
      ](itemStack, books, results)
  }

  const holdingBooks = Utils.newList()
  const resultingItems = Utils.newList()
  for (let i = 1; i <= 4; ++i) {
    holdingBooks.add(
      Item.of('minecraft:enchanted_book').enchant('cofh_core:holding', i)
    )
    resultingItems.add(
      Item.of('kubejs:xp_crystal').enchant('cofh_core:holding', i)
    )
  }

  e.register(
    'minecraft:anvil',
    wrapList(
      createAnvilRecipe(
        Item.of('kubejs:xp_crystal'),
        holdingBooks,
        resultingItems
      )
    )
  )
})
