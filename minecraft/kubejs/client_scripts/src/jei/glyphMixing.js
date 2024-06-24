// priority: 0
// Recategorizes the custom mixing recipes for Ars Nouveau glyph crafting so
// that they don't clutter JEI.

JEIAddedEvents.registerCategories((e) => {
  // The Mixing recipe category, contains the code that performs the actual
  // rendering of the recipe inputs and outputs in JEI
  const $MixingCategory = Java.loadClass(
    'com.simibubi.create.compat.jei.category.MixingCategory'
  )

  // RecipeType and the actual underlying Mixing recipe. Needed to create a
  // RecipeType for the custom category registration.
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $MixingRecipe = Java.loadClass(
    'com.simibubi.create.content.kinetics.mixer.MixingRecipe'
  )
  const $Info = Java.loadClass(
    'com.simibubi.create.compat.jei.category.CreateRecipeCategory$Info'
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  // MixingCategory needs a reference to the background IDrawable.
  const background = guiHelper.createBlankDrawable(177, 103)
  // Create a concrete instance of the basin mixing recipe category and
  // defer our custom category to use its rendering code.
  const mixingCategory = $MixingCategory.standard(
    // Don't actually need any of the subfields, just need an instance of
    // MixingCategory to call its lookup and draw handler.
    new $Info(null, null, background, null, null, null)
  )
  e.wrap(
    $RecipeType.create('kubejs', 'glyph_mixing', $MixingRecipe),
    mixingCategory,
    (category) => {
      category
        .title('Automated Glyph Crafting')
        .background(background)
        .icon(
          doubleItemIcon('create:mechanical_mixer', 'ars_nouveau:glyph_craft')
        )
        .isRecipeHandled(() => true) // Only relevant recipes are registered
    }
  )
})

JEIAddedEvents.onRuntimeAvailable((e) => {
  const { recipeManager } = e.data
  // Move all custom glyph mixing recipes from the Create mixer category
  // to the custom glyph mixing category.
  const glyphMixingRecipes = recipeManager
    .createRecipeLookup('create:mixing')
    .get()
    .filter((recipe) => {
      return recipe.getId().toString().startsWith('kubejs:mixing_glyph_')
    })
    .toList()
  recipeManager.hideRecipes('create:mixing', glyphMixingRecipes)
  recipeManager.addRecipes('kubejs:glyph_mixing', glyphMixingRecipes)
})

JEIAddedEvents.registerRecipeCatalysts((e) => {
  e.data.addRecipeCatalyst('create:mechanical_mixer', 'kubejs:glyph_mixing')
  e.data.addRecipeCatalyst('create:basin', 'kubejs:glyph_mixing')
  e.data.addRecipeCatalyst('ars_nouveau:scribes_table', 'kubejs:glyph_mixing')
})
