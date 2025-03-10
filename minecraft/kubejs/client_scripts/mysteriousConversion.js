// priority: 0

const $MysteriousItemConversionCategory = Java.loadClass(
  'com.simibubi.create.compat.jei.category.MysteriousItemConversionCategory'
)
const $ConversionRecipe = Java.loadClass(
  'com.simibubi.create.compat.jei.ConversionRecipe'
)

const registerMysteriousItemConversion = (output, input) => {
  $MysteriousItemConversionCategory.RECIPES.add(
    $ConversionRecipe.create(output, input)
  )
}
registerMysteriousItemConversion(
  'kubejs:uninspired_spark',
  'kubejs:inspired_spark'
)
