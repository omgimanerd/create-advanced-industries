// priority: 0

StartupEvents.registry('item', (e) => {
  const registerItem = registerItem_(e)

  // Register an intermediate item for Create: Sweets and Treats brownie recipe.
  registerItem('kubejs:uncooked_brownie')
})

// Nerf the saturation values of Create: Sweets and Treats because otherwise
// they make Remy the Amethyst Golem shit his pants.
ItemEvents.modification((e) => {
  // Saturation is computed as a multiplier of the food's base nutrition value
  const foodOverrides = {
    // Default hunger of 8
    'createsweetsandtreets:unfinished_powdered_brownie': { saturation: 0.66 },
    // Default hunger of 2
    'createsweetsandtreets:sugar_cookie': { saturation: 0.5 },
    // Defualt hunger of 8
    'createsweetsandtreets:donut': { saturation: 0.66 },
    'createsweetsandtreets:apple_donut': { saturation: 1 },
    'createsweetsandtreets:chocolatedonut': { saturation: 1 },
    'createsweetsandtreets:sweet_donut': { saturation: 1 },
    // Default hunger of 6
    'createsweetsandtreets:apple_pie': { saturation: 1 },
    // Default hunger of 8
    'createsweetsandtreets:chocolate_pie': { saturation: 1 },
    // Default hunger of 4
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
