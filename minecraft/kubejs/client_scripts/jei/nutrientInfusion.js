// priority: 0

JEIAddedEvents.registerCategories((e) => {
  // The vanilla Anvil recipe category, contains the code that performs the
  // actual rendering of the recipe inputs and outputs in JEI.
  const $AnvilRecipeCategory = Java.loadClass(
    'mezz.jei.library.plugins.vanilla.anvil.AnvilRecipeCategory'
  )

  // RecipeType and the actual underlying processing recipe. Needed to create a
  // RecipeType for the custom category registration.
  // const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  // const $IJeiAnvilRecipe = Java.loadClass(
  //   'mezz.jei.api.recipe.vanilla.IJeiAnvilRecipe'
  // )
  // const nutrientInfusionRecipeType = $RecipeType.create(
  //   'kubejs',
  //   'nutrient_infusion',
  //   $IJeiAnvilRecipe
  // )

  const guiHelper = e.data.jeiHelpers.guiHelper
  // Create an concrete instance of the anvil recipe category and defer our
  // custom category to use its render code.
  const anvilRecipeCategory = new $AnvilRecipeCategory(guiHelper)

  e.custom('kubejs:nutrient_infusion', (category) => {
    category
      .title('Nutrient Infusion')
      .background(
        guiHelper.createBlankDrawable(
          anvilRecipeCategory.getWidth(),
          anvilRecipeCategory.getHeight()
        )
      )
      .icon(
        doubleItemIcon('minecraft:anvil', 'minecraft:enchanted_golden_apple')
      )
      .isRecipeHandled(() => true)
      .handleLookup((builder, recipe, focuses) => {
        // TODO currently broken: anvilRecipeCategory.createRecipeExtras needs
        // to be called in order to draw the arrow and experience costs.
        anvilRecipeCategory.setRecipe(builder, recipe, focuses)
      })
      .setDrawHandler((recipe, slots, graphics, mouseX, mouseY) => {
        anvilRecipeCategory.draw(recipe, slots, graphics, mouseX, mouseY)
      })
  })
})

JEIAddedEvents.registerRecipes((e) => {
  const { ingredientManager, vanillaRecipeFactory } = e.data

  /**
   * @param {any[]} l
   */
  const wrapList = (l) => {
    l = Array.isArray(l) ? l : [l]
    const r = Utils.newList()
    l.forEach((v) => r.add(v))
    return r
  }

  /**
   * @param {Internal.ItemStack_} itemStack
   * @param {Internal.List} books
   * @param {Internal.List} results
   * @returns {Internal.IJeiAnvilRecipe_}
   */
  const createAnvilRecipe = (itemStack, books, results) => {
    return vanillaRecipeFactory[
      'createAnvilRecipe(net.minecraft.world.item.ItemStack,java.util.List,' +
        'java.util.List)'
    ](itemStack, books, results)
  }

  // Logic to register anvil recipes for Nutrient Infusion enchants on food.
  const nutrientInfusionBooks = wrapList(
    Array(5)
      .fill(null)
      .map((_, i) => {
        return Item.of('minecraft:enchanted_book').enchant(
          'kubejs:nutrient_infusion',
          i + 1
        )
      })
  )
  const getEnchantedFoodResults = (itemStack) => {
    return wrapList(
      Array(5)
        .fill(null)
        .map((_, i) => {
          return itemStack.enchant('kubejs:nutrient_infusion', i + 1)
        })
    )
  }
  const recipes = ingredientManager.allItemStacks
    .stream()
    .filter((itemStack) => {
      return (
        itemStack.isEdible() &&
        itemStack.id !== 'artifacts:eternal_steak' &&
        itemStack.id !== 'artifacts:everlasting_beef'
      )
    })
    .map((itemStack) => {
      return createAnvilRecipe(
        itemStack,
        nutrientInfusionBooks,
        getEnchantedFoodResults(itemStack)
      )
    })
    .toList()
  e.register('kubejs:nutrient_infusion', recipes)
})

JEIAddedEvents.onRuntimeAvailable((e) => {
  // Get nutrient infusion anvil recipes that are in the default minecraft
  // anvil section and hide them. These are automatically generated for food
  // items that have a durability.
  const { recipeManager } = e.data
  const matchingAnvilRecipes = recipeManager
    .createRecipeLookup('minecraft:anvil')
    .get()
    .filter((recipe) => {
      for (let input of recipe.getRightInputs()) {
        if (
          input.id === 'minecraft:enchanted_book' &&
          input.enchantments.containsKey('kubejs:nutrient_infusion')
        ) {
          return true
        }
      }
      return false
    })
    .toList()
  recipeManager.hideRecipes('minecraft:anvil', matchingAnvilRecipes)
})

JEIAddedEvents.registerRecipeCatalysts((e) => {
  e.data[
    'addRecipeCatalysts(mezz.jei.api.recipe.RecipeType,net.minecraft.world.item.ItemStack[])'
  ]('kubejs:nutrient_infusion', [
    'minecraft:anvil',
    Item.of('minecraft:enchanted_book').enchant('kubejs:nutrient_infusion', 1),
    Item.of('minecraft:enchanted_book').enchant('kubejs:nutrient_infusion', 2),
    Item.of('minecraft:enchanted_book').enchant('kubejs:nutrient_infusion', 3),
    Item.of('minecraft:enchanted_book').enchant('kubejs:nutrient_infusion', 4),
    Item.of('minecraft:enchanted_book').enchant('kubejs:nutrient_infusion', 5),
  ])
})
