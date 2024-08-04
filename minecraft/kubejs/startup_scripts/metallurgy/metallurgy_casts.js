// priority: 1000

/**
 * @param {Registry.Block} e
 * @param {string} id
 * @param {string} displayName
 * @param {object} modelJson
 * @returns {Internal.BasicBlockJS$Builder_}
 */
const registerCast = (e, id, displayName, modelJson) => {
  /** @type {Internal.BasicBlockJS$Builder_} */
  const block = e
    .create(id)
    .displayName(displayName)
    .stoneSoundType()
    .fullBlock(false)
    .box(5, 0, 3, 11, 4, 13)
    .box(6, 3, 1, 10, 4, 15)
    .notSolid()
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('create:wrench_pickup')
    .item((item) => {
      item.modelJson(modelJson).maxStackSize(8)
    })
  // let variants = {}
  // for (let rotation = 0; rotation < 16; ++rotation) {
  //   variants[`rotation=${rotation}`] = {
  //     model: 'kubejs:block/base_ingot_cast',
  //     y: (rotation * 360) / 16,
  //   }
  // }
  // block.blockstateJson = {
  //   variants: variants,
  // }
  block.modelJson = modelJson
  return block
}

/**
 * @param {Registry.Block} e
 * @param {string} id
 * @param {string} baseTexture
 */
const registerBaseIngotCast = (e, id, baseTexture) => {
  const modelJson = {
    parent: 'kubejs:block/base_ingot_cast',
    textures: { base: baseTexture },
  }
  return registerCast(e, id, getDisplayName(id), modelJson)
}

/**
 * @param {Registry.Block} e
 * @param {string} id
 * @param {string} displayName
 * @param {string} baseTexture
 * @param {string} fluidTexture
 */
const registerFilledIngotCast = (
  e,
  id,
  displayName,
  baseTexture,
  fluidTexture
) => {
  const modelJson = {
    parent: 'kubejs:block/filled_ingot_cast',
    textures: { base: baseTexture, fluid: fluidTexture },
  }
  return registerCast(e, id, displayName, modelJson).lightLevel(12)
}
