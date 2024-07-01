// priority: 1000

/**
 * @typedef ArsGravityBlockCrushingRecipe
 * @property {Internal.Block_} belowBlock
 * @property {number=} minimumSpeed
 * @property {Internal.ItemStack_} ingredients
 * @property {Internal.ItemStack_} results
 *
 * @type {{string:ArsGravityBlockCrushingRecipe[]}}
 */
global.ArsGravityBlockCrushingRecipes = {}

/**
 * @param {Internal.Block_} fallingBlock
 * @param {Internal.Block_=} belowBlock
 * @param {number=} minimumSpeed
 * @param {Internal.ItemStack_|Internal.ItemStack_[]} fromItem
 * @param {Internal.ItemStack_|Internal.ItemStack_[]} toItem
 */
const registerBlockCrushingRecipe = (
  fallingBlock,
  belowBlock,
  minimumSpeed,
  ingredients,
  results
) => {
  let recipes = global.ArsGravityBlockCrushingRecipes[fallingBlock]
  if (!recipes) {
    global.ArsGravityBlockCrushingRecipes[fallingBlock] = []
    recipes = global.ArsGravityBlockCrushingRecipes[fallingBlock]
  }
  const ingredients_ = (
    Array.isArray(ingredients) ? ingredients : [ingredients]
  ).map((v) => {
    return typeof v === 'string' ? Ingredient.of(v) : v
  })
  const results_ = (Array.isArray(results) ? results : [results]).map((v) => {
    return typeof v === 'string' ? Item.of(v, 1) : v
  })
  recipes.push({
    belowBlock: belowBlock,
    minimumSpeed: minimumSpeed,
    ingredients: ingredients_,
    results: results_,
  })
}

/**
 *
 * @param {Internal.EntityLeaveLevelEvent_} e
 */
global.EntityLeaveLevelEventCallback = (e) => {
  const { entity, level } = e
  if (level.isClientSide()) return

  const { type, block, motionY } = entity
  // Filter out all non-matching events
  if (type !== 'ars_nouveau:enchanted_falling_block') return
  const fallingBlockPosition = block.pos
  const candidateRecipes = global.ArsGravityBlockCrushingRecipes[block.id]
  if (candidateRecipes === undefined) return
  const belowBlock = level.getBlock(fallingBlockPosition.below())
  const speed = Math.abs(motionY)

  // Find all matching recipes
  const matchingRecipes = candidateRecipes.filter((r) => {
    const { rBelowBlock, rMinimumSpeed } = r
    return (
      (rMinimumSpeed === undefined || speed > rMinimumSpeed) &&
      (rBelowBlock === undefined || rBelowBlock === belowBlock.id)
    )
  })

  // Consolidate all the item entities for processing.
  const itemEntities = level.getEntitiesWithin(
    AABB.ofBlock(fallingBlockPosition)
  )
  // Attempt to process each matching recipe.
  const processor = RecipeIngredientProcessor.fromItemEntities(itemEntities)
  for (const { ingredients, results } of matchingRecipes) {
    while (processor.processIngredientList(ingredients, results)) {}
  }

  // Delete the item entities and pop new ones.
  itemEntities.forEach((e) => e.discard())
  processor.getResultingItems().forEach((itemStack) => {
    belowBlock.popItemFromFace(itemStack, 'up')
  })

  // TODO play sound on successful craft.
  // TODO custom JEI category
  // TODO custom ponder
}
