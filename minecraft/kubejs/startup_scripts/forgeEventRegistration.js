// priority: 1000

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityStruckByLightningEvent',
  (e) => {
    // Callbacks defined in server_scripts
    if (global.WanderingTraderLightningCallback) {
      global.WanderingTraderLightningCallback(e)
    }
  }
)

/**
 * @param {Internal.EntityTeleportEvent_} e
 */
global.EndermanTeleportCallback = (e) => {
  const { entity } = e
  if (entity.type !== 'minecraft:enderman') return
  for (const offset of BlockPos.betweenClosed(-2, -1, -2, 2, 2, 2)) {
    let { x, y, z } = global.getXYZ(offset)
    let block = entity.block.offset(x, y, z)
    if (block.entity) {
      let capability = block.entity.getCapability(
        ForgeCapabilities.FLUID_HANDLER
      )
      if (!capability.isPresent()) continue
      let fluidHandler = capability.resolve().get()
      // Enderman will attempt to teleport many times in quick succession when
      // hurt, so this should be kept to a modest value.
      fluidHandler.fill(Fluid.water(1), 'execute')
      e.setCanceled(true)
      return
    }
  }
}

ForgeEvents.onEvent(
  'net.minecraftforge.event.entity.EntityTeleportEvent',
  (e) => {
    if (global.EndermanTeleportCallback) {
      global.EndermanTeleportCallback(e)
    }
  }
)
