// priority: 0
// Recategorizes the custom brewing and centrifugation recipes so that potion
// recipes don't clutter JEI.

JEIAddedEvents.registerCategories((e) => {
  // The Centrifugation recipe category, contains the code that performs the
  // actual rendering of the recipe inputs and outputs in JEI
  const $CentrifugationCategory = Java.loadClass(
    'com.negodya1.vintageimprovements.compat.jei.category.CentrifugationCategory'
  )

  // RecipeType and the actual underlying processing recipe. Needed to create a
  // RecipeType for the custom category registration.
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $CentrifugationRecipe = Java.loadClass(
    'com.negodya1.vintageimprovements.content.kinetics.centrifuge.CentrifugationRecipe'
  )
  const $Info = Java.loadClass(
    'com.simibubi.create.compat.jei.category.CreateRecipeCategory$Info'
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  // Create a concrete instance of the centrifugation recipe category and
  // defer our custom category to use its render code.
  const background = guiHelper.createBlankDrawable(177, 113)
  const centrifugationCategory = new $CentrifugationCategory(
    // Don't actually need any of the subfields, just need an instance of
    // CentrifugationCategory to call its lookup and draw handler.
    new $Info(null, null, background, null, null, null)
  )

  e.wrap(
    $RecipeType.create('kubejs', 'potion_centrifuging', $CentrifugationRecipe),
    centrifugationCategory,
    (category) => {
      category
        .title('Potion Centrifugation')
        .background(background)
        .icon(
          doubleItemIcon(
            'vintageimprovements:centrifuge',
            Item.of('minecraft:potion', '{Potion:"minecraft:healing"}')
          )
        )
        .isRecipeHandled(() => true) // Only relevant recipes are registered
    }
  )
})

JEIAddedEvents.onRuntimeAvailable((e) => {
  const { recipeManager } = e.data

  // Move all custom potion brewing recipes from the Create mixer category to
  // Create automated brewing.
  const customBrewingRecipes = recipeManager
    .createRecipeLookup('create:mixing')
    .get()
    .filter((recipe) => {
      return recipe.getId().toString().startsWith('kubejs:create_potion_mixing')
    })
    .toList()
  recipeManager.hideRecipes('create:mixing', customBrewingRecipes)
  recipeManager.addRecipes('create:automatic_brewing', customBrewingRecipes)

  // Move all potion centrifugation recipes from the CVI category to the new
  // custom category.
  const customCentrifugationRecipes = recipeManager
    .createRecipeLookup('vintageimprovements:centrifugation')
    .get()
    .filter((recipe) => {
      return recipe
        .getId()
        .toString()
        .startsWith('kubejs:create_potion_centrifuging')
    })
    .toList()
  recipeManager.hideRecipes(
    'vintageimprovements:centrifugation',
    customCentrifugationRecipes
  )
  recipeManager.addRecipes(
    'kubejs:potion_centrifuging',
    customCentrifugationRecipes
  )
})

JEIAddedEvents.registerRecipeCatalysts((e) => {
  e.data.addRecipeCatalyst(
    'vintageimprovements:centrifuge',
    'kubejs:potion_centrifuging'
  )
  e.data.addRecipeCatalyst('create:basin', 'kubejs:potion_centrifuging')
})
