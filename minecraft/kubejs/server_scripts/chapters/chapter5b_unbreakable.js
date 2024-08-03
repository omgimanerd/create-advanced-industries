// priority: 500
// Crafting the unbreakable charm.

ServerEvents.recipes((e) => {
  //  Whitelisted items that can be made unbreaking with the Codex Indestructia
  const whitelisted = {
    'tfmg:screwdriver': true,
    'kubejs:diamond_saw_blade': true,
    'minecraft:carrot_on_a_stick': true,
    'gag:escape_rope': true,
    'apotheosis:ender_lead': true,
    'minecraft:shears': true,
    'minecraft:flint_and_steel': true,
  }

  Ingredient.all.itemIds.forEach((id) => {
    const item = Item.of(id)
    if (!item.damageableItem) return

    // Add an unbreaking crafting recipe for all armors, tools, and whitelisted
    // items.
    let equippable = false
    for (const slot of ['chest', 'feet', 'head', 'legs']) {
      if (item.canEquip(slot, null)) {
        equippable = true
        break
      }
    }
    const isTool = item.hasTag('forge:tools')
    if (equippable || isTool || id in whitelisted) {
      // Output item is only for display in JEI. We need to add to the NBT
      // value in order to preserve the item's existing NBT.
      e.shapeless(item.withNBT({ Unbreakable: true }), [
        id,
        'kubejs:codex_indestructia',
      ]).modifyResult((grid) => {
        const outputItem = grid.find(id)
        outputItem.nbt.putBoolean('Unbreakable', true)
        return outputItem
      })
    }
  })

  e.recipes.ars_nouveau.enchanting_apparatus(
    [
      'minecraft:netherite_upgrade_smithing_template',
      enchantedBook('minecraft:unbreaking', 8),
      'minecraft:netherite_ingot',
      enchantedBook('minecraft:unbreaking', 8),
      'minecraft:netherite_upgrade_smithing_template',
      enchantedBook('minecraft:unbreaking', 8),
      'minecraft:netherite_ingot',
      enchantedBook('minecraft:unbreaking', 8),
    ],
    'minecraft:book',
    'kubejs:codex_indestructia',
    8000
  )
})
