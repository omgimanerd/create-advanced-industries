// priority: 900
// Utility functions and classes used by the code to generate custom Ponders.

const $DeployerBlockEntity = Java.loadClass(
  'com.simibubi.create.content.kinetics.deployer.DeployerBlockEntity'
)

/**
 * Animates the tank fluid amount at the given position.
 * @param {$ExtendedSceneBuilder_} scene
 * @param {$BlockPos_} position
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
 * @param {$ExtendedSceneBuilder_} scene
 * @param {$BlockPos_} deployerPos
 * @param {$ItemStack_} item
 */
const setDeployerFilter = (scene, deployerPos, item) => {
  scene.world.setFilterData(deployerPos, $DeployerBlockEntity, item)
}

/**
 * @param {$ExtendedSceneBuilder_} scene
 * @param {$BlockPos_} deployerPos
 * @param {$ItemStack_} id
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
 * @param {$ExtendedSceneBuilder_} scene
 * @param {$BlockPos_} pos
 * @param {number} ticks
 * @param {boolean=} clearHand
 * @param {function=} onDeploy
 */
const cycleDeployerMovement = (scene, pos, ticks, clearHand, onDeploy) => {
  ticks = ticks === undefined ? 25 : ticks
  clearHand = clearHand === undefined ? true : clearHand
  scene.world.moveDeployer(pos, 1, ticks)
  scene.idle(ticks)
  if (clearHand) {
    setDeployerHeldItem(scene, pos, 'minecraft:air')
  }
  if (onDeploy !== undefined) {
    onDeploy()
  }
  scene.world.moveDeployer(pos, -1, ticks)
}

/**
 * @param {$ExtendedSceneBuilder_} scene
 * @param {$Entity_} entity
 * @param {(number[])[]} movement
 */
const lerpEntityMovement = (scene, entity, movements) => {
  let prevX = entity.x
  let prevY = entity.y
  let prevZ = entity.z
  let prevYRot = entity.yRot || 0
  let prevXRot = entity.xRot || 0
  for (const movement of movements) {
    if (movement.length !== 6) {
      console.error(`Unknown movement command ${movement}`)
    }
    let [x, y, z, yRot, xRot, steps] = movement
    x = x === null || x === undefined ? prevX : x
    y = y === null || y === undefined ? prevY : y
    z = z === null || z === undefined ? prevZ : z
    xRot = xRot === null || xRot === undefined ? prevXRot : xRot
    yRot = yRot === null || yRot === undefined ? prevYRot : yRot
    ;((x_, y_, z_, yRot_, xRot_, steps_) => {
      scene.world.modifyEntity(entity, (e) => {
        e.lerpTo(x_, y_, z_, yRot_, xRot_, steps_, false)
      })
      scene.idle(steps_)
    })(x, y, z, yRot, xRot, steps)
    prevX = x
    prevY = y
    prevZ = z
    prevYRot = yRot
    prevXRot = xRot
  }
}
