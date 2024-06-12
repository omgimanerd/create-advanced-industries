// priority: 0

;(() => {
  // Currently does not work
  //
  // const $IJeiAnvilRecipe = Java.loadClass(
  //   'mezz.jei.api.recipe.vanilla.IJeiAnvilRecipe'
  // )
  // const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')

  // const nutrientInfusionRecipeType = $RecipeType.create(
  //   'kubejs',
  //   'nutrient_infusion',
  //   $IJeiAnvilRecipe
  // )

  // JEIAddedEvents.registerCategories((e) => {
  //   const guiHelper = e.data.jeiHelpers.guiHelper
  //   e.register(nutrientInfusionRecipeType, (category) => {
  //     category
  //       .title('Nutrient Infusion')
  //       .icon(
  //         guiHelper.createDrawableItemStack('minecraft:enchanted_golden_apple')
  //       )
  //       .isRecipeHandled(() => true)
  //       .setDrawHandler()
  //   })
  // })

  JEIAddedEvents.registerRecipes((e) => {
    const { ingredientManager, jeiHelpers, vanillaRecipeFactory } = e.data

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
    let recipes = Utils.newList()
    ingredientManager.allItemStacks
      .stream()
      .filter((itemStack) => {
        return (
          itemStack.isEdible() && itemStack.id !== 'artifacts:eternal_steak'
        )
      })
      .forEach((itemStack) => {
        recipes.add(
          createAnvilRecipe(
            itemStack,
            nutrientInfusionBooks,
            getEnchantedFoodResults(itemStack)
          )
        )
      })
    e.register(jeiHelpers.getRecipeType('anvil').get(), recipes)
  })
})()
