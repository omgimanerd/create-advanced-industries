// priority: 100
// Define the handler for milking a blaze after feeding it blaze cake.

/**
 * Callback handler for feeding and milking a blaze.
 */
ItemEvents.entityInteracted((e) => {
  const { hand, item, player, target, server } = e
  if (hand !== 'main_hand') return
  if (target.type !== 'minecraft:blaze') return
  if (
    item.id !== 'minecraft:bucket' &&
    item.id !== 'minecraft:lava_bucket' &&
    item.id !== 'create:blaze_cake'
  ) {
    return
  }

  let remainingMilks = target.persistentData.getInt('remaining_milks')
  // Feeding a blaze cake to the blaze.
  if (item.id === 'create:blaze_cake') {
    item.count--
    repeat(
      /*server*/ server,
      /*duration*/ 10,
      /*interval*/ 3,
      /*cb*/ () => {
        target.playSound('entity.generic.eat', /*volume=*/ 3, /*pitch=*/ 0)
      }
    )
    remainingMilks = Math.max(10, remainingMilks)
  }

  // Feeding lava to the blaze.
  if (item.id === 'minecraft:lava_bucket') {
    item.count--
    player.addItem(item.getCraftingRemainingItem())
    target.playSound(
      'entity.wandering_trader.drink_milk',
      /*volume=*/ 3,
      /*pitch=*/ 1
    )
    remainingMilks = Math.max(3, remainingMilks)
  }

  // Milking the blaze
  if (item.id === 'minecraft:bucket') {
    if (remainingMilks === 0) {
      target.playSound('entity.villager.ambient', /*volume=*/ 3, /*pitch=*/ 2)
    } else {
      item.count--
      remainingMilks--
      player.addItem('kubejs:blaze_milk_bucket')
      target.playSound('entity.cow.milk', /*volume=*/ 3, /*pitch=*/ 1)
    }
  }

  player.swing()
  target.persistentData.putInt('remaining_milks', remainingMilks)
  e.cancel()
})
