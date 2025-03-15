// priority: 1000

global.ARS_GRAVITY_BLOCK_CRUSHING = 'kubejs:ars_gravity_block_crushing'

/**
 * @typedef {Object} ArsGravityBlockCrushingRecipe
 * @property {Internal.Block_} belowBlock
 * @property {number=} minimumSpeed
 * @property {string} ingredients
 * @property {string} results
 *
 * @type {{string:ArsGravityBlockCrushingRecipe[]}}
 */
global.ArsGravityBlockCrushingRecipes = {}

/**
 * @param {string} fallingBlock
 * @param {string=} belowBlock
 * @param {number=} minimumSpeed
 * @param {Internal.ItemStack_|Internal.ItemStack_[]} fromItem
 * @param {Internal.ItemStack_|Internal.ItemStack_[]} toItem
 */
global.RegisterArsGravityBlockCrushingRecipe = (
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
  const ingredients_ = Array.isArray(ingredients) ? ingredients : [ingredients]
  const results_ = Array.isArray(results) ? results : [results]
  recipes.push({
    fallingBlock: fallingBlock,
    belowBlock: belowBlock,
    minimumSpeed: minimumSpeed,
    ingredients: ingredients_,
    results: results_,
  })
}

/**
 * @param {Internal.EntityLeaveLevelEvent_} e
 */
global.ArsGravityBlockCrushingCallback = (e) => {
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
    while (
      processor.processIngredientList(
        ingredients.map((v) => Ingredient.of(v)),
        results.map((v) => Item.of(v))
      )
    ) {}
  }

  // Delete the item entities and pop new ones.
  itemEntities.forEach((e) => e.discard())
  processor.getResultingItems().forEach((itemStack) => {
    belowBlock.popItemFromFace(itemStack, 'up')
  })

  entity.playSound('minecraft:block.anvil.land', /*volume=*/ 5, /*pitch=*/ 0)
}

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityLeaveLevelEvent',
  (e) => {
    global.ArsGravityBlockCrushingCallback(e)
  }
)

// Register recipes
;(() => {
  const registerVoidSteelCrushingRecipe = (output, input, minimumSpeed) => {
    global.RegisterArsGravityBlockCrushingRecipe(
      'createutilities:void_steel_block',
      'createutilities:void_steel_block',
      minimumSpeed,
      input,
      output
    )
  }

  // Netherite sheets
  registerVoidSteelCrushingRecipe(
    'vintageimprovements:netherite_sheet',
    'minecraft:netherite_ingot'
  )

  // Higher yield powdered obsidian
  registerVoidSteelCrushingRecipe(
    '9x create:powdered_obsidian',
    'minecraft:obsidian'
  )

  // Void Steel
  registerVoidSteelCrushingRecipe(
    'createutilities:void_steel_sheet',
    'createutilities:void_steel_ingot'
  )

  // Shadow Steel and Refined Radiance
  registerVoidSteelCrushingRecipe(
    'vintageimprovements:shadow_steel_sheet',
    'create:shadow_steel'
  )
  registerVoidSteelCrushingRecipe(
    'vintageimprovements:refined_radiance_sheet',
    'create:refined_radiance'
  )
})()
