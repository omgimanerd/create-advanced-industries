// priority: 0

// Duplicate fluids or ones removed by the modpack.
const hiddenFluids = [
  'cofh_core:potion',
  'pneumaticcraft:oil',
  'pneumaticcraft:memory_essence',
  'sophisticatedcore:xp_still',
  'thermal:creosote',
  'thermal:crude_oil',
  'thermal:heavy_oil',
  'thermal:light_oil',
  'thermal:refined_fuel',
  'tfmg:liquid_plastic',
  'tfmg:molten_slag',
  'tfmg:gasoline',
  'tfmg:diesel',
  'tfmg:kerosene',
  'tfmg:naphtha',
  'tfmg:heavy_oil',
  'tfmg:lubrication_oil',
  'tfmg:cooling_fluid',
]

JEIEvents.addItems((e) => {
  e.add('thermal:drill_head')
  e.add('thermal:saw_blade')
})

JEIEvents.hideItems((e) => {
  // Defined in startup_scripts/removed_recipes.js
  if (global.hideJEI) {
    global.removedRecipes.forEach((r) => {
      if (r.output) {
        e.hide(r.output)
      }
    })
  }

  // Hide all the buckets for unused fluids.
  hiddenFluids.forEach((fluid) => {
    e.hide(`${fluid}_bucket`)
  })

  // Hide intermediate mechanism items.
  e.hide('kubejs:incomplete_andesite_mechanism')
  e.hide('kubejs:incomplete_copper_mechanism')
  e.hide('kubejs:incomplete_source_mechanism')
})

JEIEvents.addFluids((e) => {
  // Add the Create awkward potion so custom brewing recipes can be looked up.
  e.add(
    Fluid.of('create:potion').withNBT({
      Bottle: 'REGULAR',
      Potion: 'minecraft:awkward',
    })
  )
})

JEIEvents.hideFluids((e) => {
  hiddenFluids.forEach((fluid) => {
    e.hide(fluid)
  })
})

JEIEvents.removeCategories((e) => {
  e.remove('thermal:bottler')
  e.remove('thermal:furnace')
  e.remove('thermal:brewer')
  e.remove('jumbofurnace:jumbo_smelting')
  e.remove('jumbofurnace:jumbo_furnace_upgrade')
})

JEIAddedEvents.onRuntimeAvailable((e) => {
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $BasinRecipe = Java.loadClass(
    'com.simibubi.create.content.processing.basin.BasinRecipe'
  )
  const basinRecipeType = $RecipeType.create('create', 'mixing', $BasinRecipe)
  const automatedBrewing = $RecipeType.create(
    'create',
    'automatic_brewing',
    $BasinRecipe
  )

  // Move all custom potion brewing recipes from the Create mixer category to
  // Create automated brewing.
  const recipeManager = e.data.getRecipeManager()
  const customBrewingRecipes = Utils.newList()
  recipeManager
    .createRecipeLookup(basinRecipeType)
    .get()
    .forEach((recipe) => {
      if (recipe.getId().toString().startsWith('kubejs:create_potion_mixing')) {
        customBrewingRecipes.add(recipe)
      }
    })
  recipeManager.hideRecipes(basinRecipeType, customBrewingRecipes)
  recipeManager.addRecipes(automatedBrewing, customBrewingRecipes)
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
