// priority: 0
// Recategorizes the custom compacting recipes for Apotheosis gem crafting so
// that they don't clutter JEI.

const GEM_COMPACTING = 'kubejs:gem_compacting'

JEIAddedEvents.registerCategories((e) => {
  // The Packing recipe category, contains the code that performs the actual
  // render of the recipe inputs and outputs in JEI
  const $PackingCategory = Java.loadClass(
    'com.simibubi.create.compat.jei.category.PackingCategory'
  )

  // RecipeType and the actual underlying Compacting recipe. Needed to create a
  // RecipeType for the custom category registration.
  const $RecipeType = Java.loadClass('mezz.jei.api.recipe.RecipeType')
  const $CompactingRecipe = Java.loadClass(
    'com.simibubi.create.content.kinetics.mixer.CompactingRecipe'
  )
  const $Info = Java.loadClass(
    'com.simibubi.create.compat.jei.category.CreateRecipeCategory$Info'
  )

  const guiHelper = e.data.jeiHelpers.guiHelper
  // Create a concrete instance of the basin compacting recipe and defer our
  // custom category to use its rendering code.
  const packingCategory = $PackingCategory.standard(
    new $Info(
      null,
      null,
      guiHelper.createBlankDrawable(177, 103),
      null,
      null,
      null
    )
  )
  const [rl, id] = GEM_COMPACTING.split(':')
  // Wrap the existing recipe category to use its rendering logic.
  e.wrap(
    $RecipeType.create(rl, id, $CompactingRecipe),
    packingCategory,
    (category) => {
      category
        .title('Apotheosis Gem Crafting')
        .icon(doubleItemIcon('create:mechanical_press', 'apotheosis:gem_dust'))
        .isRecipeHandled(() => true) // All relevant recipes are registered
    }
  )
})

JEIAddedEvents.onRuntimeAvailable((e) => {
  const { recipeManager } = e.data
  // Move all apotheosis gem compacting recipes from the Create compacting
  // category to the custom gem compacting category.
  const gemCompactingRecipes = recipeManager
    .createRecipeLookup('create:packing')
    .get()
    .filter((recipe) => {
      return recipe
        .getId()
        .toString()
        .startsWith('kubejs:apotheosis_gem_compacting_')
    })
    .toList()
  recipeManager.hideRecipes('create:packing', gemCompactingRecipes)
  recipeManager.addRecipes(GEM_COMPACTING, gemCompactingRecipes)
})

JEIAddedEvents.registerRecipeCatalysts((e) => {
  e.data[
    'addRecipeCatalysts(mezz.jei.api.recipe.RecipeType,net.minecraft.world.item.ItemStack[])'
  ](GEM_COMPACTING, [
    'create:mechanical_press',
    'create:basin',
    'apotheosis:gem_cutting_table',
  ])
})
