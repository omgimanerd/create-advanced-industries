// priority: 500

/**
 * @param {Internal.EntityTeleportEvent_} e
 */
global.EndermanTeleportCallback = (e) => {
  const { entity } = e
  const level = entity.level
  if (
    entity.type !== 'minecraft:enderman' &&
    entity.type !== 'minecraft:shulker'
  ) {
    return
  }
  for (const offset of BlockPos.betweenClosed(-4, -1, -4, 4, 2, 4)) {
    let { x, y, z } = global.getXYZ(offset)
    let block = entity.block.offset(x, y, z)
    if (block.id !== 'kubejs:ender_inhibitor') continue

    // Check the block below to see if it is a tank we can input fluid into.
    let tank = block.offset(0, -1, 0)
    if (tank.entity) {
      let capability = tank.entity.getCapability(
        ForgeCapabilities.FLUID_HANDLER
      )
      if (capability.isPresent()) {
        let fluidHandler = capability.resolve().get()
        // Enderman will attempt to teleport many times in quick succession when
        // hurt, so this should be kept to a modest value.
        let fluidFilled = fluidHandler.fill(
          Fluid.of('kubejs:teleportation_juice', 1),
          'execute'
        )
        if (fluidFilled !== 0) {
          level.spawnParticles(
            'minecraft:reverse_portal',
            true,
            block.x + 0.5,
            block.y + 0.8,
            block.z + 0.5,
            /*vx*/ 0,
            /*vy*/ -0.2,
            /*vz*/ 0,
            /*count*/ 5,
            /*speed*/ 0.06
          )
          e.setCanceled(true)
          return
        }
      }
    }

    // Failure mode if we could not find a place to put the teleportation juice.
    level.destroyBlock(block.pos, false)
    level.createExplosion(block.x, block.y, block.z).strength(7).explode()
    return
  }
}

ServerEvents.recipes((e) => {
  e.shaped(
    'kubejs:ender_inhibitor',
    [
      ' R ', //
      'EME', //
      'AVA', //
    ],
    {
      R: 'kubejs:resonant_ender_pearl',
      E: '#forge:rods/enderium',
      M: VIBRATION_MECHANISM,
      A: 'vintageimprovements:aluminum_sheet',
      V: 'createutilities:void_casing',
    }
  )
})
