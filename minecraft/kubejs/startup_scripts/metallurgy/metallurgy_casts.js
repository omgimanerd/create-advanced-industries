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
    .create(id, 'cardinal')
    .displayName(displayName)
    .stoneSoundType()
    .fullBlock(false)
    .box(3, 0, 5, 13, 4, 11)
    .box(1, 3, 6, 15, 4, 10)
    .notSolid()
    .requiresTool(true)
    .tagBlock('minecraft:mineable/pickaxe')
    .tagBlock('create:wrench_pickup')
    .item((item) => {
      // Do not tag this create:upright_on_belt or create:upright_on_deployer
      item.modelJson(modelJson).maxStackSize(8)
    })
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
