// priority: 0

JEIAddedEvents.registerCategories((e) => {
  // The vanilla Anvil recipe category, contains the code that performs the
  // actual rendering of the recipe inputs and outputs in JEI.
  const $AnvilRecipeCategory = Java.loadClass(
    'mezz.jei.library.plugins.vanilla.anvil.AnvilRecipeCategory'
  )

  // RecipeType and the actual underlying processing recipe. Needed to create a
  // RecipeType for the custom category registration.
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $IJeiAnvilRecipe = Java.loadClass(
    'mezz.jei.api.recipe.vanilla.IJeiAnvilRecipe'
  )
  const nutrientInfusionRecipeType = $RecipeType.create(
    'kubejs',
    'nutrient_infusion',
    $IJeiAnvilRecipe
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  // Create an concrete instance of the anvil recipe category and defer our
  // custom category to use its render code.
  const anvilRecipeCategory = new $AnvilRecipeCategory(guiHelper)

  e.wrap(nutrientInfusionRecipeType, anvilRecipeCategory, (category) => {
    category
      .title('Nutrient Infusion')
      .background(anvilRecipeCategory.getBackground())
      .icon(
        doubleItemIcon('minecraft:anvil', 'minecraft:enchanted_golden_apple')
      )
      .isRecipeHandled(() => true)
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
   * @param {Internal.ItemStack} itemStack
   * @param {Internal.List} books
   * @param {Internal.List} results
   * @returns {Internal.IJeiAnvilRecipe}
   */
  const createAnvilRecipe = (itemStack, books, results) => {
    return vanillaRecipeFactory[
      'createAnvilRecipe(net.minecraft.world.item.ItemStack,java.util.List,' +
        'java.util.List)'
    ](itemStack, books, results)
  }

  // TODO remove recipes from anvil category
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
      return itemStack.isEdible() && itemStack.id !== 'artifacts:eternal_steak'
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

JEIAddedEvents.registerRecipeCatalysts((e) => {
  for (let level = 5; level >= 1; --level) {
    e.data.addRecipeCatalyst(
      Item.of('enchanted_book').enchant('kubejs:nutrient_infusion', level),
      'kubejs:nutrient_infusion'
    )
  }
  e.data.addRecipeCatalyst('minecraft:anvil', 'kubejs:nutrient_infusion')
})
