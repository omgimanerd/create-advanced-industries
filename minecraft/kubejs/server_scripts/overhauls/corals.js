// priority: 0
// Overhaul vanilla corals to be mineable by Create, and grindable into their
// respective dye colors.

LootJS.modifiers((e) => {
  Ingredient.of(
    /^minecraft:(tube|brain|bubble|fire|horn){0,1}_coral.*/
  ).itemIds.forEach((id) => {
    e.addBlockLootModifier(id)
      .or((or) => {
        // Create drills do not have a breaking entity, so this will match.
        or.not((n) => {
          n.entityPredicate(() => true)
        })
        // Allow regular silk touch behavior
        or.matchMainHand(ItemFilter.hasEnchantment('minecraft:silk_touch'))
      })
      .removeLoot(ItemFilter.ALWAYS_TRUE)
      .addLoot(id)
  })
})

ServerEvents.tags('item', (e) => {
  Ingredient.of(/^minecraft:dead_[a-z]+_coral(_fan){0,1}$/).itemIds.forEach(
    (id) => {
      e.add('kubejs:dead_coral', id)
    }
  )
  Ingredient.of(/^minecraft:dead_[a-z]+_coral_block$/).itemIds.forEach((id) => {
    e.add('kubejs:dead_coral_block', id)
  })
})

ServerEvents.recipes((e) => {
  const create = defineCreateRecipes(e)

  create.milling(
    ['tfmg:limesand', Item.of('tfmg:limesand').withChance(0.25)],
    '#kubejs:dead_coral'
  )
  create.milling(
    [Item.of('tfmg:limesand', 4), Item.of('tfmg:limesand').withChance(0.25)],
    '#kubejs:dead_coral_block'
  )

  const colorMap = {
    tube: 'minecraft:blue_dye',
    brain: 'minecraft:pink_dye',
    bubble: 'minecraft:magenta_dye',
    fire: 'minecraft:red_dye',
    horn: 'minecraft:yellow_dye',
  }

  for (const [coral, dye] of Object.entries(colorMap)) {
    create.milling(
      [dye, Item.of(dye).withChance(0.25)],
      `minecraft:${coral}_coral`
    )
    create.milling(
      [dye, Item.of(dye).withChance(0.25)],
      `minecraft:${coral}_coral_fan`
    )
    create.milling(
      [Item.of(dye, 4), Item.of(dye).withChance(0.25)],
      `minecraft:${coral}_coral_block`
    )
  }
})
