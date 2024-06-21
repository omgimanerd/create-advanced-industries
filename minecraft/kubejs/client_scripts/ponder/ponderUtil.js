// priority: 900
// Utility functions and classes used by the code to generate custom Ponders.

const $DeployerBlockEntity = Java.loadClass(
  'com.simibubi.create.content.kinetics.deployer.DeployerBlockEntity'
)

/**
 * Animates the tank fluid amount at the given position.
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos_} position
 * @param {Special.Fluid} fluid
 * @param {number} from
 * @param {number} to
 * @param {number=} step
 */
const animateTank = (scene, position, fluid, from, to, step) => {
  step = step === undefined ? 100 : step
  while (from != to) {
    // Requires a closure to bind the value of amount inside the callback
    ;((amount_) => {
      scene.world.modifyBlockEntityNBT(position, (nbt) => {
        nbt.TankContent = {
          FluidName: fluid,
          Amount: amount_,
        }
      })
    })(from)
    scene.idle(1)
    from = to < from ? Math.max(to, from - step) : Math.min(to, from + step)
  }
}

/**
 *
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos_} deployerPos
 * @param {Internal.ItemStack} item
 */
const setDeployerFilter = (scene, deployerPos, item) => {
  scene.world.setFilterData(deployerPos, $DeployerBlockEntity, item)
}

/**
 * @param {Internal.ExtendedSceneBuilder} scene
 * @param {BlockPos_} deployerPos
 * @param {Internal.ItemStack_} id
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
 * @param {BlockPos_} pos
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
