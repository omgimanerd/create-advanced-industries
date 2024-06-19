// priority: 0
// Create a custom JEI category for time pouch crafting.

;(() => {
  const $ManualApplicationRecipe = Java.loadClass(
    'com.simibubi.create.content.kinetics.deployer.ManualApplicationRecipe'
  )
  const $ProcessingRecipeBuilder = Java.loadClass(
    'com.simibubi.create.content.processing.recipe.ProcessingRecipeBuilder'
  )

  JEIAddedEvents.registerCategories((e) => {
    // The Manual Application recipe category, contains the code the performs
    // the actual rendering of the recipe inputs and outputs in JEI
    const $ItemApplicationCategory = Java.loadClass(
      'com.simibubi.create.compat.jei.category.ItemApplicationCategory'
    )

    // RecipeType and the underlying ItemApplication recipe. Needed to create a
    // RecipeType for the custom category registration.
    const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
    const $Info = Java.loadClass(
      'com.simibubi.create.compat.jei.category.CreateRecipeCategory$Info'
    )

    const guiHelper = e.data.jeiHelpers.guiHelper
    // ItemApplicationCategory needs a reference to the background IDrawable
    const background = guiHelper.createBlankDrawable(177, 60)
    const timePouchCraftingCategory = new $ItemApplicationCategory(
      // Don't actually need any of the subfields, just need an instance of
      // ItemApplicationCategory to call its lookup and draw handler.
      $Info(null, null, background, null, null, null)
    )
    e.wrap(
      $RecipeType.create(
        'kubejs',
        'time_pouch_crafting',
        $ManualApplicationRecipe
      ),
      timePouchCraftingCategory,
      (category) => {
        category
          .title('Time Pouch Crafting')
          .background(background)
          .icon(guiHelper.createDrawableItemStack('gag:time_sand_pouch'))
          .isRecipeHandled(() => true)
      }
    )
  })

  JEIAddedEvents.registerRecipes((e) => {
    const { ingredientManager } = e.data

    // let p = new $ProcessingRecipeBuilder(
    //   $ManualApplicationRecipe,
    //   new ResourceLocation('kubejs:test_recipe')
    // )
    // console.log(p.ingredients)
    // console.log(p.results)

    // e.custom('kubejs:time_pouch_crafting').add()

    // TODO implement time pouch crafting rendering with item application recipes
  })

  JEIAddedEvents.registerRecipeCatalysts((e) => {
    e.data.addRecipeCatalyst(
      'gag:time_sand_pouch',
      'kubejs:time_pouch_crafting'
    )
  })
})()
