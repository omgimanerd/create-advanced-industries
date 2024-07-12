// priority: 900
// Utility functions and classes used by the code to generate custom Ponders.

// TODO add a custom ars enchanting ponder

const $DeployerBlockEntity = Java.loadClass(
  'com.simibubi.create.content.kinetics.deployer.DeployerBlockEntity'
)
const $FunnelBlockEntity = Java.loadClass(
  'com.simibubi.create.content.logistics.funnel.FunnelBlockEntity'
)

/**
 * Animates the tank fluid amount at the given position.
 * @param {Internal.ExtendedSceneBuilder_} scene
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
 * Animates the source jar's fluid level at the given position.
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {BlockPos_} pos
 * @param {number} from
 * @param {number} to
 * @param {number=} delay
 */
const animateSourceJar = (scene, pos, from, to, delay) => {
  delay = delay === undefined ? 5 : delay
  while (from != to) {
    setSourceJarFill(scene, pos, amount_, false)
    scene.idle(delay)
    from = to < from ? Math.max(to, from - 1) : Math.min(to, from + 1)
  }
}

/**
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {BlockPos_} pos
 * @param {Internal.ItemStack_} itemStack
 */
const setArsContainerItem = (scene, pos, itemStack) => {
  itemStack = typeof itemStack === 'string' ? Item.of(itemStack) : itemStack
  scene.world.modifyBlockEntityNBT(pos, (nbt) => {
    nbt.itemStack = itemStack.toNBT()
  })
}

/**
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {BlockPos_} pos
 * @param {number} fill
 * @param {boolean=} particles
 */
const setSourceJarFill = (scene, pos, fill, particles) => {
  scene.world.modifyBlock(
    pos,
    Block.id('ars_nouveau:source_jar', { fill: `${fill}` }),
    !!particles
  )
}

/**
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {BlockPos_} deployerPos
 * @param {Internal.ItemStack_} item
 */
const setDeployerFilter = (scene, deployerPos, item) => {
  scene.world.setFilterData(deployerPos, $DeployerBlockEntity, item)
}

/**
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {BlockPos_} funnelPos
 * @param {Internal.ItemStack_} item
 */
const setFunnelFilter = (scene, funnelPos, item) => {
  scene.world.setFilterData(funnelPos, $FunnelBlockEntity, item)
}

/**
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {BlockPos_} deployerPos
 * @param {string|Internal.ItemStack_} itemStack
 */
const setDeployerHeldItem = (scene, deployerPos, itemStack) => {
  itemStack = typeof itemStack === 'string' ? Item.of(itemStack) : itemStack
  scene.world.modifyBlockEntityNBT(deployerPos, (nbt) => {
    nbt.HeldItem = itemStack.toNBT()
  })
}

/**
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {BlockPos_} pos
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
 * @param {Internal.ExtendedSceneBuilder_} scene
 * @param {Internal.Entity_} entity
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
