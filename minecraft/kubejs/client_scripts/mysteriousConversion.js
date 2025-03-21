// priority: 0

ClientEvents.highPriorityAssets(() => {
  const $MysteriousItemConversionCategory = Java.loadClass(
    'com.simibubi.create.compat.jei.category.MysteriousItemConversionCategory'
  )
  const $ConversionRecipe = Java.loadClass(
    'com.simibubi.create.compat.jei.ConversionRecipe'
  )

  const registerMysteriousItemConversion = (input, output) => {
    $MysteriousItemConversionCategory.RECIPES.add(
      $ConversionRecipe.create(input, output)
    )
  }

  // Singularities
  registerMysteriousItemConversion(
    'kubejs:unstable_singularity',
    'kubejs:singularity'
  )

  // Inspired Sparks
  registerMysteriousItemConversion(
    'kubejs:uninspired_spark',
    'kubejs:inspired_spark'
  )
})
