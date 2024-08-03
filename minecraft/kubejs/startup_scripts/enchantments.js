// priority: 1000

const $EnchantmentCategory = Java.loadClass(
  'net.minecraft.world.item.enchantment.EnchantmentCategory'
)

StartupEvents.registry('enchantment', (e) => {
  e.create('nutrient_infusion')
    // The min and max level are overridden by Apotheosis's configuration. The
    // configuration must also be changed to match these numbers.
    .minLevel(1) // This is overridden by Apotheosis's enchantments.cfg
    .maxLevel(5) // This is overridden by Apotheosis's enchantments.cfg
    .category(
      $EnchantmentCategory.create('food', (i) => {
        return (
          i.isEdible() &&
          i.id !== 'artifacts:eternal_steak' &&
          i.id !== 'artifacts:everlasting_beef'
        )
      })
    )
    .canEnchant((/** @type {Internal.ItemStack_} */ i) => {
      return (
        i.isEdible() &&
        i.id !== 'artifacts:eternal_steak' &&
        i.id !== 'artifacts:everlasting_beef'
      )
    })
    .displayName('Nutrient Infusion')
})
