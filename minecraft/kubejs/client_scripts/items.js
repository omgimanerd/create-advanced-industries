// priority: 0

ClientEvents.lang('en_us', (e) => {
  // The TFMG plastic sheet will be used as the primary liquid plastic output
  // and can be cut into the Pneumaticcraft plastic sheets.
  e.renameItem('tfmg:plastic_sheet', 'Plastic')

  // Reuse the textures from Create Crafts & Additions for the Create: New Age
  // wire spools
  e.renameItem('createaddition:iron_wire', 'Overcharged Iron Wire')
  e.renameItem('createaddition:gold_wire', 'Overcharged Gold Wire')
})

ItemEvents.tooltip((e) => {
  e.add('kubejs:blaze_milk_bucket', 'Where did you even milk this from?')

  // Update tooltips for Tom's Simple Storage Mod with pack specific overrides.
  e.addAdvanced('toms_storage:ts.inventory_cable_connector', (_, __, text) => {
    const textSize = text.size()
    console.log(text)
    if (e.shift && textSize > 1) {
      for (let i = textSize - 2; i >= 1; --i) {
        text.remove(i)
      }
      text.add(1, 'Connects the inventory to the Inventory Network.')
      text.add(2, 'Or gives access to the Network.')
      text.add(3, 'Required to connect terminals.')
      text.add(4, 'Linking to other cable connectors is disabled.')
    }
  })
  e.addAdvanced('toms_storage:ts.adv_wireless_terminal', (_, __, text) => {
    const textSize = text.size()
    if (e.shift && textSize > 1) {
      for (let i = textSize - 3; i >= 1; --i) {
        text.remove(i)
      }
      text.add(1, 'Shift right click a terminal to bind it. Range: 64 blocks')
      text.add(2, "The terminal's chunk must be loaded.")
      text.add(
        3,
        'Build a level 4 beacon in an 8 block radius of the bound terminal ' +
          'to make it accessible from anywhere in the same dimension.'
      )
    }
  })
})

// const $IRecipeRegistration = Java.loadClass(
//   'mezz.jei.api.registration.IRecipeRegistration'
// )
// const $EnchantmentHelper = Java.loadClass(
//   'net.minecraft.world.item.enchantment.EnchantmentHelper'
// )
// const $EnchantmentCategory = Java.loadClass(
//   'net.minecraft.world.item.enchantment.EnchantmentCategory'
// )

// function getPrivateField(obj, field) {
//   let classField = obj.class.getDeclaredField(field)
//   classField.setAccessible(true)
//   return classField.get(obj)
// }

// JEIEvents.information((event) => {
//   /** @type {Internal.IRecipeRegistration} */
//   let registration = getPrivateField(event, 'registration') // This is a hack to grab registration
//   let allItems = registration.ingredientManager.allItemStacks
//   let vanillaRecipeFactory = registration.vanillaRecipeFactory
//   let anvilRecipeType = registration.jeiHelpers.getRecipeType('anvil').get()
//   let enchantCategoryFood = $EnchantmentCategory.valueOf('food')
//   /** @type {Internal.ItemStack[]} */
//   let enchantableFood = allItems
//     .stream()
//     .filter((stack) => enchantCategoryFood.canEnchant(stack.item))
//     .toArray()
//   /** @type {Internal.Enchantment} */
//   let nutriEnchant = Utils.getRegistry('enchantment').getValue(
//     'kubejs:nutrient_infusion'
//   )
//   let recipes = Utils.newList()
//   enchantableFood.forEach((stack) => {
//     let books = Utils.newList()
//     let enchantedFoods = Utils.newList()
//     for (
//       let index = nutriEnchant.minLevel;
//       index <= nutriEnchant.maxLevel;
//       index++
//     ) {
//       let currentBook = Item.of('minecraft:enchanted_book').enchant(
//         'kubejs:nutrient_infusion',
//         index
//       )
//       let newItem = stack.copy()
//       books.add(currentBook)
//       let bookEnchantments = $EnchantmentHelper.getEnchantments(currentBook)
//       $EnchantmentHelper.setEnchantments(bookEnchantments, newItem)
//       enchantedFoods.add(newItem)
//     }
//     recipes.add(
//       vanillaRecipeFactory[
//         'createAnvilRecipe(net.minecraft.world.item.ItemStack,java.util.List,java.util.List)'
//       ](stack, books, enchantedFoods)
//     )
//   })
//   registration.addRecipes(anvilRecipeType, recipes)
// })
