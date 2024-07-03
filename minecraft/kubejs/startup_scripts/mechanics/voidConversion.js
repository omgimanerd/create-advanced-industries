// priority: 1000

/** @type {{string:Internal.ItemStack_}} */
global.VoidConversionRecipes = {}

/**
 * @param {string|Internal.ItemStack_} output
 * @param {string} input
 */
global.RegisterVoidConversionRecipe = (output, input) => {
  if (global.VoidConversionRecipes[input]) {
    throw new Error('Recipe already exists!')
  }
  global.VoidConversionRecipes[input] =
    typeof output === 'string' ? Item.of(output) : output
}

/**
 * @param {Internal.EntityLeaveLevelEvent_} e
 */
global.VoidConversionCallback = (e) => {
  const { entity, level } = e
  const minBuildHeight = level.getMinBuildHeight()
  if (level.isClientSide()) return
  const { type, block, item, x, y, z } = entity
  if (type !== 'minecraft:item') return
  if (y > minBuildHeight) return
  if (item === undefined) return
  const result = global.VoidConversionRecipes[item.id]
  if (result === undefined) return
  const resultEntity = block.createEntity('item')
  resultEntity.item = result
  resultEntity.setPos(x, minBuildHeight - 20, z)
  resultEntity.spawn()
  resultEntity.setDeltaMovement(new Vec3d(0, 0.5, 0))
  resultEntity.setNoGravity(true)
  resultEntity.setGlowing(true)
  // No need to discard the original entity.
}

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityLeaveLevelEvent',
  (e) => {
    global.ArsGravityBlockCrushingCallback(e)
  }
)