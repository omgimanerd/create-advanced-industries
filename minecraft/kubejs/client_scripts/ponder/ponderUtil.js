// priority: 900
// Utility functions and classes used by the code to generate custom Ponders.

const deployerBlockEntity = Java.loadClass(
  'com.simibubi.create.content.kinetics.deployer.DeployerBlockEntity'
)

/**
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos} deployerPos
 * @param {Internal.ItemStack_?} id
 */
const setDeployerHeldItem = (scene, deployerPos, id) => {
  scene.world.modifyBlockEntityNBT(deployerPos, (nbt) => {
    nbt.HeldItem = {
      id: id,
      Count: 1,
    }
  })
}

/**
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos} pos
 * @param {number} ticks
 * @param {boolean?} clearHand
 */
const cycleDeployerMovement = (scene, pos, ticks, clearHand) => {
  ticks = ticks === undefined ? 25 : ticks
  clearHand = clearHand === undefined ? true : clearHand
  scene.world.moveDeployer(pos, 1, ticks)
  scene.idle(ticks)
  if (clearHand) {
    setDeployerHeldItem(scene, pos, 'minecraft:air')
  }
  scene.world.moveDeployer(pos, -1, ticks)
}
