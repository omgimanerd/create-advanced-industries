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

  // Crushing the Create stones
  registerVoidSteelCrushingRecipe(
    '2x kubejs:crushed_crimsite',
    'create:crimsite'
  )
  registerVoidSteelCrushingRecipe(
    '2x kubejs:crushed_veridium',
    'create:veridium'
  )
  registerVoidSteelCrushingRecipe('2x kubejs:crushed_ochrum', 'create:ochrum')
  registerVoidSteelCrushingRecipe('2x kubejs:crushed_asurine', 'create:asurine')

  // Ingot to sheet map
  const ingotSheetMap = {
    'minecraft:copper_ingot': 'create:copper_sheet',
    'create:brass_ingot': 'create:brass_sheet',
    'minecraft:iron_ingot': 'create:iron_sheet',
    'minecraft:gold_ingot': 'create:golden_sheet',
    'thermal:electrum_ingot': 'createaddition:electrum_sheet',
    'create:andesite_alloy': 'createdeco:andesite_sheet',
    'create:zinc_ingot': 'createdeco:zinc_sheet',
    'createdeco:industrial_iron_ingot': 'createdeco:industrial_iron_sheet',
    'create_new_age:overcharged_iron': 'create_new_age:overcharged_iron_sheet',
    'tfmg:steel_ingot': 'tfmg:heavy_plate',
    'create:polished_rose_quartz': 'create_things_and_misc:rose_quartz_sheet',
    'create:experience_nugget': 'create_things_and_misc:experience_sheet',
    'createutilities:void_steel_ingot': 'createutilities:void_steel_sheet',
    'tfmg:aluminum_ingot': 'vintageimprovements:aluminum_sheet',
    'thermal:bronze_ingot': 'vintageimprovements:bronze_sheet',
    'thermal:constantan_ingot': 'vintageimprovements:constantan_sheet',
    'thermal:enderium_ingot': 'vintageimprovements:enderium_sheet',
    'thermal:invar_ingot': 'vintageimprovements:invar_sheet',
    'thermal:lead_ingot': 'vintageimprovements:lead_sheet',
    'thermal:lumium_ingot': 'vintageimprovements:lumium_sheet',
    'minecraft:netherite_ingot': 'vintageimprovements:netherite_sheet',
    'thermal:nickel_ingot': 'vintageimprovements:nickel_sheet',
    'thermal:signalum_ingot': 'vintageimprovements:signalum_sheet',
    'thermal:silver_ingot': 'vintageimprovements:silver_sheet',
    'thermal:tin_ingot': 'vintageimprovements:tin_sheet',
    'create:shadow_steel': 'vintageimprovements:shadow_steel_sheet',
    'create:refined_radiance': 'vintageimprovements:refined_radiance_sheet',
  }
  for (const [ingot, sheet] of Object.entries(ingotSheetMap)) {
    registerVoidSteelCrushingRecipe(sheet, ingot)
  }

  // Higher yield powdered obsidian
  registerVoidSteelCrushingRecipe(
    '9x create:powdered_obsidian',
    'minecraft:obsidian'
  )

  // Mysterious Scrap Metal
  registerVoidSteelCrushingRecipe(
    '4x apotheosis:common_material',
    'tfmg:steel_mechanism'
  )
})()
