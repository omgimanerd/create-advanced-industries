// priority: 100

const $HoldingEnchantment = Java.loadClass(
  'cofh.core.common.enchantment.HoldingEnchantment'
)

/**
 * https://minecraft.fandom.com/wiki/Experience#Leveling_up
 * @param {number} level
 * @returns {number}
 */
global.levelToXp = (level) => {
  if (level <= 15) {
    return (level ** 2) + (6 * level) // prettier-ignore
  }
  if (level <= 30) {
    return 2.5 * (level ** 2) - (40.5 * level) + 360 // prettier-ignore
  }
  return 4.5 * (level ** 2) - (162.5 * level) + 2220 // prettier-ignore
}

/**
 * https://minecraft.fandom.com/wiki/Experience#Leveling_up
 * @param {number} level
 * @returns {number}
 */
global.xpToNextLevel = (level) => {
  if (level <= 15) return 2 * level + 7
  if (level <= 30) return 5 * level - 38
  return 9 * level - 158
}

/**
 * Helper method to get the amount of XP in the custom XP Crystal.
 * @param {$ItemStack_} itemStack
 * @returns {number}
 */
global.customXpCrystalCapacity = (itemStack) => {
  if (itemStack.enchantments === null) return 10000
  const holding = itemStack.enchantments.getOrDefault('cofh_core:holding', 0)
  return 10000 + holding * 5000
}

/**
 * Helper method to get the amount of XP in the custom XP Crystal.
 * @param {$ItemStack_} itemStack
 * @returns {number}
 */
global.customXpCrystalContents = (itemStack) => {
  if (itemStack.nbt === null) return 0
  return itemStack.nbt.getInt('Xp') ?? 0
}

StartupEvents.postInit(() => {
  // Allow the item to take the holding enchantment
  $HoldingEnchantment.addValidItem('kubejs:xp_crystal')
})

StartupEvents.registry('item', (e) => {
  let capability = CapabilityBuilder.FLUID.customItemStack()
    .acceptFluid('create_enchantment_industry:experience')
    .getCapacity(global.customXpCrystalCapacity)
    .onFill((container, resource, simulate) => {
      if (global.customXpCrystalOnFill) {
        return global.customXpCrystalOnFill(container, resource, simulate)
      }
      return 0
    })
  // Drain handler causes a crash.
  //   .onDrain((container, resource, simulate) => {
  //     if (global.customXpCrystalOnDrain) {
  //       return global.customXpCrystalOnDrain(container, resource, simulate)
  //     }
  //     return 0
  //   })
  e.create('kubejs:xp_crystal')
    // Model JSON directly copied from COFH Core's GitHub
    .modelJson({
      parent: 'minecraft:item/generated',
      textures: {
        layer0: 'thermal:item/xp_crystal_0',
      },
      overrides: [
        {
          predicate: {
            stored: 0.0,
          },
          model: 'thermal:item/xp_crystal_0',
        },
        {
          predicate: {
            stored: 0.00001,
          },
          model: 'thermal:item/xp_crystal_1',
        },
        {
          predicate: {
            stored: 0.25,
          },
          model: 'thermal:item/xp_crystal_2',
        },
        {
          predicate: {
            stored: 0.5,
          },
          model: 'thermal:item/xp_crystal_3',
        },
        {
          predicate: {
            stored: 0.75,
          },
          model: 'thermal:item/xp_crystal_4',
        },
      ],
    })
    .unstackable()
    .displayName('Insightful Crystal')
    .barWidth((/** @type {$ItemStack_} */ itemstack) => {
      const capacity = global.customXpCrystalCapacity(itemstack)
      const xp = global.customXpCrystalContents(itemstack)
      // Any value greater than 13 will not show the durability bar. A fully
      // empty crystal and a fully filled crystal will not show the bar.
      if (xp == 0 || xp == capacity) return 14
      return Math.round((xp / capacity) * 13)
    })
    .barColor(() => Color.GREEN)
    // Forge capabilities to allow the item crystal to be filled with CEI exp.
    .attachCapability(capability)
})

ItemEvents.modelProperties((e) => {
  // Set the model properties based on the fill level, so that the texture of
  // the item changes as it fills.
  e.register(
    'kubejs:xp_crystal',
    new ResourceLocation('stored'),
    /** @type {$ClampedItemPropertyFunction_} */
    (itemStack) => {
      if (!itemStack.nbt) return 0
      return (
        global.customXpCrystalContents(itemStack) /
        global.customXpCrystalCapacity(itemStack)
      )
    }
  )
})
