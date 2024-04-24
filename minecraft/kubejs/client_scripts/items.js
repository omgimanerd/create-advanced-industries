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
