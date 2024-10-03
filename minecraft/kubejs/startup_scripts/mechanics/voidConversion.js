// priority: 1000

/** @type {{string:Internal.ItemStack_}} */
global.VoidConversionRecipes = {}

/**
 * @param {string|Internal.ItemStack_} output
 * @param {string} input
 */
global.RegisterVoidConversionRecipe = (output, input) => {
  if (global.VoidConversionRecipes[input]) {
    throw new Error(`Recipe already exists for input ${input}!`)
  }
  global.VoidConversionRecipes[input] = output
}

/**
 * @param {Internal.EntityLeaveLevelEvent_} e
 */
global.VoidConversionCallback = (e) => {
  const { entity, level } = e
  if (level.clientSide || !entity.item || entity.y > level.minBuildHeight) {
    return
  }
  const { block, item, x, z } = entity
  const result = global.VoidConversionRecipes[item.id]
  if (result === undefined) return

  const spawnY = level.minBuildHeight - 10
  const resultEntity = block.createEntity('item')
  resultEntity.item = Item.of(result, item.count)
  resultEntity.setPos(x, level.minBuildHeight - 10, z)
  resultEntity.spawn()
  resultEntity.setDeltaMovement(new Vec3d(0, 0.6, 0))
  resultEntity.setNoGravity(true)
  resultEntity.setGlowing(true)
  level.spawnParticles(
    'minecraft:end_rod',
    true, // overrideLimiter
    x,
    spawnY,
    z,
    0.2, // vx, affects the spread around the position
    0.2, // vy, affects the spread around the position
    0.2, // vz, affects the spread around the position
    25, // count
    0.2 // speed
  )
  // No need to discard the original entity.
}

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityLeaveLevelEvent',
  (e) => {
    global.VoidConversionCallback(e)
  }
)

// Void conversion recipe registration.
;(() => {
  // Void steel crafting with void conversion.
  global.RegisterVoidConversionRecipe(
    'createutilities:void_steel_ingot',
    'tfmg:steel_ingot'
  )
  global.RegisterVoidConversionRecipe(
    'createutilities:void_steel_block',
    'tfmg:steel_block'
  )
  // Shadow Steel
  global.RegisterVoidConversionRecipe(
    'create:shadow_steel',
    'create:chromatic_compound'
  )
})()
