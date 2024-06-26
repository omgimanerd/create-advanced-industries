// priority: 1000

// Useful class from Create to generate custom double item icons.
const $DoubleItemIcon = Java.loadClass(
  'com.simibubi.create.compat.jei.DoubleItemIcon'
)

/**
 * @param {Internal.ItemStack_} big
 * @param {Internal.ItemStack_} small
 * @returns {Internal.IDrawable_}
 */
const doubleItemIcon = (big, small) => {
  return new $DoubleItemIcon(
    () => (typeof big === 'string' ? Item.of(big) : big),
    () => (typeof small === 'string' ? Item.of(small) : small)
  )
}
