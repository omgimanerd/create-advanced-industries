// priority: 0

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  // Create: Sweets and Treats Brownies don't work. Add them ourself.
  registerItem('kubejs:uncooked_brownie')
  registerItem('kubejs:brownie').food((food) => {
    food
      .hunger(8)
      .saturation(0.66) // 8 * 0.66 = 6.33 saturation
      .eaten((e) => {
        if (e.player) {
          e.player.giveInHand('createsweetsandtreets:brass_cake_pan')
        }
      })
  })
})

// Nerf the saturation values of Create: Sweets and Treats because otherwise
// they make Remy the Amethyst Golem shit his pants.
ItemEvents.modification((e) => {
  // Saturation is computed as a multiplier of the food's base hunger value
  const foodOverrides = {
    // Default hunger of 2, saturation = 2 * 0.5 = 1
    'createsweetsandtreets:sugar_cookie': { saturation: 0.5 },
    // Default hunger of 8, saturation = 8 * 0.66 = 6.33
    'createsweetsandtreets:donut': { saturation: 0.66 },
    // Default hunger of 8, saturation = 8 * 1 = 8
    'createsweetsandtreets:apple_donut': { saturation: 1 },
    // Default hunger of 8, saturation = 8 * 1 = 8
    'createsweetsandtreets:chocolatedonut': { saturation: 1 },
    // Default hunger of 8, saturation = 8 * 1 = 8
    'createsweetsandtreets:sweet_donut': { saturation: 1 },
    // Default hunger of 6, saturation = 6 * 1 = 6
    'createsweetsandtreets:apple_pie': { saturation: 1 },
    // Default hunger of 8, saturation = 8 * 1 = 8
    'createsweetsandtreets:chocolate_pie': { saturation: 1 },
    // Default hunger of 4, saturation = 4 * 1 = 4
    'createsweetsandtreets:honey_pie': { saturation: 1 },
  }
  for (const [food, override] of Object.entries(foodOverrides)) {
    e.modify(food, (item) => {
      item.foodProperties = (food) => {
        if (override.hunger !== undefined) {
          food.hunger(override.hunger)
        }
        if (override.saturation !== undefined) {
          food.saturation(override.saturation)
        }
      }
    })
  }
})
