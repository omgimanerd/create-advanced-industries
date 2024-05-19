// priority: 100

/**
 * @type {Internal.CapabilityFluid$FluidIOItemStack}
 */
global.customXpCrystalOnFill = (itemStack, fluidStack, simulate) => {
  const capacity = global.customXpCrystalCapacity(itemStack)
  const xp = global.customXpCrystalContents(itemStack)
  const remainingXp = capacity - xp
  const fillAmount = Math.min(remainingXp, fluidStack.amount)
  if (!simulate) {
    if (!itemStack.nbt) itemStack.setNbt({ Xp: 0 })
    // Use putInt specifically so that the resulting data type is an int.
    itemStack.nbt.putInt('Xp', xp + fillAmount)
  }
  return fillAmount
}

/**
 * @type {Internal.CapabilityFluid$FluidIOItemStack}
 */
global.customXpCrystalOnDrain = (itemStack, resource, simulate) => {
  if (resource.amount === 0) return 0
  const xp = global.getXpCrystalContents(itemStack)
  const drainAmount = Math.min(xp, resource.amount)
  if (!simulate) {
    if (!itemStack.nbt) itemStack.setNbt({ Xp: 0 })
    itemStack.nbt.putInt('Xp', xp - drainAmount)
  }
  return drainAmount
}

/**
 * Right click event handler for the XP crystal.
 * @param {Internal.ItemClickedEventJS}
 */
ItemEvents.rightClicked('kubejs:xp_crystal', (e) => {
  const { player, item } = e
  if (player.isFake()) return

  const crystalCapacity = global.customXpCrystalCapacity(item)
  const crystalXp = global.customXpCrystalContents(item)
  // The numerical level of the player
  const playerLevel = player.xpLevel
  // The total XP points required to be at the level threshold
  const xpAtCurrentLevel = global.levelToXp(playerLevel)
  // The extra XP points the player has past the level threshold
  const xpPastCurrentLevel = player.xp
  // Is the player exactly at the level threshold?
  const isExactlyAtLevel = player.xp === 0

  if (player.shiftKeyDown) {
    // On right click action, if the player is crouching, take out 1 level or
    // fill them the rest of the way to the next level.
    if (crystalXp <= 0) return
    const xpNeededToLevel = player.xpNeededForNextLevel - xpPastCurrentLevel
    const xpExtracted = Math.min(xpNeededToLevel, crystalXp)
    if (xpExtracted < xpNeededToLevel) {
      // Crystal does not have enough xp to level the player. Add whatever is
      // left in the crystal, prone to floating point error.
      //
      // player.setXp takes a argument representing the TOTAL experience
      player.addXP(xpExtracted)
    } else {
      // Crystal has enough to level up the player. Set the level directly to
      // avoid floating point error.
      player.setXpLevel(playerLevel + 1) // also sets the level progress to 0
    }
    if (!item.nbt) item.setNbt({ Xp: 0 })
    item.nbt.putInt('Xp', crystalXp - xpExtracted)
  } else {
    // Otherwise, deposit 1 level or the player's current level progress.
    if (playerLevel === 0 && xpPastCurrentLevel == 0) return
    let playerXpToDeposit
    if (isExactlyAtLevel) {
      playerXpToDeposit = global.xpToNextLevel(playerLevel - 1)
    } else {
      playerXpToDeposit = xpPastCurrentLevel
    }
    const remainingSpace = crystalCapacity - crystalXp
    const xpDeposited = Math.min(playerXpToDeposit, remainingSpace)
    if (xpDeposited < playerXpToDeposit) {
      // Crystal does not have enough space for the XP. Subtract whatever
      // capacity is left, prone to floating point error.
      //
      // player.setXp takes a argument representing the TOTAL experience
      player.setXp(xpAtCurrentLevel + xpPastCurrentLevel - xpDeposited)
    } else {
      // Crystal has enough space for the XP
      if (isExactlyAtLevel) {
        player.setXpLevel(playerLevel - 1)
      } else {
        player.setXpLevel(playerLevel)
      }
    }
    if (!item.nbt) item.setNbt({ Xp: 0 })
    item.nbt.putInt('Xp', crystalXp + xpDeposited)
  }
})
