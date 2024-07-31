// priority: 100

/**
 * @type {Internal.CapabilityFluid$FluidIOItemStack_}
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
 * This is not implemented due to the fact that this causes a crash with Create
 * drains.
 * @type {Internal.CapabilityFluid$FluidIOItemStack_}
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
 *
 * There are several key nuances for this function to work. The ONLY reliable
 * information about the player level is what Minecraft stores:
 *   - player.experienceLevel: the numerical level on the exp  bar
 *   - player.experienceProgress: a float representing the fullness of the bar
 * Because of this adding and subtracting integer XP points may not level the
 * player even if the total XP point value equals the XP required at that level.
 *
 * A key example is the following commands, run with an empty XP bar
 *   /xp add @a 20 points
 *   /xp add @a -4 points
 * At 16 points, the player should be at level 2, but this will put the player
 * with a numerical level of 1, but with the XP bar filled due to floating point
 * error.
 *
 * Additionally, KubeJS attempts to store values like player.xp, which should
 * theoretically represent the total integral XP points that the player has, but
 * these get fucked if you mess with the player's level, and do not update
 * accordingly.
 *
 * As a consequence of this, the only reliable way to get the player's total XP
 * is to compute it yourself from player.experienceLevel and
 * player.experienceProgress. The only reliable way to set the player's level
 * and XP is to convert the given integral XP point value to the player level +
 * remaining XP.
 *
 * @param {Internal.ItemClickedEventJS_}
 */
ItemEvents.rightClicked('kubejs:xp_crystal', (e) => {
  const { player, item } = e
  if (player.isFake()) return
  if (!item.nbt) item.setNbt({ Xp: 0 })

  const crystalCapacity = global.customXpCrystalCapacity(item)
  const crystalXp = global.customXpCrystalContents(item)

  // The numerical level of the player
  const playerLevel = player.experienceLevel
  // The total XP points required to be at the player's numerical level
  const xpAtLevelThreshold = global.levelToXp(playerLevel)
  // The additional XP the player has
  const xpPastCurrentLevel = Math.round(
    player.experienceProgress * global.xpToNextLevel(playerLevel)
  )
  // The computed total XP points the player has. DO NOT USE player.xp
  const playerXp = xpAtLevelThreshold + xpPastCurrentLevel

  /**
   * Internal helper to set the player's level and XP progress given the total
   * numerical XP the player should have.
   * @param {number} xp
   */
  const setXp = (xp) => {
    const level = Math.floor(global.xpToLevel(xp))
    const xpAtLevel = global.levelToXp(level)
    player.setXpLevel(level)
    player.addXP(xp - xpAtLevel)
  }

  // If the player is crouching, take out XP from the crystal.
  if (player.shiftKeyDown) {
    // Crystal has no XP to extract.
    if (crystalXp <= 0) return
    // Take out 1 level or fill them the rest of the way to the next level.
    let xpNeededToLevel = global.xpToNextLevel(playerLevel) - xpPastCurrentLevel
    let xpExtracted = Math.min(xpNeededToLevel, crystalXp)
    setXp(playerXp + xpExtracted)
    item.nbt.putInt('Xp', crystalXp - xpExtracted)
  } else {
    if (playerXp === 0) return
    // Otherwise, deposit 1 level or the player's current level progress into
    // the crystal.
    let playerXpToDeposit =
      xpPastCurrentLevel === 0
        ? global.xpToNextLevel(playerLevel - 1)
        : xpPastCurrentLevel
    // Check if the crystal has enough space to hold the xp to deposit.
    let remainingSpace = crystalCapacity - crystalXp
    let xpDeposited = Math.min(playerXpToDeposit, remainingSpace)
    if (xpDeposited > 0) {
      setXp(playerXp - xpDeposited)
      item.nbt.putInt('Xp', crystalXp + xpDeposited)
    }
  }
  player.swing()
})
