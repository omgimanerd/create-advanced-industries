// priority: 0
// Recategorizes the custom brewing and centrifugation recipes so that potion
// recipes don't clutter JEI.

;(() => {
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $CentrifugationCategory = Java.loadClass(
    'com.negodya1.vintageimprovements.compat.jei.category.CentrifugationCategory'
  )
  const $CentrifugationRecipe = Java.loadClass(
    'com.negodya1.vintageimprovements.content.kinetics.centrifuge.CentrifugationRecipe'
  )
  const $Info = Java.loadClass(
    'com.simibubi.create.compat.jei.category.CreateRecipeCategory$Info'
  )

  // Create the recipe type and use it to to register a custom category and
  // regroup potion centrifugation.
  const potionCentrifugationRecipeType = $RecipeType.create(
    'kubejs',
    'potion_centrifuging',
    $CentrifugationRecipe
  )

  JEIAddedEvents.registerCategories((e) => {
    const guiHelper = e.data.jeiHelpers.guiHelper

    const centrifugationCategory = new $CentrifugationCategory(
      // Don't actually need any of the subfields, just need an instance of
      // CentrifugationCategory to call its lookup and draw handler.
      new $Info(null, null, null, null, null, null)
    )
    e.register(potionCentrifugationRecipeType, (category) => {
      category
        .title('Potion Centrifugation')
        .background(guiHelper.createBlankDrawable(177, 113))
        .icon(guiHelper.createDrawableItemStack('kubejs:inert_potion_residue'))
        .isRecipeHandled(() => true)
        .handleLookup((builder, recipe, focuses) => {
          centrifugationCategory.setRecipe(builder, recipe, focuses)
        })
        .setDrawHandler(
          (recipe, recipeSlotsView, guiGraphics, mouseX, mouseY) => {
            centrifugationCategory.draw(
              recipe,
              recipeSlotsView,
              guiGraphics,
              mouseX,
              mouseY
            )
          }
        )
    })
  })

  JEIAddedEvents.onRuntimeAvailable((e) => {
    const { recipeManager, jeiHelpers } = e.data

    // Store a dictionary of all recipe types for easy access later.
    const recipeTypes = {}
    jeiHelpers.allRecipeTypes.forEach((recipeType) => {
      recipeTypes[`${recipeType.getUid().toString()}`] = recipeType
    })

    // Move all custom potion brewing recipes from the Create mixer category to
    // Create automated brewing.
    const customBrewingRecipes = recipeManager
      .createRecipeLookup(recipeTypes['create:mixing'])
      .get()
      .filter((recipe) => {
        return recipe
          .getId()
          .toString()
          .startsWith('kubejs:create_potion_mixing')
      })
      .toList()
    recipeManager.hideRecipes(
      recipeTypes['create:mixing'],
      customBrewingRecipes
    )
    recipeManager.addRecipes(
      recipeTypes['create:automatic_brewing'],
      customBrewingRecipes
    )

    // Move all potion centrifugation recipes from the CVI category to the new
    // custom category.
    const customCentrifugationRecipes = recipeManager
      .createRecipeLookup(recipeTypes['vintageimprovements:centrifugation'])
      .get()
      .filter((recipe) => {
        return recipe
          .getId()
          .toString()
          .startsWith('kubejs:create_potion_centrifuging')
      })
      .toList()
    recipeManager.hideRecipes(
      recipeTypes['vintageimprovements:centrifugation'],
      customCentrifugationRecipes
    )
    recipeManager.addRecipes(
      potionCentrifugationRecipeType,
      customCentrifugationRecipes
    )
  })

  JEIAddedEvents.registerRecipeCatalysts((e) => {
    // Store a dictionary of all recipe types for easy access later.
    const recipeTypes = {}
    e.data.jeiHelpers.allRecipeTypes.forEach((recipeType) => {
      recipeTypes[`${recipeType.getUid().toString()}`] = recipeType
    })

    e.data.addRecipeCatalyst('kubejs:inert_potion_residue', [
      potionCentrifugationRecipeType,
      recipeTypes['vintageimprovements:centrifugation'],
    ])
  })
})()
