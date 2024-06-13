// priority: 0
// Recategorizes the custom mixing recipes for Ars Nouveau glyph crafting so
// that they don't clutter JEI.

;(() => {
  // The Mixing recipe category, contains the code that performs the actual
  // rendering of the recipe inputs and outputs in JEI
  const $MixingCategory = Java.loadClass(
    'com.simibubi.create.compat.jei.category.MixingCategory'
  )

  // RecipeType and the actual underlying processing Recipe. Needed to create a
  // RecipeType for the custom category registration.
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $MixingRecipe = Java.loadClass(
    'com.simibubi.create.content.kinetics.mixer.MixingRecipe'
  )
  const $Info = Java.loadClass(
    'com.simibubi.create.compat.jei.category.CreateRecipeCategory$Info'
  )

  const glyphMixingRecipeType = $RecipeType.create(
    'kubejs',
    'glyph_mixing',
    $MixingRecipe
  )

  JEIAddedEvents.registerCategories((e) => {
    const guiHelper = e.data.jeiHelpers.guiHelper
    // MixingCategory needs a reference to the background IDrawable.
    const background = guiHelper.createBlankDrawable(177, 103)
    // Create a concrete instance of the basin mixing recipe category and
    // defer our custom category to use its rendering code.
    const glyphMixingCategory = $MixingCategory.standard(
      // Don't actually need any of the subfields, just need an instance of
      // MixingCategory to call its lookup and draw handler.
      new $Info(null, null, background, null, null, null)
    )
    e.register(glyphMixingRecipeType, (category) => {
      category
        .title('Automated Glyph Crafting')
        .background(background)
        .icon(
          doubleItemIcon('create:mechanical_mixer', 'ars_nouveau:glyph_craft')
        )
        .isRecipeHandled(() => true)
        .handleLookup((builder, recipe, focuses) => {
          glyphMixingCategory.setRecipe(builder, recipe, focuses)
        })
        .setDrawHandler(
          (recipe, recipeSlotsView, guiGraphics, mouseX, mouseY) => {
            glyphMixingCategory.draw(
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

    // Store a dictionary of all recipe types for easy access.
    const recipeTypes = {}
    jeiHelpers.allRecipeTypes.forEach((recipeType) => {
      recipeTypes[`${recipeType.getUid().toString()}`] = recipeType
    })

    // Move all custom glyph mixing recipes from the Create mixer category
    // to the custom glyph mixing category.
    const glyphMixingRecipes = recipeManager
      .createRecipeLookup(recipeTypes['create:mixing'])
      .get()
      .filter((recipe) => {
        return recipe.getId().toString().startsWith('kubejs:mixing_glyph_')
      })
      .toList()
    recipeManager.hideRecipes(recipeTypes['create:mixing'], glyphMixingRecipes)
    recipeManager.addRecipes(glyphMixingRecipeType, glyphMixingRecipes)
  })

  JEIAddedEvents.registerRecipeCatalysts((e) => {
    e.data.addRecipeCatalyst('create:mechanical_mixer', glyphMixingRecipeType)
    e.data.addRecipeCatalyst('create:basin', glyphMixingRecipeType)
    e.data.addRecipeCatalyst('ars_nouveau:scribes_table', glyphMixingRecipeType)
  })
})()
